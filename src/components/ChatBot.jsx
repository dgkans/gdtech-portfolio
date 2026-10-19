import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { chatCorpus, seedQuestions } from "../data/chatCorpus";
import { buildIndex } from "../lib/retrieval";
import { createBrain } from "../lib/chatBrain";
import {
  isPersonaLLMConfigured,
  polishPersonaReply,
} from "../lib/personaLLM";

const HISTORY_KEY = "gd_chat_history_v1";
const MAX_HISTORY = 24;

/** Render minimal markdown: **bold** + line breaks; everything else is escaped. */
function renderInline(text) {
  const lines = String(text || "").split(/\n/);
  return lines.map((line, i) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g).map((p, j) => {
      if (/^\*\*[^*]+\*\*$/.test(p)) {
        return (
          <strong key={j} className="font-semibold">
            {p.slice(2, -2)}
          </strong>
        );
      }
      return <span key={j}>{p}</span>;
    });
    return (
      <span key={i} className="block">
        {parts.length === 0 ? "\u00A0" : parts}
      </span>
    );
  });
}

/** Animated hologram-style AI persona chip (border spins, face bobs, eyes blink). */
function AIPersonaGlyph({ size = "md" }) {
  const box =
    size === "sm"
      ? "w-8 h-8"
      : size === "lg"
        ? "w-11 h-11"
        : "w-9 h-9";
  const inset = size === "sm" ? "inset-[2px]" : size === "lg" ? "inset-[3px]" : "inset-[2.5px]";
  const eye = size === "sm" ? "w-1 h-1" : "w-1.5 h-1.5";
  const mouth = size === "sm" ? "w-2 h-[2px]" : "w-2.5 h-[3px]";

  return (
    <div
      className={`relative shrink-0 ${box} rounded-xl motion-safe:animate-persona-bob`}
      aria-hidden="true"
    >
      <div className="absolute inset-0 rounded-xl overflow-hidden shadow-[0_0_14px_rgba(59,130,246,0.35)]">
        <div
          className="absolute -inset-[45%] motion-safe:animate-persona-ring opacity-95"
          style={{
            background:
              "conic-gradient(from 0deg at 50% 50%, #22d3ee, #3b82f6, #6366f1, #a855f7, #06b6d4, #22d3ee)",
          }}
        />
      </div>
      <div
        className={`absolute ${inset} rounded-[10px] bg-white dark:bg-zinc-950 flex flex-col items-center justify-center gap-0.5 z-[1] shadow-inner shadow-black/15 dark:shadow-black/40`}
      >
        <div className="flex gap-1">
          <span
            className={`${eye} rounded-full bg-cyan-500 shadow-[0_0_6px_rgba(34,211,238,0.65)] motion-safe:animate-blink`}
          />
          <span
            className={`${eye} rounded-full bg-cyan-500 shadow-[0_0_6px_rgba(34,211,238,0.65)] motion-safe:animate-blink [animation-delay:0.15s]`}
          />
        </div>
        <span className={`${mouth} rounded-full bg-blue-500/75`} />
      </div>
    </div>
  );
}

function Avatar({ kind }) {
  if (kind === "user") {
    return (
      <div className="w-7 h-7 shrink-0 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-semibold">
        You
      </div>
    );
  }
  return <AIPersonaGlyph size="sm" />;
}

function SourcePill({ src, onJump }) {
  const label =
    src.section === "Project" && src.project
      ? `${src.section} · ${src.project}`
      : src.section;
  return (
    <button
      type="button"
      onClick={() => onJump(src.link)}
      className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-blue-500/30 text-blue-600 dark:text-blue-300 bg-blue-500/5 hover:bg-blue-500/15 transition"
      title={src.title}
    >
      {label}
    </button>
  );
}

const SUGGESTION_BTN =
  "text-xs px-2.5 py-1 rounded-full border border-blue-500/30 text-blue-600 dark:text-blue-300 hover:bg-blue-500/10 transition text-left disabled:opacity-40 disabled:pointer-events-none";

function SuggestionChips({ questions, onPick, disabled }) {
  return (
    <div className="flex flex-wrap gap-2">
      {questions.map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onPick(s)}
          disabled={disabled}
          className={SUGGESTION_BTN}
        >
          {s}
        </button>
      ))}
    </div>
  );
}

/** Up to 4 follow-ups after a bot reply; skips the user's last question; rotates for variety. */
function getFollowUpSuggestions(messages) {
  if (!messages?.length) return [];
  const last = messages[messages.length - 1];
  if (last.role !== "bot") return [];

  let lastUserText = "";
  for (let i = messages.length - 2; i >= 0; i--) {
    if (messages[i].role === "user") {
      lastUserText = String(messages[i].text || "").trim().toLowerCase();
      break;
    }
  }

  const pool = seedQuestions.filter(
    (q) => String(q).trim().toLowerCase() !== lastUserText
  );
  const base = pool.length ? pool : [...seedQuestions];
  const n = Math.min(4, base.length);
  const offset = messages.length % base.length;
  const picked = [];
  for (let i = 0; i < n; i++) {
    const q = base[(offset + i) % base.length];
    if (!picked.includes(q)) picked.push(q);
  }
  return picked;
}

export const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [thinking, setThinking] = useState(false);
  const [messages, setMessages] = useState(() => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      if (Array.isArray(parsed)) return parsed.slice(-MAX_HISTORY);
    } catch {
      // ignore
    }
    return [];
  });
  const inputRef = useRef(null);
  const scrollerRef = useRef(null);

  const brain = useMemo(() => {
    const idx = buildIndex(chatCorpus);
    return createBrain({ index: idx });
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(messages.slice(-MAX_HISTORY)));
    } catch {
      // ignore
    }
  }, [messages]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
    }
  }, [messages, thinking, open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const jumpTo = useCallback((hash) => {
    if (!hash) return;
    const el = document.querySelector(hash);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    else window.location.hash = hash;
  }, []);

  const llmOn = useMemo(() => isPersonaLLMConfigured(), []);

  const ask = useCallback(
    (raw) => {
      const q = String(raw || "").trim();
      if (!q || thinking) return;

      const userMsg = { role: "user", text: q, ts: Date.now() };
      setMessages((m) => [...m, userMsg]);
      setQuery("");
      setThinking(true);

      const delayMs = llmOn ? 0 : 280;

      window.setTimeout(() => {
        (async () => {
          const { text: draft, sources } = brain.answer(q);
          let text = draft;
          if (llmOn) {
            try {
              const ctx = brain.contextForLLM(q);
              const polished = await polishPersonaReply({
                query: q,
                draft,
                context: ctx,
              });
              if (polished) text = polished;
            } catch (e) {
              console.warn("[persona LLM]", e);
            }
          }
          const botMsg = {
            role: "bot",
            text,
            sources: sources || [],
            ts: Date.now(),
          };
          setMessages((m) => [...m.slice(-MAX_HISTORY + 1), botMsg]);
          setThinking(false);
        })();
      }, delayMs);
    },
    [brain, thinking, llmOn]
  );

  const followUpRow = useMemo(() => {
    if (thinking || messages.length === 0) return null;
    if (messages[messages.length - 1]?.role !== "bot") return null;
    const followUps = getFollowUpSuggestions(messages);
    return followUps.length ? followUps : null;
  }, [messages, thinking]);

  const onSubmit = (e) => {
    e.preventDefault();
    ask(query);
  };

  const reset = () => {
    setMessages([]);
    setQuery("");
    setThinking(false);
    brain.reset();
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch {
      // ignore
    }
  };

  return (
    <div
      className="fixed z-40 left-4 sm:left-6 transition-all duration-300"
      style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 1.25rem)" }}
    >
      {open && (
        <div
          role="dialog"
          aria-label="Chat with Gaurav's AI persona"
          className="absolute bottom-14 left-0 w-[min(94vw,360px)] sm:w-[380px] h-[min(80vh,560px)]
                     rounded-2xl border border-black/10 dark:border-white/10
                     bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md shadow-2xl
                     flex flex-col overflow-hidden"
        >
          <div className="flex items-start justify-between gap-3 px-4 py-3 border-b border-black/10 dark:border-white/10 bg-gradient-to-r from-blue-500/10 via-cyan-500/5 to-transparent">
            <div className="min-w-0 flex items-start gap-3">
              <AIPersonaGlyph size="lg" />
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">
                  Chat with my AI persona
                </h3>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 leading-snug">
                  {llmOn
                    ? "Retrieval from this site first; an API may polish wording only — still strictly about Gaurav's background on this site (no general chat)."
                    : "Answers are grounded in Gaurav's experience, projects, and skills on this site — no external LLM, no cost."}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={reset}
                  className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-md text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition"
                  title="Clear chat"
                >
                  Reset
                </button>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="w-7 h-7 grid place-items-center rounded-md text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition"
              >
                ×
              </button>
            </div>
          </div>

          <div
            ref={scrollerRef}
            className="flex-1 overflow-y-auto px-3 py-3 space-y-3"
          >
            {messages.length === 0 && (
              <div className="text-sm text-gray-700 dark:text-gray-200 space-y-3">
                <p>
                  Hi — I'm Gaurav's on-site AI persona. Ask me anything about
                  his work, projects, stack, or availability and I'll pull the
                  closest matching details from this portfolio.
                </p>
                <SuggestionChips
                  questions={seedQuestions}
                  onPick={ask}
                  disabled={thinking}
                />
              </div>
            )}

            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex gap-2 ${
                  m.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <Avatar kind={m.role} />
                <div
                  className={`max-w-[82%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-blue-500 text-white rounded-tr-sm"
                      : "bg-black/[0.04] dark:bg-white/[0.06] text-gray-800 dark:text-gray-100 rounded-tl-sm"
                  }`}
                >
                  <div className="whitespace-pre-wrap break-words">
                    {renderInline(m.text)}
                  </div>
                  {m.role === "bot" && m.sources && m.sources.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {m.sources.map((s) => (
                        <SourcePill key={s.id} src={s} onJump={jumpTo} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {thinking && (
              <div className="flex gap-2">
                <Avatar kind="bot" />
                <div className="rounded-xl px-3 py-2 bg-black/[0.04] dark:bg-white/[0.06]">
                  <span className="inline-flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" />
                  </span>
                </div>
              </div>
            )}

            {followUpRow && (
              <div className="pl-9 space-y-2 pt-1 border-t border-black/5 dark:border-white/5 mt-1">
                <p className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Suggested questions
                </p>
                <SuggestionChips
                  questions={followUpRow}
                  onPick={ask}
                  disabled={thinking}
                />
              </div>
            )}
          </div>

          <form
            onSubmit={onSubmit}
            className="border-t border-black/10 dark:border-white/10 p-2 flex gap-2 items-end bg-white/80 dark:bg-zinc-950/80"
          >
            <textarea
              ref={inputRef}
              rows={1}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  ask(query);
                }
              }}
              placeholder="Ask the persona anything…"
              className="flex-1 resize-none rounded-lg px-3 py-2 text-sm
                         border border-black/10 dark:border-white/10
                         bg-black/[0.03] dark:bg-white/[0.04]
                         text-gray-900 dark:text-white
                         placeholder-gray-500 dark:placeholder-gray-400
                         focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={!query.trim() || thinking}
              className="shrink-0 px-3 py-2 rounded-lg text-sm font-semibold
                         bg-blue-500 text-white hover:bg-blue-600 transition
                         disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={
          open ? "Close AI persona chat" : "Open chat with my AI persona"
        }
        className={`group flex items-center gap-2.5 pl-2 pr-4 sm:pr-5 py-2.5 rounded-full
                    bg-gradient-to-r from-blue-500 to-cyan-500 text-white
                    shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50
                    transition-all cursor-pointer border border-blue-400/40
                    max-w-[min(94vw,320px)] sm:max-w-none
                    ${open ? "ring-2 ring-blue-400/50" : ""}`}
      >
        <AIPersonaGlyph size="sm" />
        <span className="text-sm font-semibold leading-snug text-left">
          Chat with my AI persona
        </span>
      </button>
    </div>
  );
};
