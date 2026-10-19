import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useTheme } from "../hooks/useTheme";

let mermaidPromise;

/** Lazy-load mermaid only when a diagram first appears. */
function loadMermaid() {
  if (!mermaidPromise) {
    mermaidPromise = import("mermaid").then((m) => m.default || m);
  }
  return mermaidPromise;
}

/** Prepended to each chart so font/spacing scale without fighting global init. */
const SIZE_INIT = {
  sm: "%%{init: {'themeVariables': {'fontSize':'12px'},'flowchart':{'nodeSpacing':32,'rankSpacing':28,'curve':'basis'}}}%%\n",
  md: "%%{init: {'themeVariables': {'fontSize':'15px'},'flowchart':{'nodeSpacing':44,'rankSpacing':38,'curve':'basis'}}}%%\n",
  lg: "%%{init: {'themeVariables': {'fontSize':'18px'},'flowchart':{'nodeSpacing':56,'rankSpacing':48,'curve':'basis'}}}%%\n",
  xl: "%%{init: {'themeVariables': {'fontSize':'22px'},'flowchart':{'nodeSpacing':72,'rankSpacing':58,'curve':'basis'}}}%%\n",
};

/**
 * Theme-aware Mermaid renderer.
 * @param {"sm"|"md"|"lg"|"xl"} [size="md"] — controls embedded init directive (font + spacing).
 */
export const MermaidDiagram = ({
  chart,
  ariaLabel,
  className = "",
  size = "md",
}) => {
  const { resolvedTheme } = useTheme();
  const reactId = useId();
  const renderId = `mmd-${reactId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const [svg, setSvg] = useState("");
  const [error, setError] = useState(null);
  const mounted = useRef(true);

  const sizedChart = useMemo(() => {
    const prefix = SIZE_INIT[size] || SIZE_INIT.md;
    return prefix + chart;
  }, [chart, size]);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setError(null);

    loadMermaid()
      .then((mermaid) => {
        if (cancelled) return undefined;
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          theme: resolvedTheme === "dark" ? "dark" : "default",
          themeVariables:
            resolvedTheme === "dark"
              ? {
                  background: "transparent",
                  primaryColor: "#0b1220",
                  primaryTextColor: "#e5e7eb",
                  primaryBorderColor: "#3b82f6",
                  lineColor: "#64748b",
                  secondaryColor: "#0ea5e9",
                  tertiaryColor: "#1e293b",
                }
              : {
                  background: "transparent",
                  primaryColor: "#ffffff",
                  primaryTextColor: "#0f172a",
                  primaryBorderColor: "#3b82f6",
                  lineColor: "#475569",
                  secondaryColor: "#0ea5e9",
                  tertiaryColor: "#f1f5f9",
                },
        });
        return mermaid.render(renderId, sizedChart);
      })
      .then((res) => {
        if (cancelled || !res || !mounted.current) return;
        setSvg(res.svg);
      })
      .catch((err) => {
        if (cancelled || !mounted.current) return;
        console.error("Mermaid render failed:", err);
        setError(err?.message || "Diagram failed to render");
      });

    return () => {
      cancelled = true;
    };
  }, [sizedChart, resolvedTheme, renderId]);

  const skeletonH =
    size === "xl"
      ? "min-h-[min(70vh,520px)]"
      : size === "lg"
        ? "min-h-80 md:min-h-96"
        : size === "sm"
          ? "min-h-36"
          : "min-h-52";

  if (error) {
    return (
      <div className="text-xs text-amber-600 dark:text-amber-400">
        Couldn't render diagram ({error}).
      </div>
    );
  }

  if (!svg) {
    return (
      <div
        className={`rounded-lg border border-dashed border-black/10 dark:border-white/10 animate-pulse ${skeletonH} ${className}`}
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      className={`overflow-x-auto overflow-y-visible [&_svg]:max-w-none [&_svg]:h-auto ${className}`}
      role="img"
      aria-label={ariaLabel || "Architecture diagram"}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};
