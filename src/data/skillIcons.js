/**
 * Brand-icon + color mapping for the Skills section.
 *
 * Each entry is `{ Icon, color, label? }`. `label` overrides the display name
 * (rare; useful when the chip text differs from the canonical brand name).
 *
 * Skills present in `skillGroups` (src/data/resume.js) but absent from this
 * map render as a monogram fallback tile in `<SkillTile>` — same shape and
 * size, so the grid stays visually consistent.
 *
 * Colors are the official Simple Icons brand hex values where available,
 * with manual overrides for icons that simple-icons publishes as solid black
 * (e.g. Java) where the community-standard color reads better in dark mode.
 */
import {
  SiPython,
  SiOpenjdk,
  SiJavascript,
  SiTypescript,
  SiGo,
  SiSharp,
  SiC,
  SiCplusplus,
  SiSolidity,
  SiGraphql,
  SiHtml5,
  SiCss,
  SiGnubash,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiVite,
  SiSpringboot,
  SiNodedotjs,
  SiExpress,
  SiNestjs,
  SiDotnet,
  SiFastapi,
  SiPostgresql,
  SiMysql,
  SiMongodb,
  SiRedis,
  SiElasticsearch,
  SiApachekafka,
  SiDocker,
  SiKubernetes,
  SiGooglecloud,
  SiFirebase,
  SiPrometheus,
  SiAnsible,
  SiJenkins,
  SiGit,
  SiGithub,
  SiLinux,
  SiEthereum,
  SiIpfs,
  SiOpenzeppelin,
  SiJsonwebtokens,
  SiScikitlearn,
  SiTensorflow,
  SiKeras,
  SiPytorch,
  SiPandas,
  SiNumpy,
  SiLangchain,
  SiOllama,
  SiModelcontextprotocol,
  SiPydantic,
  SiSqlalchemy,
  SiPytest,
  SiVitest,
  SiGithubactions,
  SiOpentelemetry,
  SiJaeger,
  SiRender,
  SiCloudflarepages,
} from "react-icons/si";
import { FaMicrosoft, FaJava, FaAws } from "react-icons/fa";
import { VscAzure } from "react-icons/vsc";

export const skillIconMap = {
  // Languages & scripting
  Python: { Icon: SiPython, color: "#3776AB" },
  Java: { Icon: FaJava, color: "#E76F00" },
  JavaScript: { Icon: SiJavascript, color: "#F7DF1E" },
  TypeScript: { Icon: SiTypescript, color: "#3178C6" },
  Go: { Icon: SiGo, color: "#00ADD8" },
  "C#": { Icon: SiSharp, color: "#9B4F96" },
  "C/C++": { Icon: SiCplusplus, color: "#00599C" },
  C: { Icon: SiC, color: "#A8B9CC" },
  "C++": { Icon: SiCplusplus, color: "#00599C" },
  Solidity: { Icon: SiSolidity, color: "#363636" },
  GraphQL: { Icon: SiGraphql, color: "#E10098" },
  HTML: { Icon: SiHtml5, color: "#E34F26" },
  CSS: { Icon: SiCss, color: "#1572B6" },
  Bash: { Icon: SiGnubash, color: "#4EAA25" },
  Shell: { Icon: SiGnubash, color: "#4EAA25" },

  // Frontend & UI
  React: { Icon: SiReact, color: "#61DAFB" },
  "Next.js": { Icon: SiNextdotjs, color: "#FFFFFF" },
  TailwindCSS: { Icon: SiTailwindcss, color: "#06B6D4" },
  Vite: { Icon: SiVite, color: "#646CFF" },
  WinForms: { Icon: FaMicrosoft, color: "#00A4EF" },
  WPF: { Icon: FaMicrosoft, color: "#00A4EF" },
  JWT: { Icon: SiJsonwebtokens, color: "#D63AFF" },
  Vitest: { Icon: SiVitest, color: "#6E9F18" },
  // "REST APIs" intentionally omitted -> monogram fallback

  // Backend & application frameworks
  "Spring Boot": { Icon: SiSpringboot, color: "#6DB33F" },
  "Node.js": { Icon: SiNodedotjs, color: "#5FA04E" },
  "Node.js / Express": { Icon: SiNodedotjs, color: "#5FA04E" },
  Express: { Icon: SiExpress, color: "#FFFFFF" },
  NestJS: { Icon: SiNestjs, color: "#E0234E" },
  ".NET": { Icon: SiDotnet, color: "#512BD4" },
  "ASP.NET": { Icon: SiDotnet, color: "#512BD4" },
  FastAPI: { Icon: SiFastapi, color: "#009688" },
  Pydantic: { Icon: SiPydantic, color: "#E92063" },
  SQLAlchemy: { Icon: SiSqlalchemy, color: "#D71F00" },
  pytest: { Icon: SiPytest, color: "#0A9EDC" },
  // "JPA" -> monogram fallback (no brand icon)

  // Data stores & search
  PostgreSQL: { Icon: SiPostgresql, color: "#4169E1" },
  "PostgreSQL / MySQL": { Icon: SiPostgresql, color: "#4169E1" },
  MySQL: { Icon: SiMysql, color: "#4479A1" },
  MongoDB: { Icon: SiMongodb, color: "#47A248" },
  Redis: { Icon: SiRedis, color: "#DC382D" },
  "MS SQL": { Icon: FaMicrosoft, color: "#CC2927" },
  Elasticsearch: { Icon: SiElasticsearch, color: "#005571" },
  // "NoSQL" -> monogram fallback

  // Streaming & messaging
  "Apache Kafka": { Icon: SiApachekafka, color: "#FFFFFF" },
  // "Solace", "Event-driven design" -> monogram fallback

  // ML / AI / analytics
  "scikit-learn": { Icon: SiScikitlearn, color: "#F7931E" },
  TensorFlow: { Icon: SiTensorflow, color: "#FF6F00" },
  "TensorFlow / Keras": { Icon: SiTensorflow, color: "#FF6F00" },
  Keras: { Icon: SiKeras, color: "#D00000" },
  PyTorch: { Icon: SiPytorch, color: "#EE4C2C" },
  Pandas: { Icon: SiPandas, color: "#150458" },
  "Pandas / NumPy": { Icon: SiPandas, color: "#150458" },
  NumPy: { Icon: SiNumpy, color: "#013243" },
  // "RAG / LLMs", "Feature engineering" -> monogram fallback
  LangGraph: { Icon: SiLangchain, color: "#5FD3BC" },
  LangChain: { Icon: SiLangchain, color: "#5FD3BC" },
  "Model Context Protocol": { Icon: SiModelcontextprotocol, color: "#FFFFFF" },
  Ollama: { Icon: SiOllama, color: "#FFFFFF" },
  // "Groq", "LLM evaluation", "AI guardrails", "Alembic", "Neon", "SQL" -> monogram

  // Cloud, DevOps & observability
  AWS: { Icon: FaAws, color: "#FF9900" },
  Azure: { Icon: VscAzure, color: "#0078D4" },
  "Google Cloud": { Icon: SiGooglecloud, color: "#4285F4" },
  Firebase: { Icon: SiFirebase, color: "#FFCA28" },
  Docker: { Icon: SiDocker, color: "#2496ED" },
  Kubernetes: { Icon: SiKubernetes, color: "#326CE5" },
  Prometheus: { Icon: SiPrometheus, color: "#E6522C" },
  Ansible: { Icon: SiAnsible, color: "#EE0000" },
  Jenkins: { Icon: SiJenkins, color: "#D24939" },
  Git: { Icon: SiGit, color: "#F05032" },
  GitHub: { Icon: SiGithub, color: "#FFFFFF" },
  Linux: { Icon: SiLinux, color: "#FCC624" },
  // "Agile / SDLC" -> monogram fallback
  "GitHub Actions": { Icon: SiGithubactions, color: "#2088FF" },
  OpenTelemetry: { Icon: SiOpentelemetry, color: "#F5A800" },
  Jaeger: { Icon: SiJaeger, color: "#66CFE3" },
  Render: { Icon: SiRender, color: "#FFFFFF" },
  "Cloudflare Pages": { Icon: SiCloudflarepages, color: "#F38020" },

  // Web3 & distributed apps
  "ethers.js": { Icon: SiEthereum, color: "#627EEA" },
  // "Truffle" -> monogram fallback (no icon in react-icons/si)
  IPFS: { Icon: SiIpfs, color: "#65C2CB" },
  OpenZeppelin: { Icon: SiOpenzeppelin, color: "#4E5EE4" },
  // "ERC-721" -> monogram fallback
};

/** Return `{ Icon, color }` if known, otherwise null (caller renders fallback). */
export function getSkillIcon(name) {
  return skillIconMap[name] || null;
}

/** Build a 1–2 char monogram for the fallback tile (e.g. "REST APIs" -> "RA"). */
export function monogramFor(name) {
  const cleaned = String(name)
    .replace(/[^A-Za-z0-9 ]+/g, " ")
    .trim();
  if (!cleaned) return "?";
  const parts = cleaned.split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}
