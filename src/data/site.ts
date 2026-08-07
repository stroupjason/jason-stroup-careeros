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
  stack: string[];
  capabilities: string[];
  roleLinks: string[];
  verifiedFacts: string[];
  unknowns: string[];
  mediaPath: string;
  media?: ProjectMedia[];
  subsystems?: ProjectSubsystem[];
};

export type RoleLens = {
  slug: string;
  title: string;
  group: "Immediate" | "Bridge" | "Long-term" | "Exploratory";
  fit: string;
  priority: string;
  headline: string;
  overview: string;
  demonstratedEvidence: string[];
  relevantProjects: string[];
  gaps: string[];
  nextProof: string;
  recruiterTakeaway: string;
  notClaimed: string[];
  keywords: string[];
};

export const profile = {
  name: "Jason Stroup",
  location: "Northern Colorado",
  currentRole: "Technical Support Engineer",
  coreIdentity:
    "Customer-facing technical systems professional specializing in troubleshooting, integrations, analytics, solution delivery, and business value.",
  headline:
    "I turn difficult customer problems into structured technical investigations—and I am expanding that strength into backend delivery, data, and forward deployment.",
  summary:
    "My strongest evidence sits at the intersection of enterprise SaaS support, APIs, integrations, observability, customer ownership, analytics, and technical communication. CareerOS organizes that evidence into truthful role-specific views without pretending every adjacent role is already demonstrated.",
  github: "https://github.com/stroupjason",
  linkedin: "https://www.linkedin.com/in/jasonstroup/",
};

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
    name: "Observability and runtime investigation",
    state: "Demonstrated",
    evidence:
      "Linux, Docker, Grafana, Prometheus, logs, and structured escalation packages.",
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
    status: "Active build",
    evidenceState: "Practicing",
    summary:
      "A recruiter-safe portfolio and proof-of-concept for connecting learning, applied capability, target roles, and the next highest-leverage action.",
    problem:
      "Traditional resumes fragment hybrid technical experience and rarely show how learning becomes applied capability over time.",
    outcome:
      "A functioning product narrative, typed content model, role-lens system, project evidence model, and deployable public website foundation.",
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
      "The project is being built as Jason's public portfolio and personal career evidence system.",
      "The first release uses evidence states instead of unsupported readiness percentages.",
      "The product separates private career evidence from public recruiter-safe proof.",
      "The future organization concept is intentionally deferred until the personal product is useful.",
    ],
    unknowns: [
      "Final production URL",
      "Long-term database and authentication architecture",
      "Validated user demand beyond the first user",
      "Measured impact on job-search outcomes",
    ],
    mediaPath: "/projects/careeros/",
  },
  {
    slug: "automatic-nerf-turret",
    title: "Automatic Nerf Turret",
    shortTitle: "Nerf Turret",
    type: "Personal computer vision / edge prototype",
    status: "Completed prototype",
    evidenceState: "Demonstrated",
    summary:
      "A Raspberry Pi and OpenCV motion-detection and 360-degree tracking prototype integrating Python, camera processing, state management, and hardware control.",
    problem:
      "Coordinate real-time visual detection with physical tracking and actuation in a constrained edge-computing environment.",
    outcome:
      "A working personal prototype validated end to end across camera input, software logic, state coordination, and physical movement.",
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
      "Built with Python on Linux/Raspberry Pi.",
      "Used OpenCV for motion detection and object tracking.",
      "Implemented 360-degree tracking behavior.",
      "Integrated camera processing, software logic, servo-driven hardware control, and end-to-end testing.",
      "Used SQLAlchemy and web technologies for state/workflow management.",
    ],
    unknowns: [
      "Exact build date",
      "Specific camera, servo, and mechanical component models",
      "Surviving source-code or repository link",
      "Measured latency, tracking accuracy, or reliability metrics",
      "Available photographs or demonstration video",
    ],
    mediaPath: "/projects/automatic-nerf-turret/",
  },
  {
    slug: "rallye-control",
    title: "Rallye Control — Solar Trailer Telemetry",
    shortTitle: "Rallye Control",
    type: "Personal edge / IoT systems project",
    status: "Active architecture and build journal",
    evidenceState: "Practicing",
    summary:
      "An off-grid solar trailer telemetry and control concept connecting edge compute, live power visibility, sensors, local networking, backend services, dashboards, and a future cross-platform mobile experience.",
    problem:
      "Create useful visibility and control for an off-grid trailer where power, connectivity, environmental conditions, and field reliability matter.",
    outcome:
      "An active systems-integration project with a documented architecture, subsystem evidence states, and a clear sequence of testable engineering experiments.",
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
      "The project centers on an off-grid solar trailer and edge observability.",
      "The design uses or is evaluating Raspberry Pi edge computing, live power telemetry, local connectivity, and dashboard/alerting workflows.",
      "The architecture includes planned MQTT, ESP32, Python/FastAPI, Docker, and mobile-control components.",
      "The cross-platform mobile direction targets iPadOS/iOS and Android using React Native/Expo and TypeScript.",
      "The project must not be represented as a completed security-camera or computer-vision system.",
    ],
    unknowns: [
      "Battery, panel, inverter, and telemetry hardware specifications",
      "Current sensor inventory and message schema",
      "Which planned services are already running",
      "Measured telemetry, alerting, and field-reliability outcomes",
      "Public repository, photographs, architecture diagram, and demo links",
    ],
    mediaPath: "/projects/rallye-control/",
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
    status: "Next build",
    evidenceState: "Learning",
    summary:
      "A fictional backend environment for practicing code navigation, database tracing, structured logs, regression tests, Docker deployment, and public-safe debugging case studies.",
    problem:
      "Create a safe, independent environment for demonstrating the complete path from customer symptom to code, data, test, fix, and validation.",
    outcome:
      "Not yet completed. The lab specification and evidence goals are defined so the eventual build can produce a credible public case study.",
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
      "The lab is intentionally fictional and independent from employer architecture.",
      "Its target workflow is symptom → logs → code/data trace → reproduction → hypothesis → test → small fix → validation.",
      "It is the next public proof project, not a completed achievement.",
    ],
    unknowns: [
      "Final service domain and failure scenario",
      "Repository and deployment URL",
      "Completed tests, screenshots, and outcome",
    ],
    mediaPath: "/projects/python-mongodb-debugging-lab/",
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
      "This lens leads with Jason's strongest demonstrated work: resolving complex SaaS issues, analyzing integrations and data flows, using observability tools, coordinating escalations, and communicating under customer pressure.",
    demonstratedEvidence: [
      "Enterprise SaaS troubleshooting and escalation ownership",
      "API, authentication, integration, and data-quality investigations",
      "Linux, Docker, logs, Grafana, and Prometheus",
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
      "Jason is closest to Senior TSE today and brings unusually broad customer, integration, observability, data, and builder experience.",
    notClaimed: [
      "Formal Senior TSE title",
      "Unapproved internal performance metrics",
      "Confidential customer or incident details",
    ],
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
      "This lens emphasizes customer trust, technical depth, stakeholder coordination, issue ownership, adoption insight, and the ability to translate between customers and internal teams.",
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
      "Jason brings more hands-on troubleshooting and integration depth than many traditional TAM profiles while already operating comfortably with customers.",
    notClaimed: [
      "Formal TAM title",
      "Commercial renewal ownership",
      "Executive QBR ownership without evidence",
    ],
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
      "This lens presents Jason as a technical partner who can understand customer objectives, guide integrations, diagnose blockers, improve adoption, and convert product complexity into a clear success path.",
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
      "Jason's differentiator is the combination of customer empathy, deep technical troubleshooting, integrations, analytics, and independent building.",
    notClaimed: [
      "Formal CSE title",
      "Direct renewal quota ownership",
      "Unverified adoption metrics",
    ],
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
      "This lens highlights Jason's practical analytics work across SQL, product/support data, dashboards, customer-health thinking, and the ability to explain what the data means operationally.",
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
      "Jason stands out as an analyst who understands the operational and customer context behind technical data—not just the visualization layer.",
    notClaimed: [
      "Senior Data Analyst title",
      "Advanced statistical modeling",
      "Unverified business-impact metrics",
    ],
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
      "This lens makes the transition explicit: Jason already understands customer symptoms, logs, integrations, and system behavior; the next proof is sustained software lifecycle contribution.",
    demonstratedEvidence: [
      "Strong debugging and reproduction discipline",
      "Python, JavaScript, SQL, APIs, Linux, Docker, and observability",
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
      "Jason already brings the customer and production context that many application engineers must learn; his current gap is repeatable reviewed delivery.",
    notClaimed: [
      "Production backend engineer title",
      "Completed production code ownership",
      "Senior software engineering readiness",
    ],
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
    slug: "forward-deployed-engineer",
    title: "Forward Deployed Engineer",
    group: "Long-term",
    fit: "Strong directional alignment",
    priority: "Long-term convergence role",
    headline:
      "Own the path from customer ambiguity through implementation, deployment, production debugging, and measurable outcomes.",
    overview:
      "FDE is the role where Jason's customer-facing, troubleshooting, integration, data, and builder strengths can converge. The page is intentionally a roadmap, not a claim that he already meets every engineering requirement.",
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
      "Jason's unusual advantage is that the customer-facing and production-troubleshooting side of FDE is already strong; engineering delivery is the focused growth area.",
    notClaimed: [
      "Current FDE title",
      "Production-scale software ownership",
      "Advanced distributed-systems expertise",
    ],
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
      "This page exists to show credible foundations and an evidence plan—not to market Jason as a job-ready data scientist today. The Nerf turret provides real applied computer-vision evidence, while the remaining data-science requirements are clearly labeled as gaps.",
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
      "Jason has credible technical foundations and one applied computer-vision build, but this remains an exploratory path until rigorous modeling evidence exists.",
    notClaimed: [
      "Data Scientist title",
      "Production machine-learning deployment",
      "Advanced statistical or ML expertise",
    ],
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
    title: "Launch the truthful portfolio",
    date: "Now",
    status: "active",
    detail:
      "Publish the multipage CareerOS foundation, featured personal projects, role lenses, and strict evidence boundaries.",
  },
  {
    phase: "02",
    title: "Recover and document project proof",
    date: "Next",
    status: "next",
    detail:
      "Add original photos, diagrams, surviving code, and honest reconstruction notes for the Nerf turret and Rallye Control.",
  },
  {
    phase: "03",
    title: "Map before modifying",
    date: "Days 1–30",
    status: "next",
    detail:
      "Trace one approved backend request and data flow, locate tests, understand deployment boundaries, and record a public-safe learning artifact.",
  },
  {
    phase: "04",
    title: "Reproduce and test",
    date: "Days 31–60",
    status: "planned",
    detail:
      "Build the independent Python/MongoDB lab, reproduce one failure, write a testable hypothesis, and add a regression test.",
  },
  {
    phase: "05",
    title: "Contribute something small",
    date: "Days 61–90",
    status: "planned",
    detail:
      "Complete a small reviewed test, logging improvement, or narrow defect fix and publish only a sanitized transferable lesson.",
  },
  {
    phase: "06",
    title: "Add role-specific proof",
    date: "2027",
    status: "planned",
    detail:
      "Create one strong artifact for each active role lens instead of adding more unsupported role pages.",
  },
];

export const journalEntries = [
  {
    title: "Why CareerOS uses evidence states instead of percentages",
    date: "2026-08-06",
    status: "Draft",
    summary:
      "A decision note explaining why Demonstrated, Practicing, Learning, and Planned are more trustworthy than a false-precision readiness score.",
  },
  {
    title: "Reconstructing the Automatic Nerf Turret responsibly",
    date: "Planned",
    status: "Template",
    summary:
      "A build retrospective that will separate verified facts, missing artifacts, technical lessons, and what would be redesigned today.",
  },
  {
    title: "Rallye Control subsystem evidence review",
    date: "Planned",
    status: "Template",
    summary:
      "A recurring build-journal entry that tracks each telemetry, edge, network, backend, and mobile subsystem without overstating completion.",
  },
];

export const caseStudies = [
  {
    title: "Automatic Nerf Turret",
    state: "Reconstruction planned",
    summary:
      "Computer vision, edge execution, state management, hardware integration, and end-to-end prototype validation.",
    href: "/projects/automatic-nerf-turret",
  },
  {
    title: "Rallye Control",
    state: "Active build journal",
    summary:
      "Off-grid telemetry, edge services, local connectivity, dashboards, and a planned mobile control layer.",
    href: "/projects/rallye-control",
  },
  {
    title: "Python/MongoDB Debugging Lab",
    state: "Next build",
    summary:
      "A fictional public-safe walkthrough from symptom and logs to code/data trace, test, fix, deployment, and validation.",
    href: "/projects/python-mongodb-debugging-lab",
  },
];

export const nextAction = {
  title: "Ship the portfolio, then add proof—not more scope",
  action:
    "Deploy the multipage site with the two featured personal projects and honest role lenses. Then recover one real artifact or create one original diagram for each project before adding another major feature.",
  why:
    "This produces immediate recruiter value while keeping the site coherent, truthful, and grounded in evidence rather than an ever-expanding list of aspirations.",
};
