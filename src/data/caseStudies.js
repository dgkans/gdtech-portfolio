/**
 * Per-project case studies surfaced in the Projects section.
 * Each key matches a repo name in `siteConfig.featuredRepos`.
 *
 * The `mermaid` strings are rendered by `MermaidDiagram.jsx` and should
 * stay small (1 screen of content). Avoid double quotes inside node labels
 * — Mermaid is happiest with single-line text or HTML <br/>.
 */
export const caseStudies = {
  TradeGuard: {
    problem:
      "LLM agents can now place real orders through broker tools. A broker checks buying power and margin, but not whether the order matches what the user asked for, whether the agent was manipulated by untrusted text like a news headline, or whether it respects the trader's own risk limits.",
    role: "Designed and built it end-to-end: the MCP gateway and policy pipeline, the LangGraph agent, the evaluation harness, the multi-user React desk with accounts, and the free cloud deployment with CI/CD.",
    tech: [
      "Python / FastAPI",
      "LangGraph / LangChain",
      "Model Context Protocol (MCP)",
      "PostgreSQL / Alembic (Neon)",
      "React / TypeScript / Vite",
      "OpenTelemetry / Jaeger",
      "Ollama / Groq LLMs",
      "Finnhub live prices",
      "Docker / GitHub Actions / Render / Cloudflare Pages",
    ],
    outcome:
      "Across a 100-scenario evaluation (900 runs over 3 guard settings), unsafe orders executed fell from 30 unguarded to 0 fully guarded, and a scripted fully hijacked agent got 0 of 45 injected orders through, at 0.3 ms median gateway overhead. Live as a multi-user paper-trading desk on real-time prices.",
    architecture: [
      "A trader chats with a LangGraph agent; every tool call goes through the TradeGuard MCP gateway.",
      "The gateway runs a fail-closed pipeline: schema and tool allowlist, the trader's risk limits, prompt-injection taint tracking, and intent alignment (with an LLM judge for ambiguous requests).",
      "Large orders pause for the trader's approval in the chat; every decision lands in a PostgreSQL audit log with OpenTelemetry traces.",
      "Approved orders reach a paper broker priced live from Finnhub; a replay market drives the reproducible evaluation harness.",
    ],
    mermaid: `flowchart LR
  trader([Trader]) -->|chat| ui[React desk]
  ui --> agent[LangGraph agent]
  agent -->|MCP| gw{TradeGuard}
  gw -->|allowed| broker[Paper broker]
  gw -. approval .-> trader
  gw --> audit[(Audit log)]
  broker --> prices[(Finnhub)]
  classDef ext fill:#0ea5e91a,stroke:#0ea5e9,color:#0ea5e9;
  classDef store fill:#22c55e1a,stroke:#22c55e,color:#22c55e;
  class trader ext
  class audit,prices store`,
  },

  AI_Realestate: {
    problem:
      "Buyers and small investors lacked an accessible way to gauge a fair price for a home and to understand whether a listing represented a smart, risk-aware investment.",
    role: "Owned the project end-to-end — data ingestion, ML microservice, MERN backend/frontend, auth, and deployment.",
    tech: [
      "React",
      "Node.js / Express",
      "MongoDB",
      "Python",
      "FastAPI",
      "scikit-learn (Random Forest, KNN)",
      "JWT",
    ],
    outcome:
      "Delivered a working end-to-end platform with sub-second prediction latency, comparable-property search, and a personalised investment-recommendation flow that explains its reasoning.",
    architecture: [
      "React SPA calls the Node/Express API for auth and listings.",
      "Express delegates pricing / comparables / recommendations to a Python FastAPI ML service.",
      "FastAPI loads pre-trained Random Forest + KNN artifacts at boot for low-latency inference.",
      "MongoDB stores users, listings, and saved searches.",
    ],
    mermaid: `flowchart LR
  user([User]) -->|HTTPS| web[React SPA]
  web -->|REST + JWT| api[Node / Express API]
  api -->|listings, auth| db[(MongoDB)]
  api -->|/predict, /comparables, /recommend| ml[FastAPI ML Service]
  ml -->|loads| models[(RF + KNN models)]
  classDef ext fill:#0ea5e91a,stroke:#0ea5e9,color:#0ea5e9;
  classDef store fill:#22c55e1a,stroke:#22c55e,color:#22c55e;
  class user ext
  class db,models store`,
  },

  BlogSpace: {
    problem:
      "Most lightweight blogging tools either lock authors into a hosted CMS or skip the polish — scheduled publishing, autosave, media handling, search, and a dependable reading experience.",
    role: "Designed the schema, built the React Quill editor, wrote the API, and shipped the responsive UI end-to-end.",
    tech: [
      "React",
      "React Quill",
      "Node.js / Express",
      "MongoDB",
      "JWT",
      "Cloudinary",
      "TailwindCSS",
    ],
    outcome:
      "Authors can draft with autosave, schedule publishes, upload media via Cloudinary, and readers get fast search, tags, comments, bookmarks, and persistent dark mode.",
    architecture: [
      "React + Quill author dashboard with debounced autosave to /drafts.",
      "Express REST API with JWT auth, scheduled publish jobs, and view tracking.",
      "Cloudinary signed uploads keep media off the app server.",
      "MongoDB stores posts, drafts, comments, and reactions; indexed on tags + slug.",
    ],
    mermaid: `flowchart LR
  reader([Reader]) -->|browse / search| ui[React UI]
  author([Author]) -->|edit / schedule| ui
  ui -->|REST + JWT| api[Express API]
  api -->|posts, drafts, comments| db[(MongoDB)]
  ui -. signed upload .-> cdn[(Cloudinary)]
  api -->|cron: publish scheduled| api
  classDef ext fill:#0ea5e91a,stroke:#0ea5e9,color:#0ea5e9;
  classDef store fill:#22c55e1a,stroke:#22c55e,color:#22c55e;
  class reader,author ext
  class db,cdn store`,
  },

  AetherVaultBlockchain: {
    problem:
      "NFT marketplaces are often opaque about provenance and bid mechanics. Independent creators need a transparent venue with on-chain ownership and clear auction state.",
    role: "Wrote the Solidity contracts, built the React/ethers.js client, and pinned media to IPFS via Pinata.",
    tech: [
      "Solidity",
      "OpenZeppelin (ERC-721)",
      "Truffle",
      "ethers.js",
      "React / Vite",
      "TailwindCSS",
      "IPFS (Pinata)",
    ],
    outcome:
      "Functional auction dApp with minting, fixed-price sales, real-time auctions, on-chain escrow, and analytics dashboards — all backed by audited OpenZeppelin building blocks.",
    architecture: [
      "Creators mint ERC-721 tokens; metadata + media pinned to IPFS via Pinata.",
      "Auction & marketplace contracts hold escrow, manage bids, and emit events.",
      "React/ethers.js client subscribes to events for live auction updates.",
    ],
    mermaid: `flowchart LR
  creator([Creator]) --> ui[React + ethers.js]
  bidder([Bidder]) --> ui
  ui -->|tx + events| chain[Ethereum]
  chain --> nft[ERC-721 Contract]
  chain --> auc[Auction Contract]
  ui -. metadata .-> ipfs[(IPFS / Pinata)]
  classDef ext fill:#0ea5e91a,stroke:#0ea5e9,color:#0ea5e9;
  classDef store fill:#a855f71a,stroke:#a855f7,color:#a855f7;
  class creator,bidder ext
  class ipfs,nft,auc store`,
  },

  EAdoptionPortal: {
    problem:
      "Adoption workflows are paper-heavy, slow, and error-prone, with sensitive data spread across email and spreadsheets between adoptive parents and orphanage admins.",
    role: "Led the backend — designed the role-based domain model, REST API, and document workflow; collaborated on the React client.",
    tech: [
      "Java",
      "Spring Boot",
      "Spring Security",
      "JPA / Hibernate",
      "MySQL",
      "React",
      "JWT",
    ],
    outcome:
      "Replaced manual paperwork with an auditable, role-aware workflow: parents apply, admins verify documents, and case status is tracked end-to-end with secure auth and KPI views.",
    architecture: [
      "React client talks to a Spring Boot REST API behind JWT + role-based access.",
      "JPA persists users, applications, documents, and audit events to MySQL.",
      "Document store keeps verified IDs/forms; status transitions enforced server-side.",
    ],
    mermaid: `flowchart LR
  parent([Parent]) --> ui[React Client]
  admin([Admin]) --> ui
  ui -->|REST + JWT| api[Spring Boot API]
  api --> sec{Role-based Access}
  sec --> svc[Application Service]
  svc -->|JPA| db[(MySQL)]
  svc -. verify .-> docs[(Document Store)]
  classDef ext fill:#0ea5e91a,stroke:#0ea5e9,color:#0ea5e9;
  classDef store fill:#22c55e1a,stroke:#22c55e,color:#22c55e;
  class parent,admin ext
  class db,docs store`,
  },
};
