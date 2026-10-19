/**
 * Optional LLM polish for the on-site persona (RAG stays local; this only rewrites).
 *
 * Scope: résumé / portfolio answers only — the model never answers unrelated “general chat”.
 *
 * Production (GitHub Pages): set VITE_PERSONA_PROXY_URL to a server you control
 * that forwards to OpenAI (or another provider) with the API key on the server.
 * Omit it to keep the chat 100% local and free.
 *
 * Local dev: add OPENAI_API_KEY to `.env.local` and set
 * VITE_PERSONA_PROXY_URL=/api/persona — Vite serves a dev-only POST handler.
 *
 * Never commit real API keys. A Vite `VITE_*` key is bundled into client JS — use
 * only for local experiments, or use the proxy in production.
 */

import { siteConfig } from "../data/config";
import { buildPersonaSystemPrompt, buildPersonaUserPrompt } from "./personaPrompt";

const PROXY = String(import.meta.env.VITE_PERSONA_PROXY_URL || "").trim();
const OPENAI_KEY = String(import.meta.env.VITE_OPENAI_API_KEY || "").trim();
const OPENAI_MODEL = String(
  import.meta.env.VITE_OPENAI_MODEL || "gpt-4o-mini"
).trim();
/** Only if true: call OpenAI directly from the browser (insecure for public sites). */
const ALLOW_CLIENT_OPENAI =
  String(import.meta.env.VITE_PERSONA_ALLOW_CLIENT_LLM || "").trim() === "1";

/**
 * Returns true when a network LLM call may be attempted (polish only).
 */
export function isPersonaLLMConfigured() {
  if (PROXY) return true;
  if (ALLOW_CLIENT_OPENAI && OPENAI_KEY) return true;
  return false;
}

/**
 * @param {{ query: string, draft: string, context: string }} args
 * @returns {Promise<string | null>} polished text, or null to keep draft
 */
export async function polishPersonaReply({ query, draft, context }) {
  const q = String(query || "").trim();
  const bodyDraft = String(draft || "").trim();
  if (!q || !bodyDraft) return null;

  const userBlock = buildPersonaUserPrompt({
    query: q,
    context,
    draft: bodyDraft,
  });

  if (PROXY) {
    const res = await fetch(PROXY, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: q,
        draft: bodyDraft,
        context,
        model: OPENAI_MODEL,
      }),
    });
    if (!res.ok) {
      const err = await res.text().catch(() => "");
      throw new Error(`Persona proxy ${res.status}: ${err.slice(0, 200)}`);
    }
    const data = await res.json().catch(() => ({}));
    const text = typeof data.text === "string" ? data.text.trim() : "";
    return text || null;
  }

  if (!(ALLOW_CLIENT_OPENAI && OPENAI_KEY)) return null;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      temperature: 0.35,
      max_tokens: 700,
      messages: [
        {
          role: "system",
          content: buildPersonaSystemPrompt({
            name: siteConfig.name,
            tagline: siteConfig.tagline,
          }),
        },
        { role: "user", content: userBlock },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text().catch(() => "");
    throw new Error(`OpenAI ${res.status}: ${err.slice(0, 200)}`);
  }

  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content?.trim();
  return text || null;
}
