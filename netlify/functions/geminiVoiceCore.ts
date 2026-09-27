import { GoogleGenAI, Modality } from "@google/genai";
import crypto from "crypto";

// In-memory audio PCM cache for instant sub-millisecond playback on serverless instances
const audioCache = new Map<string, string>();
const inFlightRequests = new Map<string, Promise<string>>();

let ai: GoogleGenAI | null = null;
export function getAI(): GoogleGenAI {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build-netlify",
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
export const LIVE_SPEECH_SYSTEM_INSTRUCTION =
  `You are Ganga, the caring virtual dental assistant for Ganga Dental Clinic.
Voice & Delivery Style:
- Natural, warm, polite, sweet, and soothing feminine Indian conversational voice.
- Authentic Hindi and Hinglish pronunciation: pronounce Hindi and Hinglish terms (such as Namaste, Dard, Kulla, Masude, Sujan, Dawa, Shukriya, Somwar, Samay, Swasth, Ilaj, Shuru) with natural vernacular phonetics and melodic Indian cadence.
- Natural Pacing & Pauses: Speak at a comforting, unhurried pace with natural micro-pauses at commas, periods, and bullet points. Never sound rushed, flat, or synthetic.
- Emotional Expression: Gentle, empathetic, reassuring, and articulate dental care delivery.
- Execution Rule: Speak ONLY the exact message content provided by the user. Do not add any greeting, preamble, conversational preface, or extra commentary. Deliver the text directly as spoken audio.`;

/**
 * Clean text for optimal speech synthesis
 */
export function sanitizeSpeechText(text: string): string {
  return text
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "")
    .replace(/[*_~`#>]/g, "")
    .replace(/[•\-\+]/g, ", ")
    .replace(/\n+/g, ". ")
    .replace(/\s+/g, " ")
    .trim();
}

export function getAudioCacheHash(cleanText: string): string {
  return crypto.createHash("md5").update(`gemini-3.1-flash-live:aoede:${cleanText}`).digest("hex");
}

export function getCachedAudio(hash: string): string | undefined {
  return audioCache.get(hash);
}

export function setCachedAudio(hash: string, pcmBase64: string): void {
  audioCache.set(hash, pcmBase64);
}

/**
 * Generates natural 24000Hz 16-bit linear PCM audio using Gemini Live Audio API
 * (model: gemini-3.1-flash-live-preview, voice: Aoede).
 * Exact audio architecture matching Preview.
 */
export async function generateViaGeminiLive(text: string): Promise<string> {
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
export async function generateAoedeAudioPCM(cleanText: string): Promise<string> {
  const hash = getAudioCacheHash(cleanText);

  // 1. Fast in-memory cache check (< 0.1ms)
  const cached = getCachedAudio(hash);
  if (cached) {
    return cached;
  }

  // 2. In-flight request deduplication
  let inFlightPromise = inFlightRequests.get(hash);
  if (!inFlightPromise) {
    inFlightPromise = (async () => {
      const pcmBase64 = await generateViaGeminiLive(cleanText);
      setCachedAudio(hash, pcmBase64);
      return pcmBase64;
    })();
    inFlightRequests.set(hash, inFlightPromise);
  }

  try {
    const pcmBase64 = await inFlightPromise;
    inFlightRequests.delete(hash);
    return pcmBase64;
  } catch (err) {
    inFlightRequests.delete(hash);
    throw err;
  }
}
