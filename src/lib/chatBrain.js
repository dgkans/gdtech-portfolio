/**
 * Conversational answer engine for the AI persona.
 *
 * Combines:
 *   • intent detection (cheap regex/keyword based)
 *   • per-intent synthesizers that stitch multiple corpus chunks into a
 *     proper paragraph answer
 *   • TF-IDF retrieval fallback for everything else
 *   • short conversational memory ("tell me more", "what about that")
 *
 * Designed to feel substantive without depending on any external LLM.
 */

import { siteConfig } from "../data/config";
import { isPersonaLLMConfigured } from "./personaLLM";
import { resume, skillGroups } from "../data/resume";
import { caseStudies } from "../data/caseStudies";

const PROJECT_ALIASES = {
  TradeGuard: [
    "tradeguard",
    "trade guard",
    "trading agent",
    "ai trading",
    "mcp",
    "model context protocol",
    "langgraph",
    "guardrail",
    "prompt injection",
    "agent safety",
  ],
  AI_Realestate: [
    "ai_realestate",
    "ai real estate",
    "real estate",
    "real-estate",
    "realestate",
    "housing",
    "property",
    "fastapi ml",
    "random forest",
    "knn",
  ],
  BlogSpace: [
    "blogspace",
    "blog",
    "blogging",
    "cms",
    "react quill",
    "cloudinary",
  ],
  AetherVaultBlockchain: [
    "aethervault",
    "aether",
    "nft",
    "auction",
    "blockchain",
    "ethereum",
    "solidity",
    "ipfs",
    "marketplace",
  ],
  EAdoptionPortal: [
    "e-adoption",
    "e adoption",
    "adoption",
    "orphanage",
    "spring boot",
    "role-based",
  ],
};

const COMPANY_ALIASES = {
  MOFSL: ["mofsl", "motilal", "trading", "broking", "kafka", "solace", "market data"],
  "CHCS Services Inc.": ["chcs", "process associate"],
  "Jaldoot Enterprises Ltd.": [
    "jaldoot",
    "winforms",
    "wpf",
    "small business",
    "operations",
  ],
};

const SKILL_GROUP_KEYWORDS = {
  "ML, AI & analytics": [
    "ml",
    "ai",
    "machine learning",
    "deep learning",
    "model",
    "models",
    "data science",
    "rag",
    "llm",
    "llms",
    "scikit",
    "tensorflow",
    "pytorch",
    "pandas",
    "numpy",
    "embeddings",
  ],
  "Backend & application frameworks": [
    "backend",
    "api",
    "apis",
    "framework",
    "spring",
    "node",
    "express",
    "nest",
    ".net",
    "asp.net",
    "fastapi",
    "microservice",
    "microservices",
  ],
  "Frontend & UI": [
    "frontend",
    "front-end",
    "ui",
    "react",
    "next",
    "tailwind",
    "ux",
    "vite",
    "winforms",
    "wpf",
  ],
  "Streaming & messaging": [
    "kafka",
    "solace",
    "streaming",
    "events",
    "queue",
    "queues",
    "messaging",
    "pub/sub",
  ],
  "Data stores & search": [
    "database",
    "db",
    "sql",
    "postgres",
    "mysql",
    "mongo",
    "mongodb",
    "redis",
    "elasticsearch",
    "search",
  ],
  "Cloud, DevOps & observability": [
    "cloud",
    "aws",
    "azure",
    "gcp",
    "google cloud",
    "devops",
    "docker",
    "kubernetes",
    "k8s",
    "ci/cd",
    "jenkins",
    "ansible",
    "prometheus",
    "linux",
    "observability",
    "monitoring",
  ],
  "Languages & scripting": [
    "language",
    "languages",
    "python",
    "java",
    "go",
    "golang",
    "javascript",
    "typescript",
    "c#",
    "c++",
    "c/c++",
    "shell",
    "bash",
    "graphql",
    "solidity",
  ],
  "Web3 & distributed apps": [
    "blockchain",
    "web3",
    "solidity",
    "ethers",
    "ipfs",
    "erc-721",
    "smart contract",
    "smart contracts",
  ],
};

function lower(s) {
  return String(s || "").toLowerCase();
}

function matchAny(haystack, needles) {
  return needles.some((n) => haystack.includes(n));
}

function detectProjects(qLower) {
  const found = [];
  Object.entries(PROJECT_ALIASES).forEach(([key, aliases]) => {
    if (matchAny(qLower, aliases)) found.push(key);
  });
  return found;
}

function detectCompanies(qLower) {
  const found = [];
  Object.entries(COMPANY_ALIASES).forEach(([name, aliases]) => {
    if (matchAny(qLower, aliases)) found.push(name);
  });
  return found;
}

function detectSkillGroups(qLower) {
  const found = [];
  Object.entries(SKILL_GROUP_KEYWORDS).forEach(([title, kws]) => {
    if (matchAny(qLower, kws)) found.push(title);
  });
  return found;
}

const INTENTS = [
  {
    name: "greeting",
    test: (q) =>
      /^(hi|hello|hey|yo|hiya|sup|howdy|namaste|hola)\b/.test(q) ||
      /^good (morning|afternoon|evening)\b/.test(q),
  },
  {
    name: "thanks",
    test: (q) => /\b(thanks|thank you|thx|appreciate)\b/.test(q),
  },
  {
    name: "bye",
    test: (q) => /\b(bye|goodbye|see ya|see you|later|cheers)\b/.test(q),
  },
  {
    name: "identity",
    test: (q) =>
      /\b(who are you|what are you|are you (an? )?(ai|bot|chatbot|llm)|are you real|are you human|how (do|does) (this|you) work|how were you (built|made)|tech (stack|behind))\b/.test(
        q
      ),
  },
  {
    name: "name",
    test: (q) =>
      /\b(what.?s? (his|your) name|who is gaurav|tell me (his|your) name|introduce (yourself|him|gaurav))\b/.test(
        q
      ),
  },
  {
    name: "location",
    test: (q) =>
      /\b(where (do|does|are|is) (you|he|gaurav)( (live|based|located))?|location|city|relocate|relocation|remote|onsite|hybrid)\b/.test(
        q
      ) && !/\b(experience|projects?|skills?|stack)\b/.test(q),
  },
  {
    name: "start_date",
    test: (q) =>
      /\b(when can (you|he|gaurav) start|earliest (start|join)|start date|joining date|join(ing)? (on|by|from|date)|how soon can (you|he) start|notice period|commencement)\b/.test(
        q
      ),
  },
  {
    name: "work_authorization",
    test: (q) =>
      /\b(visa|f-?1\b|f1\b|opt|cpt|stem opt|work authori[sz]ation|sponsor(ship)?|h-?1b|green card|citizenship|eligible to work|uscis|i-?20|international student)\b/.test(
        q
      ),
  },
  {
    name: "availability",
    test: (q) =>
      /\b(available|availability|hire|hiring|hire me|open to|looking|seeking|opportunities|interview)\b/.test(
        q
      ),
  },
  {
    name: "contact",
    test: (q) =>
      /\b(contact|email|reach|get in touch|message|linkedin|twitter|phone|number)\b/.test(
        q
      ),
  },
  {
    name: "projects_list",
    test: (q) =>
      /\b(list (your|his)? ?projects?|what.?s? (your|his) projects?|show (me )?(your|his) projects?|what (have|did) you (built|build|shipped|made)|portfolio of work|side projects?|what.?s in your portfolio)\b/.test(
        q
      ) || /\bprojects?\b/.test(q),
  },
  {
    name: "experience_list",
    test: (q) =>
      /\b(work (history|experience)|career (history|timeline)|companies|jobs?|where have you (worked|been))\b/.test(
        q
      ),
  },
  {
    name: "education",
    test: (q) =>
      /\b(education|school|college|university|degree|gpa|major|study|studied|studies|coursework|grade)\b/.test(
        q
      ),
  },
  {
    name: "skills_overview",
    test: (q) =>
      /\b(skills?|tech (stack|stacks)|stack|technologies|languages|frameworks|tools|toolkit|what (do|can) you (know|use|do)|what.?s (your|his) (stack|tech))\b/.test(
        q
      ),
  },
  {
    name: "favorite_project",
    test: (q) =>
      /\b(favou?rite|best|most proud|coolest|biggest|main|flagship)\b.*\bproject\b/.test(
        q
      ),
  },
  {
    name: "tell_more",
    test: (q) =>
      /^\s*(tell me more|more|elaborate|details?|expand|go deeper|continue|and\??)\s*[.!?]?\s*$/.test(
        q
      ),
  },
  {
    name: "off_topic",
    test: (q) =>
      /\b(weather|stock price|news|joke|recipe|sports|football|basketball|movie|song|write code|build me|generate|hack|cheat|nsfw|porn)\b/.test(
        q
      ),
  },
];

function detectIntent(qLower) {
  for (const intent of INTENTS) {
    if (intent.test(qLower)) return intent.name;
  }
  return null;
}

/* -------------------------------------------------------------------------- */
/* Synthesizers                                                                */
/* -------------------------------------------------------------------------- */

function projectAnswer(repoKey) {
  const study = caseStudies[repoKey];
  const meta = siteConfig.repoMeta?.[repoKey];
  if (!study || !meta) return null;
  const url = `https://github.com/${siteConfig.github}/${repoKey}`;
  const text =
    `**${meta.displayName}** — ${meta.tagline} ` +
    `\nProblem: ${study.problem} ` +
    `\nMy role: ${study.role} ` +
    `\nOutcome: ${study.outcome} ` +
    `\nTech: ${study.tech.join(", ")}. ` +
    `\nRepo: ${url}`;
  return {
    text,
    sources: [
      {
        id: `proj-${repoKey}`,
        section: "Project",
        project: meta.displayName,
        title: `${meta.displayName} — overview`,
        link: "#projects",
      },
    ],
    follow: { kind: "project", repoKey },
  };
}

function projectsListAnswer() {
  const lines = siteConfig.featuredRepos
    .map((key) => {
      const meta = siteConfig.repoMeta?.[key];
      if (!meta) return null;
      return `• **${meta.displayName}** — ${meta.tagline}`;
    })
    .filter(Boolean);
  return {
    text:
      "Here are the four featured projects on this site:\n\n" +
      lines.join("\n") +
      "\n\nAsk me about any one (e.g. \"tell me about AetherVault\") for the full case study.",
    sources: [
      {
        id: "projects-list",
        section: "Project",
        title: "All featured projects",
        link: "#projects",
      },
    ],
    follow: { kind: "projects_list" },
  };
}

function experienceAnswer(companyName) {
  const exp = resume.experience.find((e) => e.company === companyName);
  if (!exp) return null;
  const period = `${exp.start} – ${exp.end}`;
  return {
    text:
      `**${exp.role} · ${exp.company}** (${period})\n\n` +
      exp.bullets.map((b) => `• ${b}`).join("\n"),
    sources: [
      {
        id: `exp-${companyName}`,
        section: "Experience",
        title: `${exp.role} · ${exp.company}`,
        link: "#home",
      },
    ],
    follow: { kind: "experience", company: companyName },
  };
}

function experienceListAnswer() {
  const lines = resume.experience.map((e) => {
    const head = `**${e.role} · ${e.company}** (${e.start} – ${e.end})`;
    const oneLiner = e.bullets[0];
    return `${head}\n  ${oneLiner}`;
  });
  return {
    text:
      "Career timeline (most recent first):\n\n" +
      lines.join("\n\n") +
      "\n\nAsk about any role for the full bullet list.",
    sources: [
      {
        id: "exp-list",
        section: "Experience",
        title: "Career timeline",
        link: "#home",
      },
    ],
    follow: { kind: "experience_list" },
  };
}

function skillGroupAnswer(title) {
  const g = skillGroups.find((s) => s.title === title);
  if (!g) return null;
  return {
    text: `**${g.title}**: ${g.items.join(", ")}.`,
    sources: [
      {
        id: `skill-${title}`,
        section: "Skills",
        title: g.title,
        link: "#skills",
      },
    ],
    follow: { kind: "skill_group", title },
  };
}

function skillsOverviewAnswer() {
  const lines = skillGroups.map(
    (g) => `• **${g.title}** — ${g.items.slice(0, 6).join(", ")}${g.items.length > 6 ? "…" : ""}`
  );
  return {
    text:
      "Day-to-day stack across services, data, ML, and infra:\n\n" +
      lines.join("\n") +
      "\n\nAsk about a specific area (e.g. \"what databases do you use?\") for the full list.",
    sources: [
      {
        id: "skills-all",
        section: "Skills",
        title: "Skills & toolbox",
        link: "#skills",
      },
    ],
    follow: { kind: "skills_overview" },
  };
}

function educationAnswer() {
  const lines = resume.education.map((ed) => {
    const period = [ed.start, ed.end].filter(Boolean).join(" – ");
    return `• **${ed.degree}** — ${ed.school}${period ? ` (${period})` : ""}${ed.detail ? `. ${ed.detail}` : ""}`;
  });
  const certs =
    resume.certifications?.length > 0
      ? `\n\nCertifications: ${resume.certifications.join(", ")}.`
      : "";
  return {
    text: "Education:\n\n" + lines.join("\n") + certs,
    sources: [
      {
        id: "edu",
        section: "Education",
        title: "Education",
        link: "#home",
      },
    ],
    follow: { kind: "education" },
  };
}

function availabilityAnswer() {
  const a = siteConfig.availability || {};
  const pf = siteConfig.profileFacts;
  const timing =
    pf?.earliestStartDateHuman && pf?.visaOneLiner
      ? ` Earliest full-time start: **${pf.earliestStartDateHuman}**. Work authorization: ${pf.visaOneLiner}`
      : "";
  return {
    text:
      `${a.status || "Open to roles across the USA"} — ${a.detail || "Full-time Software / ML Engineer; onsite, hybrid, or remote"}.${timing} ` +
      `The fastest way to reach out is the contact form on this site or email at ${siteConfig.email}.`,
    sources: [
      {
        id: "avail",
        section: "Availability",
        title: "Currently available",
        link: "#contact",
      },
    ],
    follow: { kind: "availability" },
  };
}

function startDateAnswer() {
  const pf = siteConfig.profileFacts;
  const human =
    pf?.earliestStartDateHuman ||
    "Happy to align on a specific date with the hiring team.";
  return {
    text: `Earliest full-time start: **${human}**. If you need an internship or CPT-aligned start, say so in your message and we can match academic term dates.`,
    sources: [
      {
        id: "start",
        section: "Availability",
        title: "Start date",
        link: "#contact",
      },
    ],
    follow: { kind: "start_date" },
  };
}

function workAuthAnswer() {
  const pf = siteConfig.profileFacts;
  const core =
    pf?.visaOneLiner ||
    "Work authorization can be confirmed with the hiring team.";
  const extra = pf?.workAuthExtra ? ` ${pf.workAuthExtra}` : "";
  return {
    text: `${core}${extra}`,
    sources: [
      {
        id: "workauth",
        section: "Availability",
        title: "Work authorization",
        link: "#contact",
      },
    ],
    follow: { kind: "work_authorization" },
  };
}

function contactAnswer() {
  return {
    text:
      `You can reach me a few ways:\n\n` +
      `• **Email**: ${siteConfig.email}\n` +
      `• **LinkedIn**: ${siteConfig.linkedin}\n` +
      `• **GitHub**: github.com/${siteConfig.github}\n\n` +
      `The contact form on this site goes straight to my inbox — usually a same-day reply.`,
    sources: [
      {
        id: "contact",
        section: "Contact",
        title: "How to get in touch",
        link: "#contact",
      },
    ],
    follow: { kind: "contact" },
  };
}

function locationAnswer() {
  const a = siteConfig.availability || {};
  return {
    text:
      `Currently based in ${siteConfig.location}, but ${a.status?.toLowerCase() || "open to roles across the USA"} — ${a.detail?.toLowerCase() || "onsite, hybrid, or remote"}.`,
    sources: [
      {
        id: "loc",
        section: "Availability",
        title: "Location & availability",
        link: "#contact",
      },
    ],
    follow: { kind: "location" },
  };
}

function identityAnswer() {
  const llmNote = isPersonaLLMConfigured()
    ? "Facts are always retrieved from this portfolio first; wording may be polished by a small cloud model when enabled — still only about Gaurav's background on this site."
    : "Everything runs in your browser: rules, retrieval, and drafting — no external LLM.";
  return {
    text:
      "I'm Gaurav's on-site AI persona — a retrieval-style assistant grounded in Gaurav's résumé, project write-ups, skills, and availability on this site. " +
      llmNote +
      " Ask about experience, projects, stack, education, or how to reach him.",
    sources: [],
    follow: { kind: "identity" },
  };
}

function nameAnswer() {
  return {
    text: `${resume.name} — ${siteConfig.tagline}. Currently based in ${siteConfig.location}.`,
    sources: [
      {
        id: "name",
        section: "About",
        title: "Summary",
        link: "#home",
      },
    ],
    follow: { kind: "name" },
  };
}

function favoriteProjectAnswer() {
  return {
    text:
      "Hard to pick just one, but **AI in Real Estate** is the most representative — it spans the whole stack he likes working in: a MERN web app talking to a Python FastAPI ML microservice (Random Forest + KNN) for fair-price prediction, comparable-property search, and a personalised, risk-aware investment advisor. End-to-end: data, model, API, UI, deploy.",
    sources: [
      {
        id: "fav",
        section: "Project",
        project: siteConfig.repoMeta?.AI_Realestate?.displayName,
        title: "AI in Real Estate — overview",
        link: "#projects",
      },
    ],
    follow: { kind: "project", repoKey: "AI_Realestate" },
  };
}

function offTopicAnswer(topic) {
  return {
    text:
      (topic ? `I can't help with ${topic} — ` : "") +
      "I'm here to answer questions about Gaurav's background. Try asking about his projects (TradeGuard, AI Real Estate, BlogSpace, AetherVault, E-Adoption Portal), his work at MOFSL, his ML/backend skills, education, or how to contact him.",
    sources: [],
    follow: null,
  };
}

function fallbackAnswer(hits, qLower) {
  if (!hits || hits.length === 0) {
    return offTopicAnswer(null);
  }
  const top = hits.filter((h) => h.score > 0.05);
  if (top.length === 0) {
    return offTopicAnswer(null);
  }

  // If the top 1-2 hits look strong, blend them.
  const primary = top[0];
  const secondary = top[1] && top[1].score > 0.18 ? top[1] : null;

  const lead =
    primary.score >= 0.45
      ? "Here's what lines up best:"
      : primary.score >= 0.2
        ? "Closest match from his background:"
        : "I'm not 100% sure that's covered, but the nearest detail I have is:";

  const body = secondary
    ? `${primary.text}\n\nAlso possibly relevant: ${secondary.text}`
    : primary.text;

  return {
    text: `${lead} ${body}`,
    sources: top.slice(0, 3),
    follow: null,
    confidence: primary.score,
    qLower,
  };
}

/* -------------------------------------------------------------------------- */
/* Brain                                                                       */
/* -------------------------------------------------------------------------- */

export function createBrain({ index }) {
  let lastFollow = null;

  function answer(query) {
    const q = String(query || "").trim();
    if (!q) {
      return {
        text: "Type a question to get started — try one of the quick prompts below.",
        sources: [],
        follow: null,
      };
    }
    const qLower = q.toLowerCase();

    const intent = detectIntent(qLower);

    // Conversation follow-ups: "tell me more", "details", etc.
    if (intent === "tell_more" && lastFollow) {
      const next = followUp(lastFollow);
      if (next) {
        lastFollow = next.follow ?? lastFollow;
        return next;
      }
    }

    // Hard-coded short responses
    if (intent === "greeting") {
      const r = {
        text:
          "Hey! I'm Gaurav's AI persona. Ask me anything about his work, projects, skills, or availability — or try one of the suggestions below.",
        sources: [],
        follow: null,
      };
      lastFollow = null;
      return r;
    }
    if (intent === "thanks") {
      return {
        text: "Anytime — happy to help. Anything else you'd like to know?",
        sources: [],
        follow: lastFollow,
      };
    }
    if (intent === "bye") {
      return {
        text: "Take care! Reach out via the contact form or email anytime.",
        sources: [
          {
            id: "bye",
            section: "Contact",
            title: "How to get in touch",
            link: "#contact",
          },
        ],
        follow: null,
      };
    }
    if (intent === "off_topic") {
      lastFollow = null;
      return offTopicAnswer("that");
    }
    if (intent === "identity") {
      lastFollow = null;
      return identityAnswer();
    }
    if (intent === "name") {
      const r = nameAnswer();
      lastFollow = r.follow;
      return r;
    }
    if (intent === "location") {
      const r = locationAnswer();
      lastFollow = r.follow;
      return r;
    }
    if (intent === "start_date") {
      const r = startDateAnswer();
      lastFollow = r.follow;
      return r;
    }
    if (intent === "work_authorization") {
      const r = workAuthAnswer();
      lastFollow = r.follow;
      return r;
    }
    if (intent === "availability") {
      const r = availabilityAnswer();
      lastFollow = r.follow;
      return r;
    }
    if (intent === "contact") {
      const r = contactAnswer();
      lastFollow = r.follow;
      return r;
    }
    if (intent === "favorite_project") {
      const r = favoriteProjectAnswer();
      lastFollow = r.follow;
      return r;
    }

    // Project + company aware routing
    const matchedProjects = detectProjects(qLower);
    if (matchedProjects.length > 0) {
      const r = projectAnswer(matchedProjects[0]);
      if (r) {
        lastFollow = r.follow;
        return r;
      }
    }

    const matchedCompanies = detectCompanies(qLower);
    if (matchedCompanies.length > 0) {
      const r = experienceAnswer(matchedCompanies[0]);
      if (r) {
        lastFollow = r.follow;
        return r;
      }
    }

    if (intent === "experience_list") {
      const r = experienceListAnswer();
      lastFollow = r.follow;
      return r;
    }
    if (intent === "projects_list") {
      const r = projectsListAnswer();
      lastFollow = r.follow;
      return r;
    }
    if (intent === "education") {
      const r = educationAnswer();
      lastFollow = r.follow;
      return r;
    }

    // Skill-area specific?
    const matchedSkillGroups = detectSkillGroups(qLower);
    if (matchedSkillGroups.length > 0 && intent !== "skills_overview") {
      const r = skillGroupAnswer(matchedSkillGroups[0]);
      if (r) {
        lastFollow = r.follow;
        return r;
      }
    }
    if (intent === "skills_overview") {
      const r = skillsOverviewAnswer();
      lastFollow = r.follow;
      return r;
    }

    // Fall back to TF-IDF retrieval
    const hits = index.search(q, 4);
    const r = fallbackAnswer(hits, qLower);
    lastFollow = r.follow;
    return r;
  }

  function followUp(follow) {
    if (!follow) return null;
    if (follow.kind === "project") {
      const study = caseStudies[follow.repoKey];
      const meta = siteConfig.repoMeta?.[follow.repoKey];
      if (!study || !meta) return null;
      return {
        text:
          `More on **${meta.displayName}** — architecture:\n\n` +
          study.architecture.map((l) => `• ${l}`).join("\n") +
          `\n\nFull stack: ${study.tech.join(", ")}.`,
        sources: [
          {
            id: `proj-arch-${follow.repoKey}`,
            section: "Project",
            project: meta.displayName,
            title: `${meta.displayName} — architecture`,
            link: "#projects",
          },
        ],
        follow,
      };
    }
    if (follow.kind === "experience") {
      const r = experienceAnswer(follow.company);
      return r;
    }
    if (follow.kind === "skill_group") {
      const r = skillGroupAnswer(follow.title);
      return r;
    }
    if (follow.kind === "availability") {
      return contactAnswer();
    }
    if (follow.kind === "start_date") {
      return workAuthAnswer();
    }
    if (follow.kind === "work_authorization") {
      return startDateAnswer();
    }
    if (follow.kind === "skills_overview") {
      return {
        text:
          "Want to drill in? Try asking about a specific area: ML/AI, backend frameworks, frontend, databases, streaming, cloud & DevOps, or web3.",
        sources: [],
        follow,
      };
    }
    return null;
  }

  function reset() {
    lastFollow = null;
  }

  /** Top TF-IDF chunks for optional LLM grounding (same index as fallback retrieval). */
  function contextForLLM(query, k = 6) {
    const q = String(query || "").trim();
    if (!q) return "";
    const hits = index.search(q, k);
    return hits
      .map((h) => `[${h.section}] ${h.title}: ${h.text}`)
      .join("\n\n");
  }

  return { answer, reset, contextForLLM };
}
