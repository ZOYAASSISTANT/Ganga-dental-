// Audio playback utilities for Gemini PCM audio
// Reproduces the exact audio architecture from the reference Zoya AI Assistant (lux.zip)
// Using Web Audio API, 24000Hz sample rate, Int16 -> Float32 conversion, and AudioBufferSourceNode.

let currentAudioCtx: AudioContext | null = null;
let currentSource: AudioBufferSourceNode | null = null;
let currentStreamPlayer: StreamAudioPlayer | null = null;
let currentOnEndedCallback: (() => void) | null = null;
let isCurrentlyPaused: boolean = false;

export function isAudioPaused(): boolean {
  return isCurrentlyPaused;
}

export function isAudioActive(): boolean {
  return (
    (currentAudioCtx !== null && currentSource !== null) ||
    (currentStreamPlayer !== null && currentStreamPlayer.isActive())
  );
}

/**
 * Shared AudioContext helper with automatic resumption
 */
export function getOrCreateAudioContext(): AudioContext {
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContextClass) {
    throw new Error("Web Audio API AudioContext is not supported in this browser.");
  }
  if (!currentAudioCtx || currentAudioCtx.state === "closed") {
    currentAudioCtx = new AudioContextClass({ sampleRate: 24000 });
  }
  if (currentAudioCtx.state === "suspended") {
    currentAudioCtx.resume().catch(() => {});
  }
  return currentAudioCtx;
}

/**
 * Mobile-safe audio unlocker: resumes AudioContext and plays a 1-frame silent buffer
 * within direct touch/click gesture stack.
 */
export function unlockAudioContext(): void {
  try {
    const ctx = getOrCreateAudioContext();
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }
    const buffer = ctx.createBuffer(1, 1, 24000);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.start(0);
  } catch (_) {}
}

/**
 * Helper to convert 16-bit linear PCM base64 string to Float32Array
 */
export function decodePCMBase64ToFloat32(base64Data: string): Float32Array {
  const binaryString = atob(base64Data);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  const sampleCount = Math.floor(len / 2);
  const int16 = new Int16Array(bytes.buffer, bytes.byteOffset, sampleCount);
  const float32 = new Float32Array(sampleCount);
  for (let i = 0; i < sampleCount; i++) {
    float32[i] = int16[i] / 32768.0;
  }
  return float32;
}

/**
 * Streaming Audio Player for Gemini Live Audio
 * Plays incoming PCM chunks immediately as they arrive from the network with 0 latency,
 * using precise nextPlayTime scheduling (identical to the reference Zoya lux.zip architecture).
 */
export class StreamAudioPlayer {
  private audioCtx: AudioContext;
  private nextPlayTime: number = 0;
  private activeSources: AudioBufferSourceNode[] = [];
  private isStopped: boolean = false;
  private hasStarted: boolean = false;
  private streamFinished: boolean = false;
  private chunksScheduled: number = 0;
  private chunksFinished: number = 0;
  private onStart?: () => void;
  private onEnded?: () => void;
  private onError?: (err: any) => void;

  constructor(callbacks?: { onStart?: () => void; onEnded?: () => void; onError?: (err: any) => void }) {
    this.audioCtx = getOrCreateAudioContext();
    if (this.audioCtx.state === "suspended") {
      this.audioCtx.resume().catch(() => {});
    }
    this.onStart = callbacks?.onStart;
    this.onEnded = callbacks?.onEnded;
    this.onError = callbacks?.onError;
  }

  public isActive(): boolean {
    return !this.isStopped && (this.activeSources.length > 0 || !this.streamFinished);
  }

  public pushChunk(base64Chunk: string): void {
    if (this.isStopped || !base64Chunk) return;

    try {
      if (this.audioCtx.state === "suspended") {
        this.audioCtx.resume().catch(() => {});
      }

      const float32 = decodePCMBase64ToFloat32(base64Chunk);
      if (float32.length === 0) return;

      const audioBuffer = this.audioCtx.createBuffer(1, float32.length, 24000);
      audioBuffer.getChannelData(0).set(float32);

      const source = this.audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.audioCtx.destination);

      const startTime = Math.max(this.audioCtx.currentTime, this.nextPlayTime);
      source.start(startTime);
      this.nextPlayTime = startTime + audioBuffer.duration;

      this.chunksScheduled++;
      this.activeSources.push(source);

      if (!this.hasStarted) {
        this.hasStarted = true;
        this.onStart?.();
      }

      source.onended = () => {
        this.chunksFinished++;
        const idx = this.activeSources.indexOf(source);
        if (idx !== -1) {
          this.activeSources.splice(idx, 1);
        }
        if (this.streamFinished && this.chunksFinished >= this.chunksScheduled && !this.isStopped) {
          this.stop();
          this.onEnded?.();
        }
      };
    } catch (err) {
      console.warn("[StreamAudioPlayer] Error scheduling chunk:", err);
      this.onError?.(err);
    }
  }

  public finishStream(): void {
    this.streamFinished = true;
    if (this.chunksScheduled === 0) {
      this.stop();
      this.onError?.(new Error("Empty audio stream received"));
      return;
    }
    if (this.chunksFinished >= this.chunksScheduled && !this.isStopped) {
      this.stop();
      this.onEnded?.();
    }
  }

  public stop(): void {
    this.isStopped = true;
    for (const src of this.activeSources) {
      try {
        src.onended = null;
        src.stop();
        src.disconnect();
      } catch (_) {}
    }
    this.activeSources = [];
  }
}

/**
 * Creates and registers a new active streaming player
 */
export function createStreamAudioPlayer(callbacks?: {
  onStart?: () => void;
  onEnded?: () => void;
  onError?: (err: any) => void;
}): StreamAudioPlayer {
  stopAllAudio();
  const player = new StreamAudioPlayer(callbacks);
  currentStreamPlayer = player;
  return player;
}

/**
 * Stops all currently playing audio immediately.
 * Completely cleans up Web Audio API resources to prevent overlapping or audio memory leaks.
 */
export function stopAllAudio(): void {
  try {
    if (currentStreamPlayer) {
      currentStreamPlayer.stop();
      currentStreamPlayer = null;
    }
    if (currentSource) {
      currentSource.onended = null;
      currentSource.stop();
      currentSource.disconnect();
      currentSource = null;
    }
  } catch (_) {
    // Ignore cleanup errors
  }
  currentOnEndedCallback = null;
  isCurrentlyPaused = false;

  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (_) {}
  }
}

/**
 * Pauses active PCM audio playback at the current exact sample.
 */
export async function pauseAudio(): Promise<boolean> {
  if (currentAudioCtx && currentAudioCtx.state === "running") {
    try {
      await currentAudioCtx.suspend();
      isCurrentlyPaused = true;
      return true;
    } catch (err) {
      console.warn("[AudioUtils] Failed to suspend audio context:", err);
    }
  }
  return false;
}

/**
 * Resumes paused PCM audio playback from the exact sample where it was paused.
 */
export async function resumeAudio(): Promise<boolean> {
  if (currentAudioCtx && currentAudioCtx.state === "suspended") {
    try {
      await currentAudioCtx.resume();
      isCurrentlyPaused = false;
      return true;
    } catch (err) {
      console.warn("[AudioUtils] Failed to resume audio context:", err);
    }
  }
  return false;
}

/**
 * Plays 24000Hz 16-bit linear PCM audio through Web Audio API.
 * Exactly matches the reference project's PCM decoding and playback pipeline:
 * base64 -> Uint8Array -> Int16Array -> Float32Array -> AudioBuffer -> AudioBufferSourceNode
 */
export async function playPCM(
  base64Data: string,
  callbacks?: {
    onStart?: () => void;
    onEnded?: () => void;
    onError?: (err: any) => void;
  }
): Promise<void> {
  // Stop any previous audio to eliminate overlapping voices
  stopAllAudio();

  try {
    const audioCtx = getOrCreateAudioContext();
    if (audioCtx.state === "suspended") {
      await audioCtx.resume();
    }

    const float32 = decodePCMBase64ToFloat32(base64Data);

    // Create 24000Hz mono AudioBuffer
    const audioBuffer = audioCtx.createBuffer(1, float32.length, 24000);
    audioBuffer.getChannelData(0).set(float32);

    const source = audioCtx.createBufferSource();
    currentSource = source;
    source.buffer = audioBuffer;
    source.connect(audioCtx.destination);

    currentOnEndedCallback = () => {
      try {
        if (currentSource === source) currentSource = null;
        isCurrentlyPaused = false;
      } catch (_) {}
      callbacks?.onEnded?.();
    };

    source.onended = () => {
      if (currentOnEndedCallback) {
        currentOnEndedCallback();
        currentOnEndedCallback = null;
      }
    };

    source.start(0);
    isCurrentlyPaused = false;
    callbacks?.onStart?.();

    return new Promise<void>((resolve) => {
      const origEnded = source.onended;
      source.onended = (ev) => {
        if (typeof origEnded === "function") {
          origEnded.call(source, ev);
        }
        resolve();
      };
    });
  } catch (error) {
    console.error("[AudioUtils] Error in playPCM:", error);
    stopAllAudio();
    callbacks?.onError?.(error);
    throw error;
  }
}

/**
 * Fallback browser speech synthesis is permanently disabled per user requirement.
 * Only genuine Gemini AI voice (Aoede) is permitted.
 */
export function speakWithBrowserVoice(_text: string): Promise<void> {
  console.warn("[AudioUtils] Suppressed browser SpeechSynthesis per user directive (only natural Gemini Aoede voice allowed)");
  return Promise.resolve();
}
