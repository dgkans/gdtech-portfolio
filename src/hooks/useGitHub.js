import { useEffect, useState } from "react";
import {
  aggregateLanguages,
  getContributions,
  getRepoCommits,
  getRepoLanguages,
  getUserRepos,
} from "../lib/github";

export function useGitHubContributions(username) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getContributions(username)
      .then((d) => {
        if (cancelled) return;
        setData(d);
        setError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err);
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [username]);

  return { data, error, loading };
}

export function useUserRepos(username) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getUserRepos(username)
      .then((repos) => {
        if (cancelled) return;
        setData(repos);
        setError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err);
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [username]);

  return { data, error, loading };
}

// Fetch latest commits across a list of [owner, repo] pairs and merge sort.
export function useRecentCommits({ username, repoNames, perRepo = 5, limit = 8 }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!repoNames || repoNames.length === 0) {
      setData([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    Promise.allSettled(
      repoNames.map((name) => getRepoCommits(username, name, perRepo))
    )
      .then((results) => {
        if (cancelled) return;
        const merged = [];
        results.forEach((r, idx) => {
          if (r.status !== "fulfilled" || !Array.isArray(r.value)) return;
          const repoName = repoNames[idx];
          r.value.forEach((c) => {
            merged.push({
              repo: repoName,
              sha: c.sha,
              shortSha: c.sha.slice(0, 7),
              message: (c.commit?.message || "").split("\n")[0],
              author:
                c.commit?.author?.name || c.author?.login || "unknown",
              date: c.commit?.author?.date || c.commit?.committer?.date,
              url: c.html_url,
            });
          });
        });
        merged.sort((a, b) => new Date(b.date) - new Date(a.date));
        setData(merged.slice(0, limit));
        setError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err);
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [username, repoNames?.join(","), perRepo, limit]);

  return { data, error, loading };
}

// Aggregate languages across a list of repos. Pass null/undefined repoNames
// to aggregate across ALL of the user's public repos instead.
export function useLanguageBreakdown({ username, repoNames }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    async function run() {
      try {
        let names = repoNames;
        if (!names) {
          const repos = await getUserRepos(username);
          names = repos
            .filter((r) => !r.fork && !r.archived)
            .slice(0, 12)
            .map((r) => r.name);
        }
        const results = await Promise.allSettled(
          names.map((name) => getRepoLanguages(username, name))
        );
        if (cancelled) return;
        const langs = results
          .filter((r) => r.status === "fulfilled")
          .map((r) => r.value);
        setData(aggregateLanguages(langs));
        setError(null);
      } catch (err) {
        if (cancelled) return;
        setError(err);
      } finally {
        if (cancelled) return;
        setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [username, repoNames?.join(",")]);

  return { data, error, loading };
}
