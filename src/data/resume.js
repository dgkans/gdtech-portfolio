export const resume = {
  name: "Gaurav Abhay Desai",
  contact: {
    location: "San Francisco, CA, USA",
    phone: "+1 (657) 500-1950",
    email: "desai.gaurav.77@gmail.com",
    linkedin: "https://www.linkedin.com/in/gaurav-desai-9bb562289/",
    github: "https://github.com/dgkans",
  },
  summary:
    "Backend-focused full-stack engineer with production experience on low-latency market-data systems (Kafka, Redis, Solace), polyglot services (Java, C#, Go), and applied ML (Python, FastAPI, classical ML + modern LLM tooling). M.S. Computer Science (GPA 3.94).",

  skills: {
    languages: [
      { name: "Python", level: 95 },
      { name: "Java", level: 90 },
      { name: "JavaScript", level: 90 },
      { name: "Go", level: 80 },
      { name: "C#", level: 85 },
      { name: "C/C++", level: 75 },
      { name: "Solidity", level: 70 },
      { name: "GraphQL", level: 70 },
    ],
    frameworks: [
      { name: "React", level: 92 },
      { name: "Spring Boot", level: 88 },
      { name: ".NET", level: 82 },
      { name: "Node.js / Express", level: 88 },
      { name: "Next.js", level: 80 },
      { name: "NestJS", level: 75 },
      { name: "TailwindCSS", level: 90 },
    ],
    aiml: [
      { name: "scikit-learn", level: 88 },
      { name: "TensorFlow / Keras", level: 80 },
      { name: "PyTorch", level: 75 },
      { name: "Pandas / NumPy", level: 92 },
      { name: "RAG / LLMs", level: 78 },
    ],
    infra: [
      { name: "Apache Kafka", level: 88 },
      { name: "Redis", level: 85 },
      { name: "Docker", level: 82 },
      { name: "Kubernetes", level: 70 },
      { name: "AWS", level: 80 },
      { name: "PostgreSQL / MySQL", level: 85 },
      { name: "MongoDB", level: 85 },
      { name: "Elasticsearch", level: 72 },
    ],
  },

  experience: [
    {
      company: "MOFSL",
      role: "Software Developer",
      start: "Nov 2022",
      end: "Jun 2024",
      bullets: [
        "Engineered real-time market data pipelines using Kafka, Redis, and Solace to process 5M+ messages daily with sub-millisecond latency, boosting decision-making speed for traders.",
        "Developed backend APIs in C#, Java and Go for order execution and risk checks, supporting 100K+ daily transactions without performance bottlenecks.",
        "Automated recurring monitoring and cleanup tasks with Python, cutting maintenance overhead by 25% and reducing downtime incidents by 20% through retry/failover mechanisms.",
        "Collaborated cross-functionally with the trading and broking portal and compliance teams to translate requirements into technical solutions and ship features ahead of trading deadlines.",
      ],
    },
    {
      company: "CHCS Services Inc.",
      role: "Process Associate",
      start: "Sep 2021",
      end: "Nov 2021",
      bullets: [
        "Built automated database validation scripts in Python and SQL, eliminating manual error checks and reducing processing effort by 40%.",
        "Used Prometheus and Elasticsearch for routine system optimizations, enhancing performance and reducing downtime.",
      ],
    },
    {
      company: "Jaldoot Enterprises Ltd.",
      role: "Technical Partner (Software & Operations)",
      start: "Oct 2013",
      end: "Jul 2021",
      bullets: [
        "Increased revenue 25% YoY by launching a wealth sub-broking vertical and converting ~200 customers into AUM clients.",
        "Reduced month-end close from 5 days to 1 day by digitizing financial / inventory records with maker–checker controls.",
        "Built a C# WinForms personnel-tracking app for shifts, attendance, and field activity; automated rostering improved payroll accuracy by 40%.",
        "Designed an HR tracking tool that reduced reporting errors by 30% and introduced KPI dashboards (sales, AUM pipeline, stock-outs, collections).",
      ],
    },
  ],

  education: [
    {
      school: "California State University, Fullerton",
      degree: "M.S. Computer Science",
      start: "Aug 2024",
      end: "May 2026",
      detail: "GPA 3.94 · Algorithms, Machine Learning, Software Engineering, Advanced Blockchain",
    },
    {
      school: "Centre for Development of Advanced Computing, India",
      degree: "Post Graduate Diploma in Advanced Computing",
      start: "",
      end: "2022",
      detail: "",
    },
    {
      school: "University of Mumbai",
      degree: "B.E. Information Technology",
      start: "",
      end: "",
      detail: "",
    },
  ],

  certifications: ["Google Cloud Computing Foundations Certificate"],

  projects: [
    {
      name: "TradeGuard",
      url: "https://github.com/dgkans/TradeGuard",
      summary:
        "Safety gateway for AI trading agents: an MCP gateway that checks every LangGraph agent tool call (schema, risk limits, prompt-injection taint, intent alignment, human approval), with a 900-run evaluation harness and a live multi-user paper-trading desk on live Finnhub prices.",
    },
    {
      name: "Transforming Real Estate with AI",
      url: "https://github.com/dgkans/AI_Realestate",
      summary:
        "AI-powered MERN real estate platform with Python FastAPI ML microservices using Random Forest + KNN for fair-price prediction, comparable-property search, and personalized risk-aware investment recommendations.",
    },
    {
      name: "BlogSpace",
      url: "https://github.com/dgkans/BlogSpace",
      summary:
        "MERN blogging platform with React Quill editor, draft autosave, scheduled publishing, Cloudinary uploads, and a responsive UI with search, filters, tags, reactions, comments, bookmarks, and a persisted theme.",
    },
    {
      name: "AetherVault",
      url: "https://github.com/dgkans/AetherVaultBlockchain",
      summary:
        "Decentralized NFT auction & marketplace on Ethereum (Solidity, OpenZeppelin ERC-721, Truffle, ethers.js, IPFS) with minting, fixed-price sales, real-time auctions, and analytics dashboards.",
    },
    {
      name: "E-Adoption Portal",
      url: "https://github.com/dgkans/EAdoptionPortal",
      summary:
        "Secure online adoption system in Java Spring Boot + React with role-based access, streamlined adoption processes, and real-time orphanage management.",
    },
  ],

  now: {
    updated: "May 2026",
    items: [
      "Wrapping up an applied-ML project on AI-assisted real-estate price analysis.",
      "Diving deeper into LLM application engineering — RAG pipelines, evals, and agent tool use.",
      "Refactoring this portfolio into a fully interactive, theme-aware site with live GitHub data and ML demos.",
      "Open to full-time Software / ML Engineer roles across the USA — onsite, hybrid, or remote.",
    ],
  },
};

/** Recruiter hero — keeps the résumé summary verbatim. */
export const heroSummary =
  "Results-driven software engineer with expertise in software engineering, machine learning, AI, and application development, specializing in backend systems and data-driven solutions. Skilled in optimizing infrastructures, enhancing performance, and driving system innovation and automation.";

/** Skill tags grouped for the About section (aligned with résumé + adjacent tools). */
export const skillGroups = [
  {
    title: "Languages & scripting",
    items: [
      "Python",
      "Java",
      "JavaScript",
      "TypeScript",
      "Go",
      "C#",
      "C/C++",
      "Solidity",
      "GraphQL",
      "HTML",
      "Bash",
      "Shell",
      "SQL",
    ],
  },
  {
    title: "Frontend & UI",
    items: [
      "React",
      "Next.js",
      "TailwindCSS",
      "Vite",
      "WinForms",
      "WPF",
      "REST APIs",
      "JWT",
      "Vitest",
    ],
  },
  {
    title: "Backend & application frameworks",
    items: [
      "Spring Boot",
      "Node.js",
      "Express",
      "NestJS",
      ".NET",
      "ASP.NET",
      "FastAPI",
      "JPA",
      "Pydantic",
      "SQLAlchemy",
      "pytest",
    ],
  },
  {
    title: "Data stores & search",
    items: [
      "PostgreSQL",
      "MySQL",
      "MongoDB",
      "Redis",
      "MS SQL",
      "Elasticsearch",
      "NoSQL",
      "Alembic",
      "Neon",
    ],
  },
  {
    title: "Streaming & messaging",
    items: ["Apache Kafka", "Solace", "Event-driven design"],
  },
  {
    title: "ML, AI & analytics",
    items: [
      "scikit-learn",
      "TensorFlow",
      "Keras",
      "PyTorch",
      "Pandas",
      "NumPy",
      "RAG / LLMs",
      "Feature engineering",
      "LangGraph",
      "LangChain",
      "Model Context Protocol",
      "Ollama",
      "Groq",
      "LLM evaluation",
      "AI guardrails",
    ],
  },
  {
    title: "Cloud, DevOps & observability",
    items: [
      "AWS",
      "Azure",
      "Google Cloud",
      "Firebase",
      "Docker",
      "Kubernetes",
      "Prometheus",
      "Ansible",
      "Jenkins",
      "Git",
      "Linux",
      "Agile / SDLC",
      "GitHub Actions",
      "OpenTelemetry",
      "Jaeger",
      "Render",
      "Cloudflare Pages",
    ],
  },
  {
    title: "Web3 & distributed apps",
    items: [
      "ethers.js",
      "Truffle",
      "IPFS",
      "OpenZeppelin",
      "ERC-721",
    ],
  },
];
