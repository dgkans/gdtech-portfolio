import { useEffect, useState } from "react";

const SECTION_TO_FILE = {
  home: "~/portfolio/hero.tsx",
  skills: "~/portfolio/skills.ts",
  github: "~/portfolio/github-activity.tsx",
  projects: "~/portfolio/projects.json",
  contact: "~/portfolio/contact.tsx",
};

function formatTime(d) {
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

export const StatusLine = () => {
  const [time, setTime] = useState(() => formatTime(new Date()));
  const [section, setSection] = useState("home");

  useEffect(() => {
    const t = setInterval(() => setTime(formatTime(new Date())), 30_000);
    return () => clearInterval(t);
  }, []);

  // Track which section is centered in the viewport for the status line file path.
  useEffect(() => {
    const ids = Object.keys(SECTION_TO_FILE);
    const elems = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (elems.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setSection(visible[0].target.id);
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: [0, 0.25, 0.5, 1] }
    );
    elems.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const file = SECTION_TO_FILE[section] || SECTION_TO_FILE.home;

  return (
    <div className="hidden md:block fixed bottom-0 left-0 right-0 z-30 pointer-events-none">
      <div
        className="font-mono text-[11px] flex items-center gap-2 px-4 py-1 backdrop-blur
                   border-t
                   bg-zinc-100/85 dark:bg-zinc-950/80
                   border-zinc-300/60 dark:border-white/10
                   text-zinc-600 dark:text-zinc-300"
      >
        <span className="bg-emerald-500 text-black px-1.5 rounded-sm font-bold tracking-wider">
          NORMAL
        </span>
        <span className="text-zinc-700 dark:text-zinc-200">{file}</span>
        <span className="text-zinc-400 dark:text-zinc-600">·</span>
        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          main
        </span>
        <span className="text-zinc-400 dark:text-zinc-600">·</span>
        <span className="text-zinc-500 dark:text-zinc-400">vite serve</span>

        <span className="ml-auto" />

        <span>UTF-8</span>
        <span className="text-zinc-400 dark:text-zinc-600">|</span>
        <span>LF</span>
        <span className="text-zinc-400 dark:text-zinc-600">|</span>
        <span className="text-blue-600 dark:text-blue-400 tabular-nums">
          {time}
        </span>
      </div>
    </div>
  );
};
