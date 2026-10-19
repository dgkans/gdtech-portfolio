import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { polishPersonaWithOpenAI } from "./server/personaOpenAI.js";

function personaDevApiPlugin(mode) {
  return {
    name: "persona-dev-api",
    configureServer(server) {
      const env = loadEnv(mode, process.cwd(), "");

      server.middlewares.use(async (req, res, next) => {
        const pathname = (req.url || "").split("?")[0];
        if (pathname !== "/api/persona") {
          next();
          return;
        }

        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");

        if (req.method === "OPTIONS") {
          res.statusCode = 204;
          res.end();
          return;
        }

        if (req.method !== "POST") {
          res.statusCode = 405;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: "Method not allowed" }));
          return;
        }

        const key = env.OPENAI_API_KEY || process.env.OPENAI_API_KEY;
        if (!key) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({
              error:
                "OPENAI_API_KEY missing — add it to .env.local for local persona polish",
            })
          );
          return;
        }

        const chunks = [];
        for await (const chunk of req) {
          chunks.push(chunk);
        }
        const raw = Buffer.concat(chunks).toString("utf8");
        let body = {};
        if (raw) {
          try {
            body = JSON.parse(raw);
          } catch {
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "Invalid JSON body" }));
            return;
          }
        }

        try {
          const text = await polishPersonaWithOpenAI(key, body);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ text }));
        } catch (e) {
          const status = e.status || 500;
          res.statusCode = status;
          res.setHeader("Content-Type", "application/json");
          if (status === 400) {
            res.end(JSON.stringify({ error: e.message || "Bad request" }));
            return;
          }
          res.end(
            JSON.stringify({
              error: "Upstream LLM error",
              detail: (e.message || "").slice(0, 500),
            })
          );
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  // Load environment variables from .env file
  loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), tailwindcss(), personaDevApiPlugin(mode)],
    base: "/gdtech-portfolio",
  };
});
