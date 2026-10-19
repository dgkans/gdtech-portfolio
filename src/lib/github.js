// Lightweight GitHub REST helper with localStorage caching so we don't burn
// through the 60 req/hour unauthenticated limit on every page view.

const API = "https://api.github.com";
const CACHE_PREFIX = "gh_cache_v1::";
const DEFAULT_TTL_MS = 1000 * 60 * 30; // 30 minutes

function cacheKey(path) {
  return `${CACHE_PREFIX}${path}`;
}

function readCache(path) {
  try {
    const raw = localStorage.getItem(cacheKey(path));
    if (!raw) return null;
    const { value, expiresAt } = JSON.parse(raw);
    if (Date.now() > expiresAt) return null;
    return value;
  } catch {
    return null;
  }
}

function writeCache(path, value, ttl) {
  try {
    localStorage.setItem(
      cacheKey(path),
      JSON.stringify({ value, expiresAt: Date.now() + ttl })
    );
  } catch {
    // localStorage may be full or unavailable — silently ignore.
  }
}

async function cacheFetch(url, { ttl = DEFAULT_TTL_MS, headers } = {}) {
  const cached = readCache(url);
  if (cached) return cached;

  const res = await fetch(url, { headers });

  if (!res.ok) {
    if (res.status === 403) {
      throw new Error("API rate limit reached. Try again later.");
    }
    throw new Error(`API ${res.status}: ${res.statusText}`);
  }

  const data = await res.json();
  writeCache(url, data, ttl);
  return data;
}

export function ghFetch(path, opts = {}) {
  return cacheFetch(`${API}${path}`, {
    ...opts,
    headers: { Accept: "application/vnd.github+json" },
  });
}

// Returns { total: {...}, contributions: [{date, count, level}] } for last year.
// Uses the public github-contributions-api proxy (same one react-github-calendar uses).
export function getContributions(username) {
  return cacheFetch(
    `https://github-contributions-api.jogruber.de/v4/${username}?y=last`
  );
}

export function getUserRepos(username) {
  return ghFetch(`/users/${username}/repos?sort=updated&per_page=100`);
}

export function getRepo(owner, repo) {
  return ghFetch(`/repos/${owner}/${repo}`);
}

export function getRepoCommits(owner, repo, perPage = 5) {
  return ghFetch(`/repos/${owner}/${repo}/commits?per_page=${perPage}`);
}

export function getRepoLanguages(owner, repo) {
  return ghFetch(`/repos/${owner}/${repo}/languages`);
}

// Aggregate language byte counts across many repos.
export function aggregateLanguages(perRepoLanguages) {
  const totals = {};
  perRepoLanguages.forEach((langs) => {
    if (!langs) return;
    Object.entries(langs).forEach(([lang, bytes]) => {
      totals[lang] = (totals[lang] || 0) + bytes;
    });
  });
  const entries = Object.entries(totals).sort((a, b) => b[1] - a[1]);
  const total = entries.reduce((sum, [, b]) => sum + b, 0) || 1;
  return entries.map(([name, bytes]) => ({
    name,
    bytes,
    percent: (bytes / total) * 100,
  }));
}

// Stable color per language (curated set + deterministic fallback).
const LANGUAGE_COLORS = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  Java: "#b07219",
  Go: "#00ADD8",
  "C#": "#178600",
  C: "#555555",
  "C++": "#f34b7d",
  Solidity: "#AA6746",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  Dockerfile: "#384d54",
  Jupyter: "#DA5B0B",
  "Jupyter Notebook": "#DA5B0B",
  Vue: "#41b883",
  Svelte: "#ff3e00",
  PHP: "#4F5D95",
  Ruby: "#701516",
  Rust: "#dea584",
  Kotlin: "#A97BFF",
  Swift: "#F05138",
  SCSS: "#c6538c",
  Makefile: "#427819",
};

export function colorForLanguage(name) {
  if (LANGUAGE_COLORS[name]) return LANGUAGE_COLORS[name];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) | 0;
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 65%, 55%)`;
}
