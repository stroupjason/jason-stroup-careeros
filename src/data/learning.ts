import type { EvidenceState, InitiativePhaseStatus } from "./site";

export const deliveryStatuses = [
  "Backlog",
  "Ready",
  "In Progress",
  "Blocked",
  "In Review",
  "Done",
] as const;

export const visibilityStates = ["Private", "Public Draft", "Public"] as const;
export const issueTypes = ["Epic", "Story", "Task", "Bug", "Spike"] as const;

export type DeliveryStatus = (typeof deliveryStatuses)[number];
export type VisibilityState = (typeof visibilityStates)[number];
export type IssueType = (typeof issueTypes)[number];
export type Priority = "Highest" | "High" | "Medium" | "Low";
export type EvidenceVerificationState = "Verified" | "Pending Review" | "Not Yet Created";

export const courseStatuses = ["In Progress", "Completed"] as const;
export const courseKinds = ["Course", "Professional certification"] as const;
export const courseProgressSources = [
  "Manual",
  "User-provided screenshot",
  "Browser-assisted verification",
] as const;
export const courseProgressVerificationStates = ["Verified", "Candidate"] as const;
export const courseProgressValueKinds = ["Provider reported", "Derived"] as const;

export type CourseStatus = (typeof courseStatuses)[number];
export type CourseKind = (typeof courseKinds)[number];
export type CourseProgressSource = (typeof courseProgressSources)[number];
export type CourseProgressVerificationState = (typeof courseProgressVerificationStates)[number];
export type CourseProgressValueKind = (typeof courseProgressValueKinds)[number];

export type CourseProgressSnapshot = {
  id: string;
  observedAt: string;
  source: CourseProgressSource;
  verificationState: CourseProgressVerificationState;
  valueKind: CourseProgressValueKind;
  percentage?: number;
  totalDurationSeconds?: number;
  completedDurationSeconds?: number;
  remainingDurationSeconds?: number;
  relatedEvidenceIds: string[];
  currentModule?: string;
};

export type LearningCourse = {
  id: string;
  slug: string;
  title: string;
  provider: string;
  providerSlug: string;
  instructor: string;
  providerUpdated: string;
  publicUrl: string;
  kind: CourseKind;
  status: CourseStatus;
  evidenceState: EvidenceState;
  metadataVerifiedAt: string;
  relatedTicketKey: string;
  initiativeSlug: string;
  relatedProjectSlug: string;
  capabilitySlugs: string[];
  evidenceIds: string[];
  progressSnapshots: CourseProgressSnapshot[];
  currentLearningFocus: string;
  nextAction: string;
  publicSummary: string;
  completionDate?: string;
  certificateUrl?: string;
  visibility: "Public";
  publicApproved: true;
  notClaimed: string;
};

export type LearningMilestone = {
  id: string;
  title: string;
  status: InitiativePhaseStatus;
};

export type LearningInitiative = {
  slug: string;
  title: string;
  goal: string;
  roadmapStatus: InitiativePhaseStatus;
  evidenceState: EvidenceState;
  startDate: string;
  targetDate?: string;
  completionDate?: string;
  careerObjective: string;
  roleLensSlugs: string[];
  currentPhase: string;
  nextAction: string;
  publicSummary: string;
  milestones: LearningMilestone[];
  visibility: "Public";
  publicApproved: true;
  notClaimed: string;
};

export type LearningBlocker = {
  id: string;
  summary: string;
  status: "Open" | "Resolved";
  addedAt: string;
  resolvedAt?: string;
};

export type LearningTicket = {
  key: string;
  issueType: IssueType;
  title: string;
  publicSummary: string;
  deliveryStatus: DeliveryStatus;
  evidenceState: EvidenceState;
  priority: Priority;
  initiativeSlug: string;
  parentKey?: string;
  dependencies: string[];
  blockers: LearningBlocker[];
  createdAt: string;
  plannedStart: string;
  targetDate?: string;
  actualStart?: string;
  completionDate?: string;
  estimateHours?: number;
  definitionOfDone: string;
  acceptanceCriteria: string[];
  capabilitySlugs: string[];
  roleLensSlugs: string[];
  evidenceIds: string[];
  reflection?: string;
  nextAction: string;
  relatedProjectSlug: string;
  visibility: "Public";
  publicApproved: true;
  notClaimed: string;
};

export type WorkSession = {
  id: string;
  date: string;
  startedAt?: string;
  endedAt?: string;
  ticketKey: string;
  problemCategory: string;
  capabilitySlugs: string[];
  whatIDid: string;
  outcome: string;
  whatILearned: string;
  nextAction: string;
  roleLensSlugs: string[];
  evidenceIds: string[];
  blocker?: string;
  privateDetailsRemoved: true;
  visibility: "Public";
  publicApproved: true;
  notClaimed: string;
};

export type LearningEvidence = {
  id: string;
  type:
    | "Course certificate"
    | "Notes"
    | "SQL script"
    | "Query result"
    | "Test"
    | "README"
    | "Diagram"
    | "Case study"
    | "Presentation"
    | "Demo"
    | "Reflection"
    | "Pull request"
    | "Source code"
    | "Documentation";
  title: string;
  dateCreated: string;
  createdAt: string;
  verificationState: EvidenceVerificationState;
  evidenceStateSupported: EvidenceState;
  relatedTicketKeys: string[];
  relatedProjectSlug: string;
  capabilitySlugs: string[];
  roleLensSlugs: string[];
  publicUrl?: string;
  repositoryPath?: string;
  publicSummary: string;
  limitations: string;
  visibility: "Public";
  publicApproved: true;
  approvedAt: string;
  notClaimed: string;
};

export type BoardFilters = {
  initiative?: string;
  delivery?: DeliveryStatus;
  evidence?: EvidenceState;
  capability?: string;
  role?: string;
  issueType?: IssueType;
};

export type TimelineFilters = Pick<BoardFilters, "initiative" | "capability" | "role">;

export type LearningTimelineEvent = {
  id: string;
  occurredAt: string;
  type: "Ticket created" | "Work started" | "Work session recorded" | "Artifact created" | "Ticket completed" | "Evidence approved";
  title: string;
  summary: string;
  ticketKey?: string;
  initiativeSlug: string;
  capabilitySlugs: string[];
  roleLensSlugs: string[];
};

export const capabilityLabels = {
  "delivery-modeling": "Delivery modeling",
  "evidence-design": "Evidence design",
  "privacy-review": "Privacy review",
  accessibility: "Accessibility",
  "responsive-design": "Responsive design",
  testing: "Testing",
  sql: "SQL",
  "data-analysis": "Data analysis",
  "healthcare-data": "Healthcare data",
  "data-quality": "Data-quality investigation",
  troubleshooting: "Troubleshooting",
  "root-cause-analysis": "Root-cause analysis",
  "technical-account-management": "Technical account management",
  "technical-account-planning": "Technical account planning",
  "executive-communication": "Executive communication",
  "customer-risk-management": "Customer-risk management",
} as const;

export const learningRoleLabels = {
  "senior-technical-support-engineer": "Senior Technical Support Engineer",
  "technical-account-manager": "Technical Account Manager",
  "customer-success-engineer": "Customer Success Engineer",
  "data-analytics": "Data Analytics",
  "application-engineer": "Application Engineer",
  "forward-deployed-engineer": "Forward Deployed Engineer",
} as const;

const systemRoles = [
  "senior-technical-support-engineer",
  "technical-account-manager",
  "customer-success-engineer",
  "data-analytics",
  "application-engineer",
  "forward-deployed-engineer",
];

const sqlRoles = [
  "technical-account-manager",
  "data-analytics",
  "customer-success-engineer",
  "senior-technical-support-engineer",
];

const implementationCreatedAt = "2026-08-07T18:59:26-06:00";
const implementationCompletedAt = "2026-08-07T19:26:46-06:00";

export const learningInitiatives = [
  {
    slug: "careeros-learning-delivery",
    title: "CareerOS Learning & Delivery System",
    goal: "Turn planned learning and delivery work into reviewed, recruiter-safe evidence without publishing private operating notes.",
    roadmapStatus: "Active",
    evidenceState: "Practicing",
    startDate: "2026-08-07",
    careerObjective: "Make professional growth visible through truthful execution history, artifacts, and next actions.",
    roleLensSlugs: systemRoles,
    currentPhase: "Public workflow verification",
    nextAction: "Verify the production routes, then create the private Jira operating board before enabling any export workflow.",
    publicSummary: "A typed CareerOS workflow for planning work, recording execution and blockers, linking evidence to capabilities and role lenses, and publishing only reviewed public derivatives.",
    milestones: [
      { id: "LDS-M1", title: "Workflow and evidence model", status: "Completed" },
      { id: "LDS-M2", title: "Public learning board and ticket routes", status: "Completed" },
      { id: "LDS-M3", title: "Private Jira operating board", status: "Next" },
      { id: "LDS-M4", title: "Healthcare SQL initiative", status: "Next" },
      { id: "LDS-M5", title: "Safe Jira-to-CareerOS publishing workflow", status: "Planned" },
      { id: "LDS-M6", title: "Learning analytics and review cadence", status: "Planned" },
    ],
    visibility: "Public",
    publicApproved: true,
    notClaimed: "This public workflow does not mean Jira is connected, private notes are synchronized, or tracked work proves readiness for every related role.",
  },
  {
    slug: "healthcare-sql-customer-operations",
    title: "Healthcare Customer Operations SQL Case Study",
    goal: "Build a reproducible SQL and technical-account-management case study with synthetic healthcare data.",
    roadmapStatus: "Active",
    evidenceState: "Learning",
    startDate: "2026-08-08",
    targetDate: "2026-08-09",
    careerObjective: "Strengthen applied SQL, data-quality investigation, root-cause analysis, and customer communication evidence.",
    roleLensSlugs: sqlRoles,
    currentPhase: "Foundational course in progress",
    nextAction: "Verify current SQL Essential Training progress, finish only the remaining course work, and record the SQL baseline without treating course progress as proficiency.",
    publicSummary: "An applied SQL and technical-account-management case study using synthetic healthcare data to investigate data quality, explain customer impact, structure a root-cause analysis, and recommend a practical action plan.",
    milestones: [
      { id: "SQL-M1", title: "Baseline and learning focus recorded", status: "Active" },
      { id: "SQL-M2", title: "Synthetic dataset and environment documented", status: "Next" },
      { id: "SQL-M3", title: "Data-quality investigation validated", status: "Planned" },
      { id: "SQL-M4", title: "Public case study reviewed", status: "Planned" },
    ],
    visibility: "Public",
    publicApproved: true,
    notClaimed: "No course completion, SQL proficiency certification, healthcare-domain expertise, real customer incident, or finished case study is claimed.",
  },
] satisfies LearningInitiative[];

export const learningCourses: LearningCourse[] = [
  {
    id: "COURSE-SQL-ESSENTIAL-TRAINING",
    slug: "sql-essential-training-linkedin-learning",
    title: "SQL Essential Training",
    provider: "LinkedIn Learning",
    providerSlug: "linkedin-learning",
    instructor: "Walter Shields",
    providerUpdated: "May 2024",
    publicUrl: "https://www.linkedin.com/learning/sql-essential-training-20685933",
    kind: "Course",
    status: "In Progress",
    evidenceState: "Learning",
    metadataVerifiedAt: "2026-08-07",
    relatedTicketKey: "SQL-002",
    initiativeSlug: "healthcare-sql-customer-operations",
    relatedProjectSlug: "healthcare-sql-customer-operations",
    capabilitySlugs: [
      "sql",
      "data-analysis",
      "healthcare-data",
      "troubleshooting",
      "root-cause-analysis",
      "technical-account-management",
    ],
    evidenceIds: [],
    progressSnapshots: [],
    currentLearningFocus: "Complete SQL Essential Training and identify concepts to apply in the synthetic healthcare SQL case study.",
    nextAction: "Verify the current LinkedIn Learning progress with Jason, then complete the remaining course work and record an original concept summary.",
    publicSummary: "Foundational SQL course work connected to an applied, synthetic-data investigation rather than presented as standalone proof of proficiency.",
    visibility: "Public",
    publicApproved: true,
    notClaimed: "The current percentage, completed modules, completion date, certificate, SQL mastery, healthcare expertise, and applied project outcome are not yet verified.",
  },
];

function systemTicket(
  ticket: Omit<LearningTicket, "createdAt" | "plannedStart" | "initiativeSlug" | "relatedProjectSlug" | "visibility" | "publicApproved" | "blockers" | "roleLensSlugs"> & {
    plannedStart?: string;
    roleLensSlugs?: string[];
  },
): LearningTicket {
  return {
    ...ticket,
    actualStart: ticket.actualStart === "2026-08-07" ? implementationCreatedAt : ticket.actualStart,
    completionDate: ticket.completionDate === "2026-08-07" ? implementationCompletedAt : ticket.completionDate,
    createdAt: implementationCreatedAt,
    plannedStart: ticket.plannedStart ?? "2026-08-07",
    initiativeSlug: "careeros-learning-delivery",
    relatedProjectSlug: "careeros-learning-delivery",
    visibility: "Public",
    publicApproved: true,
    blockers: [],
    roleLensSlugs: ticket.roleLensSlugs ?? systemRoles,
  };
}

function sqlTicket(
  ticket: Omit<LearningTicket, "createdAt" | "plannedStart" | "initiativeSlug" | "relatedProjectSlug" | "visibility" | "publicApproved" | "blockers" | "roleLensSlugs"> & {
    plannedStart?: string;
    roleLensSlugs?: string[];
  },
): LearningTicket {
  return {
    ...ticket,
    createdAt: implementationCreatedAt,
    plannedStart: ticket.plannedStart ?? "2026-08-08",
    initiativeSlug: "healthcare-sql-customer-operations",
    relatedProjectSlug: "healthcare-sql-customer-operations",
    visibility: "Public",
    publicApproved: true,
    blockers: [],
    roleLensSlugs: ticket.roleLensSlugs ?? sqlRoles,
  };
}

const implementationEvidence = ["EVD-LDS-SOURCE", "EVD-LDS-TESTS"];

export const learningTickets = [
  systemTicket({
    key: "LDS-001",
    issueType: "Epic",
    title: "Build the public Learning & Delivery workflow",
    publicSummary: "Implement the typed, validated, read-only public projection while keeping private authoring outside the browser bundle.",
    deliveryStatus: "Done",
    evidenceState: "Practicing",
    priority: "Highest",
    dependencies: [],
    actualStart: "2026-08-07",
    completionDate: "2026-08-07",
    definitionOfDone: "The overview, board, timeline, ticket routes, validated data, documentation, and honest seed initiative are present and pass project checks.",
    acceptanceCriteria: ["Public routes render", "Private fields are rejected", "SQL seed claims remain uncompleted"],
    capabilitySlugs: ["delivery-modeling", "evidence-design", "privacy-review"],
    evidenceIds: implementationEvidence,
    reflection: "Separating workflow, evidence, and visibility states prevents a completed task from becoming an unsupported capability claim.",
    nextAction: "Create and verify the private Jira board without changing the public runtime boundary.",
    notClaimed: "This epic does not claim a live Jira integration or measured learning outcomes.",
  }),
  systemTicket({
    key: "PRODUCT-211",
    issueType: "Story",
    title: "Add the public learning overview",
    publicSummary: "Summarize current focus, initiatives, sprint candidates, recent evidence, delivery health, and one next action.",
    deliveryStatus: "Done",
    evidenceState: "Practicing",
    priority: "High",
    parentKey: "LDS-001",
    dependencies: ["PRODUCT-201", "PRODUCT-202", "PRODUCT-203"],
    actualStart: "2026-08-07",
    completionDate: "2026-08-07",
    definitionOfDone: "The overview answers the active-work, role relevance, status, evidence, and next-action questions without vanity metrics.",
    acceptanceCriteria: ["Metrics are derived", "No fabricated hours or readiness percentages", "The highest-value next action is visible"],
    capabilitySlugs: ["delivery-modeling", "evidence-design"],
    evidenceIds: implementationEvidence,
    nextAction: "Review the overview after the first real SQL work session.",
    notClaimed: "The overview does not claim that planned SQL learning has started.",
  }),
  systemTicket({
    key: "PRODUCT-212",
    issueType: "Story",
    title: "Add the public read-only work board",
    publicSummary: "Show approved tickets by delivery status with shareable, low-cardinality filters and a stacked mobile layout.",
    deliveryStatus: "Done",
    evidenceState: "Practicing",
    priority: "High",
    parentKey: "LDS-001",
    dependencies: ["PRODUCT-204"],
    actualStart: "2026-08-07",
    completionDate: "2026-08-07",
    definitionOfDone: "Approved tickets are grouped by status, filters combine through URL parameters, and the board does not allow public editing.",
    acceptanceCriteria: ["Ready through Done columns render", "Backlog is available separately", "Cards link to ticket details", "Mobile has no horizontal board scrolling"],
    capabilitySlugs: ["delivery-modeling", "responsive-design", "accessibility"],
    evidenceIds: implementationEvidence,
    nextAction: "Use the board during the first SQL work session and review filter usefulness.",
    notClaimed: "The board is not Jira and does not edit private work items.",
  }),
  systemTicket({
    key: "PRODUCT-213",
    issueType: "Story",
    title: "Add public ticket detail routes",
    publicSummary: "Render approved context, completion rules, dependencies, evidence, sessions, next actions, and truth boundaries for each public ticket.",
    deliveryStatus: "Done",
    evidenceState: "Practicing",
    priority: "High",
    parentKey: "LDS-001",
    dependencies: ["PRODUCT-202", "PRODUCT-204"],
    actualStart: "2026-08-07",
    completionDate: "2026-08-07",
    definitionOfDone: "Valid public keys render detail pages and unknown or private keys use the established not-found experience.",
    acceptanceCriteria: ["Truth boundaries are visible", "Evidence and sessions are linked", "Unknown keys do not leak records"],
    capabilitySlugs: ["evidence-design", "privacy-review", "accessibility"],
    evidenceIds: implementationEvidence,
    nextAction: "Add real SQL evidence links only after human review.",
    notClaimed: "Ticket detail pages do not expose raw notes, private URLs, or external issue identifiers.",
  }),
  systemTicket({
    key: "PRODUCT-214",
    issueType: "Story",
    title: "Add initiative and milestone views",
    publicSummary: "Represent macro roadmap progress separately from ticket delivery and evidence states.",
    deliveryStatus: "Done",
    evidenceState: "Practicing",
    priority: "Medium",
    parentKey: "LDS-001",
    dependencies: ["PRODUCT-203"],
    actualStart: "2026-08-07",
    completionDate: "2026-08-07",
    definitionOfDone: "Initiatives expose derived completed milestone counts, current phases, and next actions without invented percentages.",
    acceptanceCriteria: ["Roadmap and delivery statuses remain distinct", "Counts come from milestone records"],
    capabilitySlugs: ["delivery-modeling"],
    evidenceIds: ["EVD-LDS-SOURCE"],
    nextAction: "Update milestone status only when its evidence gate is met.",
    notClaimed: "Milestone counts are not role-readiness scores.",
  }),
  systemTicket({
    key: "PRODUCT-215",
    issueType: "Story",
    title: "Add the work-session and evidence timeline",
    publicSummary: "Derive chronology only from dated tickets, approved sessions, and verified artifacts.",
    deliveryStatus: "Done",
    evidenceState: "Practicing",
    priority: "Medium",
    parentKey: "LDS-001",
    dependencies: ["PRODUCT-201", "PRODUCT-202"],
    actualStart: "2026-08-07",
    completionDate: "2026-08-07",
    definitionOfDone: "The timeline is date ordered, filterable, and contains no inferred history that is absent from source records.",
    acceptanceCriteria: ["Events are derived", "Filters support initiative, capability, and role", "Dates use semantic time elements"],
    capabilitySlugs: ["evidence-design", "accessibility"],
    evidenceIds: implementationEvidence,
    nextAction: "Record the first SQL work session before showing SQL activity.",
    notClaimed: "No healthcare SQL learning event has been recorded yet.",
  }),
  systemTicket({
    key: "PRODUCT-219",
    issueType: "Story",
    title: "Add truthful current-course progress tracking",
    publicSummary: "Connect a verified course record to existing tickets, initiatives, projects, evidence states, and timestamped progress snapshots without adding a second learning tracker.",
    deliveryStatus: "Done",
    evidenceState: "Practicing",
    priority: "High",
    parentKey: "LDS-001",
    dependencies: ["PRODUCT-211", "PRODUCT-213", "PRODUCT-217", "PRODUCT-218"],
    actualStart: "2026-08-07T20:24:55-06:00",
    completionDate: "2026-08-07T20:47:31-06:00",
    definitionOfDone: "The current-course experience, snapshot validation, truth boundaries, analytics allowlist, integration decision, responsive behavior, and focused tests are implemented and verified.",
    acceptanceCriteria: ["No unverified numeric progress is rendered", "Course progress remains separate from proficiency", "LinkedIn is not a browser runtime dependency", "Completed-course history remains available"],
    capabilitySlugs: ["delivery-modeling", "evidence-design", "privacy-review", "testing", "accessibility", "responsive-design"],
    evidenceIds: implementationEvidence,
    nextAction: "Record a verified progress snapshot only after Jason confirms the visible provider value.",
    notClaimed: "This work does not claim LinkedIn synchronization, course completion, SQL proficiency, or a completed healthcare case study.",
  }),
  systemTicket({
    key: "PRODUCT-216",
    issueType: "Spike",
    title: "Set up private Jira authoring and evaluate a safe export",
    publicSummary: "Configure the private operating board first, then test a one-way staging export that still requires human publication approval.",
    deliveryStatus: "Ready",
    evidenceState: "Planned",
    priority: "Medium",
    parentKey: "LDS-001",
    dependencies: ["PRODUCT-204"],
    definitionOfDone: "A private board is verified, credentials remain local, a raw export stays gitignored, and only a reviewed derivative can pass publication validation.",
    acceptanceCriteria: ["No browser Jira calls", "No committed credentials", "Human approval remains mandatory", "Manual export remains available"],
    capabilitySlugs: ["privacy-review", "delivery-modeling"],
    evidenceIds: [],
    nextAction: "Create the team-managed Kanban board and workflow in an authenticated Jira session.",
    notClaimed: "Jira is not connected and no controlled export has been tested.",
  }),
  systemTicket({
    key: "PRODUCT-217",
    issueType: "Story",
    title: "Seed the healthcare SQL initiative",
    publicSummary: "Create an honest, synthetic-data SQL plan with dependencies, evidence gates, and no pre-completed learning.",
    deliveryStatus: "Done",
    evidenceState: "Practicing",
    priority: "High",
    parentKey: "LDS-001",
    dependencies: ["PRODUCT-204"],
    actualStart: "2026-08-07",
    completionDate: "2026-08-07",
    definitionOfDone: "Public seed tickets exist in credible order, private preparation stays private, and no course or project outcome is fabricated.",
    acceptanceCriteria: ["SQL-001 and SQL-002 are Ready", "Applied work remains Backlog", "Only synthetic or public data is allowed"],
    capabilitySlugs: ["delivery-modeling", "privacy-review"],
    evidenceIds: ["EVD-LDS-SOURCE"],
    nextAction: "Start SQL-001 only when the real baseline session begins.",
    notClaimed: "Creating the plan is not evidence of SQL proficiency or healthcare experience.",
  }),
  systemTicket({
    key: "PRODUCT-218",
    issueType: "Task",
    title: "Verify accessibility, responsiveness, and tests",
    publicSummary: "Run focused data, route, filter, keyboard, responsive, typecheck, test, and production-build checks.",
    deliveryStatus: "Done",
    evidenceState: "Practicing",
    priority: "High",
    parentKey: "LDS-001",
    dependencies: ["PRODUCT-211", "PRODUCT-212", "PRODUCT-213", "PRODUCT-215"],
    actualStart: "2026-08-07",
    completionDate: "2026-08-07",
    definitionOfDone: "Automated checks and desktop, tablet, and mobile browser verification pass without application-generated console errors.",
    acceptanceCriteria: ["Typecheck and tests pass", "Production build passes", "Direct routes refresh", "Keyboard controls and narrow layouts work"],
    capabilitySlugs: ["testing", "accessibility", "responsive-design"],
    evidenceIds: ["EVD-LDS-TESTS"],
    nextAction: "Repeat production route checks after deployment.",
    notClaimed: "Automated and browser checks reduce risk but do not prove every assistive-technology combination.",
  }),
  sqlTicket({
    key: "SQL-000",
    issueType: "Epic",
    title: "Build the Healthcare Customer Operations SQL Case Study",
    publicSummary: "Plan and produce a synthetic-data SQL investigation with a customer-facing root-cause and action plan.",
    deliveryStatus: "Ready",
    evidenceState: "Learning",
    priority: "Highest",
    dependencies: [],
    definitionOfDone: "The applied investigation is reproducible, tested, publicly reviewed, and explicit about its fictional and synthetic scope.",
    acceptanceCriteria: ["Only synthetic or public data", "Queries and findings are reproducible", "Customer impact and limitations are explained"],
    capabilitySlugs: ["sql", "healthcare-data", "data-quality", "root-cause-analysis", "technical-account-planning"],
    evidenceIds: [],
    nextAction: "Begin with the SQL baseline and verified course context.",
    notClaimed: "This planned epic is not a completed case study or a real healthcare incident.",
  }),
  sqlTicket({
    key: "SQL-001",
    issueType: "Spike",
    title: "Establish SQL baseline and project questions",
    publicSummary: "Record current strengths and gaps, then define five to eight SQL questions that support a customer-operations investigation.",
    deliveryStatus: "Ready",
    evidenceState: "Learning",
    priority: "Highest",
    parentKey: "SQL-000",
    dependencies: [],
    definitionOfDone: "Current strengths, gaps, five to eight relevant SQL questions, and the next learning focus are recorded.",
    acceptanceCriteria: ["Baseline is candid", "Questions connect query work to customer decisions", "No proficiency score is invented"],
    capabilitySlugs: ["sql", "data-quality", "technical-account-planning"],
    evidenceIds: [],
    nextAction: "Record the current SQL strengths, gaps, and project questions without assigning a proficiency score.",
    notClaimed: "This baseline is not a proficiency certification.",
  }),
  sqlTicket({
    key: "SQL-002",
    issueType: "Task",
    title: "Complete remaining LinkedIn Learning SQL course work",
    publicSummary: "Continue SQL Essential Training by Walter Shields, then capture completion and original learning notes only when each requirement is verified.",
    deliveryStatus: "In Progress",
    evidenceState: "Learning",
    priority: "High",
    parentKey: "SQL-000",
    dependencies: [],
    definitionOfDone: "Course completion is verified, an available completion page or certificate is captured, key concepts are summarized in Jason's own words, applied follow-up tickets are linked, and the actual completion date is recorded.",
    acceptanceCriteria: ["Current progress is verified before a percentage is published", "Completion is not pre-marked", "Applied work remains a separate evidence gate", "A 100% progress value alone does not satisfy every completion requirement"],
    capabilitySlugs: ["sql", "data-analysis", "healthcare-data", "troubleshooting", "root-cause-analysis", "technical-account-management"],
    evidenceIds: [],
    nextAction: "Verify the current provider progress, then finish the remaining course work and write an original concept summary.",
    notClaimed: "The course is in progress, but its current percentage, completed modules, completion date, certificate, and learning outcomes are not yet verified.",
  }),
  sqlTicket({
    key: "SQL-003",
    issueType: "Story",
    title: "Convert course concepts into a SQL reference and practice set",
    publicSummary: "Write original examples, expected results, and practical usage notes only for techniques actually studied and practiced.",
    deliveryStatus: "Backlog",
    evidenceState: "Learning",
    priority: "Medium",
    parentKey: "SQL-000",
    dependencies: ["SQL-001", "SQL-002"],
    definitionOfDone: "Original examples include expected results and explain when each verified technique is useful.",
    acceptanceCriteria: ["Examples are original", "Coverage reflects actual study", "Results are checked"],
    capabilitySlugs: ["sql"],
    evidenceIds: [],
    nextAction: "Wait for the baseline and verified course scope.",
    notClaimed: "No SQL technique is represented as practiced until an original example is run and reviewed.",
  }),
  sqlTicket({
    key: "SQL-004",
    issueType: "Spike",
    title: "Select and document a synthetic healthcare dataset",
    publicSummary: "Evaluate a small, licensed synthetic healthcare dataset and document its source, acquisition, privacy rationale, and limitations.",
    deliveryStatus: "Ready",
    evidenceState: "Learning",
    priority: "High",
    parentKey: "SQL-000",
    dependencies: [],
    definitionOfDone: "The source, license, version or access date, data dictionary, reproducible acquisition steps, sample size, privacy rationale, and limitations are documented.",
    acceptanceCriteria: ["No PHI or real patient data", "A small reproducible sample is preferred", "The final license and source are recorded"],
    capabilitySlugs: ["healthcare-data", "privacy-review", "data-quality"],
    evidenceIds: [],
    nextAction: "Evaluate a small Synthea CSV sample and confirm its current license and schema.",
    notClaimed: "No dataset has been selected or downloaded yet.",
  }),
  sqlTicket({
    key: "SQL-005",
    issueType: "Task",
    title: "Create the reproducible SQL environment",
    publicSummary: "Create a lightweight environment with deterministic data setup and a clean-start verification command.",
    deliveryStatus: "Backlog",
    evidenceState: "Planned",
    priority: "High",
    parentKey: "SQL-000",
    dependencies: ["SQL-004"],
    definitionOfDone: "Setup instructions, schema and import scripts, deterministic sample data, and a clean-start verification command work together.",
    acceptanceCriteria: ["Environment is recruiter-reproducible", "Data setup is deterministic", "No sensitive data is present"],
    capabilitySlugs: ["sql", "healthcare-data", "testing"],
    evidenceIds: [],
    nextAction: "Choose the environment after the dataset format is known.",
    notClaimed: "PostgreSQL and Docker are candidates, not confirmed implementation choices.",
  }),
  sqlTicket({
    key: "SQL-006",
    issueType: "Story",
    title: "Profile healthcare data quality with SQL",
    publicSummary: "Use original queries to examine volume, uniqueness, completeness, validity, consistency, and referential integrity.",
    deliveryStatus: "Backlog",
    evidenceState: "Planned",
    priority: "High",
    parentKey: "SQL-000",
    dependencies: ["SQL-005"],
    definitionOfDone: "Original queries and reviewed findings cover the selected data-quality dimensions.",
    acceptanceCriteria: ["Queries execute", "Findings cite query evidence", "Limitations are recorded"],
    capabilitySlugs: ["sql", "data-quality", "healthcare-data"],
    evidenceIds: [],
    nextAction: "Complete the reproducible environment first.",
    notClaimed: "No data profile or finding exists yet.",
  }),
  sqlTicket({
    key: "SQL-007",
    issueType: "Story",
    title: "Investigate a fictional healthcare data incident",
    publicSummary: "Use synthetic data to test hypotheses, explain impact, identify a root cause, and separate mitigation from durable remediation.",
    deliveryStatus: "Backlog",
    evidenceState: "Planned",
    priority: "High",
    parentKey: "SQL-000",
    dependencies: ["SQL-006"],
    definitionOfDone: "The fictional symptom, hypotheses, SQL investigation, findings, root cause, impact, mitigation, durable fix, and validation are documented.",
    acceptanceCriteria: ["Scenario is explicitly fictional", "Data is synthetic", "Claims follow executed queries"],
    capabilitySlugs: ["sql", "data-quality", "root-cause-analysis", "healthcare-data"],
    evidenceIds: [],
    nextAction: "Define the scenario only after the dataset profile reveals plausible synthetic conditions.",
    notClaimed: "The scenario does not reflect a real customer, product, schema, or incident.",
  }),
  sqlTicket({
    key: "SQL-008",
    issueType: "Story",
    title: "Create the technical account action and communication plan",
    publicSummary: "Translate synthetic findings into customer objectives, risks, owners, escalation thresholds, updates, and success indicators.",
    deliveryStatus: "Backlog",
    evidenceState: "Planned",
    priority: "Medium",
    parentKey: "SQL-000",
    dependencies: ["SQL-007"],
    definitionOfDone: "A customer objective, risk register, stakeholder map, owner-based actions, escalation thresholds, update cadence, and success indicators are documented.",
    acceptanceCriteria: ["Actions distinguish immediate and durable work", "Owners and follow-up are explicit", "Communication is concise"],
    capabilitySlugs: ["technical-account-planning", "executive-communication", "customer-risk-management", "root-cause-analysis"],
    evidenceIds: [],
    nextAction: "Wait for validated findings from the fictional incident.",
    notClaimed: "This will be a fictional planning artifact, not a record of managing a real healthcare account.",
  }),
  sqlTicket({
    key: "SQL-009",
    issueType: "Task",
    title: "Test queries and reproducibility",
    publicSummary: "Run the project from a clean environment, verify expected outputs and edge cases, and confirm that all data is safe.",
    deliveryStatus: "Backlog",
    evidenceState: "Planned",
    priority: "High",
    parentKey: "SQL-000",
    dependencies: ["SQL-006", "SQL-007", "SQL-008"],
    definitionOfDone: "Queries execute from a clean environment, expected outputs and edge cases are verified, and no sensitive or proprietary data exists.",
    acceptanceCriteria: ["Clean-start run passes", "Expected outputs are documented", "Privacy review passes"],
    capabilitySlugs: ["sql", "testing", "privacy-review"],
    evidenceIds: [],
    nextAction: "Run only after the investigation and action plan exist.",
    notClaimed: "No query or environment has been tested yet.",
  }),
  sqlTicket({
    key: "SQL-010",
    issueType: "Story",
    title: "Publish the healthcare SQL case study",
    publicSummary: "Publish reviewed setup, data flow, SQL examples, findings, limitations, and a truthful evidence state.",
    deliveryStatus: "Backlog",
    evidenceState: "Planned",
    priority: "Medium",
    parentKey: "SQL-000",
    dependencies: ["SQL-009"],
    definitionOfDone: "The public page and appropriate artifact include reproducible instructions, a diagram, SQL examples, findings, limitations, and reviewed claims.",
    acceptanceCriteria: ["All linked artifacts are real", "Evidence state matches proof", "Public review is recorded"],
    capabilitySlugs: ["sql", "healthcare-data", "data-quality", "executive-communication"],
    evidenceIds: [],
    nextAction: "Publish only after reproducibility and confidentiality review pass.",
    notClaimed: "The case study is not complete or publication-ready.",
  }),
  sqlTicket({
    key: "SQL-012",
    issueType: "Task",
    title: "Retrospective and next SQL gaps",
    publicSummary: "Record what worked, what was difficult, what changed, remaining gaps, and the next highest-value SQL task.",
    deliveryStatus: "Backlog",
    evidenceState: "Planned",
    priority: "Low",
    parentKey: "SQL-000",
    dependencies: ["SQL-010"],
    definitionOfDone: "The retrospective records outcomes, difficulty, changes, remaining gaps, and one next action without inflating evidence state.",
    acceptanceCriteria: ["Reflection cites completed work", "Remaining gaps are explicit", "Next action is singular"],
    capabilitySlugs: ["sql", "evidence-design"],
    evidenceIds: [],
    nextAction: "Wait until the reviewed project is published.",
    notClaimed: "No retrospective outcome exists before the applied work is completed.",
  }),
] satisfies LearningTicket[];

export const learningEvidence = [
  {
    id: "EVD-LDS-SOURCE",
    type: "Source code",
    title: "Typed Learning & Delivery public data model",
    dateCreated: "2026-08-07",
    createdAt: "2026-08-07T18:59:26-06:00",
    verificationState: "Verified",
    evidenceStateSupported: "Practicing",
    relatedTicketKeys: ["LDS-001", "PRODUCT-211", "PRODUCT-212", "PRODUCT-213", "PRODUCT-214", "PRODUCT-215", "PRODUCT-217", "PRODUCT-219"],
    relatedProjectSlug: "careeros-learning-delivery",
    capabilitySlugs: ["delivery-modeling", "evidence-design", "privacy-review"],
    roleLensSlugs: systemRoles,
    repositoryPath: "src/data/learning.ts",
    publicSummary: "A typed public record model separates delivery, roadmap, evidence, and visibility states and validates relationships and publication approval.",
    limitations: "The source module is a curated public projection and is not a private authoring database.",
    visibility: "Public",
    publicApproved: true,
    approvedAt: implementationCompletedAt,
    notClaimed: "This artifact does not prove a live Jira integration or generalized product readiness.",
  },
  {
    id: "EVD-LDS-TESTS",
    type: "Test",
    title: "Learning data, filters, routes, and privacy validation",
    dateCreated: "2026-08-07",
    createdAt: "2026-08-07T18:59:26-06:00",
    verificationState: "Verified",
    evidenceStateSupported: "Practicing",
    relatedTicketKeys: ["LDS-001", "PRODUCT-211", "PRODUCT-212", "PRODUCT-213", "PRODUCT-215", "PRODUCT-218", "PRODUCT-219"],
    relatedProjectSlug: "careeros-learning-delivery",
    capabilitySlugs: ["testing", "privacy-review", "accessibility", "responsive-design"],
    roleLensSlugs: ["application-engineer", "forward-deployed-engineer"],
    repositoryPath: "src/data/learning.test.tsx",
    publicSummary: "Focused automated checks cover identifiers, relationships, course progress, history, completion boundaries, analytics privacy, routes, chronology, and truthful SQL states.",
    limitations: "Automated checks are supplemented by browser review and do not replace human publication approval.",
    visibility: "Public",
    publicApproved: true,
    approvedAt: implementationCompletedAt,
    notClaimed: "Passing tests does not prove every browser or assistive-technology combination.",
  },
] satisfies LearningEvidence[];

export const workSessions: WorkSession[] = [
  {
    id: "SESSION-2026-08-07-01",
    date: "2026-08-07",
    startedAt: "2026-08-07T18:59:26-06:00",
    endedAt: implementationCompletedAt,
    ticketKey: "LDS-001",
    problemCategory: "Workflow and evidence modeling",
    capabilitySlugs: ["delivery-modeling", "evidence-design", "privacy-review"],
    whatIDid: "Separated initiative, ticket, session, evidence, roadmap, delivery, and visibility concepts into a typed public model with approval validation.",
    outcome: "The public projection can fail typecheck, tests, or module validation when records are incomplete, private, or inconsistent.",
    whatILearned: "Completion, evidence maturity, and publication approval need independent states to keep recruiter-facing claims truthful.",
    nextAction: "Verify the routes and create the private Jira board in an authenticated session.",
    roleLensSlugs: ["application-engineer", "forward-deployed-engineer", "technical-account-manager"],
    evidenceIds: implementationEvidence,
    privateDetailsRemoved: true,
    visibility: "Public",
    publicApproved: true,
    notClaimed: "This session records implementation work, not SQL course work or healthcare expertise.",
  },
];

export const currentLearningSprint = {
  title: "Healthcare SQL preparation weekend",
  startDate: "2026-08-08",
  endDate: "2026-08-09",
  candidateTicketKeys: ["SQL-001", "SQL-002", "SQL-004", "SQL-007", "SQL-010"],
  goals: [
    "Verify the current SQL Essential Training progress and remaining modules",
    "Establish the SQL baseline",
    "Complete only the remaining course work that is realistically finished",
    "Select a synthetic dataset",
    "Define the fictional customer and data-quality scenario",
    "Decide the minimum shareable deliverable",
    "Record the first Five-Minute Evidence Capture entry",
  ],
  highestValueNextAction: "Verify the current SQL Essential Training progress, then complete the remaining course work and record Jason's original concept summary before closing SQL-002.",
} as const;

const evidenceStates: EvidenceState[] = ["Demonstrated", "Practicing", "Learning", "Planned"];
const roadmapStatuses: InitiativePhaseStatus[] = ["Active", "Next", "Planned", "Completed"];
const forbiddenPublicKeys = new Set([
  "jiraUrl",
  "jiraKey",
  "apiToken",
  "accessToken",
  "refreshToken",
  "accountEmail",
  "accountId",
  "authenticatedUrl",
  "certificateId",
  "cookie",
  "cookies",
  "password",
  "privateSourceReference",
  "privateNotes",
  "comments",
  "attachments",
]);
const forbiddenPublicText = [
  /@[a-z0-9.-]+\.[a-z]{2,}/i,
  /https?:\/\/[^\s]*atlassian\.net/i,
  /linkedin\.com\/learning\/(?:me|my-learning|in-progress)(?:\/|\?|$)/i,
];

function duplicateValues(values: string[]) {
  const seen = new Set<string>();
  return values.filter((value) => {
    if (seen.has(value)) return true;
    seen.add(value);
    return false;
  });
}

function inspectPublicValue(value: unknown, path: string, errors: string[]) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => inspectPublicValue(item, `${path}[${index}]`, errors));
    return;
  }
  if (value && typeof value === "object") {
    Object.entries(value).forEach(([key, item]) => {
      if (forbiddenPublicKeys.has(key)) errors.push(`${path}.${key} is a forbidden public field`);
      inspectPublicValue(item, `${path}.${key}`, errors);
    });
    return;
  }
  if (typeof value === "string" && forbiddenPublicText.some((pattern) => pattern.test(value))) {
    errors.push(`${path} contains public-forbidden text`);
  }
}

export function validatePublicationCandidate(candidate: unknown) {
  const errors: string[] = [];
  if (!candidate || typeof candidate !== "object") return ["Candidate must be a record"];
  const record = candidate as Record<string, unknown>;
  if (record.visibility !== "Public") errors.push("Candidate visibility must be Public");
  if (record.publicApproved !== true) errors.push("Candidate requires human public approval");
  if (typeof record.notClaimed !== "string" || !record.notClaimed.trim()) errors.push("Candidate requires a truth boundary");
  inspectPublicValue(record, "candidate", errors);
  return errors;
}

export function validateCourseProgressSnapshot(snapshot: CourseProgressSnapshot) {
  const errors: string[] = [];
  const observedAt = Date.parse(snapshot.observedAt);
  if (!snapshot.observedAt.trim() || Number.isNaN(observedAt)) {
    errors.push(`${snapshot.id} has an invalid observation timestamp`);
  }

  if (!courseProgressSources.includes(snapshot.source)) errors.push(`${snapshot.id} has an unsupported progress source`);
  if (!courseProgressVerificationStates.includes(snapshot.verificationState)) errors.push(`${snapshot.id} has an invalid verification state`);
  if (!courseProgressValueKinds.includes(snapshot.valueKind)) errors.push(`${snapshot.id} has an invalid progress value kind`);
  if (
    snapshot.percentage !== undefined
    && (!Number.isFinite(snapshot.percentage) || snapshot.percentage < 0 || snapshot.percentage > 100)
  ) {
    errors.push(`${snapshot.id} percentage must be between 0 and 100`);
  }

  const durations = [
    ["total", snapshot.totalDurationSeconds],
    ["completed", snapshot.completedDurationSeconds],
    ["remaining", snapshot.remainingDurationSeconds],
  ] as const;
  durations.forEach(([label, value]) => {
    if (value !== undefined && (!Number.isFinite(value) || value < 0)) errors.push(`${snapshot.id} ${label} duration cannot be negative`);
  });

  if (snapshot.completedDurationSeconds !== undefined && snapshot.totalDurationSeconds === undefined) {
    errors.push(`${snapshot.id} completed duration requires a total duration`);
  }
  if (snapshot.remainingDurationSeconds !== undefined && snapshot.totalDurationSeconds === undefined) {
    errors.push(`${snapshot.id} remaining duration requires a total duration`);
  }
  if (
    snapshot.completedDurationSeconds !== undefined
    && snapshot.totalDurationSeconds !== undefined
    && snapshot.completedDurationSeconds > snapshot.totalDurationSeconds
  ) {
    errors.push(`${snapshot.id} completed duration cannot exceed total duration`);
  }
  if (
    snapshot.remainingDurationSeconds !== undefined
    && snapshot.totalDurationSeconds !== undefined
    && snapshot.remainingDurationSeconds > snapshot.totalDurationSeconds
  ) {
    errors.push(`${snapshot.id} remaining duration cannot exceed total duration`);
  }
  if (snapshot.valueKind === "Provider reported" && snapshot.percentage === undefined) {
    errors.push(`${snapshot.id} provider-reported progress requires a percentage`);
  }
  if (
    snapshot.valueKind === "Derived"
    && (
      snapshot.totalDurationSeconds === undefined
      || (snapshot.completedDurationSeconds === undefined && snapshot.remainingDurationSeconds === undefined)
    )
  ) {
    errors.push(`${snapshot.id} derived progress requires total and completed or remaining duration`);
  }

  return errors;
}

export function getCourseProgressPercentage(snapshot: CourseProgressSnapshot) {
  if (snapshot.percentage !== undefined) return snapshot.percentage;
  if (!snapshot.totalDurationSeconds) return undefined;
  const completed = snapshot.completedDurationSeconds
    ?? (snapshot.remainingDurationSeconds === undefined
      ? undefined
      : snapshot.totalDurationSeconds - snapshot.remainingDurationSeconds);
  if (completed === undefined) return undefined;
  return Math.round((completed / snapshot.totalDurationSeconds) * 100);
}

export function getCurrentCourseProgress(course: LearningCourse) {
  return [...course.progressSnapshots]
    .filter((snapshot) => snapshot.verificationState === "Verified")
    .sort((a, b) => b.observedAt.localeCompare(a.observedAt) || b.id.localeCompare(a.id))[0];
}

export function recordCourseProgress(course: LearningCourse, snapshot: CourseProgressSnapshot): LearningCourse {
  const errors = validateCourseProgressSnapshot(snapshot);
  if (course.progressSnapshots.some((item) => item.id === snapshot.id)) errors.push(`Duplicate course progress identifier: ${snapshot.id}`);
  if (errors.length > 0) throw new Error(errors.join("\n"));
  return { ...course, progressSnapshots: [...course.progressSnapshots, snapshot] };
}

export function completeLearningCourse(course: LearningCourse, completionDate: string): LearningCourse {
  const currentProgress = getCurrentCourseProgress(course);
  if (Number.isNaN(Date.parse(completionDate))) throw new Error("Course completion requires a valid date");
  if (!currentProgress || getCourseProgressPercentage(currentProgress) !== 100) {
    throw new Error("Course completion requires a verified 100% progress snapshot");
  }
  return {
    ...course,
    status: "Completed",
    completionDate,
    progressSnapshots: [...course.progressSnapshots],
    capabilitySlugs: [...course.capabilitySlugs],
    evidenceIds: [...course.evidenceIds],
  };
}

export function validateLearningData(
  initiatives: readonly LearningInitiative[] = learningInitiatives,
  tickets: readonly LearningTicket[] = learningTickets,
  sessions: readonly WorkSession[] = workSessions,
  evidence: readonly LearningEvidence[] = learningEvidence,
  courses: readonly LearningCourse[] = learningCourses,
) {
  const errors: string[] = [];
  const identifierGroups = [
    ["initiative", initiatives.map((item) => item.slug)],
    ["ticket", tickets.map((item) => item.key)],
    ["session", sessions.map((item) => item.id)],
    ["evidence", evidence.map((item) => item.id)],
    ["course", courses.map((item) => item.id)],
    ["course progress", courses.flatMap((course) => course.progressSnapshots.map((snapshot) => snapshot.id))],
  ] as const;

  identifierGroups.forEach(([label, identifiers]) => {
    duplicateValues(identifiers).forEach((identifier) => errors.push(`Duplicate ${label} identifier: ${identifier}`));
  });

  const initiativeSlugs = new Set(initiatives.map((item) => item.slug));
  const ticketByKey = new Map(tickets.map((ticket) => [ticket.key, ticket]));
  const evidenceIds = new Set(evidence.map((item) => item.id));

  initiatives.forEach((initiative) => {
    if (!roadmapStatuses.includes(initiative.roadmapStatus)) errors.push(`${initiative.slug} has an invalid roadmap status`);
    errors.push(...validatePublicationCandidate(initiative).map((error) => `${initiative.slug}: ${error}`));
  });

  tickets.forEach((ticket) => {
    if (!deliveryStatuses.includes(ticket.deliveryStatus)) errors.push(`${ticket.key} has an invalid delivery status`);
    if (!evidenceStates.includes(ticket.evidenceState)) errors.push(`${ticket.key} has an invalid evidence state`);
    if (!issueTypes.includes(ticket.issueType)) errors.push(`${ticket.key} has an invalid issue type`);
    if (!initiativeSlugs.has(ticket.initiativeSlug)) errors.push(`${ticket.key} references an unknown initiative`);
    if (ticket.parentKey && !ticketByKey.has(ticket.parentKey)) errors.push(`${ticket.key} references unknown parent ${ticket.parentKey}`);
    if (ticket.parentKey && ticketByKey.get(ticket.parentKey)?.issueType !== "Epic") errors.push(`${ticket.key} parent must be an Epic`);
    ticket.dependencies.forEach((dependency) => {
      if (!ticketByKey.has(dependency) && !dependency.startsWith("PRODUCT-20")) errors.push(`${ticket.key} references unknown dependency ${dependency}`);
    });
    ticket.evidenceIds.forEach((id) => {
      if (!evidenceIds.has(id)) errors.push(`${ticket.key} references unknown evidence ${id}`);
    });
    if (ticket.deliveryStatus === "Done" && !ticket.completionDate) errors.push(`${ticket.key} is Done without a completion date`);
    if (ticket.deliveryStatus === "Done" && (!ticket.definitionOfDone.trim() || ticket.evidenceIds.length === 0)) errors.push(`${ticket.key} is Done without its public definition of done or evidence`);
    errors.push(...validatePublicationCandidate(ticket).map((error) => `${ticket.key}: ${error}`));
  });

  courses.forEach((course) => {
    if (!courseStatuses.includes(course.status)) errors.push(`${course.id} has an invalid course status`);
    if (!courseKinds.includes(course.kind)) errors.push(`${course.id} has an invalid course kind`);
    if (!evidenceStates.includes(course.evidenceState)) errors.push(`${course.id} has an invalid evidence state`);
    if (!ticketByKey.has(course.relatedTicketKey)) errors.push(`${course.id} references unknown ticket ${course.relatedTicketKey}`);
    if (!initiativeSlugs.has(course.initiativeSlug)) errors.push(`${course.id} references an unknown initiative`);
    course.evidenceIds.forEach((id) => {
      if (!evidenceIds.has(id)) errors.push(`${course.id} references unknown evidence ${id}`);
    });
    course.progressSnapshots.forEach((snapshot) => {
      errors.push(...validateCourseProgressSnapshot(snapshot));
      if (snapshot.verificationState !== "Verified") {
        errors.push(`${snapshot.id} is an unverified candidate and cannot enter public course data`);
      }
      snapshot.relatedEvidenceIds.forEach((id) => {
        if (!evidenceIds.has(id)) errors.push(`${snapshot.id} references unknown evidence ${id}`);
      });
    });
    const currentProgress = getCurrentCourseProgress(course);
    if (course.status === "Completed" && !course.completionDate) errors.push(`${course.id} is Completed without a completion date`);
    if (course.status === "Completed" && (!currentProgress || getCourseProgressPercentage(currentProgress) !== 100)) {
      errors.push(`${course.id} is Completed without verified 100% course progress`);
    }
    errors.push(...validatePublicationCandidate(course).map((error) => `${course.id}: ${error}`));
  });

  const visitState = new Map<string, "visiting" | "visited">();
  function visit(key: string, trail: string[]) {
    if (visitState.get(key) === "visiting") {
      errors.push(`Dependency cycle: ${[...trail, key].join(" -> ")}`);
      return;
    }
    if (visitState.get(key) === "visited") return;
    visitState.set(key, "visiting");
    const ticket = ticketByKey.get(key);
    ticket?.dependencies.filter((dependency) => ticketByKey.has(dependency)).forEach((dependency) => visit(dependency, [...trail, key]));
    visitState.set(key, "visited");
  }
  tickets.forEach((ticket) => visit(ticket.key, []));

  sessions.forEach((session) => {
    if (!ticketByKey.has(session.ticketKey)) errors.push(`${session.id} references unknown ticket ${session.ticketKey}`);
    session.evidenceIds.forEach((id) => {
      if (!evidenceIds.has(id)) errors.push(`${session.id} references unknown evidence ${id}`);
    });
    if (!session.privateDetailsRemoved) errors.push(`${session.id} has not confirmed private-detail removal`);
    errors.push(...validatePublicationCandidate(session).map((error) => `${session.id}: ${error}`));
  });

  evidence.forEach((artifact) => {
    artifact.relatedTicketKeys.forEach((key) => {
      if (!ticketByKey.has(key)) errors.push(`${artifact.id} references unknown ticket ${key}`);
    });
    errors.push(...validatePublicationCandidate(artifact).map((error) => `${artifact.id}: ${error}`));
  });

  const sqlTickets = tickets.filter((ticket) => ticket.key.startsWith("SQL-"));
  if (sqlTickets.some((ticket) => ticket.evidenceState === "Demonstrated")) {
    errors.push("Healthcare SQL work must not claim Demonstrated without reviewed applied evidence");
  }
  if (evidence.some((artifact) =>
    artifact.relatedProjectSlug === "healthcare-sql-customer-operations"
    && artifact.evidenceStateSupported === "Demonstrated")) {
    errors.push("Healthcare SQL evidence must not claim Demonstrated before reviewed applied work exists");
  }

  return errors;
}

export function assertValidLearningData() {
  const errors = validateLearningData();
  if (errors.length > 0) throw new Error(`Invalid public learning data:\n${errors.join("\n")}`);
}

export function getLearningTicket(ticketKey: string) {
  return learningTickets.find((ticket) => ticket.key === ticketKey.toUpperCase());
}

export function getLearningInitiative(slug: string) {
  return learningInitiatives.find((initiative) => initiative.slug === slug);
}

export function getInitiativeProgress(initiative: LearningInitiative) {
  return {
    completed: initiative.milestones.filter((milestone) => milestone.status === "Completed").length,
    total: initiative.milestones.length,
  };
}

export function getTicketEffortMinutes(ticketKey: string) {
  return workSessions
    .filter((session) => session.ticketKey === ticketKey && session.startedAt && session.endedAt)
    .reduce((minutes, session) => {
      const duration = new Date(session.endedAt!).getTime() - new Date(session.startedAt!).getTime();
      return minutes + Math.max(0, Math.round(duration / 60_000));
    }, 0);
}

const evidenceStateSet = new Set<EvidenceState>(evidenceStates);
const deliveryStatusSet = new Set<DeliveryStatus>(deliveryStatuses);
const issueTypeSet = new Set<IssueType>(issueTypes);

export function parseBoardFilters(search: string): BoardFilters {
  const parameters = new URLSearchParams(search);
  const initiative = parameters.get("initiative") ?? undefined;
  const delivery = parameters.get("delivery") ?? undefined;
  const evidence = parameters.get("evidence") ?? undefined;
  const capability = parameters.get("capability") ?? undefined;
  const role = parameters.get("role") ?? undefined;
  const issueType = parameters.get("type") ?? undefined;
  return {
    initiative: initiative && learningInitiatives.some((item) => item.slug === initiative) ? initiative : undefined,
    delivery: delivery && deliveryStatusSet.has(delivery as DeliveryStatus) ? (delivery as DeliveryStatus) : undefined,
    evidence: evidence && evidenceStateSet.has(evidence as EvidenceState) ? (evidence as EvidenceState) : undefined,
    capability: capability && capability in capabilityLabels ? capability : undefined,
    role: role && role in learningRoleLabels ? role : undefined,
    issueType: issueType && issueTypeSet.has(issueType as IssueType) ? (issueType as IssueType) : undefined,
  };
}

export function filterLearningTickets(filters: BoardFilters) {
  return learningTickets.filter((ticket) =>
    (!filters.initiative || ticket.initiativeSlug === filters.initiative)
    && (!filters.delivery || ticket.deliveryStatus === filters.delivery)
    && (!filters.evidence || ticket.evidenceState === filters.evidence)
    && (!filters.capability || ticket.capabilitySlugs.includes(filters.capability))
    && (!filters.role || ticket.roleLensSlugs.includes(filters.role))
    && (!filters.issueType || ticket.issueType === filters.issueType));
}

export function parseTimelineFilters(search: string): TimelineFilters {
  const filters = parseBoardFilters(search);
  return { initiative: filters.initiative, capability: filters.capability, role: filters.role };
}

export function getLearningTimeline(filters: TimelineFilters = {}) {
  const events: LearningTimelineEvent[] = [];

  learningTickets.forEach((ticket) => {
    events.push({
      id: `${ticket.key}-created`,
      occurredAt: ticket.createdAt,
      type: "Ticket created",
      title: `${ticket.key} created`,
      summary: ticket.publicSummary,
      ticketKey: ticket.key,
      initiativeSlug: ticket.initiativeSlug,
      capabilitySlugs: ticket.capabilitySlugs,
      roleLensSlugs: ticket.roleLensSlugs,
    });
    if (ticket.actualStart) {
      events.push({
        id: `${ticket.key}-started`,
        occurredAt: ticket.actualStart,
        type: "Work started",
        title: `${ticket.key} moved into active work`,
        summary: ticket.nextAction,
        ticketKey: ticket.key,
        initiativeSlug: ticket.initiativeSlug,
        capabilitySlugs: ticket.capabilitySlugs,
        roleLensSlugs: ticket.roleLensSlugs,
      });
    }
    if (ticket.completionDate) {
      events.push({
        id: `${ticket.key}-completed`,
        occurredAt: ticket.completionDate,
        type: "Ticket completed",
        title: `${ticket.key} completed`,
        summary: ticket.definitionOfDone,
        ticketKey: ticket.key,
        initiativeSlug: ticket.initiativeSlug,
        capabilitySlugs: ticket.capabilitySlugs,
        roleLensSlugs: ticket.roleLensSlugs,
      });
    }
  });

  workSessions.forEach((session) => {
    const ticket = getLearningTicket(session.ticketKey)!;
    events.push({
      id: session.id,
      occurredAt: session.startedAt ?? session.date,
      type: "Work session recorded",
      title: `${session.ticketKey}: ${session.problemCategory}`,
      summary: session.outcome,
      ticketKey: session.ticketKey,
      initiativeSlug: ticket.initiativeSlug,
      capabilitySlugs: session.capabilitySlugs,
      roleLensSlugs: session.roleLensSlugs,
    });
  });

  learningEvidence.forEach((artifact) => {
    const ticket = getLearningTicket(artifact.relatedTicketKeys[0])!;
    events.push({
      id: `${artifact.id}-created`,
      occurredAt: artifact.createdAt,
      type: "Artifact created",
      title: artifact.title,
      summary: artifact.publicSummary,
      ticketKey: ticket.key,
      initiativeSlug: ticket.initiativeSlug,
      capabilitySlugs: artifact.capabilitySlugs,
      roleLensSlugs: artifact.roleLensSlugs,
    });
    events.push({
      id: `${artifact.id}-approved`,
      occurredAt: artifact.approvedAt,
      type: "Evidence approved",
      title: `${artifact.title} approved for publication`,
      summary: artifact.limitations,
      ticketKey: ticket.key,
      initiativeSlug: ticket.initiativeSlug,
      capabilitySlugs: artifact.capabilitySlugs,
      roleLensSlugs: artifact.roleLensSlugs,
    });
  });

  return events
    .filter((event) =>
      (!filters.initiative || event.initiativeSlug === filters.initiative)
      && (!filters.capability || event.capabilitySlugs.includes(filters.capability))
      && (!filters.role || event.roleLensSlugs.includes(filters.role)))
    .sort((a, b) => b.occurredAt.localeCompare(a.occurredAt) || b.id.localeCompare(a.id));
}

assertValidLearningData();
