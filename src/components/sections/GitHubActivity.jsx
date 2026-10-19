import { useEffect, useMemo, useState } from "react";
import { GitHubCalendar } from "react-github-calendar";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RTooltip,
} from "recharts";
import { RevealOnScroll } from "../RevealOnScroll";
import { siteConfig } from "../../data/config";
import {
  useGitHubContributions,
  useLanguageBreakdown,
  useRecentCommits,
} from "../../hooks/useGitHub";
import { colorForLanguage } from "../../lib/github";
import { useTheme } from "../../hooks/useTheme";

const cardCls =
  "rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] p-6";

function formatRelative(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const sec = Math.floor(diff / 1000);
  const min = Math.floor(sec / 60);
  const hour = Math.floor(min / 60);
  const day = Math.floor(hour / 24);
  if (day >= 30) return `${Math.floor(day / 30)}mo ago`;
  if (day >= 1) return `${day}d ago`;
  if (hour >= 1) return `${hour}h ago`;
  if (min >= 1) return `${min}m ago`;
  return "just now";
}

function CommitsFeed() {
  const { data, loading, error } = useRecentCommits({
    username: siteConfig.github,
    repoNames: siteConfig.featuredRepos,
    perRepo: 5,
    limit: 5,
  });

  return (
    <div className={`${cardCls} h-full flex flex-col`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Recent commits</h3>
        <span className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400">
          latest 5 across featured repos
        </span>
      </div>

      {loading && (
        <div className="space-y-3 animate-pulse flex-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-12 bg-black/5 dark:bg-white/5 rounded"
            />
          ))}
        </div>
      )}

      {error && (
        <p className="text-amber-600 dark:text-amber-400 text-sm">
          Couldn't load commits ({error.message}).
        </p>
      )}

      {!loading && !error && (!data || data.length === 0) && (
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          No recent commits found.
        </p>
      )}

      {!loading && data && data.length > 0 && (
        <ul className="divide-y divide-black/5 dark:divide-white/5 flex-1">
          {data.map((c) => (
            <li key={c.sha} className="py-3">
              <a
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:bg-black/[0.03] dark:hover:bg-white/[0.03] -mx-2 px-2 py-1 rounded transition"
              >
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-1">
                  <span className="text-blue-600 dark:text-blue-400 font-medium">
                    {c.repo}
                  </span>
                  <span>·</span>
                  <span className="font-mono">{c.shortSha}</span>
                  <span>·</span>
                  <span>{formatRelative(c.date)}</span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-200 line-clamp-2">
                  {c.message}
                </p>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function LanguageBreakdown() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const { data, loading, error } = useLanguageBreakdown({
    username: siteConfig.github,
  });

  const chartData = (data || []).slice(0, 8).map((d) => ({
    name: d.name,
    value: Math.round(d.percent * 10) / 10,
    color: colorForLanguage(d.name),
  }));

  return (
    <div className={`${cardCls} h-full flex flex-col`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Language breakdown</h3>
        <span className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400">
          public repos
        </span>
      </div>

      {loading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-40 h-40 rounded-full border-4 border-black/5 dark:border-white/5 border-t-blue-500 animate-spin" />
        </div>
      )}

      {error && (
        <p className="text-amber-600 dark:text-amber-400 text-sm">
          Couldn't load languages ({error.message}).
        </p>
      )}

      {!loading && data && chartData.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center flex-1">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((d) => (
                    <Cell key={d.name} fill={d.color} />
                  ))}
                </Pie>
                <RTooltip
                  contentStyle={{
                    background: isDark
                      ? "rgba(10,10,10,0.95)"
                      : "rgba(255,255,255,0.95)",
                    border: `1px solid ${
                      isDark ? "rgba(255,255,255,0.1)" : "rgba(15,23,42,0.1)"
                    }`,
                    borderRadius: "8px",
                    color: isDark ? "#f3f4f6" : "#0f172a",
                    fontSize: "12px",
                  }}
                  formatter={(value, name) => [`${value}%`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="space-y-1.5 text-sm">
            {chartData.map((d) => (
              <li key={d.name} className="flex items-center gap-2">
                <span
                  className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: d.color }}
                />
                <span className="text-gray-700 dark:text-gray-300 flex-1 truncate">
                  {d.name}
                </span>
                <span className="text-gray-500 dark:text-gray-400 tabular-nums">
                  {d.value}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function computeStats(contributions) {
  if (!contributions || contributions.length === 0) return null;

  // Group counts by YYYY-MM.
  const byMonth = new Map();
  contributions.forEach((d) => {
    const key = d.date.slice(0, 7);
    byMonth.set(key, (byMonth.get(key) || 0) + d.count);
  });
  const sortedMonths = Array.from(byMonth.entries()).sort(([a], [b]) =>
    a.localeCompare(b)
  );
  const months = sortedMonths.slice(-12).map(([key, count]) => {
    const d = new Date(`${key}-01T00:00:00`);
    return {
      key,
      label: d.toLocaleDateString("en-US", { month: "short" }),
      year: d.getFullYear(),
      count,
    };
  });

  const total = contributions.reduce((s, d) => s + d.count, 0);
  const best = months.reduce((m, x) => (x.count > m.count ? x : m), months[0]);

  // Streaks (chronological).
  const sorted = [...contributions].sort((a, b) =>
    a.date.localeCompare(b.date)
  );
  let longest = 0;
  let run = 0;
  sorted.forEach((d) => {
    if (d.count > 0) {
      run += 1;
      if (run > longest) longest = run;
    } else {
      run = 0;
    }
  });
  let current = 0;
  for (let i = sorted.length - 1; i >= 0; i--) {
    if (sorted[i].count > 0) current += 1;
    else break;
  }

  return { months, total, best, current, longest };
}

function StatTile({ label, value, sub }) {
  return (
    <div className="rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.03] px-3 py-2.5">
      <div className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400">
        {label}
      </div>
      <div className="text-lg font-semibold text-gray-900 dark:text-white tabular-nums">
        {value}
      </div>
      {sub && (
        <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
          {sub}
        </div>
      )}
    </div>
  );
}

function ContributionsCard() {
  const { resolvedTheme } = useTheme();
  const { data, loading, error } = useGitHubContributions(siteConfig.github);
  const [compact, setCompact] = useState(false);
  const stats = useMemo(
    () => computeStats(data?.contributions),
    [data?.contributions]
  );

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;
    const mql = window.matchMedia("(max-width: 640px)");
    const onChange = () => setCompact(Boolean(mql.matches));
    onChange();
    mql.addEventListener?.("change", onChange);
    return () => mql.removeEventListener?.("change", onChange);
  }, []);

  return (
    <div className={cardCls}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Contributions</h3>
        <a
          href={`https://github.com/${siteConfig.github}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 hover:text-blue-500"
        >
          @{siteConfig.github} ↗
        </a>
      </div>

      <div className="overflow-x-auto -mx-2 px-2">
        <GitHubCalendar
          username={siteConfig.github}
          colorScheme={resolvedTheme === "dark" ? "dark" : "light"}
          blockSize={compact ? 6 : 11}
          blockMargin={compact ? 1 : 3}
          fontSize={compact ? 10 : 12}
          theme={{
            light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
            dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
          }}
          errorMessage="Couldn't load contribution data right now."
        />
      </div>

      <div className="mt-6 pt-5 border-t border-black/5 dark:border-white/5">
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-16 bg-black/5 dark:bg-white/5 rounded animate-pulse"
              />
            ))}
          </div>
        )}

        {error && (
          <p className="text-amber-600 dark:text-amber-400 text-sm">
            Couldn't load contribution stats ({error.message}).
          </p>
        )}

        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatTile
              label="Total"
              value={stats.total.toLocaleString()}
              sub="last 12 months"
            />
            <StatTile
              label="Best month"
              value={stats.best.count.toLocaleString()}
              sub={`${stats.best.label} ${stats.best.year}`}
            />
            <StatTile
              label="Current streak"
              value={`${stats.current} ${stats.current === 1 ? "day" : "days"}`}
            />
            <StatTile
              label="Longest streak"
              value={`${stats.longest} ${stats.longest === 1 ? "day" : "days"}`}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export const GitHubActivity = () => {
  return (
    <section
      id="github"
      className="py-12 md:py-16 flex justify-center"
    >
      <RevealOnScroll>
        <div className="max-w-5xl mx-auto px-4 w-full">
          <div className="flex flex-col items-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent text-center">
              GitHub Activity
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
              Live snapshot of what I've been building
            </p>
          </div>

          <div className="space-y-6">
            <ContributionsCard />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CommitsFeed />
              <LanguageBreakdown />
            </div>
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
};
