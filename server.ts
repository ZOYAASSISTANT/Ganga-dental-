import "dotenv/config";
import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Modality } from "@google/genai";

const CACHE_DIR = path.join(process.cwd(), ".audio_cache");
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: "10mb" }));

  // In-memory audio PCM cache for instant sub-millisecond playback
  const audioCache = new Map<string, string>();

  // Pre-load all cached PCM responses into memory on server boot for 0ms instantaneous response
  try {
    const files = fs.readdirSync(CACHE_DIR);
    for (const f of files) {
      if (f.endsWith(".pcm")) {
        const hash = f.replace(".pcm", "");
        const content = fs.readFileSync(path.join(CACHE_DIR, f), "utf8");
        audioCache.set(hash, content);
      }
    }
    console.log(`[Voice] Pre-loaded ${audioCache.size} cached voice items into memory for 0ms instant speech.`);
  } catch (_) {}

  // In-flight request deduplication map to prevent multiple identical concurrent API calls
  const inFlightRequests = new Map<string, Promise<string>>();

  let ai: GoogleGenAI | null = null;
  function getAI(): GoogleGenAI {
    if (!ai) {
      ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
    return ai;
  }

  /**
   * System instruction for natural conversational Indian female voice (matching Lux reference):
   * Controls tone, Hindi/Hinglish pronunciation, micro-pauses, emotional expression, and sentence delivery.
   */
  const LIVE_SPEECH_SYSTEM_INSTRUCTION =
    `You are Ganga, the caring virtual dental assistant for Ganga Dental Clinic.
Voice & Delivery Style:
- Natural, warm, polite, sweet, and soothing feminine Indian conversational voice.
- Authentic Hindi and Hinglish pronunciation: pronounce Hindi and Hinglish terms (such as Namaste, Dard, Kulla, Masude, Sujan, Dawa, Shukriya, Somwar, Samay, Swasth, Ilaj, Shuru) with natural vernacular phonetics and melodic Indian cadence.
- Natural Pacing & Pauses: Speak at a comforting, unhurried pace with natural micro-pauses at commas, periods, and bullet points. Never sound rushed, flat, or synthetic.
- Emotional Expression: Gentle, empathetic, reassuring, and articulate dental care delivery.
- Execution Rule: Speak ONLY the exact message content provided by the user. Do not add any greeting, preamble, conversational preface, or extra commentary. Deliver the text directly as spoken audio.`;

  /**
   * Generates natural 24000Hz 16-bit linear PCM audio using Gemini Live Audio API
   * (model: gemini-3.1-flash-live-preview, voice: Aoede).
   * Exact audio architecture from the reference Lux assistant project.
   */
  async function generateViaGeminiLive(text: string): Promise<string> {
    const client = getAI();
    return new Promise(async (resolve, reject) => {
      const pcmChunks: Buffer[] = [];
      let session: any = null;
      let finished = false;

      const timeout = setTimeout(() => {
        if (finished) return;
        finished = true;
        try {
          session?.close();
        } catch (_) {}
        if (pcmChunks.length > 0) {
          resolve(Buffer.concat(pcmChunks).toString("base64"));
        } else {
          reject(new Error("Gemini Live Audio generation timed out"));
        }
      }, 16000);

      const cleanup = () => {
        clearTimeout(timeout);
        try {
          session?.close();
        } catch (_) {}
      };

      try {
        const sessionPromise = client.live.connect({
          model: "gemini-3.1-flash-live-preview",
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: "Aoede" },
              },
            },
            systemInstruction: LIVE_SPEECH_SYSTEM_INSTRUCTION,
          },
          callbacks: {
            onopen: () => {
              sessionPromise
                .then((s) => {
                  session = s;
                  s.sendClientContent({
                    turns: [{ role: "user", parts: [{ text }] }],
                    turnComplete: true,
                  });
                })
                .catch((err) => {
                  if (!finished) {
                    finished = true;
                    cleanup();
                    reject(err);
                  }
                });
            },
            onmessage: (m) => {
              const parts = m.serverContent?.modelTurn?.parts;
              if (parts) {
                for (const part of parts) {
                  if (part.inlineData?.data) {
                    pcmChunks.push(Buffer.from(part.inlineData.data, "base64"));
                  }
                }
              }
              if (m.serverContent?.turnComplete || m.serverContent?.generationComplete) {
                if (!finished) {
                  finished = true;
                  cleanup();
                  resolve(Buffer.concat(pcmChunks).toString("base64"));
                }
              }
            },
            onerror: (err) => {
              if (!finished) {
                finished = true;
                cleanup();
                if (pcmChunks.length > 0) {
                  resolve(Buffer.concat(pcmChunks).toString("base64"));
                } else {
                  reject(err);
                }
              }
            },
            onclose: () => {
              if (!finished) {
                finished = true;
                cleanup();
                if (pcmChunks.length > 0) {
                  resolve(Buffer.concat(pcmChunks).toString("base64"));
                } else {
                  reject(new Error("Gemini Live Audio session closed unexpectedly"));
                }
              }
            },
          },
        });
        session = await sessionPromise;
      } catch (err) {
        if (!finished) {
          finished = true;
          cleanup();
          reject(err);
        }
      }
    });
  }

  /**
   * Unified Natural Gemini Live Voice Generator (Voice: Aoede):
   * Strictly uses gemini-3.1-flash-live-preview with Aoede voice.
   */
  async function generateAoedeAudioPCM(cleanText: string): Promise<string> {
    return await generateViaGeminiLive(cleanText);
  }

  // Primary Gemini Live Voice API Endpoint
  const handleVoiceRequest = async (req: express.Request, res: express.Response) => {
    try {
      const { text } = req.body;
      if (!text || typeof text !== "string") {
        return res.status(400).json({ error: "Text is required" });
      }

      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "GEMINI_API_KEY environment variable is missing" });
      }

      const cleanText = text
        .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "")
        .replace(/[*_~`#>]/g, "")
        .replace(/[•\-\+]/g, ", ")
        .replace(/\n+/g, ". ")
        .replace(/\s+/g, " ")
        .trim();

      const hash = crypto.createHash("md5").update(`gemini-3.1-flash-live:aoede:${cleanText}`).digest("hex");
      const diskPathPcm = path.join(CACHE_DIR, `${hash}.pcm`);

      // 1. Fast in-memory cache check (< 0.1ms)
      if (audioCache.has(hash)) {
        const pcmBase64 = audioCache.get(hash)!;
        return res.json({
          pcm: pcmBase64,
          sampleRate: 24000,
          voice: "Aoede",
          model: "gemini-3.1-flash-live-preview",
          cached: true,
        });
      }

      // 2. Persistent disk cache check (< 2ms)
      if (fs.existsSync(diskPathPcm)) {
        try {
          const pcmBase64 = fs.readFileSync(diskPathPcm, "utf8");
          audioCache.set(hash, pcmBase64);
          return res.json({
            pcm: pcmBase64,
            sampleRate: 24000,
            voice: "Aoede",
            model: "gemini-3.1-flash-live-preview",
            cached: true,
          });
        } catch (_) {}
      }

      // 3. In-flight request deduplication
      let inFlightPromise = inFlightRequests.get(hash);
      if (!inFlightPromise) {
        inFlightPromise = (async () => {
          const pcmBase64 = await generateAoedeAudioPCM(cleanText);
          try {
            fs.writeFileSync(diskPathPcm, pcmBase64, "utf8");
          } catch (writeErr) {
            console.warn("[Voice] Failed writing disk cache:", writeErr);
          }
          audioCache.set(hash, pcmBase64);
          return pcmBase64;
        })();
        inFlightRequests.set(hash, inFlightPromise);
      }

      try {
        const pcmBase64 = await inFlightPromise;
        inFlightRequests.delete(hash);
        return res.json({
          pcm: pcmBase64,
          sampleRate: 24000,
          voice: "Aoede",
          model: "gemini-3.1-flash-live-preview",
          cached: false,
        });
      } catch (genErr: any) {
        inFlightRequests.delete(hash);
        console.error("[Voice] Gemini audio generation error:", genErr?.message || genErr);
        return res.status(500).json({
          error: "VOICE_GENERATION_FAILED",
          message: genErr?.message || "Failed to generate Gemini voice audio",
        });
      }
    } catch (err: any) {
      console.error("[Voice] Route error:", err?.message || err);
      return res.status(500).json({ error: "INTERNAL_ERROR", message: err?.message || "Internal server error" });
    }
  };

  // Support both /api/tts and /api/voice for complete compatibility
  app.post("/api/tts", handleVoiceRequest);
  app.post("/api/voice", handleVoiceRequest);

  // Real-time zero-delay streaming voice endpoint (Server-Sent Events)
  // Streams 24000Hz PCM chunks as soon as Gemini produces them (~800ms for first chunk)
  // Client plays immediately using Web Audio API nextPlayTime scheduling
  app.post("/api/voice-stream", async (req, res) => {
    try {
      const { text } = req.body;
      if (!text || typeof text !== "string") {
        return res.status(400).json({ error: "Text is required" });
      }

      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "GEMINI_API_KEY environment variable is missing" });
      }

      const cleanText = text
        .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "")
        .replace(/[*_~`#>]/g, "")
        .replace(/[•\-\+]/g, ", ")
        .replace(/\n+/g, ". ")
        .replace(/\s+/g, " ")
        .trim();

      const hash = crypto.createHash("md5").update(`gemini-3.1-flash-live:aoede:${cleanText}`).digest("hex");
      const diskPathPcm = path.join(CACHE_DIR, `${hash}.pcm`);

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache, no-transform");
      res.setHeader("Connection", "keep-alive");
      res.flushHeaders?.();

      // 1. Instant Cache: If already synthesized, emit full audio immediately (< 1ms!)
      if (audioCache.has(hash)) {
        const fullPcm = audioCache.get(hash)!;
        res.write(`data: ${JSON.stringify({ chunk: fullPcm, done: true, cached: true })}\n\n`);
        return res.end();
      }

      if (fs.existsSync(diskPathPcm)) {
        try {
          const fullPcm = fs.readFileSync(diskPathPcm, "utf8");
          audioCache.set(hash, fullPcm);
          res.write(`data: ${JSON.stringify({ chunk: fullPcm, done: true, cached: true })}\n\n`);
          return res.end();
        } catch (_) {}
      }

      // 2. Real-time Gemini Live WebSocket Streaming
      const client = getAI();
      const pcmChunks: Buffer[] = [];
      let session: any = null;
      let finished = false;

      const finishAndClose = async (err?: any) => {
        if (finished) return;
        finished = true;
        clearTimeout(timeout);
        try {
          session?.close();
        } catch (_) {}

        if (pcmChunks.length > 0) {
          const fullPcm = Buffer.concat(pcmChunks).toString("base64");
          audioCache.set(hash, fullPcm);
          try {
            fs.writeFileSync(diskPathPcm, fullPcm, "utf8");
          } catch (_) {}
          res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
          return res.end();
        }

        // If Live stream didn't yield any audio chunks (e.g. quota or early socket close),
        // fallback to generateAoedeAudioPCM so the client receives the audio seamlessly!
        try {
          console.log(`[VoiceStream] No chunks from live stream, synthesizing fallback for hash ${hash}...`);
          const fallbackPcm = await generateAoedeAudioPCM(cleanText);
          if (fallbackPcm) {
            audioCache.set(hash, fallbackPcm);
            try {
              fs.writeFileSync(diskPathPcm, fallbackPcm, "utf8");
            } catch (_) {}
            res.write(`data: ${JSON.stringify({ chunk: fallbackPcm, done: true, cached: false })}\n\n`);
            return res.end();
          }
        } catch (fallbackErr: any) {
          console.warn("[VoiceStream] Fallback synthesis error:", fallbackErr?.message || fallbackErr);
        }

        if (err) {
          res.write(`data: ${JSON.stringify({ error: err.message || "Live stream error", done: true })}\n\n`);
        } else {
          res.write(`data: ${JSON.stringify({ error: "NO_AUDIO_GENERATED", done: true })}\n\n`);
        }
        res.end();
      };

      const timeout = setTimeout(() => {
        finishAndClose();
      }, 16000);

      req.on("close", () => {
        finishAndClose();
      });

      try {
        const sessionPromise = client.live.connect({
          model: "gemini-3.1-flash-live-preview",
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName: "Aoede" } },
            },
            systemInstruction: LIVE_SPEECH_SYSTEM_INSTRUCTION,
          },
          callbacks: {
            onopen: () => {
              sessionPromise
                .then((s) => {
                  session = s;
                  s.sendClientContent({
                    turns: [{ role: "user", parts: [{ text: cleanText }] }],
                    turnComplete: true,
                  });
                })
                .catch((err) => {
                  finishAndClose(err);
                });
            },
            onmessage: (m) => {
              const parts = m.serverContent?.modelTurn?.parts;
              if (parts) {
                for (const part of parts) {
                  if (part.inlineData?.data) {
                    const chunkBase64 = part.inlineData.data;
                    pcmChunks.push(Buffer.from(chunkBase64, "base64"));
                    // Instantly flush this chunk down to the client!
                    res.write(`data: ${JSON.stringify({ chunk: chunkBase64, done: false })}\n\n`);
                  }
                }
              }
              if (m.serverContent?.turnComplete || m.serverContent?.generationComplete) {
                finishAndClose();
              }
            },
            onerror: (err) => {
              finishAndClose(err);
            },
            onclose: () => {
              finishAndClose();
            },
          },
        });
        session = await sessionPromise;
      } catch (err) {
        finishAndClose(err);
      }
    } catch (routeErr: any) {
      console.error("[VoiceStream] Route error:", routeErr);
      if (!res.headersSent) {
        res.status(500).json({ error: "Voice streaming failed" });
      } else {
        res.end();
      }
    }
  });

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
