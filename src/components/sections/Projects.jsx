import { lazy, Suspense, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Tilt from "react-parallax-tilt";
import { RevealOnScroll } from "../RevealOnScroll";
import { siteConfig } from "../../data/config";
import { caseStudies } from "../../data/caseStudies";
import { useUserRepos } from "../../hooks/useGitHub";
import { colorForLanguage } from "../../lib/github";

const MermaidDiagram = lazy(() =>
  import("../MermaidDiagram").then((m) => ({ default: m.MermaidDiagram }))
);

function formatRelative(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const sec = Math.floor(diff / 1000);
  const min = Math.floor(sec / 60);
  const hour = Math.floor(min / 60);
  const day = Math.floor(hour / 24);
  const month = Math.floor(day / 30);
  const year = Math.floor(day / 365);
  if (year >= 1) return `${year}y ago`;
  if (month >= 1) return `${month}mo ago`;
  if (day >= 1) return `${day}d ago`;
  if (hour >= 1) return `${hour}h ago`;
  if (min >= 1) return `${min}m ago`;
  return "just now";
}

function Section({ title, children }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.22em] text-blue-600 dark:text-blue-400 font-semibold mb-1.5">
        {title}
      </div>
      <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
        {children}
      </div>
    </div>
  );
}

function CaseStudyBody({
  displayTitle,
  study,
  diagramSize,
  diagramWrapClass = "",
  diagramFooter,
}) {
  return (
    <div className="space-y-5">
      <Section title="Problem">{study.problem}</Section>

      <Section title="Architecture">
        <ul className="list-disc list-outside pl-5 space-y-1">
          {study.architecture.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <div
          className={`mt-4 rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-zinc-950/70 px-3 py-3 sm:px-5 sm:py-4 ${diagramWrapClass}`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
            <div className="text-[10px] uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
              System diagram
            </div>
            {diagramFooter}
          </div>
          <Suspense
            fallback={
              <div
                className={`rounded-md border border-dashed border-black/10 dark:border-white/10 animate-pulse ${
                  diagramSize === "xl"
                    ? "min-h-[min(60vh,480px)]"
                    : diagramSize === "lg"
                      ? "min-h-80 md:min-h-96"
                      : "min-h-52"
                }`}
              />
            }
          >
            <MermaidDiagram
              chart={study.mermaid}
              size={diagramSize}
              ariaLabel={`${displayTitle} architecture diagram`}
            />
          </Suspense>
        </div>
      </Section>

      <Section title="My role">{study.role}</Section>

      <Section title="Tech">
        <div className="flex flex-wrap gap-2">
          {study.tech.map((t) => (
            <span
              key={t}
              className="bg-blue-500/10 text-blue-600 dark:text-blue-400 py-1 px-3 rounded-full text-xs"
            >
              {t}
            </span>
          ))}
        </div>
      </Section>

      <Section title="Outcome">{study.outcome}</Section>
    </div>
  );
}

function CaseStudyModal({ projectKey, displayTitle, onClose }) {
  const study = projectKey ? caseStudies[projectKey] : null;

  useEffect(() => {
    if (!study) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [study, onClose]);

  if (!study) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-study-modal-title"
    >
      <button
        type="button"
        aria-label="Close fullscreen case study"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-default"
        onClick={onClose}
      />
      <div
        className="relative z-[201] w-full max-w-5xl max-h-[100dvh] sm:max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl border border-black/10 dark:border-white/10 bg-white/95 dark:bg-zinc-950/95 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-[202] flex items-center justify-between gap-3 px-4 py-3 border-b border-black/10 dark:border-white/10 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md">
          <h2
            id="case-study-modal-title"
            className="text-lg font-bold text-gray-900 dark:text-white truncate pr-2"
          >
            {displayTitle}
            <span className="block text-[10px] font-normal uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 mt-0.5">
              Case study · fullscreen
            </span>
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium border border-black/10 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/5 transition"
          >
            Close
          </button>
        </div>
        <div className="p-4 sm:p-8">
          <CaseStudyBody
            displayTitle={displayTitle}
            study={study}
            diagramSize="xl"
            diagramWrapClass="border-blue-500/20"
          />
        </div>
      </div>
    </div>,
    document.body
  );
}

function ProjectCard({
  name,
  repo,
  meta,
  expanded,
  onToggleExpand,
  onOpenModal,
}) {
  const description = meta?.tagline || repo?.description || "";
  const stack = meta?.stack || (repo?.language ? [repo.language] : []);
  const tags = meta?.tags || [];
  const study = caseStudies[name];
  const liveUrl = meta?.live || repo?.homepage || null;
  const cardId = `project-${name.toLowerCase()}`;

  const cardInner = (
    <div className="h-full p-6 rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] hover:border-blue-500/40 hover:shadow-[0_8px_30px_rgba(59,130,246,0.15)] transition-all flex flex-col relative">
      {liveUrl && (
        <a
          href={liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-4 -mt-1 w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-500 shadow-[0_4px_14px_rgba(37,99,235,0.45)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.55)] hover:brightness-[1.05] active:scale-[0.99] transition-all ring-1 ring-white/20"
        >
          <span className="tracking-wide">Open live demo</span>
          <span aria-hidden="true" className="text-base leading-none">
            ↗
          </span>
        </a>
      )}

      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="text-xl font-bold">
          {meta?.displayName || repo?.name}
        </h3>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 justify-end">
            {tags.map((t) => (
              <span
                key={t}
                className="text-[10px] uppercase tracking-wider bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 flex-1">
        {description}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {stack.map((tech) => (
          <span
            key={tech}
            className="bg-blue-500/10 text-blue-600 dark:text-blue-400 py-1 px-3 rounded-full text-xs hover:bg-blue-500/20 transition-all"
          >
            {tech}
          </span>
        ))}
      </div>

      {repo && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500 dark:text-gray-400 mb-4 border-t border-black/5 dark:border-white/5 pt-3">
          {repo.language && (
            <span className="flex items-center gap-1.5">
              <span
                className="inline-block w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: colorForLanguage(repo.language) }}
              />
              {repo.language}
            </span>
          )}
          <span title="Stars">★ {repo.stargazers_count ?? 0}</span>
          <span title="Forks">⑂ {repo.forks_count ?? 0}</span>
          <span title="Last updated">
            ↻ {formatRelative(repo.pushed_at || repo.updated_at)}
          </span>
        </div>
      )}

      <div className="flex flex-wrap justify-between items-center mt-auto gap-3">
        {study ? (
          <button
            type="button"
            onClick={onToggleExpand}
            aria-expanded={expanded}
            aria-controls={`${cardId}-case-study`}
            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 transition-colors flex items-center gap-1.5"
          >
            {expanded ? "Hide case study" : "Read case study"}
            <span
              aria-hidden="true"
              className={`inline-block transition-transform ${
                expanded ? "rotate-180" : ""
              }`}
            >
              ▾
            </span>
          </button>
        ) : (
          <span />
        )}

        <div className="flex items-center gap-3">
          <a
            href={repo?.html_url || `https://github.com/${siteConfig.github}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
          >
            GitHub →
          </a>
        </div>
      </div>

      {study && expanded && (
        <div id={`${cardId}-case-study`} className="mt-5">
          <div className="-mx-2 px-3 py-4 sm:px-5 sm:py-5 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/5 dark:border-white/5">
            <CaseStudyBody
              displayTitle={meta?.displayName || name}
              study={study}
              diagramSize="lg"
              diagramWrapClass="shadow-inner shadow-blue-500/5"
              diagramFooter={
                <button
                  type="button"
                  onClick={() => onOpenModal(name)}
                  className="shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition shadow-sm"
                >
                  Fullscreen
                </button>
              }
            />
          </div>
        </div>
      )}
    </div>
  );

  if (expanded) {
    return cardInner;
  }

  return (
    <Tilt
      glareEnable
      glareMaxOpacity={0.12}
      glareColor="#3b82f6"
      glarePosition="all"
      tiltMaxAngleX={6}
      tiltMaxAngleY={6}
      transitionSpeed={1500}
      className="h-full"
    >
      {cardInner}
    </Tilt>
  );
}

function ProjectCardSkeleton() {
  const bar = "bg-black/10 dark:bg-white/10";
  return (
    <div className="h-full p-6 rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] animate-pulse">
      <div className={`h-5 w-2/3 ${bar} rounded mb-3`} />
      <div className={`h-3 w-full ${bar} rounded mb-2`} />
      <div className={`h-3 w-5/6 ${bar} rounded mb-2`} />
      <div className={`h-3 w-4/6 ${bar} rounded mb-6`} />
      <div className="flex gap-2 mb-4">
        <div className={`h-5 w-14 ${bar} rounded-full`} />
        <div className={`h-5 w-14 ${bar} rounded-full`} />
        <div className={`h-5 w-14 ${bar} rounded-full`} />
      </div>
      <div className={`h-3 w-1/2 ${bar} rounded`} />
    </div>
  );
}

export const Projects = () => {
  const { data: repos, loading, error } = useUserRepos(siteConfig.github);
  const [expandedKey, setExpandedKey] = useState(null);
  const [modalKey, setModalKey] = useState(null);

  const repoByName = new Map();
  (repos || []).forEach((r) => repoByName.set(r.name.toLowerCase(), r));

  const cards = siteConfig.featuredRepos.map((name) => {
    const repo = repoByName.get(name.toLowerCase()) || null;
    const meta = siteConfig.repoMeta[name];
    return { name, repo, meta };
  });

  const modalMeta = modalKey
    ? cards.find((c) => c.name === modalKey)?.meta
    : null;
  const modalTitle =
    modalMeta?.displayName || modalKey || "";

  return (
    <section
      id="projects"
      className="py-12 md:py-16 flex justify-center overflow-visible"
    >
      <RevealOnScroll>
        <div className="max-w-5xl mx-auto px-4 w-full overflow-visible">
          <div className="flex flex-col items-center mb-2">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent text-center">
              Featured Projects
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 text-center max-w-xl">
              Live stats and metadata pulled directly from{" "}
              <a
                href={`https://github.com/${siteConfig.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-500"
              >
                @{siteConfig.github}
              </a>
              . Open a case study for the full problem · architecture · role ·
              outcome write-up.
            </p>
          </div>

          {error && (
            <p className="text-center text-amber-400 text-sm mb-6">
              Couldn't reach the GitHub API ({error.message}). Showing curated
              metadata only.
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 items-start overflow-visible">
            {loading && !repos
              ? Array.from({ length: siteConfig.featuredRepos.length }).map(
                  (_, i) => <ProjectCardSkeleton key={i} />
                )
              : cards.map(({ name, repo, meta }) => (
                  <ProjectCard
                    key={name}
                    name={name}
                    repo={repo}
                    meta={meta}
                    expanded={expandedKey === name}
                    onToggleExpand={() =>
                      setExpandedKey((k) => (k === name ? null : name))
                    }
                    onOpenModal={setModalKey}
                  />
                ))}
          </div>

          <div className="text-center mt-8">
            <a
              href={`https://github.com/${siteConfig.github}?tab=repositories`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 border border-blue-500/30 px-4 py-2 rounded-full hover:bg-blue-500/10 transition"
            >
              See all repositories →
            </a>
          </div>
        </div>
      </RevealOnScroll>

      {modalKey && (
        <CaseStudyModal
          projectKey={modalKey}
          displayTitle={modalTitle}
          onClose={() => setModalKey(null)}
        />
      )}
    </section>
  );
};
