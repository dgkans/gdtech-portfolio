import { siteConfig } from "./config";
import {
  resume,
  heroSummary,
  skillGroups,
} from "./resume";
import { caseStudies } from "./caseStudies";

/**
 * Knowledge base for the "Chat with my AI persona" widget.
 * Chunks are intentionally short, self-contained, and tagged with `section`
 * + `link` so the UI can deep-link the user to the relevant page section.
 */
function build() {
  const chunks = [];
  const push = (chunk) => chunks.push({ id: `c${chunks.length + 1}`, ...chunk });

  push({
    section: "About",
    title: "Summary",
    text: heroSummary,
    link: "#home",
  });

  push({
    section: "About",
    title: "Resume summary",
    text: resume.summary,
    link: "#home",
  });

  push({
    section: "Availability",
    title: "Currently available",
    text: `${siteConfig.availability?.status || "Open to roles across the USA"}. ${siteConfig.availability?.detail || "Full-time Software / ML Engineer; onsite, hybrid, or remote"}. Currently based in ${siteConfig.location} but open to relocate or work remote. Looking for full-time Software Engineer or ML Engineer positions.`,
    link: "#contact",
  });

  const pf = siteConfig.profileFacts;
  if (pf) {
    const bits = [];
    if (pf.earliestStartDateHuman) {
      bits.push(
        `Earliest full-time start: ${pf.earliestStartDateHuman}. Keywords: start date, joining date, availability.`
      );
    }
    if (pf.visaOneLiner) {
      bits.push(
        `${pf.visaOneLiner} Keywords: visa, F-1, F1, OPT, CPT, STEM OPT, work authorization, sponsorship, H-1B.`
      );
    }
    if (pf.workAuthExtra) bits.push(pf.workAuthExtra);
    if (bits.length) {
      push({
        section: "Availability",
        title: "Start date & work authorization",
        text: bits.join(" "),
        link: "#contact",
      });
    }
  }

  push({
    section: "Contact",
    title: "How to get in touch",
    text: `Email: ${siteConfig.email}. LinkedIn: ${siteConfig.linkedin}. GitHub: github.com/${siteConfig.github}. The contact form on this site goes straight to my inbox.`,
    link: "#contact",
  });

  resume.experience.forEach((exp) => {
    const period = `${exp.start || ""} – ${exp.end || ""}`.trim();
    const head = `${exp.role} at ${exp.company} (${period}).`;
    push({
      section: "Experience",
      title: `${exp.role} · ${exp.company}`,
      text: `${head} ${exp.bullets.join(" ")}`,
      link: "#home",
    });
    exp.bullets.forEach((b, i) => {
      push({
        section: "Experience",
        title: `${exp.company} highlight ${i + 1}`,
        text: `${exp.company} (${exp.role}, ${period}): ${b}`,
        link: "#home",
      });
    });
  });

  resume.education.forEach((ed) => {
    const period = [ed.start, ed.end].filter(Boolean).join(" – ");
    push({
      section: "Education",
      title: ed.school,
      text: `${ed.degree} from ${ed.school}${period ? ` (${period})` : ""}.${ed.detail ? ` ${ed.detail}` : ""}`,
      link: "#home",
    });
  });

  if (resume.certifications?.length) {
    push({
      section: "Education",
      title: "Certifications",
      text: `Certifications: ${resume.certifications.join(", ")}.`,
      link: "#home",
    });
  }

  skillGroups.forEach((g) => {
    push({
      section: "Skills",
      title: g.title,
      text: `${g.title}: ${g.items.join(", ")}.`,
      link: "#skills",
    });
  });

  Object.entries(caseStudies).forEach(([repoKey, study]) => {
    const meta = siteConfig.repoMeta?.[repoKey];
    const display = meta?.displayName || repoKey;
    const url = `https://github.com/${siteConfig.github}/${repoKey}`;
    const stack = study.tech.join(", ");
    const liveBit = meta?.live ? ` Live demo: ${meta.live}` : "";

    push({
      section: "Project",
      project: display,
      title: `${display} — overview`,
      text: `${display}: ${meta?.tagline || ""} Tech: ${stack}. Repo: ${url}.${liveBit}`,
      link: "#projects",
    });
    push({
      section: "Project",
      project: display,
      title: `${display} — problem`,
      text: `${display} (problem): ${study.problem}`,
      link: "#projects",
    });
    push({
      section: "Project",
      project: display,
      title: `${display} — architecture`,
      text: `${display} (architecture): ${study.architecture.join(" ")}`,
      link: "#projects",
    });
    push({
      section: "Project",
      project: display,
      title: `${display} — my role`,
      text: `${display} (my role): ${study.role}`,
      link: "#projects",
    });
    push({
      section: "Project",
      project: display,
      title: `${display} — outcome`,
      text: `${display} (outcome): ${study.outcome}`,
      link: "#projects",
    });
  });

  if (resume.now?.items?.length) {
    push({
      section: "Now",
      title: "What I'm working on",
      text: `Current focus (${resume.now.updated}): ${resume.now.items.join(" ")}`,
      link: "#home",
    });
  }

  return chunks;
}

export const chatCorpus = build();

/** Suggested seed questions surfaced to first-time chat users. */
export const seedQuestions = [
  "What did you work on at MOFSL?",
  "Tell me about your AI Real Estate project",
  "What's your ML and AI stack?",
  "List all your projects",
  "Are you available for full-time roles?",
  "How can I reach you?",
];
