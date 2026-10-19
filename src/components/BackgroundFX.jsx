import { useEffect, useRef } from "react";
import { useTheme } from "../hooks/useTheme";

function prefersReducedMotion() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function Starfield() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    const reduced = prefersReducedMotion();
    let stars = [];
    let raf;
    let visible = true;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;

      const area = canvas.width * canvas.height;
      const count = Math.max(60, Math.min(220, Math.floor(area / 18000)));
      stars = Array.from({ length: count }, () => makeStar(canvas));
    }

    function makeStar(c) {
      const z = Math.random() * 1.4 + 0.4;
      return {
        x: Math.random() * c.width,
        y: Math.random() * c.height,
        z,
        radius: z * 0.9,
        phase: Math.random() * Math.PI * 2,
        speed: 0.05 + Math.random() * 0.12,
      };
    }

    function tick(t) {
      if (!visible) {
        raf = requestAnimationFrame(tick);
        return;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((s) => {
        if (!reduced) {
          s.y += s.speed * s.z * dpr;
          if (s.y > canvas.height + 4) {
            s.y = -4;
            s.x = Math.random() * canvas.width;
          }
        }
        const flicker = reduced
          ? 0.7
          : 0.45 + 0.55 * Math.abs(Math.sin(s.phase + t * 0.0015));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius * dpr, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220, 232, 255, ${flicker * 0.65})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(tick);
    }

    function onVisibility() {
      visible = !document.hidden;
    }

    resize();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
    />
  );
}

function Aurora({ dark }) {
  const blobs = dark
    ? [
        { cls: "bg-blue-600/10", size: "55vw", top: "-20%", left: "-15%", delay: "0s" },
        { cls: "bg-cyan-500/8", size: "45vw", top: "30%", left: "65%", delay: "-6s" },
        { cls: "bg-emerald-500/12", size: "50vw", top: "65%", left: "10%", delay: "-12s" },
      ]
    : [
        { cls: "bg-blue-400/25", size: "55vw", top: "-20%", left: "-15%", delay: "0s" },
        { cls: "bg-cyan-300/30", size: "45vw", top: "30%", left: "65%", delay: "-6s" },
        { cls: "bg-violet-300/20", size: "50vw", top: "65%", left: "10%", delay: "-12s" },
      ];
  return (
    <div className="absolute inset-0 overflow-hidden">
      {blobs.map((b, i) => (
        <div
          key={i}
          className={`absolute rounded-full ${b.cls} animate-blob`}
          style={{
            width: b.size,
            height: b.size,
            top: b.top,
            left: b.left,
            filter: "blur(110px)",
            animationDelay: b.delay,
          }}
        />
      ))}
    </div>
  );
}

function Grid({ dark }) {
  const stroke = dark
    ? "rgba(148, 163, 184, 0.07)"
    : "rgba(15, 23, 42, 0.06)";
  return (
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `linear-gradient(${stroke} 1px, transparent 1px), linear-gradient(90deg, ${stroke} 1px, transparent 1px)`,
        backgroundSize: "56px 56px",
        maskImage:
          "radial-gradient(ellipse at center, black 30%, transparent 80%)",
        WebkitMaskImage:
          "radial-gradient(ellipse at center, black 30%, transparent 80%)",
      }}
    />
  );
}

function MatrixRain() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    const reduced = prefersReducedMotion();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const FONT_SIZE = 14;
    const TRAIL = 14;
    const SPEED = 0.5;
    // Mix of katakana, hex digits, and dev glyphs.
    const CHARS =
      "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF{}();=<>[]/+-_";
    let cols = 0;
    let drops = [];
    let raf;
    let visible = true;
    let frame = 0;

    function resize() {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      cols = Math.floor(canvas.width / (FONT_SIZE * dpr));
      drops = Array.from({ length: cols }, (_, i) => ({
        head: Math.random() * -40,
        speed: SPEED * (0.6 + Math.random() * 0.9),
        seed: i * 7 + Math.floor(Math.random() * 1000),
      }));
    }

    function tick() {
      if (!visible) {
        raf = requestAnimationFrame(tick);
        return;
      }
      frame += 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${FONT_SIZE * dpr}px "JetBrains Mono", monospace`;
      ctx.textBaseline = "top";

      for (let i = 0; i < cols; i += 1) {
        const drop = drops[i];
        if (!drop) continue;
        const x = i * FONT_SIZE * dpr;
        for (let k = 0; k < TRAIL; k++) {
          const y = (drop.head - k) * FONT_SIZE * dpr;
          if (y < -FONT_SIZE * dpr || y > canvas.height) continue;
          const charIdx =
            (drop.seed + Math.floor(drop.head) - k + (frame >> 2)) %
            CHARS.length;
          const ch = CHARS.charAt(
            charIdx < 0 ? charIdx + CHARS.length : charIdx
          );
          if (k === 0) {
            ctx.fillStyle = "rgba(210, 255, 220, 1)";
          } else if (k === 1) {
            ctx.fillStyle = "rgba(120, 240, 150, 0.85)";
          } else {
            const alpha = (1 - k / TRAIL) * 0.7;
            ctx.fillStyle = `rgba(57, 211, 83, ${alpha})`;
          }
          ctx.fillText(ch, x, y);
        }
        if (!reduced) drop.head += drop.speed;
        if (drop.head * FONT_SIZE * dpr > canvas.height + TRAIL * FONT_SIZE * dpr) {
          drop.head = -Math.random() * 30;
          drop.speed = SPEED * (0.6 + Math.random() * 0.9);
        }
      }
      raf = requestAnimationFrame(tick);
    }

    function onVisibility() {
      visible = !document.hidden;
    }

    resize();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-[0.18]"
      style={{
        maskImage:
          "linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)",
      }}
      aria-hidden="true"
    />
  );
}

function Scanlines() {
  return (
    <div
      className="absolute inset-0 mix-blend-overlay opacity-20"
      style={{
        backgroundImage:
          "repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0 1px, transparent 1px 3px)",
      }}
    />
  );
}

export const BackgroundFX = () => {
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme === "dark";

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
    >
      <div
        className="absolute inset-0"
        style={{
          background: dark
            ? "radial-gradient(ellipse at top, #0b1224 0%, #050608 60%, #000 100%)"
            : "radial-gradient(ellipse at top, #f0f6ff 0%, #f8fafc 60%, #ffffff 100%)",
        }}
      />
      <Aurora dark={dark} />
      <Grid dark={dark} />
      {dark && <Starfield />}
      {dark && <MatrixRain />}
      {dark && <Scanlines />}
    </div>
  );
};
