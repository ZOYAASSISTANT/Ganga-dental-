import type { Config } from "@netlify/functions";

export default async () => {
  return new Response(JSON.stringify({ status: "ok" }), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
};

export const config: Config = {
  path: ["/api/health", "/.netlify/functions/health"],
};
