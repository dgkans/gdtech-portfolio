/**
 * Server-side OpenAI call for portfolio persona polish (Vercel `api/persona` + Vite dev middleware).
 * Rewrites site-grounded drafts only — no open-ended general chat.
 */

import { buildPersonaSystemPrompt, buildPersonaUserPrompt } from "../src/lib/personaPrompt.js";

export async function polishPersonaWithOpenAI(apiKey, body) {
  const query = String(body?.query || "").trim();
  const draft = String(body?.draft || "").trim();
  const context = String(body?.context || "").trim();
  const model = String(body?.model || "gpt-4o-mini").trim();

  if (!query || !draft) {
    const err = new Error("query and draft are required");
    err.status = 400;
    throw err;
  }

  const system = buildPersonaSystemPrompt();
  const userContent = buildPersonaUserPrompt({ query, context, draft });

  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.35,
      max_tokens: 700,
      messages: [
        { role: "system", content: system },
        { role: "user", content: userContent },
      ],
    }),
  });

  if (!r.ok) {
    const detail = await r.text().catch(() => "");
    const err = new Error(detail.slice(0, 500) || `OpenAI HTTP ${r.status}`);
    err.status = 502;
    err.upstreamStatus = r.status;
    throw err;
  }

  const data = await r.json();
  const text = data?.choices?.[0]?.message?.content?.trim() || "";
  return text;
}
