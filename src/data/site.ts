export type EvidenceState =
  | "Demonstrated"
  | "Practicing"
  | "Learning"
  | "Planned";

export type ProjectSubsystem = {
  name: string;
  state: EvidenceState;
  detail: string;
};

export type ProjectMedia = {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
};

export type InitiativePhaseStatus = "Completed" | "Active" | "Next" | "Planned";

export type InitiativePhase = {
  phase: string;
  title: string;
  status: InitiativePhaseStatus;
  summary: string;
  ticket?: string;
  milestones: string[];
  completedMilestones?: string[];
};

export type ProjectInitiative = {
  status: "Active";
  started: string;
  currentPhase: string;
  summary: string;
  relatedTickets: string[];
  phases: InitiativePhase[];
};

export type ProjectDetailSection = {
  kicker: string;
  title: string;
  state: EvidenceState;
  summary: string;
  items: string[];
};

export type ProjectProofLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type ProjectOwnership = {
  statement: string;
  summary: string;
};

export type Project = {
  professionalEngagement?: boolean;
  architecture?: {
    title: string;
    caption: string;
    steps: string[];
  };
  slug: string;
  title: string;
  shortTitle: string;
  type: string;
  status: string;
  evidenceState: EvidenceState;
  summary: string;
  problem: string;
  outcome: string;
  approach: string;
  stack: string[];
  capabilities: string[];
  roleLinks: string[];
  verifiedFacts: string[];
  unknowns: string[];
  proofNote: string;
  nextProof: string;
  visibility?: "Public";
  liveUrl?: string;
  liveLabel?: string;
  sourceUrl?: string;
  ownership?: ProjectOwnership;
  proofLinks?: ProjectProofLink[];
  media?: ProjectMedia[];
  subsystems?: ProjectSubsystem[];
  initiative?: ProjectInitiative;
  detailSections?: ProjectDetailSection[];
};

export type RoleLens = {
  slug: string;
  title: string;
  group: "Immediate" | "Bridge" | "Long-term" | "Exploratory";
  eyebrow?: string;
  fit: string;
  priority: string;
  headline: string;
  overview: string;
  contribution: string;
  demonstratedEvidence: string[];
  relevantProjects: string[];
  gaps: string[];
  nextProof: string;
  recruiterTakeaway: string;
  notClaimed: string[];
  scopeNote: string;
  gapDisplayLimit?: number;
  keywords: string[];
};

export type SkillCategory =
  | "Customer & Technical Delivery"
  | "Platform Engineering & Software Quality"
  | "APIs & Backend"
  | "Observability & Infrastructure"
  | "Data & Analytics"
  | "Frontend & Product Delivery"
  | "Currently Developing";

export type EvidenceSourceType =
  | "work"
  | "project"
  | "assessment"
  | "credential"
  | "course"
  | "lab";

export type EvidenceSource = {
  type: EvidenceSourceType;
  label: string;
  provider?: string;
  url?: string;
  verified: boolean;
  date?: string;
};

export type PlatformAssessment = {
  provider: string;
  label: string;
  level: string;
  assessedOn?: string;
  verified: boolean;
};

export type Skill = {
  id: string;
  name: string;
  category: SkillCategory;
  careerOsStatus: EvidenceState;
  evidenceSummary: string;
  evidenceSources: EvidenceSource[];
  relatedProjectSlugs: string[];
  relatedRoleSlugs: string[];
  platformAssessment?: PlatformAssessment;
  lastVerified?: string;
  visible: boolean;
};

export type LearningProfile = {
  provider: "Pluralsight" | "Microsoft Learn" | "freeCodeCamp" | "Coursera" | "DataCamp";
  label: string;
  url?: string;
  publicVerified: boolean;
  description: string;
  actionLabel: "View public profile" | "View transcript";
  visible: boolean;
};

export type PublicationPlatform = "Medium" | "LinkedIn";

export type PublicationProfile = {
  platform: PublicationPlatform;
  url: string;
  description: string;
};

export type WritingEntry = {
  id: string;
  title: string;
  summary: string;
  url: string;
  platform: PublicationPlatform;
  publicationDate?: string;
  topics: string[];
  featured: boolean;
};

export type WritingTheme = {
  title: string;
  status: "Published" | "Future direction";
  description: string;
};

export const externalProfileUrls = {
  github: "https://github.com/stroupjason",
  linkedin: "https://www.linkedin.com/in/jasonstroup",
  medium: "https://medium.com/@jasonstroup12",
};

export const businessProfile = {
  name: "Stroup Software Solutions LLC",
  domain: "stroup-software-solutions.com",
  founded: "July 2025",
  engineering:
    "I offer custom software development, build and deployment workflows, SDET-style test automation, and AI-assisted developer tooling.",
  principles:
    "I emphasize reproducible fixes, human-reviewed changes, and clear handoffs.",
  marketing:
    "I provide end-to-end custom marketing and advertising, from campaign strategy and landing pages to analytics and reporting.",
  markets:
    "I focus on real estate teams that use platforms such as Zillow, small and midsize businesses, SaaS, DaaS, and PaaS providers, and healthcare companies.",
};

export const profile = {
  name: "Jason Stroup",
  location: "Fort Collins, Colorado",
  availability: "Open to remote opportunities",
  currentRole: "Founder, Stroup Software Solutions LLC",
  professionalIdentity: "Founder | Software Engineer | Data & AI",
  supportingLine:
    "Custom software, platform automation, and data-driven insights.",
  coreIdentity:
    "I build custom software, automate technical workflows, and turn data into practical decisions.",
  headline:
    "I turn complex customer problems into clear technical solutions.",
  summary:
    "I specialize in SaaS troubleshooting, integrations, observability, analytics, and customer ownership while building deeper backend delivery skills.",
  github: externalProfileUrls.github,
  linkedin: externalProfileUrls.linkedin,
  resumeUrl: "/resume/Jason-Stroup-Resume.pdf",
};

export const publicationProfiles: PublicationProfile[] = [
  {
    platform: "Medium",
    url: externalProfileUrls.medium,
    description: "Published technical writing on SaaS, APIs, debugging, and customer-facing engineering.",
  },
  {
    platform: "LinkedIn",
    url: externalProfileUrls.linkedin,
    description: "Professional updates, experience, and article announcements.",
  },
];

export const writingEntries: WritingEntry[] = [
  {
    id: "why-saas-integrations-break",
    title:
      "Why SaaS Integrations Break: Event Names, Identity Mapping, and the Hidden Work of Support Engineering",
    summary:
      "A practical look at why successful API responses do not always mean successful customer outcomes, including event naming, payload interpretation, identity mapping, and the role of Support Engineering in closing that gap.",
    url: "https://medium.com/@jasonstroup12/why-saas-integrations-break-event-names-identity-mapping-and-support-engineering-c2472631674a",
    platform: "Medium",
    publicationDate: "2026-05-05",
    topics: ["SaaS integrations", "APIs", "Identity mapping", "Support engineering"],
    featured: true,
  },
];

export const writingThemes: WritingTheme[] = [
  {
    title: "SaaS integrations and failure modes",
    status: "Published",
    description: "Delivery, interpretation, event naming, and identity behavior across connected systems.",
  },
  {
    title: "APIs, authentication, and data flows",
    status: "Future direction",
    description: "Practical guidance on requests, payloads, identity, authentication, and system boundaries.",
  },
  {
    title: "Technical troubleshooting and root-cause analysis",
    status: "Published",
    description: "Layered investigation that moves from symptoms to validated customer outcomes.",
  },
  {
    title: "Customer-facing engineering",
    status: "Published",
    description: "Translating technical investigation into clear, useful next steps for customers and teams.",
  },
  {
    title: "Application support and observability",
    status: "Future direction",
    description: "Support workflows, application behavior, diagnostic signals, and operational clarity.",
  },
  {
    title: "Software engineering development",
    status: "Future direction",
    description: "Lessons from building, testing, and delivering software as the development path grows.",
  },
];

export const evidenceStates: Array<{
  state: EvidenceState;
  definition: string;
}> = [
  {
    state: "Demonstrated",
    definition:
      "Supported by professional experience, a working project, or public-safe evidence.",
  },
  {
    state: "Practicing",
    definition:
      "Currently exercised through approved work, independent labs, or active builds.",
  },
  {
    state: "Learning",
    definition:
      "Actively developing, but not yet strong enough for a mastery claim.",
  },
  {
    state: "Planned",
    definition:
      "Intentionally deferred until higher-leverage evidence is complete.",
  },
];

export const skillCategories: SkillCategory[] = [
  "Customer & Technical Delivery",
  "Platform Engineering & Software Quality",
  "APIs & Backend",
  "Observability & Infrastructure",
  "Data & Analytics",
  "Frontend & Product Delivery",
];

export const skills: Skill[] = [
  {
    id: "ci-cd-and-deployment",
    name: "CI/CD and software delivery",
    category: "Platform Engineering & Software Quality",
    careerOsStatus: "Demonstrated",
    evidenceSummary:
      "I use Git and GitHub to ship CareerOS, with automated type and build checks, Vercel deployments, and production route smoke tests.",
    evidenceSources: [
      { type: "project", label: "CareerOS delivery workflow", verified: true },
    ],
    relatedProjectSlugs: ["careeros"],
    relatedRoleSlugs: ["application-engineer", "software-engineer"],
    visible: true,
  },
  {
    id: "sdet-test-automation",
    name: "Test automation and SDET practices",
    category: "Platform Engineering & Software Quality",
    careerOsStatus: "Practicing",
    evidenceSummary:
      "I reproduce defects and validate fixes with automated regression and integration tests, API checks, and smoke tests. In the Python/MongoDB lab, a failing test captured a stale response before the fix.",
    evidenceSources: [
      { type: "lab", label: "Locally validated Python/MongoDB lab", verified: true },
    ],
    relatedProjectSlugs: ["python-mongodb-debugging-lab"],
    relatedRoleSlugs: ["application-engineer", "software-engineer"],
    visible: true,
  },
  {
    id: "containers-and-runtime-diagnostics",
    name: "Containers and runtime diagnostics",
    category: "Platform Engineering & Software Quality",
    careerOsStatus: "Practicing",
    evidenceSummary:
      "I use structured logs to trace API and database behavior. I prepared and validated the Docker Compose configuration for an isolated Python/MongoDB lab workflow.",
    evidenceSources: [
      { type: "lab", label: "Python/MongoDB lab configuration and diagnostics", verified: true },
    ],
    relatedProjectSlugs: ["python-mongodb-debugging-lab"],
    relatedRoleSlugs: ["application-engineer", "forward-deployed-engineer"],
    visible: true,
  },
  {
    id: "ai-assisted-developer-tooling",
    name: "AI-assisted developer tooling",
    category: "Platform Engineering & Software Quality",
    careerOsStatus: "Practicing",
    evidenceSummary:
      "I’m developing terminal-based workflows with Claude Code CLI and OpenAI Codex for code exploration, test development, and documentation, with human review and validation before changes ship.",
    evidenceSources: [],
    relatedProjectSlugs: [],
    relatedRoleSlugs: ["application-engineer", "software-engineer"],
    visible: true,
  },
  {
    id: "customer-troubleshooting",
    name: "Complex SaaS troubleshooting",
    category: "Customer & Technical Delivery",
    careerOsStatus: "Demonstrated",
    evidenceSummary:
      "I trace complex SaaS, integration, and data issues while keeping customers and technical teams aligned.",
    evidenceSources: [
      { type: "work", label: "Professional support experience", verified: true },
    ],
    relatedProjectSlugs: [],
    relatedRoleSlugs: ["senior-technical-support-engineer"],
    visible: true,
  },
  {
    id: "technical-customer-ownership",
    name: "Technical customer ownership",
    category: "Customer & Technical Delivery",
    careerOsStatus: "Demonstrated",
    evidenceSummary:
      "I own expectations, documentation, and translation between customers and engineering.",
    evidenceSources: [
      { type: "work", label: "Professional customer-facing work", verified: true },
    ],
    relatedProjectSlugs: [],
    relatedRoleSlugs: ["technical-account-manager", "customer-success-engineer"],
    visible: true,
  },
  {
    id: "api-integration-debugging",
    name: "REST API and integration debugging",
    category: "APIs & Backend",
    careerOsStatus: "Demonstrated",
    evidenceSummary:
      "I use REST, JSON, authentication, logs, Postman, Python, JavaScript, and SQL to isolate failures.",
    evidenceSources: [
      { type: "work", label: "Professional integration investigations", verified: true },
    ],
    relatedProjectSlugs: [],
    relatedRoleSlugs: ["senior-technical-support-engineer", "application-engineer", "software-engineer"],
    visible: true,
  },
  {
    id: "python-prototyping",
    name: "Python prototyping",
    category: "APIs & Backend",
    careerOsStatus: "Demonstrated",
    evidenceSummary:
      "I built a Raspberry Pi/OpenCV motion-tracking prototype with Python and hardware control.",
    evidenceSources: [
      { type: "project", label: "Automatic Nerf Turret", provider: "CareerOS", verified: true },
    ],
    relatedProjectSlugs: ["automatic-nerf-turret"],
    relatedRoleSlugs: ["application-engineer", "software-engineer"],
    visible: true,
  },
  {
    id: "linux-system-administration",
    name: "Linux System Administration",
    category: "Observability & Infrastructure",
    careerOsStatus: "Demonstrated",
    evidenceSummary:
      "Hands-on Linux administration and troubleshooting experience spanning patching, network rollback procedures, permissions, configuration editing, and log-based investigation.",
    evidenceSources: [
      { type: "work", label: "Professional Linux use", verified: true },
    ],
    relatedProjectSlugs: [],
    relatedRoleSlugs: ["senior-technical-support-engineer", "application-engineer", "forward-deployed-engineer"],
    visible: true,
  },
  {
    id: "edge-telemetry",
    name: "Edge telemetry and systems integration",
    category: "Observability & Infrastructure",
    careerOsStatus: "Practicing",
    evidenceSummary:
      "Rallye Control exercises edge computing, power telemetry, and local connectivity.",
    evidenceSources: [
      { type: "project", label: "Rallye Control", provider: "CareerOS", verified: true },
    ],
    relatedProjectSlugs: ["rallye-control"],
    relatedRoleSlugs: ["software-engineer", "forward-deployed-engineer"],
    visible: true,
  },
  {
    id: "sql-data-investigation",
    name: "SQL and data investigation",
    category: "Data & Analytics",
    careerOsStatus: "Demonstrated",
    evidenceSummary:
      "I use SQL and operational data to trace quality issues and explain system behavior.",
    evidenceSources: [
      { type: "work", label: "Professional data investigation", verified: true },
    ],
    relatedProjectSlugs: [],
    relatedRoleSlugs: ["data-analytics"],
    visible: true,
  },
  {
    id: "dashboards-data-storytelling",
    name: "Dashboards and data storytelling",
    category: "Data & Analytics",
    careerOsStatus: "Demonstrated",
    evidenceSummary:
      "I turn product and operational data into decision-focused dashboards and explanations.",
    evidenceSources: [
      { type: "work", label: "Professional analytics experience", verified: true },
    ],
    relatedProjectSlugs: [],
    relatedRoleSlugs: ["data-analytics", "technical-account-manager"],
    visible: true,
  },
  {
    id: "react-typescript-delivery",
    name: "React, TypeScript, and Vite delivery",
    category: "Frontend & Product Delivery",
    careerOsStatus: "Demonstrated",
    evidenceSummary:
      "I shipped CareerOS with React, TypeScript, Vite, responsive layouts, and direct-route support.",
    evidenceSources: [
      { type: "project", label: "CareerOS public beta", provider: "CareerOS", verified: true },
    ],
    relatedProjectSlugs: ["careeros"],
    relatedRoleSlugs: ["application-engineer", "software-engineer"],
    visible: true,
  },
  {
    id: "product-domain-modeling",
    name: "Product and domain modeling",
    category: "Frontend & Product Delivery",
    careerOsStatus: "Demonstrated",
    evidenceSummary:
      "I modeled CareerOS projects, roles, evidence states, and confidentiality rules as typed content.",
    evidenceSources: [
      { type: "project", label: "CareerOS public beta", provider: "CareerOS", verified: true },
    ],
    relatedProjectSlugs: ["careeros"],
    relatedRoleSlugs: ["application-engineer", "software-engineer"],
    visible: true,
  },
  {
    id: "supabase-auth-rls",
    name: "Supabase Postgres, Auth, and RLS",
    category: "APIs & Backend",
    careerOsStatus: "Practicing",
    evidenceSummary:
      "CareerOS uses passwordless Auth, immutable membership authorization, private Postgres records, RLS-protected RPCs, explicit public projections, versioned migrations, and rollback scripts.",
    evidenceSources: [
      { type: "project", label: "CareerOS Learning admin backend", provider: "CareerOS", verified: true },
    ],
    relatedProjectSlugs: ["careeros-learning-delivery"],
    relatedRoleSlugs: ["application-engineer", "software-engineer", "forward-deployed-engineer"],
    visible: true,
  },
  {
    id: "delivery-intelligence-visualization",
    name: "Delivery analytics and accessible visualization",
    category: "Data & Analytics",
    careerOsStatus: "Practicing",
    evidenceSummary:
      "A deterministic CareerOS model derives WIP, bounded throughput, compatible cycle time, truthful schedule states, and canonical evidence relationships without inventing missing dates.",
    evidenceSources: [
      { type: "project", label: "CareerOS Delivery Intelligence", provider: "CareerOS", verified: true },
    ],
    relatedProjectSlugs: ["careeros-learning-delivery"],
    relatedRoleSlugs: ["technical-account-manager", "application-engineer", "forward-deployed-engineer"],
    visible: true,
  },
  {
    id: "operational-incident-evidence",
    name: "Operational incident analysis and evidence",
    category: "Observability & Infrastructure",
    careerOsStatus: "Practicing",
    evidenceSummary:
      "CareerOS records separate, sanitized root-cause narratives for authorization, managed email throttling, and a Postgres function defect while keeping raw diagnostics private.",
    evidenceSources: [
      { type: "project", label: "CareerOS classified Bug Log", provider: "CareerOS", verified: true },
    ],
    relatedProjectSlugs: ["careeros-learning-delivery"],
    relatedRoleSlugs: ["senior-technical-support-engineer", "technical-account-manager", "application-engineer"],
    visible: true,
  },
];

export const developingSkills: Skill[] = [
  {
    id: "backend-testing-reviewed-delivery",
    name: "Backend testing and reviewed delivery",
    category: "Currently Developing",
    careerOsStatus: "Learning",
    evidenceSummary:
      "Next: deliver a regression test, logging improvement, or narrow fix through review.",
    evidenceSources: [
      { type: "lab", label: "Backend evidence plan", provider: "CareerOS", verified: true },
    ],
    relatedProjectSlugs: ["python-mongodb-debugging-lab"],
    relatedRoleSlugs: ["application-engineer", "software-engineer"],
    visible: true,
  },
  {
    id: "python-mongodb-tracing",
    name: "Python and MongoDB data-flow tracing",
    category: "Currently Developing",
    careerOsStatus: "Learning",
    evidenceSummary:
      "I traced a stale API response through structured logs, a Python query, and MongoDB fixtures. Next is to package the lab for a repeatable setup.",
    evidenceSources: [
      { type: "lab", label: "Locally validated Python/MongoDB debugging lab", provider: "CareerOS", verified: true },
    ],
    relatedProjectSlugs: ["python-mongodb-debugging-lab"],
    relatedRoleSlugs: ["application-engineer", "software-engineer"],
    visible: true,
  },
  {
    id: "implementation-deployment",
    name: "End-to-end implementation and deployment",
    category: "Currently Developing",
    careerOsStatus: "Learning",
    evidenceSummary:
      "Next: repeat implementation, testing, deployment, production debugging, and outcome ownership.",
    evidenceSources: [
      { type: "work", label: "Application Engineering to FDE development path", verified: true },
    ],
    relatedProjectSlugs: ["rallye-control"],
    relatedRoleSlugs: ["application-engineer", "software-engineer", "forward-deployed-engineer"],
    visible: true,
  },
];

export const learningProfiles: LearningProfile[] = [
  {
    provider: "Pluralsight",
    label: "Pluralsight public profile",
    url: "https://app.pluralsight.com/profile/stroupjason",
    publicVerified: true,
    description:
      "Public learning activity and interests.",
    actionLabel: "View public profile",
    visible: true,
  },
  {
    provider: "Microsoft Learn",
    label: "Microsoft Learn transcript",
    publicVerified: false,
    description: "Transcript content could not be verified in a public session.",
    actionLabel: "View transcript",
    visible: false,
  },
  {
    provider: "freeCodeCamp",
    label: "freeCodeCamp profile",
    publicVerified: false,
    description: "The supplied public profile URL currently returns 404.",
    actionLabel: "View public profile",
    visible: false,
  },
  {
    provider: "Coursera",
    label: "Coursera certificates",
    publicVerified: false,
    description: "Waiting for a public certificate share URL.",
    actionLabel: "View public profile",
    visible: false,
  },
  {
    provider: "DataCamp",
    label: "DataCamp accomplishments",
    publicVerified: false,
    description: "Waiting for a public profile or statement-of-accomplishment URL.",
    actionLabel: "View public profile",
    visible: false,
  },
];

export const capabilities: Array<{
  name: string;
  state: EvidenceState;
  evidence: string;
  supports: string[];
}> = [
  {
    name: "Customer-facing troubleshooting",
    state: "Demonstrated",
    evidence:
      "Enterprise SaaS support, escalation ownership, controlled reproduction, and clear customer communication.",
    supports: ["Senior TSE", "TAM", "CSE", "FDE"],
  },
  {
    name: "API and integration debugging",
    state: "Demonstrated",
    evidence:
      "REST, JSON, authentication, logs, data-quality investigation, Postman, Python, JavaScript, and SQL.",
    supports: ["Senior TSE", "CSE", "Application Engineer", "FDE"],
  },
  {
    name: "Linux systems and runtime investigation",
    state: "Demonstrated",
    evidence:
      "Linux patching, network rollback, permissions, configuration editing, logs, Docker, Grafana, Prometheus, and structured escalation packages.",
    supports: ["Senior TSE", "Application Engineer", "FDE"],
  },
  {
    name: "Data analysis and operational insight",
    state: "Demonstrated",
    evidence:
      "SQL, product/support analytics, dashboards, Redshift, Superset, QuickSight, Athena, and data storytelling.",
    supports: ["Data Analytics", "CSE", "TAM", "Value Engineering"],
  },
  {
    name: "Technical customer ownership",
    state: "Demonstrated",
    evidence:
      "Issue ownership, expectation-setting, stakeholder coordination, documentation, and translation between customers and engineering.",
    supports: ["TAM", "CSE", "Senior TSE", "FDE"],
  },
  {
    name: "Python backend code navigation",
    state: "Practicing",
    evidence:
      "Architecture-first backend development focused on reading, tracing, explaining, testing, and safely changing backend behavior.",
    supports: ["Application Engineer", "FDE", "Data Science"],
  },
  {
    name: "MongoDB data-flow tracing",
    state: "Practicing",
    evidence:
      "Active learning path connecting customer symptoms to code paths, queries, stored data, and testable hypotheses.",
    supports: ["Application Engineer", "FDE"],
  },
  {
    name: "Applied computer vision prototyping",
    state: "Demonstrated",
    evidence:
      "Built a Raspberry Pi/OpenCV motion-detection and tracking prototype with hardware actuation and state coordination.",
    supports: ["Data Science", "Application Engineer", "FDE"],
  },
  {
    name: "Reviewed backend contribution",
    state: "Learning",
    evidence:
      "The next evidence milestone is a small test, logging improvement, or defect fix completed through review.",
    supports: ["Application Engineer", "FDE"],
  },
  {
    name: "Statistical modeling and model evaluation",
    state: "Learning",
    evidence:
      "A future evidence track requiring public notebooks, experiment design, evaluation, and reproducible analysis—not just course completion.",
    supports: ["Data Science"],
  },
];

export const professionalEngagements: Project[] = [
  {
    slug: "healthcare-data-interpretation",
    professionalEngagement: true,
    title: "Healthcare Data Interpretation & Decision Support",
    shortTitle: "Healthcare Data Interpretation",
    type: "Anonymized professional engagement",
    status: "Ongoing analytical work",
    evidenceState: "Practicing",
    summary: "Translate ambiguous questions and dataset results into understandable findings, mappings, and practical next actions.",
    problem: "A dataset can contain results without making their business meaning or the next decision clear.",
    outcome: "Ongoing work interpreting results across datasets and connecting findings to business questions. Public examples and measured outcomes are pending.",
    approach: "I work from the question the user needs answered, interpret what each dataset can support, and map the results into findings and actions. The analytical work connects technical detail to the business decision while preserving uncertainty where a result needs more context.",
    stack: ["Dataset interpretation", "Data mapping", "Requirements analysis", "Decision support"],
    capabilities: ["Ambiguity management", "Analytical reasoning", "Business communication", "Data interpretation"],
    roleLinks: ["Data Analytics", "TAM", "CSE"],
    verifiedFacts: [
      "I interpret ambiguous dataset results in a healthcare-related professional context.",
      "My contribution includes connecting data findings to business meaning and next actions.",
    ],
    unknowns: ["Public example datasets and mappings", "Measured decision or operational outcomes"],
    proofNote: "Professional summary based on my account. Public supporting artifacts are pending.",
    nextProof: "Create a fictional dataset example showing the question, mapping decisions, findings, and resulting action.",
  },
  {
    slug: "incident-automation-observability",
    professionalEngagement: true,
    title: "Incident Automation & Azure Observability",
    shortTitle: "Incident Automation",
    type: "Anonymized professional engagement",
    status: "Deployed operational tooling",
    evidenceState: "Demonstrated",
    summary: "Connect incident workflows, severity classification, operational dashboards, and team routing to reduce manual coordination.",
    problem: "Incident context and updates spread across support, incident management, and engineering systems create repeated handoffs.",
    outcome: "An Azure-backed observability tool is deployed for outage classification and routing across P1–P3 severity levels. Workflow integrations and dashboard work support incident coordination; quantified time savings are pending.",
    approach: "I build integrations across CRM, incident-management, and engineering work-tracking tools so incident context can move between teams. My work includes outage classification and routing, Grafana customer dashboards, and incident.io metrics dashboards and templates. The aim is a clearer operational picture and less manual coordination during incidents.",
    stack: ["Salesforce", "incident.io", "Azure DevOps", "Azure monitoring", "Grafana", "Workflow automation"],
    capabilities: ["Systems integration", "Observability", "Incident coordination", "Severity classification", "Dashboard design"],
    roleLinks: ["Senior TSE", "Application Engineer", "TAM", "FDE"],
    verifiedFacts: [
      "I have built incident workflow integrations and metrics dashboards and templates.",
      "The Azure-backed observability tool has been deployed for severity classification and routing.",
      "I have built customer dashboards in Grafana.",
    ],
    unknowns: ["Measured time saved", "Public demonstration and test artifacts", "Public operational reliability results"],
    proofNote: "Professional summary based on my account. Public supporting artifacts are pending.",
    nextProof: "Build an independent fictional incident example that demonstrates classification, handoff, and status updates.",
  },
  {
    slug: "service-operations-reporting",
    professionalEngagement: true,
    title: "Service Operations Reporting & Automation",
    shortTitle: "Service Operations Insights",
    type: "Anonymized professional engagement",
    status: "Reporting work in progress",
    evidenceState: "Practicing",
    summary: "Turn user requirements, ticket data, and queue activity into Power BI reporting and Power Automate workflows.",
    problem: "Operational activity needs interpretation before teams can decide what to prioritize or investigate.",
    outcome: "Active dashboard and reporting work connects user requirements to findings about tickets and queue activity. Public outputs and quantified impact are pending.",
    approach: "I translate the user's question into reporting requirements, map relevant data to the measures needed, and present findings in Power BI. Power Automate supports reporting workflows so users can act on the information. The emphasis is making the relationship between a requirement, a measure, and a decision understandable.",
    stack: ["Power BI", "Power Automate", "Requirements analysis", "Data mapping", "Operational reporting"],
    capabilities: ["Business intelligence", "Requirements translation", "Workflow automation", "Actionable reporting"],
    roleLinks: ["Data Analytics", "TAM", "CSE", "Application Engineer"],
    verifiedFacts: [
      "I translate user requirements into Power BI dashboard and Power Automate reporting work.",
      "The reporting focuses on findings, ticket activity, and user queues.",
    ],
    unknowns: ["Public dashboard examples", "Approved metric definitions", "Measured operational impact"],
    proofNote: "Professional summary based on my account. Public supporting artifacts are pending.",
    nextProof: "Create a synthetic ticket dataset and an original report demonstrating requirements, measures, findings, and recommended actions.",
  },
  {
    slug: "cybersecurity-saas-investigation",
    professionalEngagement: true,
    title: "Cybersecurity SaaS & Integration Investigation",
    shortTitle: "Cybersecurity SaaS",
    type: "Anonymized professional engagement",
    status: "Professional support experience",
    evidenceState: "Demonstrated",
    summary: "Investigate authentication, integration, data-quality, and runtime issues in a cybersecurity SaaS context.",
    problem: "Customer-facing issues can cross API, authentication, data, and system boundaries before the cause becomes clear.",
    outcome: "Professional troubleshooting and escalation experience supports structured investigation, clearer communication, and technical follow-through. Public case artifacts and measured outcomes are pending.",
    approach: "I narrow symptoms, investigate API and authentication behavior, examine logs and data flow, and communicate findings and next steps. Linux administration and runtime investigation support the diagnosis, while structured escalation gives engineering a clearer problem to work from.",
    stack: ["REST APIs", "Authentication", "Linux", "Logs", "Data-quality investigation"],
    capabilities: ["Technical troubleshooting", "Customer communication", "Systems investigation", "Escalation ownership"],
    roleLinks: ["Senior TSE", "CSE", "Application Engineer"],
    verifiedFacts: [
      "My professional experience includes cybersecurity SaaS troubleshooting and customer issue ownership.",
      "My investigations span APIs, authentication, logs, integrations, and data quality.",
    ],
    unknowns: ["Public independent reproduction", "Measured outcomes and reviewed case artifacts"],
    proofNote: "Professional summary based on my account. Public supporting artifacts are pending.",
    nextProof: "Write an original fictional investigation showing symptom, hypothesis, validation, and customer-facing next steps.",
  },
];

export const projects: Project[] = [
  {
    slug: "careeros",
    title: "CareerOS",
    shortTitle: "CareerOS",
    type: "Portfolio product / career evidence system",
    status: "Public beta live",
    evidenceState: "Demonstrated",
    summary:
      "A live recruiter-first portfolio that connects projects, role fit, and honest proof states.",
    problem:
      "Traditional resumes fragment hybrid technical experience and rarely show how learning becomes applied capability over time.",
    outcome:
      "A deployed Vite/React product with typed content, client-side routing, responsive design, and public-safe evidence boundaries.",
    approach:
      "I treated the portfolio as a product rather than a static resume. I modeled shared project and role data, built reusable page components, configured direct-route handling and canonical metadata, and checked the final experience across content, accessibility, privacy, build quality, and deployment. The result keeps one professional story while letting recruiters reach the most relevant proof quickly. I also kept unfinished evidence visible without turning it into a claim.",
    stack: ["React", "TypeScript", "Vite", "Product design", "Career evidence"],
    capabilities: [
      "Product discovery",
      "Domain modeling",
      "Frontend engineering",
      "Technical writing",
      "Privacy design",
    ],
    roleLinks: [
      "Application Engineer",
      "Data Analytics",
      "TAM",
      "CSE",
      "FDE",
    ],
    verifiedFacts: [
      "I built and deployed the public beta at www.jasonstroup.website.",
      "The React/TypeScript site uses typed project and role data with direct-route support.",
      "I use named proof states instead of unsupported readiness percentages.",
      "The public product remains separate from private career evidence.",
    ],
    unknowns: [
      "Long-term database and authentication architecture",
      "Validated user demand beyond the first user",
      "Measured impact on job-search outcomes",
    ],
    proofNote: "The live product is the primary artifact for this project.",
    nextProof: "Add a concise product decision note after the public beta produces real feedback.",
    liveUrl: "https://www.jasonstroup.website",
    liveLabel: "View live product",
    sourceUrl: "https://github.com/stroupjason/jason-stroup-careeros",
    ownership: {
      statement: "Built and operated by Jason Stroup.",
      summary:
        "Jason owns the product strategy, domain model, implementation decisions, testing, deployment, production verification, and continued development of CareerOS.",
    },
    proofLinks: [
      {
        label: "CareerOS Learning & Delivery project",
        href: "/projects/careeros-learning-delivery",
      },
      { label: "Public Learning board", href: "/learning/board" },
      { label: "Roadmap", href: "/roadmap" },
      {
        label: "GitHub source",
        href: "https://github.com/stroupjason/jason-stroup-careeros",
        external: true,
      },
    ],
  },
  {
    slug: "automatic-nerf-turret",
    title: "Automatic Nerf Turret",
    shortTitle: "Nerf Turret",
    type: "Personal computer vision / edge prototype",
    status: "Completed prototype",
    evidenceState: "Demonstrated",
    summary:
      "A working Raspberry Pi/OpenCV prototype that joined motion detection, tracking, state management, and hardware control.",
    problem:
      "Coordinate real-time visual detection with physical tracking and actuation in a constrained edge-computing environment.",
    outcome:
      "A working personal prototype validated end to end across camera input, software logic, state coordination, and physical movement.",
    approach:
      "I combined camera input, OpenCV processing, motion logic, state coordination, and servo control on a Raspberry Pi. The key challenge was keeping visual detection and physical movement working as one system under edge-compute constraints. I iterated across software and hardware together, then tested the complete path instead of treating detection, tracking, and actuation as isolated pieces. That end-to-end debugging under constraint was the central engineering lesson.",
    stack: [
      "Python",
      "OpenCV",
      "Raspberry Pi",
      "Linux",
      "SQLAlchemy",
      "Servo control",
    ],
    capabilities: [
      "Computer vision",
      "Rapid prototyping",
      "Hardware/software integration",
      "Real-time debugging",
      "State coordination",
    ],
    roleLinks: ["Data Science", "Application Engineer", "CSE", "FDE"],
    verifiedFacts: [
      "I built the prototype with Python on Linux and Raspberry Pi.",
      "I used OpenCV for motion detection and object tracking.",
      "I implemented 360-degree tracking behavior and servo-driven movement.",
      "I tested the camera, software logic, state coordination, and hardware together.",
    ],
    unknowns: [
      "Exact build date",
      "Specific camera, servo, and mechanical component models",
      "Surviving source-code or repository link",
      "Measured latency, tracking accuracy, or reliability metrics",
      "Reviewed public demonstration video",
    ],
    proofNote: "An approved original photo shows the assembled capstone prototype.",
    nextProof: "Review original demo footage and document the engineering lessons from the prototype.",
    media: [
      {
        src: "/projects/automatic-nerf-turret/prototype.jpg",
        alt: "Blue and orange Nerf toy mounted on a wooden prototype stand.",
        caption: "Original capstone photo of the assembled prototype.",
        width: 4032,
        height: 3024,
      },
    ],
  },
  {
    slug: "rallye-control",
    title: "Rallye Control — Solar Trailer Telemetry",
    shortTitle: "Rallye Control",
    type: "Personal edge / IoT systems project",
    status: "Active build",
    evidenceState: "Practicing",
    summary:
      "An off-grid solar trailer build exploring how power visibility and edge computing can support cleaner, more efficient energy use.",
    problem:
      "Understand solar input, battery state, and everyday power demand when connectivity and energy are limited.",
    outcome:
      "An active trailer build with electrical planning, a documented monitoring concept, and a defined first power-observation exercise. Measured telemetry and field results are still pending.",
    approach:
      "My interest in energy conservation starts with understanding where power comes from and where it goes. I’m building Rallye Control around small, observable steps: document the power setup, record a routine load, and compare what the display reports before, during, and after use. Raspberry Pi monitoring is the next integration step. I want useful information in the field even when internet access is limited.",
    architecture: {
      title: "From solar input to useful power",
      caption:
        "Concept reconstructed from the project planning notes. Component connections and data access still need field verification.",
      steps: [
        "Solar input",
        "Portable power station",
        "Routine appliance load",
        "Display observations",
      ],
    },
    ownership: {
      statement: "A personal build motivated by energy conservation.",
      summary:
        "I’m exploring cleaner, more efficient power through practical systems integration, careful observation, and an off-grid trailer build.",
    },
    stack: [
      "Solar power planning",
      "Manual power observations",
      "Raspberry Pi (in development)",
      "MQTT (learning)",
      "ESP32 (planned)",
      "Python/FastAPI (learning)",
      "Docker (learning)",
      "React Native/Expo (planned)",
    ],
    capabilities: [
      "IoT architecture",
      "Telemetry",
      "Observability",
      "Edge computing",
      "Systems integration",
      "Offline-first thinking",
    ],
    roleLinks: [
      "Data Analytics",
      "Application Engineer",
      "CSE",
      "FDE",
    ],
    verifiedFacts: [
      "The personal trailer project has documented electrical planning and a Raspberry Pi monitoring roadmap.",
      "The design treats the Raspberry Pi as a monitoring and convenience layer.",
      "The first measurement exercise will compare power-display observations around a routine load.",
      "MQTT, ESP32, backend services, and mobile control have individual development states below.",
    ],
    unknowns: [
      "Battery, panel, inverter, and telemetry hardware specifications",
      "Current sensor inventory and message schema",
      "Which planned services are already running",
      "Measured telemetry, alerting, and field-reliability outcomes",
      "Public repository, photographs, architecture diagram, and demo links",
    ],
    proofNote: "The concept is documented. An owned trailer photo and measured field observations are the next artifacts.",
    nextProof: "Capture one owned photo of the power setup and log display readings before, during, and after a routine load.",
    detailSections: [
      {
        kicker: "Design decision",
        title: "Start with observations the hardware can support",
        state: "Practicing",
        summary:
          "The first useful result is a clear picture of one load and the power available to run it.",
        items: [
          "Record the actual power source, load, and display used for the observation.",
          "Keep power monitoring useful locally when internet access is unavailable.",
          "Verify the available hardware interface before choosing a telemetry protocol.",
        ],
      },
      {
        kicker: "Next experiment",
        title: "One load, three observations",
        state: "Planned",
        summary:
          "Use the same routine load and compare a baseline, steady use, and recovery after the load is removed.",
        items: [
          "Record timestamps, solar input, output power, and battery state when the display exposes those values.",
          "Note conditions and capture an original display photo alongside the readings.",
          "Leave unavailable values blank and describe what the observations can establish.",
        ],
      },
    ],
    subsystems: [
      {
        name: "Solar and power telemetry",
        state: "Practicing",
        detail:
          "Power-system planning and observation design are active. Recorded field measurements are pending.",
      },
      {
        name: "Raspberry Pi edge environment",
        state: "Practicing",
        detail:
          "Monitoring architecture is in development. A working data connection and reproducible runtime artifact are pending.",
      },
      {
        name: "MQTT data flow",
        state: "Learning",
        detail:
          "Message design and reliable local telemetry flow require documented implementation evidence.",
      },
      {
        name: "ESP32 sensor nodes",
        state: "Planned",
        detail:
          "Sensor-node architecture remains a future subsystem until hardware and evidence are documented.",
      },
      {
        name: "Python/FastAPI and Docker services",
        state: "Learning",
        detail:
          "Backend and deployment architecture are part of the active engineering roadmap.",
      },
      {
        name: "React Native/Expo mobile control",
        state: "Planned",
        detail:
          "Cross-platform iPadOS/iOS and Android experience is a later product milestone.",
      },
    ],
  },
  {
    slug: "careeros-analytics-integrations",
    title: "CareerOS Analytics & Integrations",
    shortTitle: "CareerOS Analytics",
    type: "Platform & Integrations",
    status: "Active",
    evidenceState: "Practicing",
    visibility: "Public",
    summary:
      "A privacy-conscious analytics and integration layer for CareerOS that measures portfolio engagement, preserves campaign attribution, supports operational decision-making, and creates a foundation for secure lead capture and future CRM workflows.",
    problem:
      "CareerOS needs enough trustworthy product signal to improve recruiter journeys and campaign decisions without collecting personal details, exposing private configuration, or installing every possible marketing tool.",
    outcome:
      "The production domain, Vercel dashboard foundation, React instrumentation, typed event taxonomy, UTM handling, privacy preference, and canonical metadata are deployed. Production page-view and dashboard result confirmation remains the Phase 1 gate; behavior analytics, inquiry capture, and CRM evaluation remain explicitly planned.",
    approach:
      "I translated practical portfolio questions into a small event taxonomy, integrated the framework-specific Vercel Analytics client, and limited campaign handling to allowlisted UTM fields. The client honors browser Do Not Track by default, provides a persistent anonymous-usage preference, removes arbitrary query data from analytics URLs, and keeps campaign attribution session-scoped. One phased initiative holds the implementation and future integration work so the public status stays accurate as evidence changes.",
    stack: [
      "Vercel",
      "React",
      "TypeScript",
      "Web Analytics",
      "Product Analytics",
      "UTM Attribution",
      "Privacy",
      "Integrations",
      "Google Sheets (Planned)",
    ],
    capabilities: [
      "Event taxonomy design",
      "Frontend instrumentation",
      "Campaign attribution",
      "Privacy-aware measurement",
      "Observability",
      "Integration architecture",
      "Production verification",
      "Operational documentation",
    ],
    roleLinks: [
      "Senior TSE",
      "TAM",
      "CSE",
      "Data Analytics",
      "Application Engineer",
      "FDE",
    ],
    verifiedFacts: [
      "CareerOS runs on a Vercel Pro team with www.jasonstroup.website as the production custom domain.",
      "Vercel Web Analytics is enabled for the production project.",
      "The production deployment includes the official React analytics integration and a typed, low-cardinality interaction taxonomy.",
      "The live project route loads the Vercel insights script from the canonical domain, refreshes directly, and introduces no browser-console or Vercel runtime errors.",
      "Campaign handling is limited to normalized UTM fields; arbitrary query parameters, URL fragments, and personal form data are excluded.",
      "GA4, Microsoft Clarity, Search Console, inquiry capture, Google Sheets, HubSpot, and the LinkedIn Insight Tag are not presented as live.",
    ],
    unknowns: [
      "Production event results in the correct Vercel dashboard remain the final PORT-005 completion gate.",
      "Whether GA4 or Microsoft Clarity would add enough decision value to justify additional consent and performance cost.",
      "The final secure inquiry workflow and whether a later CRM migration is warranted.",
    ],
    proofNote:
      "The public route, source implementation, analytics runbook, and phased roadmap are the current artifacts; private visitor totals and administrator views stay private.",
    nextProof:
      "Verify production page-view and custom-event results in the correct Vercel dashboard, then complete PORT-005 and move discovery analytics to the next active phase.",
    detailSections: [
      {
        kicker: "Privacy and security",
        title: "Measure decisions without collecting identities",
        state: "Demonstrated",
        summary:
          "The implementation uses Vercel's cookie-free Web Analytics foundation and adds client-side boundaries for this portfolio.",
        items: [
          "Honor browser Do Not Track unless a visitor explicitly chooses a local preference.",
          "Offer a persistent anonymous-usage toggle without collecting an account or identity.",
          "Strip arbitrary query parameters and fragments before analytics events are sent.",
          "Keep future inquiry and Sheets credentials behind same-origin server endpoints rather than browser code.",
        ],
      },
      {
        kicker: "Events and attribution",
        title: "A compact taxonomy tied to portfolio questions",
        state: "Practicing",
        summary:
          "Automatic route views are paired with a typed set of meaningful interactions and session-scoped campaign context.",
        items: [
          "Track project opens, role-lens opens, primary calls to action, and public-profile visits.",
          "Use fixed event names, controlled locations, and project or role slugs instead of free-form visitor data.",
          "Normalize LinkedIn and other campaign UTMs, retain them for the browser session, and omit high-risk arbitrary parameters.",
          "Reserve successful inquiry analytics for the later server-validated submission flow.",
        ],
      },
      {
        kicker: "Verification",
        title: "Production evidence is the completion gate",
        state: "Practicing",
        summary:
          "A package install, passing build, or deployment does not complete the analytics phase by itself.",
        items: [
          "Typecheck, Vercel's production build, direct-route refresh, responsive layouts, keyboard behavior, and console/runtime checks pass for the deployed implementation.",
          "The production route loads the official Vercel insights script from the canonical domain with a successful response.",
          "Confirm page views and typed custom events appear in the correct Vercel dashboard before closing PORT-005.",
          "Keep private totals, visitor details, account identifiers, and administrator URLs out of the portfolio.",
        ],
      },
      {
        kicker: "Next integrations",
        title: "Evaluate added tracking only when it earns its cost",
        state: "Planned",
        summary:
          "Later tools remain evaluation or delivery milestones, not claims of active integrations.",
        items: [
          "Evaluate consent-gated GA4, Microsoft Clarity privacy masking, and Search Console verification.",
          "Build a same-origin inquiry endpoint with Turnstile and a signed server-to-server Sheets workflow.",
          "Evaluate HubSpot and the LinkedIn Insight Tag only when campaign reporting justifies the privacy, performance, and cost tradeoffs.",
        ],
      },
    ],
    initiative: {
      status: "Active",
      started: "August 7, 2026",
      currentPhase: "Analytics implementation",
      summary:
        "Build a privacy-conscious measurement and integration foundation for CareerOS, then add discovery and conversion systems only after each layer is verified.",
      relatedTickets: ["PORT-005", "PORT-006"],
      phases: [
        {
          phase: "00",
          title: "Foundation",
          status: "Completed",
          summary: "Production hosting, domain, and dashboard foundation are verified.",
          milestones: [
            "Vercel team upgraded to Pro",
            "jasonstroup.website connected",
            "Production custom domain established",
            "Vercel Web Analytics enabled in the dashboard",
          ],
        },
        {
          phase: "01",
          title: "Analytics implementation",
          status: "Active",
          ticket: "PORT-005",
          summary:
            "Implement privacy-conscious analytics and attribution, then verify both production requests and dashboard results.",
          milestones: [
            "Framework-specific Vercel Analytics integration",
            "SPA page-view verification",
            "Typed custom-event instrumentation",
            "LinkedIn UTM strategy",
            "Privacy and consent controls",
            "Canonical-domain metadata",
            "Analytics documentation",
            "Production request and dashboard verification",
          ],
          completedMilestones: [
            "Framework-specific Vercel Analytics integration",
            "Typed custom-event instrumentation",
            "LinkedIn UTM strategy",
            "Privacy and consent controls",
            "Canonical-domain metadata",
            "Analytics documentation",
          ],
        },
        {
          phase: "02",
          title: "Discovery and behavior analytics",
          status: "Next",
          summary:
            "Evaluate deeper behavior and search discovery signals after the lightweight analytics layer is proven.",
          milestones: [
            "GA4 property and Measurement ID configuration",
            "Microsoft Clarity configuration",
            "Consent-gated loading",
            "Clarity privacy masking",
            "Google Search Console domain verification",
            "Monthly analytics-review workflow",
          ],
        },
        {
          phase: "03",
          title: "Secure inquiry capture",
          status: "Planned",
          ticket: "PORT-006",
          summary:
            "Create a secure conversion path with server-side validation and private lead storage.",
          milestones: [
            "Custom CareerOS inquiry form",
            "Same-origin Vercel server endpoint",
            "Cloudflare Turnstile",
            "Signed Google Apps Script webhook",
            "Private Google Sheets lead storage",
            "Email notification",
            "UTM attribution preservation",
            "Privacy-safe successful-submission analytics",
          ],
        },
        {
          phase: "04",
          title: "CRM and marketing evaluation",
          status: "Planned",
          summary:
            "Evaluate added marketing infrastructure only when measured campaign needs justify it.",
          milestones: [
            "Evaluate HubSpot Free CRM migration",
            "Evaluate LinkedIn Insight Tag",
            "Assess whether campaign reporting justifies additional tracking",
            "Review consent, privacy, performance, and cost",
            "Preserve Google Sheets as an exportable migration source",
          ],
        },
      ],
    },
  },
  {
    slug: "careeros-learning-delivery",
    title: "CareerOS Learning & Delivery System",
    shortTitle: "Learning & Delivery",
    type: "Career evidence and delivery system",
    status: "Active",
    evidenceState: "Practicing",
    visibility: "Public",
    summary:
      "A data-driven CareerOS capability that turns learning goals into planned work, captures execution history and blockers, links artifacts to skills and target roles, and publishes only reviewed evidence as recruiter-safe portfolio proof.",
    problem:
      "Course lists and static skill sections show intent, but they do not explain how learning is planned, applied, reviewed, or converted into evidence a recruiter can inspect.",
    outcome:
      "CareerOS now has a typed public workflow, a verified single-admin workspace, durable ticket controls, approved public projections, honest SQL and CU coursework records, and a Delivery Intelligence release in production review.",
    approach:
      "I separated delivery status, roadmap status, evidence maturity, and publication visibility so each concept can change without inflating the others. Supabase stores authorized private authoring records while an explicit allowlist projects approved public fields. Runtime validation and focused tests reject missing approval, stale writes, broken relationships, dependency cycles, incomplete Done tickets, and unverified course or evidence claims.",
    stack: [
      "React",
      "TypeScript",
      "Vite",
      "Vitest",
      "Delivery modeling",
      "Evidence design",
      "Privacy review",
      "Supabase Postgres and Auth",
    ],
    capabilities: [
      "Workflow design",
      "Typed domain modeling",
      "Evidence architecture",
      "Public/private data boundaries",
      "Accessible frontend delivery",
      "Validation and testing",
    ],
    roleLinks: [
      "Senior TSE",
      "TAM",
      "CSE",
      "Data Analytics",
      "Application Engineer",
      "FDE",
    ],
    verifiedFacts: [
      "The public data model separates delivery, roadmap, evidence, and visibility states.",
      "Every public learning record requires explicit human approval and a truth boundary.",
      "The public board is read-only; authenticated editing is enforced through an immutable admin membership and database policies.",
      "Passwordless sign-in, the authorization helper, repaired seed functions, and authorized Admin mode were verified in production on August 8, 2026.",
      "Separate canonical Bugs preserve the authorization, email-throttle, and database-function incidents without publishing raw diagnostics.",
      "Delivery metrics and timeline states are deterministic and keep missing date windows explicitly unscheduled.",
      "Healthcare SQL seed tickets remain uncompleted and contain no course certificate, query result, or applied-project outcome.",
      "Focused tests cover identifiers, relationships, dependency cycles, publication rules, filters, routes, chronology, and seed truthfulness.",
    ],
    unknowns: [
      "Which admin review cadence will remain useful after several real learning cycles",
      "Whether an optional portable export adds value beyond database backup and the checked-in fallback",
      "Measured recruiter or job-search impact",
    ],
    proofNote:
      "The typed source, validation tests, public routes, and setup documentation are the current artifacts. Private work notes and external board details remain outside the public site.",
    nextProof:
      "Apply and verify the operations migration, complete anonymous and non-admin denial checks, then exercise one reversible SQL-002 mutation without inventing missing work facts.",
    liveUrl: "https://www.jasonstroup.website/learning",
    detailSections: [
      {
        kicker: "Model",
        title: "From objective to reviewed evidence",
        state: "Practicing",
        summary:
          "Initiatives establish direction; tickets define delivery gates; sessions record what happened; artifacts support capabilities and role lenses.",
        items: [
          "Keep delivery status independent from evidence maturity.",
          "Derive milestone counts and actual effort from source records.",
          "Require completion dates and linked evidence for Done public tickets.",
          "Carry a visible truth boundary on every public initiative, ticket, session, and artifact.",
        ],
      },
      {
        kicker: "Publication boundary",
        title: "Private operations, deliberate public proof",
        state: "Demonstrated",
        summary:
          "The browser receives only reviewed public records; raw notes, credentials, private URLs, and external issue identifiers are excluded.",
        items: [
          "No private-schema row or privileged Supabase credential enters the browser bundle.",
          "Publication requires visibility Public, explicit approval, a safe summary, and a truth boundary.",
          "Validation rejects forbidden private fields and sensitive source text.",
          "Human review remains mandatory even if a future export adapter is added.",
        ],
      },
      {
        kicker: "Admin boundary",
        title: "Durable authoring with an explicit public projection",
        state: "Practicing",
        summary:
          "Supabase stores private authoring records, while public visitors receive only approved fields and a static fallback remains available.",
        items: [
          "Use only the project URL and publishable key in Vite configuration.",
          "Authorize Jason by immutable authenticated user ID.",
          "Reject stale writes and retain append-only mutation history.",
          "Keep the checked-in public snapshot as a portable recovery path.",
        ],
      },
      {
        kicker: "Verification",
        title: "Tests enforce the important claims",
        state: "Practicing",
        summary:
          "The implementation combines type checking, runtime validation, focused automated tests, and responsive browser review.",
        items: [
          "Check unique identifiers, references, dependency cycles, and completion rules.",
          "Reject unapproved records and raw private export shapes.",
          "Verify board filters, valid and unknown ticket routes, and chronological ordering.",
          "Confirm the healthcare seed never appears completed or demonstrated without real evidence.",
        ],
      },
    ],
    initiative: {
      status: "Active",
      started: "August 7, 2026",
      currentPhase: "Delivery Intelligence and operations verification",
      summary:
        "Extend the reliable public workflow with durable private authoring and a human-reviewed publishing path.",
      relatedTickets: ["PRODUCT-201–206", "PRODUCT-211–218"],
      phases: [
        {
          phase: "01",
          title: "Workflow and evidence model",
          status: "Completed",
          summary: "Create separate typed models for delivery, roadmap, evidence, visibility, sessions, and publication approval.",
          milestones: ["Typed public data model", "Relationship validation", "Publication approval gate", "Truth-boundary requirement"],
        },
        {
          phase: "02",
          title: "Public learning board and ticket routes",
          status: "Completed",
          summary: "Ship the overview, read-only board, ticket details, timeline, filters, responsive behavior, and focused tests.",
          milestones: ["Learning overview", "Read-only board", "Ticket detail routes", "Evidence timeline", "Responsive and automated checks"],
        },
        {
          phase: "03",
          title: "Secure Supabase authoring workspace",
          status: "Active",
          ticket: "PRODUCT-216",
          summary: "Preserve the verified single-admin activation while completing denial, rollback, mutation, and persistence checks.",
          milestones: ["Approved free project reused", "Single-admin access verified", "Seed repair released", "Remaining security matrix open"],
        },
        {
          phase: "04",
          title: "Healthcare SQL initiative",
          status: "Next",
          ticket: "PRODUCT-217",
          summary: "Begin the real SQL baseline, course verification, dataset selection, and Five-Minute Evidence Capture workflow.",
          milestones: ["First real work session", "Course context verified", "Synthetic dataset selected", "Applied investigation started"],
        },
        {
          phase: "05",
          title: "Allowlisted CareerOS publishing workflow",
          status: "Active",
          summary: "Refresh public DTOs transactionally while preserving explicit human approval and a checked-in recovery snapshot.",
          milestones: ["Explicit DTO allowlist", "Publication approval", "Static fallback", "Rollback procedure"],
        },
        {
          phase: "06",
          title: "Delivery Intelligence and operational evidence",
          status: "Active",
          summary: "Add canonical metrics, a truthful portfolio timeline, an evidence map, compact Learning pulse, and a classified Bug Log.",
          milestones: ["Metric definitions", "Portfolio timeline", "Evidence Delivery Map", "Admin-only Bug Log", "Production verification"],
        },
      ],
    },
  },
  {
    slug: "healthcare-sql-customer-operations",
    title: "Healthcare Customer Operations SQL Case Study",
    shortTitle: "Healthcare SQL",
    type: "Applied SQL and technical account case study",
    status: "Active planning",
    evidenceState: "Learning",
    visibility: "Public",
    summary:
      "An applied SQL and technical-account-management case study using synthetic healthcare data to investigate data quality, explain customer impact, structure a root-cause analysis, and recommend a practical action plan.",
    problem:
      "Build evidence that connects SQL mechanics to customer judgment: data quality, hypothesis testing, impact communication, mitigation, durable remediation, and accountable follow-up.",
    outcome:
      "The initiative, public-safe seed tickets, dependency order, completion gates, and SQL Essential Training course record are defined. A screenshot-supported snapshot verifies 30 minutes 18 seconds completed out of 4 hours 36 minutes, which derives to 11 percent progress. No completion, certificate, SQL session, query, finding, or finished deliverable is claimed.",
    approach:
      "The work begins with SQL Essential Training and a candid SQL baseline. Dataset selection and licensing follow, using only a small synthetic or public sample. The applied phase will profile quality, investigate an explicitly fictional incident, produce a technical-account action plan, test reproducibility, and publish only after evidence and privacy review pass.",
    stack: ["SQL", "Synthetic healthcare data", "Data quality", "Root-cause analysis", "Technical account planning", "Reproducibility"],
    capabilities: ["SQL", "Healthcare data", "Data-quality investigation", "Root-cause analysis", "Customer-risk management", "Executive communication"],
    roleLinks: ["TAM", "Data Analytics", "CSE", "Senior TSE"],
    verifiedFacts: [
      "The public initiative and seed backlog exist.",
      "SQL Essential Training by Walter Shields is recorded as an in-progress LinkedIn Learning course and linked to SQL-002.",
      "A user-provided screenshot observed August 7, 2026 verifies a duration-derived 11 percent progress snapshot.",
      "SQL-002 is in progress; SQL-001 and SQL-004 are ready; applied project work remains in the backlog.",
      "The project requires synthetic or public data and explicitly excludes PHI, PII, employer data, and real customer information.",
      "Course completion supports foundational knowledge, while reviewed applied SQL work is the stronger capability evidence.",
    ],
    unknowns: [
      "Remaining modules, completion date, and certificate availability",
      "Final synthetic dataset, license, version, and sample size",
      "SQL environment and setup details",
      "Fictional incident scenario, queries, findings, and action plan",
      "Public repository, artifact links, and completion date",
    ],
    proofNote:
      "The course record and approved plan exist. There is no verified course completion, certificate, SQL script, query output, case-study result, or shareable brief yet.",
    nextProof:
      "Finish only the remaining SQL Essential Training course work and record original learning notes before closing SQL-002.",
  },
  {
    slug: "python-mongodb-debugging-lab",
    title: "Python/MongoDB Debugging Lab",
    shortTitle: "Backend Debugging Lab",
    type: "Independent engineering lab",
    status: "Validated locally",
    evidenceState: "Practicing",
    summary:
      "A fictional greenhouse service for practicing code tracing, MongoDB debugging, and automated regression testing.",
    problem:
      "Create a safe, independent environment for demonstrating the complete path from customer symptom to code, data, test, fix, and validation.",
    outcome:
      "The initial regression reproduced a stale reading. After correcting the sort order, all three tests passed and an HTTP smoke test returned the newest reading.",
    approach:
      "I traced the response through structured logs, the Flask request handler, and MongoDB fixtures, then added a regression test and corrected the query. The tests ran against a local MongoDB instance.",
    stack: ["Python", "Flask", "MongoDB", "Docker Compose", "unittest", "Structured logs"],
    capabilities: [
      "Backend debugging",
      "Regression testing",
      "Data-flow tracing",
      "Local validation",
      "Technical documentation",
    ],
    roleLinks: ["Senior TSE", "Application Engineer", "FDE"],
    verifiedFacts: [
      "The lab uses fictional greenhouse readings and original code.",
      "An integration test reproduced the stale response against MongoDB before the query was corrected.",
      "After the fix, three tests passed and direct HTTP requests confirmed the newest reading and the missing-station response.",
    ],
    unknowns: [
      "Public source repository and deployment URL",
      "Container runtime validation",
    ],
    proofNote: "The lab runs locally. Public source and a hosted demo are pending.",
    nextProof: "Validate the Compose workflow and prepare reviewed source and test instructions.",
  },
  {
    slug: "network-reliability-cloud-troubleshooting-lab",
    title: "Network Reliability & Cloud Troubleshooting Lab",
    shortTitle: "Network Reliability Lab",
    type: "Independent networking and cloud troubleshooting lab",
    status: "Planned evidence stream",
    evidenceState: "Planned",
    visibility: "Public",
    summary:
      "A planned public-safe evidence stream connecting CU Boulder network systems coursework to original packet-flow, Linux networking, cloud architecture, and failure-recovery exercises.",
    problem:
      "Course progress can show learning activity, but customer-facing technical engineering claims need independent, reproducible troubleshooting evidence.",
    outcome:
      "The pathway, three course tickets, and independent practice backlog are defined. No lab artifact or applied networking outcome is complete yet.",
    approach:
      "Build the evidence in stages: an original network-stack and packet-flow exercise, a Linux troubleshooting lab and customer-facing runbook, then a cloud network architecture with one isolated failure and verified recovery. Publish a case study only after the artifacts are created, tested, and reviewed independently from graded course work.",
    stack: ["TCP/IP", "Linux networking", "Cloud networking", "Network troubleshooting", "Technical documentation"],
    capabilities: ["Networking fundamentals", "Linux networking", "Cloud architecture", "Troubleshooting", "Customer communication"],
    roleLinks: ["TAM", "CSE", "Senior TSE", "Application Engineer", "FDE"],
    verifiedFacts: [
      "Jason stated that he is enrolled in CSCA 5063, CSCA 5073, and CSCA 5083.",
      "A supplied Coursera screenshot dated August 8, 2026 verifies 20 percent course progress for CSCA 5063 only.",
      "The planned artifacts are independent demonstrations and exclude graded assessments, restricted prompts, and instructor solutions.",
    ],
    unknowns: [
      "Provider completion, grades, for-credit status, and earned-credit applicability",
      "Final lab environments, tooling, repository, test results, and publication date",
      "Whether infrastructure as code fits the actual cloud networking work",
    ],
    proofNote:
      "Only the linked learning records and planned ticket hierarchy exist. No networking artifact is represented as completed or demonstrated.",
    nextProof:
      "Continue CSCA 5063 and independently create a reproducible packet-flow or protocol-troubleshooting exercise.",
  },
  ...professionalEngagements,
];

export const roleLenses: RoleLens[] = [
  {
    slug: "senior-technical-support-engineer",
    title: "Senior Technical Support Engineer",
    group: "Immediate",
    fit: "Strong current alignment",
    priority: "Primary near-term path",
    headline:
      "Deep production troubleshooting, customer ownership, and cross-functional technical judgment.",
    overview:
      "This is my strongest fit: I resolve complex SaaS issues, analyze integrations and data flows, use observability tools, coordinate escalations, and communicate under customer pressure.",
    contribution:
      "I would contribute as an investigator and owner: narrow ambiguous symptoms, reproduce behavior, connect logs and data to the customer impact, and give engineering a precise escalation when a fix crosses team boundaries. I also look for the durable follow-up—better documentation, diagnostics, or a repeatable troubleshooting path.",
    demonstratedEvidence: [
      "Enterprise SaaS troubleshooting and escalation ownership",
      "API, authentication, integration, and data-quality investigations",
      "Linux administration, patching, network rollback, permissions, configuration editing, and log-based investigation",
      "Customer communication in regulated and federal environments",
      "Runbooks, documentation, reproduction, and structured escalation packages",
    ],
    relevantProjects: [
      "careeros",
      "careeros-analytics-integrations",
      "careeros-learning-delivery",
      "healthcare-sql-customer-operations",
      "python-mongodb-debugging-lab",
      "incident-automation-observability",
      "cybersecurity-saas-investigation",
    ],
    gaps: [
      "More public-safe examples of mentoring and technical leadership",
      "Measured operational improvements such as reduced diagnosis time or repeat incidents",
      "Evidence of owning the most complex cases repeatedly, not just occasionally",
    ],
    nextProof:
      "Publish one sanitized case study showing a repeatable troubleshooting method, durable documentation, and a measurable operational improvement.",
    recruiterTakeaway:
      "I’m closest to Senior TSE today, with broad customer, integration, observability, data, and builder experience.",
    notClaimed: [
      "Formal Senior TSE title",
      "Unapproved internal performance metrics",
      "Confidential customer or incident details",
    ],
    scopeNote:
      "This reflects role alignment, not a formal Senior TSE title; confidential examples and unapproved metrics remain private.",
    keywords: [
      "root cause analysis",
      "production support",
      "API troubleshooting",
      "incident management",
      "observability",
      "customer escalation",
    ],
  },
  {
    slug: "technical-account-manager",
    title: "Technical Account Manager",
    group: "Immediate",
    fit: "Strong adjacent alignment",
    priority: "High-value adjacent path",
    headline:
      "Translate technical risk, customer goals, and product behavior into a durable account strategy.",
    overview:
      "I bring customer trust, technical depth, stakeholder coordination, issue ownership, adoption insight, and translation between customers and internal teams.",
    contribution:
      "I would pair proactive account context with hands-on technical judgment. That means translating goals into technical risks, recognizing patterns across incidents and integrations, keeping owners and next actions clear, and turning product signals into a practical customer plan. Commercial ownership would remain a growth area, not an assumed strength. My clearest starting value today is technical risk ownership.",
    demonstratedEvidence: [
      "Long-running customer-facing technical work",
      "Clear communication during complex incidents and escalations",
      "Technical translation across APIs, integrations, data, and product behavior",
      "Documentation, expectation-setting, and cross-functional coordination",
      "Analytics and adoption-oriented experience",
    ],
    relevantProjects: [
      "careeros",
      "careeros-analytics-integrations",
      "careeros-learning-delivery",
      "healthcare-sql-customer-operations",
      "rallye-control",
      "incident-automation-observability",
      "healthcare-data-interpretation",
      "service-operations-reporting",
    ],
    gaps: [
      "A public-safe proactive account plan or success-plan example",
      "Executive business review and renewal-risk evidence",
      "Documented ownership of a named account portfolio",
      "Stronger quantified adoption and business-outcome stories",
    ],
    nextProof:
      "Create a fictional technical account plan connecting customer goals, technical risks, adoption signals, actions, owners, and measurable outcomes.",
    recruiterTakeaway:
      "I bring hands-on troubleshooting and integration depth to a customer-facing account path.",
    notClaimed: [
      "Formal TAM title",
      "Commercial renewal ownership",
      "Executive QBR ownership without evidence",
    ],
    scopeNote:
      "This is a technically aligned path; formal TAM, commercial renewal, and executive QBR ownership remain growth areas.",
    keywords: [
      "technical account management",
      "customer strategy",
      "risk management",
      "stakeholder management",
      "adoption",
      "executive communication",
    ],
  },
  {
    slug: "customer-success-engineer",
    title: "Customer Success Engineer",
    group: "Immediate",
    fit: "Strong adjacent alignment",
    priority: "High-value adjacent path",
    headline:
      "Combine integrations, troubleshooting, technical enablement, and adoption to help customers realize value.",
    overview:
      "I can understand customer objectives, guide integrations, diagnose blockers, improve adoption, and turn product complexity into a clear success path.",
    contribution:
      "I would help customers move from technical uncertainty to a working path: clarify the desired outcome, guide integration decisions, diagnose blockers, explain product behavior, and close the loop with validation and enablement. My support background makes me attentive to failure modes as well as the intended implementation experience. I would measure success today through adoption and time-to-value only when supported by real data.",
    demonstratedEvidence: [
      "API and integration troubleshooting",
      "Customer education and technical communication",
      "Analytics, dashboards, and adoption-oriented thinking",
      "Automation and workflow improvement",
      "Cross-functional support-to-engineering translation",
    ],
    relevantProjects: [
      "careeros",
      "careeros-analytics-integrations",
      "careeros-learning-delivery",
      "healthcare-sql-customer-operations",
      "automatic-nerf-turret",
      "rallye-control",
      "cybersecurity-saas-investigation",
      "healthcare-data-interpretation",
      "service-operations-reporting",
    ],
    gaps: [
      "More end-to-end implementation and onboarding case studies",
      "Quantified adoption, retention, or time-to-value outcomes",
      "A clear success-plan artifact showing proactive ownership",
    ],
    nextProof:
      "Publish a fictional integration onboarding case study from discovery through validation, enablement, adoption measurement, and follow-up.",
    recruiterTakeaway:
      "My differentiator is the combination of customer empathy, technical troubleshooting, integrations, analytics, and independent building.",
    notClaimed: [
      "Formal CSE title",
      "Direct renewal quota ownership",
      "Unverified adoption metrics",
    ],
    scopeNote:
      "This is an adjacent path; formal CSE, renewal-quota ownership, and verified adoption outcomes remain growth areas.",
    keywords: [
      "customer success engineering",
      "technical onboarding",
      "integrations",
      "adoption",
      "enablement",
      "customer outcomes",
    ],
  },
  {
    slug: "data-analytics",
    title: "Data Analytics",
    group: "Immediate",
    fit: "Credible adjacent alignment",
    priority: "Secondary role lens",
    headline:
      "Use SQL, dashboards, product data, and operational context to turn technical activity into decisions.",
    overview:
      "I use SQL, product and support data, dashboards, and customer-health context to explain what technical activity means operationally.",
    contribution:
      "I would connect the analysis to a decision. My approach is to understand the operational question first, trace how the data was produced, check quality and edge cases, and present the signal with its limitations. The strongest fit is analytics close to customers, products, or support operations.",
    demonstratedEvidence: [
      "SQL and data investigation in technical support contexts",
      "Redshift, Superset, QuickSight, Athena, and product analytics exposure",
      "Dashboard and operational reporting experience",
      "Data storytelling tied to customer and support decisions",
      "Python and JSON/CSV transformation experience",
    ],
    relevantProjects: [
      "careeros",
      "careeros-analytics-integrations",
      "careeros-learning-delivery",
      "healthcare-sql-customer-operations",
      "rallye-control",
      "healthcare-data-interpretation",
      "service-operations-reporting",
    ],
    gaps: [
      "A polished public analytics case study with a reproducible dataset",
      "More explicit statistical analysis and experiment-design evidence",
      "A portfolio dashboard with documented business recommendations and outcomes",
    ],
    nextProof:
      "Build a public support-operations or customer-health analytics project with SQL, a reproducible dataset, a dashboard, and a written recommendation.",
    recruiterTakeaway:
      "I bring the operational and customer context behind technical data, not just the visualization layer.",
    notClaimed: [
      "Senior Data Analyst title",
      "Advanced statistical modeling",
      "Unverified business-impact metrics",
    ],
    scopeNote:
      "This is a secondary analytics lens; senior analyst scope, advanced statistical modeling, and verified impact metrics remain open.",
    keywords: [
      "SQL",
      "data analysis",
      "dashboards",
      "product analytics",
      "customer health",
      "business intelligence",
    ],
  },
  {
    slug: "application-engineer",
    title: "Application Engineer",
    group: "Bridge",
    fit: "Active development path",
    priority: "Primary engineering bridge",
    headline:
      "Move from diagnosing system behavior into reviewed code, tests, deployment, and maintainable fixes.",
    overview:
      "I already understand customer symptoms, logs, integrations, and system behavior; my next proof is sustained software-lifecycle contribution.",
    contribution:
      "I would bring production context into the engineering loop: reproduce a failure, trace the relevant request and data flow, add useful diagnostics or a regression test, make a narrow change, and validate it. The transition depends on building a consistent record of reviewed code and deployment ownership. Small, well-tested contributions are the right first step. That sequence matches how I already investigate technical problems.",
    demonstratedEvidence: [
      "Strong debugging and reproduction discipline",
      "Python, JavaScript, SQL, APIs, Linux administration, Docker, logs, and observability",
      "Independent hardware/software prototypes",
      "Architecture-first backend development",
      "Cross-functional translation between customer symptoms and engineering work",
    ],
    relevantProjects: [
      "automatic-nerf-turret",
      "rallye-control",
      "python-mongodb-debugging-lab",
      "careeros",
      "careeros-analytics-integrations",
      "careeros-learning-delivery",
      "incident-automation-observability",
      "cybersecurity-saas-investigation",
      "service-operations-reporting",
    ],
    gaps: [
      "Reviewed production backend contributions",
      "Regression-test and pull-request evidence",
      "Deeper software design, maintainability, and deployment ownership",
      "A finished backend case study with before-and-after validation",
    ],
    nextProof:
      "Complete the Python/MongoDB debugging lab and one small reviewed contribution focused on tests, logging, or a narrow defect.",
    recruiterTakeaway:
      "I bring customer and production context; my current gap is repeatable, reviewed delivery.",
    notClaimed: [
      "Production backend engineer title",
      "Completed production code ownership",
      "Senior software engineering readiness",
    ],
    scopeNote:
      "Current evidence supports the engineering bridge; production backend ownership and senior software engineering readiness remain to be demonstrated.",
    keywords: [
      "application engineering",
      "Python",
      "MongoDB",
      "debugging",
      "testing",
      "deployment",
    ],
  },
  {
    slug: "software-engineer",
    title: "Software Engineer",
    group: "Bridge",
    eyebrow: "Active development path",
    fit: "Active development path",
    priority: "Active software engineering path",
    headline:
      "Building from customer-facing technical depth into tested, maintainable software delivery.",
    overview:
      "I’m pursuing a Master of Science in Data Science (MSDS) while strengthening my software engineering practice through shipped projects, backend development, testing, and deployment.",
    contribution:
      "I bring customer-facing production context, structured debugging, and a MERN/full-stack foundation to software work. My focus is turning that foundation into maintainable backend delivery, automated tests, and repeatable deployment evidence.",
    demonstratedEvidence: [
      "React, JavaScript, TypeScript, and an existing MERN/full-stack foundation",
      "CareerOS design, typed implementation, routing, responsive behavior, and deployment",
      "Python/OpenCV Nerf Turret prototype and Rallye Control architecture and implementation work",
      "APIs, SQL, debugging, Linux administration, patching, permissions, Docker, logs, and observability in customer-facing production context",
    ],
    relevantProjects: [
      "careeros",
      "careeros-analytics-integrations",
      "automatic-nerf-turret",
      "rallye-control",
      "python-mongodb-debugging-lab",
      "careeros-learning-delivery",
    ],
    gaps: [
      "Reviewed backend contributions",
      "Automated testing depth",
      "Software design and maintainability evidence",
      "Repeatable deployment ownership",
      "Data structures, algorithms, and computer-science fundamentals",
    ],
    gapDisplayLimit: 5,
    nextProof:
      "Ship and document one tested full-stack application with a backend API, persistent data, automated tests, deployment, and a short engineering decision record.",
    recruiterTakeaway:
      "I bring customer-facing technical depth and shipped project evidence to an active software engineering path.",
    notClaimed: [
      "Senior production engineering experience",
      "Sustained production feature delivery",
      "Extensive code-review or deployment ownership",
    ],
    scopeNote:
      "My current evidence supports an active software engineering path, not a claim of senior production engineering experience.",
    keywords: [
      "software engineering",
      "MERN",
      "React",
      "TypeScript",
      "backend development",
      "testing",
      "deployment",
    ],
  },
  {
    slug: "forward-deployed-engineer",
    title: "Forward Deployed Engineer",
    group: "Long-term",
    fit: "Strong directional alignment",
    priority: "Long-term convergence role",
    headline:
      "Own the path from customer ambiguity through implementation, deployment, production debugging, and measurable outcomes.",
    overview:
      "FDE is where my customer-facing, troubleshooting, integration, data, and builder strengths can converge; implementation and deployment depth are the work ahead.",
    contribution:
      "My long-term value would be owning the translation from an ambiguous customer problem into a deployed technical result. I already bring discovery, troubleshooting, integration, and communication strengths. The work ahead is to make implementation, testing, deployment, and maintainability equally repeatable through finished independent builds and reviewed contributions. Measured customer outcomes would complete that delivery story. This is the path I am actively building toward.",
    demonstratedEvidence: [
      "Customer-facing technical problem ownership",
      "APIs, integrations, data flows, logs, and observability",
      "Independent end-to-end prototypes",
      "Technical communication and cross-functional coordination",
      "Analytics and business-value orientation",
    ],
    relevantProjects: [
      "careeros",
      "careeros-analytics-integrations",
      "automatic-nerf-turret",
      "rallye-control",
      "python-mongodb-debugging-lab",
      "careeros-learning-delivery",
    ],
    gaps: [
      "Production-quality engineering contribution",
      "End-to-end deployment ownership",
      "System design and maintainability at scale",
      "More customer-specific implementation evidence",
      "Measured business outcomes from delivered technical solutions",
    ],
    nextProof:
      "Ship one independently deployed customer-problem simulation that includes discovery, architecture, implementation, observability, testing, and a measurable outcome.",
    recruiterTakeaway:
      "My customer-facing and production-troubleshooting foundation is strong; engineering delivery is the focused growth area.",
    notClaimed: [
      "Current FDE title",
      "Production-scale software ownership",
      "Advanced distributed-systems expertise",
    ],
    scopeNote:
      "This is the long-term direction; production-scale software ownership and advanced distributed-systems depth remain to be demonstrated.",
    keywords: [
      "forward deployed engineering",
      "customer implementation",
      "rapid prototyping",
      "deployment",
      "production debugging",
      "business outcomes",
    ],
  },
  {
    slug: "data-science",
    title: "Data Science",
    group: "Exploratory",
    fit: "Emerging evidence only",
    priority: "Exploratory, not a primary job-search identity",
    headline:
      "Build from Python, SQL, applied computer vision, and operational data toward rigorous modeling and evaluation.",
    overview:
      "I bring Python, SQL, operational analytics, and an applied computer-vision build; rigorous modeling evidence is still developing.",
    contribution:
      "The credible starting point is applied problem framing, Python, SQL, operational analytics, and a working computer-vision prototype. A serious move toward this field would require reproducible datasets, sound experiment design, baseline comparisons, model evaluation, and error analysis. Until that proof exists, this remains exploration rather than a recruiting focus.",
    demonstratedEvidence: [
      "Python and SQL experience",
      "OpenCV motion detection and object tracking prototype",
      "Data transformation, dashboards, and operational analytics",
      "Technical problem framing and experimentation mindset",
    ],
    relevantProjects: ["automatic-nerf-turret", "rallye-control"],
    gaps: [
      "Reproducible notebooks and clean public datasets",
      "Statistics, experiment design, and model evaluation",
      "Regression, classification, clustering, and feature engineering evidence",
      "Cross-validation, error analysis, and model documentation",
      "A completed end-to-end machine-learning case study",
    ],
    nextProof:
      "Create one reproducible computer-vision or predictive-analysis case study with a public dataset, baseline, evaluation metrics, error analysis, and documented limitations.",
    recruiterTakeaway:
      "I have technical foundations and one applied computer-vision build; this remains exploratory until rigorous modeling evidence exists.",
    notClaimed: [
      "Data Scientist title",
      "Production machine-learning deployment",
      "Advanced statistical or ML expertise",
    ],
    scopeNote:
      "This remains exploratory; a Data Scientist title, production ML deployment, and advanced statistical depth are not part of the current evidence.",
    keywords: [
      "Python",
      "OpenCV",
      "computer vision",
      "machine learning",
      "model evaluation",
      "data science",
    ],
  },
];

export const roadmap = [
  {
    phase: "01",
    title: "CareerOS public beta",
    date: "Complete",
    status: "complete",
    detail:
      "The recruiter-first portfolio is deployed with responsive routes, canonical URLs, and public-safe evidence boundaries.",
  },
  {
    phase: "02",
    title: "Publish the Nerf Turret photo",
    date: "Complete",
    status: "complete",
    detail:
      "The project page includes an approved original photo of the assembled prototype.",
  },
  {
    phase: "03",
    title: "Document Rallye Control",
    date: "Next",
    status: "next",
    detail:
      "Add an owned subsystem diagram and one measured power-telemetry walkthrough.",
  },
  {
    phase: "04",
    title: "Publish the reviewed résumé",
    date: "Complete",
    status: "complete",
    detail:
      "The reviewed résumé is available on the contact page, with LinkedIn as the public contact method.",
  },
  {
    phase: "05",
    title: "Build the backend bridge",
    date: "Then",
    status: "planned",
    detail:
      "Package the locally validated Python/MongoDB lab and make a small reviewed contribution, moving from Application Engineering toward FDE delivery.",
  },
];
