import type { Config } from "@netlify/functions";
import {
  sanitizeSpeechText,
  getAudioCacheHash,
  getCachedAudio,
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

  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch (_) {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { text } = body;
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
          error: "GEMINI_API_KEY environment variable is missing on Netlify. Please set it in Netlify Site Settings > Environment variables.",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const cleanText = sanitizeSpeechText(text);
    const hash = getAudioCacheHash(cleanText);

    const cached = getCachedAudio(hash);
    if (cached) {
      return new Response(
        JSON.stringify({
          pcm: cached,
          sampleRate: 24000,
          voice: "Aoede",
          model: "gemini-3.1-flash-live-preview",
          cached: true,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const pcmBase64 = await generateAoedeAudioPCM(cleanText);

    return new Response(
      JSON.stringify({
        pcm: pcmBase64,
        sampleRate: 24000,
        voice: "Aoede",
        model: "gemini-3.1-flash-live-preview",
        cached: false,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err: any) {
    console.error("[Netlify /api/voice error]:", err);
    return new Response(
      JSON.stringify({
        error: "VOICE_GENERATION_FAILED",
        message: err?.message || "Failed to generate Gemini voice audio",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

export const config: Config = {
  path: ["/api/voice", "/.netlify/functions/voice"],
};
