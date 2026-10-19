/**
 * Vercel Serverless Function (Node): keeps OPENAI_API_KEY on the server.
 *
 * Deploy: connect repo to Vercel, set env OPENAI_API_KEY, deploy.
 * Then set VITE_PERSONA_PROXY_URL=https://your-domain.vercel.app/api/persona
 * in the Vite build for your GitHub Pages site (or same origin if SPA is on Vercel).
 *
 * Request body: { query, draft, context, model? } — résumé-grounded polish only.
 * Response: { text: string }
 */

import { polishPersonaWithOpenAI } from "../server/personaOpenAI.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    res.status(500).json({ error: "OPENAI_API_KEY is not configured" });
    return;
  }

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      res.status(400).json({ error: "Invalid JSON body" });
      return;
    }
  }

  try {
    const text = await polishPersonaWithOpenAI(key, body);
    res.status(200).json({ text });
  } catch (e) {
    const status = e.status || 500;
    if (status === 400) {
      res.status(400).json({ error: e.message || "Bad request" });
      return;
    }
    res.status(502).json({
      error: "Upstream LLM error",
      detail: (e.message || "").slice(0, 500),
    });
  }
}
