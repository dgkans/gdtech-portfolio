import { useEffect, useRef, useState } from "react";
import { siteConfig } from "../data/config";

export const HireMePill = () => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hidden, setHidden] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    const contact = document.getElementById("contact");
    if (!contact) return undefined;
    const obs = new IntersectionObserver(
      ([entry]) => setHidden(entry.isIntersecting),
      { rootMargin: "0px 0px -20% 0px", threshold: 0.05 }
    );
    obs.observe(contact);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("mousedown", onClick);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onClick);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const copyEmail = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(siteConfig.email);
      } else {
        const ta = document.createElement("textarea");
        ta.value = siteConfig.email;
        ta.setAttribute("readonly", "");
        ta.style.position = "absolute";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch (err) {
      console.error("Clipboard copy failed:", err);
    }
  };

  const goContact = () => {
    setOpen(false);
    const el = document.getElementById("contact");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    else window.location.hash = "#contact";
  };

  return (
    <div
      ref={wrapRef}
      className={`fixed z-40 right-4 sm:right-6 transition-all duration-300 ${
        hidden
          ? "opacity-0 translate-y-3 pointer-events-none"
          : "opacity-100 translate-y-0"
      }`}
      style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 1.25rem)" }}
    >
      {open && (
        <div
          role="dialog"
          aria-label="Hire me actions"
          className="mb-3 w-[18rem] rounded-2xl border border-black/10 dark:border-white/10
                     bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md shadow-2xl
                     p-4 text-left"
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {siteConfig.availability?.status || "Open to roles across the USA"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {siteConfig.availability?.detail ||
                  "Full-time Software / ML Engineer · onsite, hybrid, or remote"}
              </p>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-2">
            <button
              type="button"
              onClick={goContact}
              className="w-full text-sm font-medium px-3 py-2 rounded-lg
                         bg-blue-500 text-white hover:bg-blue-600 transition
                         shadow-sm shadow-blue-500/20"
            >
              Open contact form ↓
            </button>
            <button
              type="button"
              onClick={copyEmail}
              title={`Copy ${siteConfig.email}`}
              className="w-full text-sm font-medium px-3 py-2 rounded-lg
                         border border-black/10 dark:border-white/15
                         text-gray-800 dark:text-gray-100
                         hover:bg-black/5 dark:hover:bg-white/5 transition
                         flex items-center justify-center gap-2"
            >
              <span aria-hidden="true">✉</span>
              {copied ? "✓ Email copied" : "Copy email address"}
            </button>
          </div>

          <p className="mt-3 text-[10px] text-gray-400 dark:text-gray-500 text-center">
            Press <kbd className="font-mono">Esc</kbd> to close
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Hire me — open quick contact"
        className={`group flex items-center gap-2 pl-3 pr-4 py-2.5 rounded-full
                    bg-blue-500 text-white shadow-lg shadow-blue-500/30
                    hover:bg-blue-600 hover:shadow-blue-500/40
                    transition-all cursor-pointer
                    border border-blue-400/40
                    ${open ? "ring-2 ring-blue-400/50" : ""}`}
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inset-0 rounded-full bg-emerald-400 opacity-75 animate-ping" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-300" />
        </span>
        <span className="text-sm font-semibold">Hire me</span>
        <span className="hidden sm:inline text-xs text-blue-100/90 font-mono">
          · {siteConfig.availability?.short || "open across the USA"}
        </span>
      </button>
    </div>
  );
};
