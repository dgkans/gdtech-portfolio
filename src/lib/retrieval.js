/**
 * Tiny retrieval engine for the "Chat with my AI persona" widget.
 *
 * Uses TF-IDF + cosine similarity over a small in-memory corpus.
 * No API calls, no model downloads, no data leaves the browser.
 */

const STOPWORDS = new Set([
  "a", "an", "the", "is", "are", "was", "were", "be", "been", "being",
  "of", "to", "in", "on", "at", "by", "with", "for", "from", "about", "into",
  "and", "or", "but", "if", "then", "than", "so", "as", "that", "this", "those", "these",
  "it", "its", "i", "you", "he", "she", "we", "they", "them", "him", "her", "his",
  "my", "your", "our", "their", "me", "us",
  "do", "does", "did", "doing", "have", "has", "had", "will", "would", "should", "can", "could", "may", "might",
  "what", "when", "where", "why", "how", "who", "whom", "which",
  "tell", "say", "ask", "give", "show", "let",
  "any", "some", "all", "each", "every", "no", "not",
]);

/** Lowercase, drop punctuation, split on whitespace, strip stopwords. */
function tokenize(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9+#./-]+/g, " ")
    .split(/\s+/)
    .map((t) => t.replace(/^[.\-/]+|[.\-/]+$/g, ""))
    .filter((t) => t && t.length > 1 && !STOPWORDS.has(t));
}

/** Build TF vector for one document/query. */
function termFreqs(tokens) {
  const tf = new Map();
  tokens.forEach((t) => tf.set(t, (tf.get(t) || 0) + 1));
  // length-normalize TF so longer chunks don't dominate.
  const len = tokens.length || 1;
  tf.forEach((v, k) => tf.set(k, v / len));
  return tf;
}

/**
 * Build an index over a corpus of `{ text, ... }` items.
 * Returns `{ search(query, k = 3) }`.
 */
export function buildIndex(corpus) {
  const docs = corpus.map((c) => ({ ...c, _tokens: tokenize(c.text) }));
  const N = docs.length || 1;

  // document frequency
  const df = new Map();
  docs.forEach((d) => {
    const seen = new Set(d._tokens);
    seen.forEach((t) => df.set(t, (df.get(t) || 0) + 1));
  });

  // smoothed IDF
  const idf = new Map();
  df.forEach((dfi, t) => {
    idf.set(t, Math.log((N + 1) / (dfi + 0.5)) + 1);
  });

  const docVecs = docs.map((d) => {
    const tf = termFreqs(d._tokens);
    const vec = new Map();
    let norm = 0;
    tf.forEach((v, t) => {
      const w = v * (idf.get(t) || 0);
      if (w !== 0) {
        vec.set(t, w);
        norm += w * w;
      }
    });
    return { doc: d, vec, norm: Math.sqrt(norm) || 1 };
  });

  function search(query, k = 3) {
    const tokens = tokenize(query);
    if (tokens.length === 0) return [];

    const tf = termFreqs(tokens);
    const qvec = new Map();
    let qnorm = 0;
    tf.forEach((v, t) => {
      const w = v * (idf.get(t) || 0);
      if (w !== 0) {
        qvec.set(t, w);
        qnorm += w * w;
      }
    });
    qnorm = Math.sqrt(qnorm) || 1;

    const scored = docVecs.map(({ doc, vec, norm }) => {
      let dot = 0;
      qvec.forEach((qw, t) => {
        const dw = vec.get(t);
        if (dw) dot += qw * dw;
      });
      // small bonus when the query mentions a project name explicitly
      let bonus = 0;
      if (doc.project) {
        const projTokens = tokenize(doc.project);
        const overlap = projTokens.filter((p) => qvec.has(p)).length;
        if (overlap > 0) bonus = 0.15 * overlap;
      }
      const sim = dot / (qnorm * norm) + bonus;
      const { _tokens, ...rest } = doc;
      void _tokens;
      return { ...rest, score: sim };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, k);
  }

  return { search };
}
