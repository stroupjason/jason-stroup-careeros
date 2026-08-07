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
};

export type Project = {
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
  liveUrl?: string;
  media?: ProjectMedia[];
  subsystems?: ProjectSubsystem[];
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

export const profile = {
  name: "Jason Stroup",
  location: "Fort Collins, Colorado",
  availability: "Open to remote opportunities",
  currentRole: "Technical Support Engineer",
  professionalIdentity: "Customer-Facing Technical Systems Professional",
  supportingLine:
    "Technical solutions, SaaS integrations, application support, and software delivery.",
  coreIdentity:
    "I’m a customer-facing technical systems professional specializing in troubleshooting, integrations, analytics, solution delivery, and business value.",
  headline:
    "I turn complex customer problems into clear technical solutions.",
  summary:
    "I specialize in SaaS troubleshooting, integrations, observability, analytics, and customer ownership while building deeper backend delivery skills.",
  github: externalProfileUrls.github,
  linkedin: externalProfileUrls.linkedin,
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
  "APIs & Backend",
  "Observability & Infrastructure",
  "Data & Analytics",
  "Frontend & Product Delivery",
];

export const skills: Skill[] = [
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
      "Next: trace one symptom through logs, Python, stored data, a test, and validation.",
    evidenceSources: [
      { type: "lab", label: "Planned Python/MongoDB debugging lab", provider: "CareerOS", verified: true },
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
      "I built and deployed the public beta at jason-stroup-careeros.vercel.app.",
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
    liveUrl: "https://jason-stroup-careeros.vercel.app",
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
      "Available photographs or demonstration video",
    ],
    proofNote: "The working prototype is verified, but the original public code and media are not currently available.",
    nextProof: "Recover owned media or publish a clearly labeled reconstruction and architecture diagram.",
  },
  {
    slug: "rallye-control",
    title: "Rallye Control — Solar Trailer Telemetry",
    shortTitle: "Rallye Control",
    type: "Personal edge / IoT systems project",
    status: "Active build",
    evidenceState: "Practicing",
    summary:
      "An active off-grid solar trailer project connecting edge compute, power telemetry, local networking, and planned control services.",
    problem:
      "Create useful visibility and control for an off-grid trailer where power, connectivity, environmental conditions, and field reliability matter.",
    outcome:
      "A working systems-integration direction with active edge and power-visibility work plus clearly planned subsystems.",
    approach:
      "I am approaching Rallye Control as a sequence of field-tested subsystems. Power visibility and the Raspberry Pi edge environment come first; messaging, sensor nodes, backend services, and mobile control follow only when their interfaces and evidence are clear. That order keeps the project useful under off-grid power and connectivity constraints without presenting planned architecture as finished implementation.",
    stack: [
      "Raspberry Pi",
      "ESP32",
      "MQTT",
      "Python/FastAPI",
      "Docker",
      "React Native/Expo",
      "TypeScript",
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
      "I am building around an off-grid solar trailer and edge observability.",
      "Current work focuses on Raspberry Pi edge computing, live power visibility, and local connectivity.",
      "MQTT, ESP32, Python/FastAPI, Docker, and mobile control remain planned or in learning states.",
    ],
    unknowns: [
      "Battery, panel, inverter, and telemetry hardware specifications",
      "Current sensor inventory and message schema",
      "Which planned services are already running",
      "Measured telemetry, alerting, and field-reliability outcomes",
      "Public repository, photographs, architecture diagram, and demo links",
    ],
    proofNote: "The build is active; a reviewed architecture diagram and field evidence are still being assembled.",
    nextProof: "Publish one owned architecture diagram and a measured power-telemetry walkthrough.",
    subsystems: [
      {
        name: "Solar and power telemetry",
        state: "Practicing",
        detail:
          "Active focus on live power visibility and useful operational monitoring.",
      },
      {
        name: "Raspberry Pi edge environment",
        state: "Practicing",
        detail:
          "Edge-compute foundation for local services, networking, and system integration.",
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
    slug: "python-mongodb-debugging-lab",
    title: "Python/MongoDB Debugging Lab",
    shortTitle: "Backend Debugging Lab",
    type: "Independent engineering lab",
    status: "Planned lab",
    evidenceState: "Planned",
    summary:
      "A planned fictional backend environment for practicing code tracing, MongoDB debugging, regression tests, and Docker deployment.",
    problem:
      "Create a safe, independent environment for demonstrating the complete path from customer symptom to code, data, test, fix, and validation.",
    outcome:
      "Not yet completed. The lab specification and evidence goals are defined so the eventual build can produce a credible public case study.",
    approach:
      "The lab will start with a small fictional service and one reproducible failure. I will trace the symptom through structured logs, Python code, and MongoDB data; state a testable hypothesis; add a regression test; make the narrowest useful fix; and validate the deployed behavior. Nothing on this page represents that workflow as completed today. The finished proof will include runnable code, tests, logs, and a concise end-to-end retrospective for review.",
    stack: ["Python", "MongoDB", "Docker", "Tests", "Structured logs"],
    capabilities: [
      "Backend debugging",
      "Regression testing",
      "Data-flow tracing",
      "Safe deployment",
      "Technical documentation",
    ],
    roleLinks: ["Senior TSE", "Application Engineer", "FDE"],
    verifiedFacts: [
      "The planned lab is fictional and independent from employer architecture.",
      "The intended workflow runs from symptom and logs through code/data tracing, a test, a small fix, and validation.",
      "No working lab exists yet.",
    ],
    unknowns: [
      "Final service domain and failure scenario",
      "Repository and deployment URL",
      "Completed tests, screenshots, and outcome",
    ],
    proofNote: "No working lab or artifact exists yet; this project is planned.",
    nextProof: "Build the smallest runnable service, reproduce one failure, and add a regression test.",
  },
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
    relevantProjects: ["careeros", "python-mongodb-debugging-lab"],
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
    relevantProjects: ["careeros", "rallye-control"],
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
      "automatic-nerf-turret",
      "rallye-control",
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
    relevantProjects: ["careeros", "rallye-control"],
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
      "I’m currently pursuing a master’s degree in computer science while strengthening my software engineering practice through shipped projects, backend development, testing, and deployment.",
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
      "automatic-nerf-turret",
      "rallye-control",
      "python-mongodb-debugging-lab",
    ],
    gaps: [
      "Reviewed backend contributions",
      "Automated testing depth",
      "Software design and maintainability evidence",
      "Repeatable deployment ownership",
      "Data structures, algorithms, and computer-science depth through the master’s program",
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
      "automatic-nerf-turret",
      "rallye-control",
      "python-mongodb-debugging-lab",
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
    title: "Own the Nerf Turret proof",
    date: "Now",
    status: "active",
    detail:
      "Recover owned media or publish a clearly labeled reconstruction and original architecture diagram.",
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
    title: "Add reviewed contact materials",
    date: "Next",
    status: "planned",
    detail:
      "Publish a resume and direct contact method only after both are reviewed for accuracy and privacy.",
  },
  {
    phase: "05",
    title: "Build the backend bridge",
    date: "Then",
    status: "planned",
    detail:
      "Complete the Python/MongoDB lab and a small reviewed contribution, moving from Application Engineering toward FDE delivery.",
  },
];
