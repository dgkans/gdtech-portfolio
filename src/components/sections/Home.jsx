import { useEffect, useRef, useState } from "react";
import { siteConfig } from "../../data/config";
import { heroSummary } from "../../data/resume";

const VIEW_KEY = "gd_hero_view";

const SCRIPT = [
  { type: "command", text: "whoami" },
  {
    type: "output",
    lines: [
      "Gaurav Desai · Software Engineer · ML Engineer · San Francisco",
      "Open to roles anywhere in the USA.",
    ],
  },
  { type: "blank" },
  { type: "command", text: "cat ./about.md" },
  {
    type: "output",
    lines: [
      "Low-latency Kafka / Redis / Solace pipelines, polyglot trading APIs.",
      "MERN + FastAPI ML products; M.S. CS (3.94) — algorithms & ML depth.",
    ],
  },
  { type: "blank" },
  { type: "command", text: "ls ./projects" },
  {
    type: "grid",
    items: ["ai-realestate/", "blogspace/", "aethervault/", "e-adoption/"],
  },
  { type: "blank" },
  { type: "command", text: "./say-hi --interactive" },
  { type: "output", lines: ["Ready when you are. ↓"], accent: true },
];

const TYPE_SPEED = 35;
const COMMAND_PAUSE = 220;
const OUTPUT_PAUSE = 260;

function prefersReducedMotion() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getStoredView() {
  try {
    const v = localStorage.getItem(VIEW_KEY);
    return v === "terminal" || v === "story" ? v : "story";
  } catch {
    return "story";
  }
}

function ViewToggle({ view, setView }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-[11px] uppercase tracking-[0.25em] text-gray-500 dark:text-gray-400">
        View this site as
      </span>
      <div
        role="radiogroup"
        aria-label="Choose hero view"
        className="inline-flex items-center gap-1 rounded-full border border-blue-500/30 dark:border-blue-400/30 bg-white/70 dark:bg-white/[0.04] backdrop-blur p-1 text-sm font-medium shadow-sm"
      >
        {[
          { id: "story", label: "Recruiter", emoji: "👔" },
          { id: "terminal", label: "Developer", emoji: "⌨" },
        ].map((opt) => {
          const active = view === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setView(opt.id)}
              className={`px-4 py-1.5 rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
                active
                  ? "bg-blue-500 text-white shadow-md shadow-blue-500/30"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
              }`}
            >
              <span aria-hidden="true">{opt.emoji}</span>
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CTAButtons() {
  return (
    <div className="flex flex-wrap justify-center gap-3 mt-8">
      <a
        href="#projects"
        className="bg-blue-500 text-white py-2.5 px-5 rounded-lg font-medium transition hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(59,130,246,0.45)]"
      >
        View Projects
      </a>
      <a
        href="#contact"
        className="border border-black/15 dark:border-white/15 text-gray-800 dark:text-gray-200 py-2.5 px-5 rounded-lg font-medium transition hover:-translate-y-0.5 hover:bg-black/5 dark:hover:bg-white/5"
      >
        Contact Me
      </a>
    </div>
  );
}

function StoryHero() {
  return (
    <div className="relative rounded-2xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/[0.02] backdrop-blur-md px-6 sm:px-10 py-10 sm:py-14 shadow-[0_8px_40px_rgba(15,23,42,0.06)] dark:shadow-none">
      <div className="text-center max-w-2xl mx-auto">
        <p className="text-xs uppercase tracking-[0.25em] text-blue-500 font-semibold mb-3">
          Software Engineer · ML Engineer
        </p>
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent leading-tight">
          Hi, I'm {siteConfig.name.split(" ")[0]}
        </h1>
        <p className="mt-5 text-base sm:text-lg text-gray-700 dark:text-gray-300 text-left sm:text-center leading-relaxed">
          {heroSummary}
        </p>
        <p className="mt-3 text-xs uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400 font-mono inline-flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Open to full-time Software / ML Engineer roles across the USA · onsite, hybrid, or remote
        </p>
      </div>

      <CTAButtons />
    </div>
  );
}

function TerminalHero() {
  const [committed, setCommitted] = useState([]);
  const [typing, setTyping] = useState("");
  const [idx, setIdx] = useState(0);
  const [done, setDone] = useState(false);
  const scrollerRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setCommitted(SCRIPT);
      setIdx(SCRIPT.length);
      setDone(true);
      return undefined;
    }

    if (idx >= SCRIPT.length) {
      setDone(true);
      return undefined;
    }
    const event = SCRIPT[idx];
    let cancelled = false;
    let timer;

    if (event.type === "command") {
      let i = 0;
      const tick = () => {
        if (cancelled) return;
        i += 1;
        setTyping(event.text.slice(0, i));
        if (i >= event.text.length) {
          setCommitted((prev) => [...prev, event]);
          setTyping("");
          timer = setTimeout(() => setIdx((v) => v + 1), COMMAND_PAUSE);
        } else {
          timer = setTimeout(tick, TYPE_SPEED);
        }
      };
      timer = setTimeout(tick, COMMAND_PAUSE);
    } else {
      timer = setTimeout(() => {
        if (cancelled) return;
        setCommitted((prev) => [...prev, event]);
        setIdx((v) => v + 1);
      }, OUTPUT_PAUSE);
    }

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [idx]);

  useEffect(() => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
    }
  }, [committed, typing]);

  const skip = () => {
    setCommitted(SCRIPT);
    setTyping("");
    setIdx(SCRIPT.length);
    setDone(true);
  };

  const replay = () => {
    setCommitted([]);
    setTyping("");
    setIdx(0);
    setDone(false);
  };

  return (
    <div>
      <div className="rounded-xl overflow-hidden border border-black/10 dark:border-white/10 bg-zinc-950 text-zinc-100 shadow-2xl">
        <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900/80 border-b border-white/5">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
          </div>
          <div className="text-[11px] text-zinc-400 font-mono truncate">
            guest@gaurav.tech: ~
          </div>
          <button
            type="button"
            onClick={done ? replay : skip}
            className="text-[10px] uppercase tracking-wider text-zinc-500 hover:text-zinc-200 transition"
          >
            {done ? "Replay" : "Skip"}
          </button>
        </div>
        <div
          ref={scrollerRef}
          className="font-mono text-[13.5px] leading-6 px-5 py-4 max-h-[420px] overflow-y-auto"
        >
          {committed.map((event, i) => (
            <Line key={i} event={event} />
          ))}
          {typing !== "" && (
            <div className="flex">
              <Prompt />
              <span className="text-zinc-100 whitespace-pre">{typing}</span>
              <Cursor />
            </div>
          )}
          {typing === "" && !done && committed.length > 0 && (
            <div className="flex">
              <Prompt />
              <Cursor />
            </div>
          )}
        </div>
      </div>

      <div
        className={`transition-all duration-700 ${
          done ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
        }`}
      >
        <CTAButtons />
      </div>
    </div>
  );
}

function Line({ event }) {
  if (event.type === "blank") return <div className="h-2" />;
  if (event.type === "command") {
    return (
      <div className="flex">
        <Prompt />
        <span className="text-zinc-100 whitespace-pre">{event.text}</span>
      </div>
    );
  }
  if (event.type === "output") {
    return (
      <div className={event.accent ? "text-blue-400" : "text-zinc-300"}>
        {event.lines.map((l, i) => (
          <div key={i}>{l}</div>
        ))}
      </div>
    );
  }
  if (event.type === "grid") {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-1 text-cyan-400">
        {event.items.map((item, i) => (
          <span key={i}>{item}</span>
        ))}
      </div>
    );
  }
  return null;
}

function Prompt() {
  return (
    <span className="select-none whitespace-pre">
      <span className="text-emerald-400">guest@gaurav.tech</span>
      <span className="text-zinc-500">:</span>
      <span className="text-blue-400">~</span>
      <span className="text-zinc-500">$ </span>
    </span>
  );
}

function Cursor() {
  return (
    <span className="ml-0.5 inline-block w-2 h-4 align-middle bg-zinc-100 animate-blink" />
  );
}

export const Home = () => {
  const [view, setView] = useState(getStoredView);

  useEffect(() => {
    try {
      localStorage.setItem(VIEW_KEY, view);
    } catch {
      // ignore
    }
  }, [view]);

  return (
    <section
      id="home"
      className="relative flex flex-col items-center justify-center pt-24 md:pt-28 pb-8 md:pb-10 px-4"
    >
      <div className="w-full max-w-5xl">
        <div className="flex justify-center mb-7">
          <ViewToggle view={view} setView={setView} />
        </div>

        {view === "story" ? <StoryHero /> : <TerminalHero />}
      </div>
    </section>
  );
};
