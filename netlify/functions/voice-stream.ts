import type { Config } from "@netlify/functions";
import { Modality } from "@google/genai";
import {
  getAI,
  LIVE_SPEECH_SYSTEM_INSTRUCTION,
  sanitizeSpeechText,
  getAudioCacheHash,
  getCachedAudio,
  setCachedAudio,
  generateAoedeAudioPCM,
} from "./geminiVoiceCore";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

export default async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let text = "";
  try {
    const body = await req.json();
    text = body.text;
  } catch (_) {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (!text || typeof text !== "string") {
    return new Response(JSON.stringify({ error: "Text is required" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({
        error: "GEMINI_API_KEY environment variable is missing on Netlify.",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  const cleanText = sanitizeSpeechText(text);
  const hash = getAudioCacheHash(cleanText);

  // 1. Instant Cache check (< 0.1ms)
  const cached = getCachedAudio(hash);
  if (cached) {
    const ssePayload =
      `data: ${JSON.stringify({ chunk: cached, pcmChunk: cached, done: true, cached: true })}\n\n`;
    return new Response(ssePayload, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
      },
    });
  }

  // 2. Real-time Gemini Live WebSocket Streaming via ReadableStream
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
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
          setCachedAudio(hash, fullPcm);
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`)
          );
          controller.close();
          return;
        }

        // Seamless fallback to generateAoedeAudioPCM if live socket closed early
        try {
          const fallbackPcm = await generateAoedeAudioPCM(cleanText);
          if (fallbackPcm) {
            setCachedAudio(hash, fallbackPcm);
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  chunk: fallbackPcm,
                  pcmChunk: fallbackPcm,
                  done: true,
                  cached: false,
                })}\n\n`
              )
            );
            controller.close();
            return;
          }
        } catch (fallbackErr: any) {
          console.warn("[Netlify VoiceStream] Fallback error:", fallbackErr);
        }

        if (err) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: err.message || "Live stream error", done: true })}\n\n`
            )
          );
        } else {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: "NO_AUDIO_GENERATED", done: true })}\n\n`)
          );
        }
        controller.close();
      };

      const timeout = setTimeout(() => {
        finishAndClose();
      }, 16000);

      try {
        const client = getAI();
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
                    turns: [{ role: "user", parts: [{ text }] }],
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
                    // Flush chunk to client immediately!
                    controller.enqueue(
                      encoder.encode(
                        `data: ${JSON.stringify({
                          chunk: chunkBase64,
                          pcmChunk: chunkBase64,
                          done: false,
                        })}\n\n`
                      )
                    );
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
    },
  });

  return new Response(stream, {
    headers: {
      ...corsHeaders,
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
};

export const config: Config = {
  path: ["/api/voice-stream", "/.netlify/functions/voice-stream"],
};
