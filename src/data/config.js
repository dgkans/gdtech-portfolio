/** Optional: set `VITE_WEB3FORMS_KEY` in `.env.local` to override without editing this file. */
const web3formsKeyFromEnv = String(
  import.meta.env?.VITE_WEB3FORMS_KEY ?? ""
).trim();

/**
 * Web3Forms public access key (safe in frontend). Used when `VITE_WEB3FORMS_KEY`
 * is not set in `.env.local`. Update here if you rotate the key in Web3Forms.
 */
const WEB3FORMS_KEY_FALLBACK = "e883871c-354e-414d-ae4c-b0b2e0ef4d09";

export const siteConfig = {
  name: "Gaurav Desai",
  github: "dgkans",
  linkedin: "https://www.linkedin.com/in/gaurav-desai-9bb562289/",
  email: "desai.gaurav.77@gmail.com",
  location: "San Francisco, CA",
  tagline: "Software Engineer · ML Engineer",
  availability: {
    status: "Open to roles across the USA",
    detail: "Full-time Software / ML Engineer · onsite, hybrid, or remote",
    short: "open across the USA",
  },

  /**
   * Facts the on-site chat + TF-IDF corpus use. Edit here when dates or visa
   * status change — avoid scattering the same strings across chatBrain.js.
   */
  profileFacts: {
    earliestStartDateISO: "2026-07-06",
    earliestStartDateHuman: "July 6, 2026",
    visaOneLiner:
      "Currently in the U.S. on an F-1 student visa with OPT authorization and eligible to work anywhere in the USA. No sponsorship needed.",
    workAuthExtra:
      "No sponsorship needed,",
  },

  // Env wins when set; otherwise `WEB3FORMS_KEY_FALLBACK` (avoids empty-string saves breaking the form).
  web3formsKey: web3formsKeyFromEnv || WEB3FORMS_KEY_FALLBACK,

  featuredRepos: [
    "TradeGuard",
    "AI_Realestate",
    "BlogSpace",
    "AetherVaultBlockchain",
    "EAdoptionPortal",
  ],

  repoMeta: {
    TradeGuard: {
      displayName: "TradeGuard — Safety Gateway for AI Trading Agents",
      tagline:
        "MCP gateway that checks every AI trading agent's tool call against risk limits, prompt-injection taint, and the user's intent, with human approval for large orders, a 900-run evaluation harness, and a live paper-trading desk.",
      tags: ["AI/ML", "Agentic AI", "Full-stack"],
      stack: [
        "Python",
        "LangGraph",
        "MCP",
        "FastAPI",
        "PostgreSQL",
        "React",
        "TypeScript",
        "OpenTelemetry",
        "Docker",
        "GitHub Actions",
      ],
      live: "https://tradeguard-4c9.pages.dev",
    },
    AI_Realestate: {
      displayName: "AI in Real Estate",
      tagline:
        "Full-stack MERN platform with a Python ML microservice for fair-price prediction, KNN comparables, and a risk-aware investment advisor.",
      tags: ["AI/ML", "Full-stack"],
      stack: [
        "React",
        "Node.js",
        "Express",
        "MongoDB",
        "Python",
        "FastAPI",
        "scikit-learn",
      ],
      live: "https://ai-realestate-khaki.vercel.app/",
    },
    BlogSpace: {
      displayName: "BlogSpace",
      tagline:
        "MERN blogging platform with rich-text editing, scheduled publishing, draft autosave, tags, bookmarks, and a Cloudinary-backed media pipeline.",
      tags: ["Full-stack"],
      stack: [
        "React",
        "Node.js",
        "Express",
        "MongoDB",
        "JWT",
        "Cloudinary",
        "Quill",
      ],
      live: "https://blog-space-git-development-dgkans-projects.vercel.app/",
    },
    AetherVaultBlockchain: {
      displayName: "AetherVault — NFT Auction DApp",
      tagline:
        "Decentralized NFT auction & marketplace on Ethereum: ERC-721 minting, batch listings, real-time bidding, on-chain escrow, IPFS metadata.",
      tags: ["Blockchain", "Full-stack"],
      stack: [
        "Solidity",
        "Truffle",
        "ethers.js",
        "React",
        "Vite",
        "TailwindCSS",
        "IPFS",
      ],
      live: null,
    },
    EAdoptionPortal: {
      displayName: "E-Adoption Portal",
      tagline:
        "Secure online child adoption system with role-based workflows for parents and orphanage admins, JWT auth, and document verification.",
      tags: ["Full-stack"],
      stack: [
        "Java",
        "Spring Boot",
        "Spring Security",
        "JPA",
        "React",
        "MySQL",
        "JWT",
      ],
      live: null,
    },
  },
};
