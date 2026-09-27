import type { Config } from "@netlify/functions";
import voiceHandler from "./voice";

export default voiceHandler;

export const config: Config = {
  path: ["/api/tts", "/.netlify/functions/tts"],
};
