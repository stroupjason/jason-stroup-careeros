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
export const bugCategories = [
  "Authentication",
  "Authorization",
  "Data",
  "Integration",
  "UI",
  "Accessibility",
  "Performance",
  "Security/Privacy",
  "Deployment",
  "Observability",
  "Content",
] as const;
export const bugSeverities = ["Critical", "High", "Moderate", "Low"] as const;

export type DeliveryStatus = (typeof deliveryStatuses)[number];
export type VisibilityState = (typeof visibilityStates)[number];
export type IssueType = (typeof issueTypes)[number];
export type BugCategory = (typeof bugCategories)[number];
export type BugSeverity = (typeof bugSeverities)[number];
export type Priority = "Highest" | "High" | "Medium" | "Low";
export type EvidenceVerificationState = "Verified" | "Pending Review" | "Not Yet Created";

export const courseStatuses = ["Enrolled", "In Progress", "Completed"] as const;
export const courseKinds = ["Course", "Academic course", "Professional certification"] as const;
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
  scope: "Course progress";
  observedAt: string;
  source: CourseProgressSource;
  sourceProvider: string;
  verificationState: CourseProgressVerificationState;
  verificationLabel: string;
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
  courseNumber?: string;
  institution?: string;
  institutionSlug?: string;
  academicProgramSlug?: string;
  specializationSlug?: string;
  nominalCredits?: number;
  enrollmentState?: "Enrolled";
  learningCategory: "Complementary professional learning" | "Academic program coursework";
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

export type CareerTrack = {
  slug: string;
  title: string;
  currentRoleFocus: string;
  progression: string;
  academicFoundation: string;
  currentAcademicPathway: string;
  complementaryLearning: string;
  appliedEvidenceStreams: string[];
  currentSprintGoal: string;
  highestValueNextAction: string;
};

export type AcademicProgram = {
  slug: string;
  title: string;
  institution: string;
  platform: string;
  publicStatus: string;
  publicUrl: string;
  curriculumVerifiedAt: string;
  totalCredits: number;
  breadthCredits: number;
  electiveCredits: number;
  activePathwaySlug: string;
  coursesEnrolled: number;
  coursesCompleted: number;
  earnedCreditsLabel: "Not yet verified";
  admissionStatus: "Not verified";
  notClaimed: string;
};

export type AcademicSpecialization = {
  slug: string;
  title: string;
  subtitle: string;
  institution: string;
  provider: string;
  publicUrl: string;
  instructor: string;
  courseCount: number;
  status: "In Progress";
  evidenceState: EvidenceState;
  relatedProgramSlug: string;
  relatedInitiativeSlug: string;
  relatedTicketKey: string;
  capabilitySlugs: string[];
  nextAction: string;
  creditsContext: string;
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
  startDate?: string;
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
  plannedStart?: string;
  targetDate?: string;
  actualStart?: string;
  completionDate?: string;
  userEstimate?: number;
  assistedEstimate?: number;
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
  bugClassification?: {
    category: BugCategory;
    severity: BugSeverity;
    detectedOn: string;
    resolvedOn?: string;
    verifiedOn?: string;
    affectedService: string;
    environment: "Production" | "Preview" | "Development";
    affectedFeatureKeys: string[];
    relatedIncidentKey: string;
    publicSymptom: string;
    publicRootCause: string;
    publicFix: string;
    publicVerification: string;
    prevention: string;
  };
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
  "networking-fundamentals": "Networking fundamentals",
  "tcp-ip": "TCP/IP",
  "linux-networking": "Linux networking",
  "network-troubleshooting": "Network troubleshooting",
  "cloud-networking": "Cloud networking",
  "network-architecture": "Network architecture",
  "cloud-infrastructure": "Cloud infrastructure",
  "technical-communication": "Technical communication",
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

const networkRoles = [
  "technical-account-manager",
  "customer-success-engineer",
  "senior-technical-support-engineer",
  "application-engineer",
  "forward-deployed-engineer",
];

const implementationCreatedAt = "2026-08-07T18:59:26-06:00";
const implementationCompletedAt = "2026-08-07T19:26:46-06:00";

export const careerTrack: CareerTrack = {
  slug: "customer-facing-technical-engineering",
  title: "Customer-Facing Technical Engineering",
  currentRoleFocus: "Technical Account Management",
  progression: "Technical Account Manager -> Customer/Solutions Engineering -> Forward-Deployed Engineering",
  academicFoundation: "University of Colorado Boulder Master of Science in Computer Science coursework",
  currentAcademicPathway: "Network Systems: Principles and Practice",
  complementaryLearning: "SQL Essential Training",
  appliedEvidenceStreams: [
    "Healthcare SQL and customer operations",
    "Network and cloud troubleshooting",
  ],
  currentSprintGoal: "Finish verified foundational course work and convert it into original, reproducible applied evidence.",
  highestValueNextAction: "Finish the remaining SQL course work and continue CSCA 5063 without conflating course progress with demonstrated capability.",
};

export const academicPrograms: AcademicProgram[] = [
  {
    slug: "cu-boulder-mscs",
    title: "Master of Science in Computer Science",
    institution: "University of Colorado Boulder",
    platform: "Coursera",
    publicStatus: "Pursuing MS-CS coursework",
    publicUrl: "https://www.colorado.edu/cs/academics/online-programs/mscs-coursera/curriculum",
    curriculumVerifiedAt: "2026-08-08",
    totalCredits: 30,
    breadthCredits: 15,
    electiveCredits: 15,
    activePathwaySlug: "network-systems-principles-in-practice",
    coursesEnrolled: 3,
    coursesCompleted: 0,
    earnedCreditsLabel: "Not yet verified",
    admissionStatus: "Not verified",
    notClaimed: "Admission, degree-candidate status, for-credit enrollment, grades, GPA, earned credits, and degree progress are not verified in CareerOS.",
  },
];

export const academicSpecializations: AcademicSpecialization[] = [
  {
    slug: "network-systems-principles-in-practice",
    title: "Network Systems: Principles and Practice",
    subtitle: "Linux and Cloud Networking",
    institution: "University of Colorado Boulder",
    provider: "Coursera",
    publicUrl: "https://www.coursera.org/specializations/network-systems-principles-in-practice",
    instructor: "Eric Keller",
    courseCount: 3,
    status: "In Progress",
    evidenceState: "Learning",
    relatedProgramSlug: "cu-boulder-mscs",
    relatedInitiativeSlug: "cu-boulder-network-systems",
    relatedTicketKey: "CU-NET-000",
    capabilitySlugs: [
      "networking-fundamentals",
      "tcp-ip",
      "linux-networking",
      "network-troubleshooting",
      "cloud-networking",
      "network-architecture",
      "cloud-infrastructure",
      "technical-communication",
    ],
    nextAction: "Continue CSCA 5063 and build an original network-stack and packet-flow troubleshooting exercise.",
    creditsContext: "3 credits only when completed for credit and accepted under the applicable degree requirements",
    notClaimed: "No specialization percentage, course completion, earned credit, grade, admission milestone, or degree progress is claimed.",
  },
];

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
    currentPhase: "Secure admin backend verification",
    nextAction: "Apply and verify the reviewed Supabase migration, then provision Jason's immutable admin membership.",
    publicSummary: "A typed CareerOS workflow for planning work, recording execution and blockers, linking evidence to capabilities and role lenses, and publishing only reviewed public derivatives.",
    milestones: [
      { id: "LDS-M1", title: "Workflow and evidence model", status: "Completed" },
      { id: "LDS-M2", title: "Public learning board and ticket routes", status: "Completed" },
      { id: "LDS-M3", title: "Secure Supabase authoring workspace", status: "Active" },
      { id: "LDS-M4", title: "Healthcare SQL initiative", status: "Next" },
      { id: "LDS-M5", title: "Allowlisted public projection", status: "Active" },
      { id: "LDS-M6", title: "Learning analytics and review cadence", status: "Planned" },
    ],
    visibility: "Public",
    publicApproved: true,
    notClaimed: "This workflow does not mean provider accounts are synchronized or tracked work proves readiness for every related role.",
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
    nextAction: "Complete the remaining SQL Essential Training course work and record the SQL baseline without treating course progress as proficiency.",
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
  {
    slug: "cu-boulder-network-systems",
    title: "Complete CU Boulder Network Systems pathway",
    goal: "Complete the three-course Network Systems pathway truthfully and convert the learning into independent, public-safe network and cloud troubleshooting evidence.",
    roadmapStatus: "Active",
    evidenceState: "Learning",
    careerObjective: "Build networking, Linux, cloud, troubleshooting, and technical communication depth for customer-facing technical engineering roles.",
    roleLensSlugs: [
      "technical-account-manager",
      "customer-success-engineer",
      "senior-technical-support-engineer",
      "application-engineer",
      "forward-deployed-engineer",
    ],
    currentPhase: "CSCA 5063 in progress",
    nextAction: "Continue CSCA 5063 and create an original packet-flow or protocol-troubleshooting exercise.",
    publicSummary: "Three enrolled CU Boulder courses on Coursera connected to independent network, Linux, and cloud troubleshooting artifacts. Course consumption and applied capability remain separate evidence states.",
    milestones: [
      { id: "CU-NET-M1", title: "CSCA 5063 Network Systems Foundation", status: "Active" },
      { id: "CU-NET-M2", title: "CSCA 5073 Linux Networking", status: "Next" },
      { id: "CU-NET-M3", title: "CSCA 5083 Cloud Networking", status: "Planned" },
      { id: "CU-NET-M4", title: "Network Reliability & Cloud Troubleshooting Lab", status: "Planned" },
    ],
    visibility: "Public",
    publicApproved: true,
    notClaimed: "Enrollment in these courses does not establish admission, for-credit status, grades, earned credit, pathway completion, networking mastery, or degree progress.",
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
    learningCategory: "Complementary professional learning",
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
    progressSnapshots: [
      {
        id: "PROGRESS-SQL-ESSENTIAL-2026-08-07-184510",
        scope: "Course progress",
        observedAt: "2026-08-07T18:45:10-06:00",
        source: "User-provided screenshot",
        sourceProvider: "LinkedIn Learning",
        verificationState: "Verified",
        verificationLabel: "Verified from supplied screenshot",
        valueKind: "Derived",
        totalDurationSeconds: 16_560,
        completedDurationSeconds: 1_818,
        remainingDurationSeconds: 14_742,
        relatedEvidenceIds: [],
      },
    ],
    currentLearningFocus: "Complete SQL Essential Training and identify concepts to apply in the synthetic healthcare SQL case study.",
    nextAction: "Complete the remaining course work and record an original concept summary.",
    publicSummary: "Foundational SQL course work connected to an applied, synthetic-data investigation rather than presented as standalone proof of proficiency.",
    visibility: "Public",
    publicApproved: true,
    notClaimed: "Completed modules, completion date, certificate, SQL mastery, healthcare expertise, and applied project outcome are not yet verified.",
  },
  {
    id: "COURSE-CSCA-5063",
    slug: "csca-5063-network-systems-foundation",
    courseNumber: "CSCA 5063",
    title: "Network Systems Foundation",
    provider: "Coursera",
    providerSlug: "coursera",
    instructor: "Eric Keller",
    providerUpdated: "Curriculum verified Aug 2026",
    institution: "University of Colorado Boulder",
    institutionSlug: "cu-boulder",
    academicProgramSlug: "cu-boulder-mscs",
    specializationSlug: "network-systems-principles-in-practice",
    nominalCredits: 1,
    enrollmentState: "Enrolled",
    learningCategory: "Academic program coursework",
    publicUrl: "https://www.coursera.org/specializations/network-systems-principles-in-practice",
    kind: "Academic course",
    status: "In Progress",
    evidenceState: "Learning",
    metadataVerifiedAt: "2026-08-08",
    relatedTicketKey: "CU-NET-001",
    initiativeSlug: "cu-boulder-network-systems",
    relatedProjectSlug: "network-reliability-cloud-troubleshooting-lab",
    capabilitySlugs: [
      "networking-fundamentals",
      "tcp-ip",
      "network-troubleshooting",
      "technical-communication",
    ],
    evidenceIds: [],
    progressSnapshots: [
      {
        id: "PROGRESS-CSCA-5063-2026-08-08",
        scope: "Course progress",
        observedAt: "2026-08-08T12:00:00-06:00",
        source: "User-provided screenshot",
        sourceProvider: "Coursera",
        verificationState: "Verified",
        verificationLabel: "Verified from supplied screenshot",
        valueKind: "Provider reported",
        percentage: 20,
        relatedEvidenceIds: [],
        currentModule: "Sharing the Link (13-minute video)",
      },
    ],
    currentLearningFocus: "Network systems foundations and the path a packet takes across links and protocol layers.",
    nextAction: "Continue with Sharing the Link, then write an original packet-flow explanation.",
    publicSummary: "Active CU Boulder network systems course work connected to an independent packet-flow and protocol-troubleshooting exercise.",
    visibility: "Public",
    publicApproved: true,
    notClaimed: "The 20% value is course-scoped only. It does not establish specialization progress, earned credit, a grade, admission, degree progress, or demonstrated networking capability.",
  },
  {
    id: "COURSE-CSCA-5073",
    slug: "csca-5073-linux-networking",
    courseNumber: "CSCA 5073",
    title: "Network Principles in Practice: Linux Networking",
    provider: "Coursera",
    providerSlug: "coursera",
    instructor: "Eric Keller",
    providerUpdated: "Curriculum verified Aug 2026",
    institution: "University of Colorado Boulder",
    institutionSlug: "cu-boulder",
    academicProgramSlug: "cu-boulder-mscs",
    specializationSlug: "network-systems-principles-in-practice",
    nominalCredits: 1,
    enrollmentState: "Enrolled",
    learningCategory: "Academic program coursework",
    publicUrl: "https://www.coursera.org/specializations/network-systems-principles-in-practice",
    kind: "Academic course",
    status: "Enrolled",
    evidenceState: "Learning",
    metadataVerifiedAt: "2026-08-08",
    relatedTicketKey: "CU-NET-002",
    initiativeSlug: "cu-boulder-network-systems",
    relatedProjectSlug: "network-reliability-cloud-troubleshooting-lab",
    capabilitySlugs: ["linux-networking", "network-troubleshooting", "technical-communication"],
    evidenceIds: [],
    progressSnapshots: [],
    currentLearningFocus: "Enrolled; active course work has not yet been verified in CareerOS.",
    nextAction: "Begin after the active foundation course reaches its verified completion gate.",
    publicSummary: "Enrolled CU Boulder Linux networking course connected to a planned Linux troubleshooting lab and customer-facing diagnostic runbook.",
    visibility: "Public",
    publicApproved: true,
    notClaimed: "No course start, percentage, grade, completion, earned credit, applied artifact, or demonstrated Linux networking capability is claimed.",
  },
  {
    id: "COURSE-CSCA-5083",
    slug: "csca-5083-cloud-networking",
    courseNumber: "CSCA 5083",
    title: "Network Principles in Practice: Cloud Networking",
    provider: "Coursera",
    providerSlug: "coursera",
    instructor: "Eric Keller",
    providerUpdated: "Curriculum verified Aug 2026",
    institution: "University of Colorado Boulder",
    institutionSlug: "cu-boulder",
    academicProgramSlug: "cu-boulder-mscs",
    specializationSlug: "network-systems-principles-in-practice",
    nominalCredits: 1,
    enrollmentState: "Enrolled",
    learningCategory: "Academic program coursework",
    publicUrl: "https://www.coursera.org/specializations/network-systems-principles-in-practice",
    kind: "Academic course",
    status: "Enrolled",
    evidenceState: "Learning",
    metadataVerifiedAt: "2026-08-08",
    relatedTicketKey: "CU-NET-003",
    initiativeSlug: "cu-boulder-network-systems",
    relatedProjectSlug: "network-reliability-cloud-troubleshooting-lab",
    capabilitySlugs: ["cloud-networking", "network-architecture", "cloud-infrastructure", "network-troubleshooting"],
    evidenceIds: [],
    progressSnapshots: [],
    currentLearningFocus: "Enrolled; active course work has not yet been verified in CareerOS.",
    nextAction: "Begin after the preceding pathway course reaches its verified completion gate.",
    publicSummary: "Enrolled CU Boulder cloud networking course connected to a planned architecture and isolated failure-recovery exercise.",
    visibility: "Public",
    publicApproved: true,
    notClaimed: "No course start, percentage, grade, completion, earned credit, applied artifact, or demonstrated cloud networking capability is claimed.",
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

function academicTicket(
  ticket: Omit<LearningTicket, "createdAt" | "initiativeSlug" | "relatedProjectSlug" | "visibility" | "publicApproved" | "blockers" | "roleLensSlugs"> & {
    roleLensSlugs?: string[];
  },
): LearningTicket {
  return {
    ...ticket,
    createdAt: "2026-08-08T12:00:00-06:00",
    initiativeSlug: "cu-boulder-network-systems",
    relatedProjectSlug: "network-reliability-cloud-troubleshooting-lab",
    visibility: "Public",
    publicApproved: true,
    blockers: [],
    roleLensSlugs: ticket.roleLensSlugs ?? networkRoles,
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
    nextAction: "Verify the durable Supabase projection without changing the public truth boundary.",
    notClaimed: "This epic does not claim provider synchronization or measured learning outcomes.",
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
    notClaimed: "Anonymous visitors cannot edit records or receive private authoring fields.",
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
    issueType: "Epic",
    title: "Build the Jason-only CareerOS Learning Admin Workspace",
    publicSummary: "Add durable authentication, authorized authoring, audit history, and an allowlisted public projection to the existing learning board and ticket routes.",
    deliveryStatus: "In Progress",
    evidenceState: "Planned",
    priority: "Highest",
    parentKey: "LDS-001",
    dependencies: [],
    definitionOfDone: "Jason alone can administer the existing board and ticket routes through RLS-protected durable records, with audit history, fallback public data, and verified production persistence.",
    acceptanceCriteria: ["No public self-sign-up", "RLS and RPC authorization are verified", "Public/private records stay structurally separate", "Every material mutation is audited"],
    capabilitySlugs: ["privacy-review", "delivery-modeling", "testing", "accessibility"],
    evidenceIds: [],
    nextAction: "Apply and verify the reviewed Supabase migration, then provision Jason's immutable admin membership.",
    notClaimed: "The admin workspace is not production-verified until authentication, persistence, rollback, and anonymous-denial tests pass.",
  }),
  systemTicket({
    key: "PRODUCT-220",
    issueType: "Story",
    title: "Add durable auth, authorization, database, and migration",
    publicSummary: "Establish the single-admin Supabase foundation, versioned schema, RLS policies, allowlisted RPCs, seed parity, and rollback path.",
    deliveryStatus: "In Progress",
    evidenceState: "Planned",
    priority: "Highest",
    parentKey: "PRODUCT-216",
    dependencies: [],
    definitionOfDone: "The reviewed migration is applied, 22 baseline ticket keys survive parity checks, and anonymous and non-admin requests cannot reach authoring data.",
    acceptanceCriteria: ["Single immutable admin membership", "RLS on every authoring table", "Idempotent migration and seed", "No service key in the client"],
    capabilitySlugs: ["privacy-review", "delivery-modeling", "testing"],
    evidenceIds: [],
    nextAction: "Apply the migration to the approved CareerOS Supabase project and run the policy verification queries.",
    notClaimed: "Authorization and persistence remain unverified until the production database checks pass.",
  }),
  systemTicket({
    key: "PRODUCT-221",
    issueType: "Story",
    title: "Add authenticated board movement and accessible status controls",
    publicSummary: "Enable pointer, touch, keyboard, and conventional status movement on the existing board with optimistic rollback and durable rank updates.",
    deliveryStatus: "Ready",
    evidenceState: "Planned",
    priority: "High",
    parentKey: "PRODUCT-216",
    dependencies: ["PRODUCT-220"],
    definitionOfDone: "Authorized moves persist atomically, stale writes are rejected, failures roll back, and a status menu provides an equivalent accessible path.",
    acceptanceCriteria: ["Pointer, touch, and keyboard movement", "Accessible announcements", "Fractional rank", "Undo for a safe last move"],
    capabilitySlugs: ["accessibility", "responsive-design", "delivery-modeling"],
    evidenceIds: [],
    nextAction: "Verify the move RPC before testing the existing board controls.",
    notClaimed: "A rendered drag handle does not prove production persistence or complete assistive-technology coverage.",
  }),
  systemTicket({
    key: "PRODUCT-222",
    issueType: "Story",
    title: "Add ticket editing, truthful dates, and transition gates",
    publicSummary: "Manage public-safe and private ticket fields separately while preserving unknown dates and enforcing review and completion rules.",
    deliveryStatus: "Ready",
    evidenceState: "Planned",
    priority: "High",
    parentKey: "PRODUCT-216",
    dependencies: ["PRODUCT-220"],
    definitionOfDone: "Ticket edits use revision checks and transitions cannot fabricate starts, targets, completion, blockers, or evidence readiness.",
    acceptanceCriteria: ["Unknown dates remain unknown", "Blocked requires a private reason and next check", "Done enforces mandatory criteria", "Target history is audited"],
    capabilitySlugs: ["delivery-modeling", "privacy-review"],
    evidenceIds: [],
    nextAction: "Verify SQL-002 can be edited without backfilling any unknown field.",
    notClaimed: "No SQL-002 dates, estimates, sessions, or completion facts are supplied by this implementation ticket.",
  }),
  systemTicket({
    key: "PRODUCT-223",
    issueType: "Story",
    title: "Add work sessions and Five-Minute Evidence Capture",
    publicSummary: "Record actual work intervals, derive effort only from valid sessions, and capture reviewed public-safe outcomes separately from private notes.",
    deliveryStatus: "Ready",
    evidenceState: "Planned",
    priority: "High",
    parentKey: "PRODUCT-216",
    dependencies: ["PRODUCT-220", "PRODUCT-222"],
    definitionOfDone: "Running and manual sessions validate chronology, survive corrections with audit history, and never fabricate effort from status or progress.",
    acceptanceCriteria: ["One running session per admin", "End follows start", "Effort is derived", "Public summary requires approval"],
    capabilitySlugs: ["delivery-modeling", "evidence-design"],
    evidenceIds: [],
    nextAction: "Test one real SQL-002 session only when Jason begins actual work.",
    notClaimed: "No SQL-002 study time has been recorded by creating the session controls.",
  }),
  systemTicket({
    key: "PRODUCT-224",
    issueType: "Story",
    title: "Add validated progress-source and snapshot workflow",
    publicSummary: "Store immutable course-scoped snapshots with source, value basis, verification, private evidence reference, and separate publication approval.",
    deliveryStatus: "Ready",
    evidenceState: "Planned",
    priority: "High",
    parentKey: "PRODUCT-216",
    dependencies: ["PRODUCT-220"],
    definitionOfDone: "Candidates never replace verified current progress and no snapshot fabricates work time, understanding, credit, or degree progress.",
    acceptanceCriteria: ["Validated source types", "Exact scope", "Newest verified selection", "Provider API remains deferred"],
    capabilitySlugs: ["evidence-design", "privacy-review", "testing"],
    evidenceIds: [],
    nextAction: "Preserve the SQL and CSCA 5063 historical snapshots during migration.",
    notClaimed: "No live LinkedIn Learning or Coursera synchronization is implemented.",
  }),
  systemTicket({
    key: "PRODUCT-225",
    issueType: "Story",
    title: "Add deterministic task-health and effort assistance",
    publicSummary: "Explain assisted Fibonacci effort from six scored factors while keeping Jason's estimate, recorded effort, and course-duration planning separate.",
    deliveryStatus: "Ready",
    evidenceState: "Planned",
    priority: "Medium",
    parentKey: "PRODUCT-216",
    dependencies: ["PRODUCT-222", "PRODUCT-223"],
    definitionOfDone: "Every score boundary is tested, 13 recommends a split, and historical calibration remains unavailable before five comparable completions.",
    acceptanceCriteria: ["No LLM or external API", "Story points are not hours", "Missing inputs stay visible", "Jason's estimate is never overwritten"],
    capabilitySlugs: ["delivery-modeling", "testing"],
    evidenceIds: [],
    nextAction: "Run the deterministic boundary tests and inspect SQL-002's missing-input guidance.",
    notClaimed: "The assisted estimate is decision support, not a prediction or autonomous project-management decision.",
  }),
  systemTicket({
    key: "PRODUCT-226",
    issueType: "Story",
    title: "Add CU Boulder program, pathway, and course records",
    publicSummary: "Connect the MS-CS coursework context, Network Systems pathway, three enrolled courses, and independent applied-practice tickets without unsupported academic claims.",
    deliveryStatus: "In Progress",
    evidenceState: "Learning",
    priority: "High",
    parentKey: "PRODUCT-216",
    dependencies: ["PRODUCT-224"],
    definitionOfDone: "The three course cards and tickets render under Learning with correct relationships and only CSCA 5063 shows its verified course-scoped 20% value.",
    acceptanceCriteria: ["All three official course numbers", "No invented 5073 or 5083 progress", "Earned credits say Not yet verified", "No admission claim"],
    capabilitySlugs: ["delivery-modeling", "evidence-design", "networking-fundamentals"],
    evidenceIds: [],
    nextAction: "Verify all CU course and ticket routes on desktop and mobile.",
    notClaimed: "Course enrollment and provider progress do not establish for-credit status, grades, credit, admission, degree progress, or demonstrated capability.",
  }),
  systemTicket({
    key: "PRODUCT-227",
    issueType: "Story",
    title: "Verify admin security, privacy, accessibility, and production persistence",
    publicSummary: "Test anonymous, non-admin, and admin paths; direct refreshes; touch and keyboard controls; secret scanning; rollback; and persistence across deployment.",
    deliveryStatus: "Ready",
    evidenceState: "Planned",
    priority: "Highest",
    parentKey: "PRODUCT-216",
    dependencies: ["PRODUCT-220", "PRODUCT-221", "PRODUCT-222", "PRODUCT-223", "PRODUCT-224", "PRODUCT-225", "PRODUCT-226"],
    definitionOfDone: "Required checks pass on preview and production, and one real reversible SQL-002 workflow is confirmed without inventing missing facts.",
    acceptanceCriteria: ["Anonymous and non-admin denied", "No secrets in build", "Direct routes refresh", "Production edit survives deployment"],
    capabilitySlugs: ["testing", "privacy-review", "accessibility", "responsive-design"],
    evidenceIds: [],
    nextAction: "Run the complete verification matrix after the production migration is applied.",
    notClaimed: "Verification is not complete until the deployed admin and persistence checks actually pass.",
  }),
  systemTicket({
    key: "PRODUCT-228",
    issueType: "Epic",
    title: "CareerOS Delivery Intelligence & Operational Evidence",
    publicSummary: "Connect canonical delivery dates, flow metrics, evidence relationships, and reviewed operational incidents without creating a second tracker.",
    deliveryStatus: "In Progress",
    evidenceState: "Practicing",
    priority: "High",
    dependencies: ["PRODUCT-220", "PRODUCT-224"],
    definitionOfDone: "The roadmap, Learning drill-down, evidence map, Bug Log, and verification gate share canonical records and truthful metric definitions.",
    acceptanceCriteria: ["One canonical ticket source", "Missing dates remain unscheduled", "Bug records use stable board keys", "Private diagnostics never enter public data"],
    capabilitySlugs: ["delivery-modeling", "evidence-design", "privacy-review"],
    evidenceIds: ["EVD-DI-SOURCE", "EVD-DI-TESTS"],
    nextAction: "Complete production verification for the shared timeline and admin-only Bug Log migration.",
    notClaimed: "This active epic does not claim a live log-ingestion pipeline, predictive analytics, or an overall CareerOS completion score.",
  }),
  systemTicket({
    key: "PRODUCT-229",
    issueType: "Story",
    title: "Define canonical delivery metrics and truthful date semantics",
    publicSummary: "Derive WIP, bounded throughput, and comparable cycle time while preserving planned, actual, completed, open-ended, and unscheduled states.",
    deliveryStatus: "In Review",
    evidenceState: "Practicing",
    priority: "High",
    parentKey: "PRODUCT-228",
    dependencies: ["PRODUCT-220", "PRODUCT-222"],
    definitionOfDone: "Metric definitions are deterministic, boundary-tested, and withhold values when required source fields are absent.",
    acceptanceCriteria: ["WIP uses active delivery states", "Throughput uses verified completion dates", "Cycle time requires actual start and completion", "No readiness percentage"],
    capabilitySlugs: ["delivery-modeling", "testing"],
    evidenceIds: ["EVD-DI-SOURCE", "EVD-DI-TESTS"],
    nextAction: "Verify the production values against the current approved ticket projection.",
    notClaimed: "The metrics do not forecast completion, convert story points to hours, or measure career readiness.",
  }),
  systemTicket({
    key: "PRODUCT-230",
    issueType: "Story",
    title: "Add a portfolio roadmap and Gantt-like delivery timeline",
    publicSummary: "Show verified planned and actual windows, open-ended work, completion milestones, dependencies, and a first-class Unscheduled lane on the established roadmap.",
    deliveryStatus: "In Review",
    evidenceState: "Practicing",
    priority: "High",
    parentKey: "PRODUCT-228",
    dependencies: ["PRODUCT-220", "PRODUCT-229"],
    definitionOfDone: "Portfolio and Learning views reuse one timeline model and remain readable on desktop and narrow mobile without inventing dates.",
    acceptanceCriteria: ["Planned and actual semantics differ", "Unscheduled items stay usable", "Mobile has a textual equivalent", "No direct calendar dragging"],
    capabilitySlugs: ["delivery-modeling", "accessibility", "responsive-design"],
    evidenceIds: ["EVD-DI-SOURCE", "EVD-DI-TESTS"],
    nextAction: "Complete browser verification on the canonical roadmap and Learning timeline routes.",
    notClaimed: "Timeline bar length is not effort, duration prediction, or a promised deadline.",
  }),
  systemTicket({
    key: "PRODUCT-231",
    issueType: "Story",
    title: "Add an Evidence Delivery Map from work to demonstrated capability",
    publicSummary: "Explain one selected canonical path from career track through initiative, course, ticket, activity, evidence, capability, and role fit.",
    deliveryStatus: "In Review",
    evidenceState: "Practicing",
    priority: "Medium",
    parentKey: "PRODUCT-228",
    dependencies: ["PRODUCT-220", "PRODUCT-224"],
    definitionOfDone: "The relationship map is data-driven, linkable, accessible as semantic content, and preserves the evidence boundary.",
    acceptanceCriteria: ["Canonical relationships only", "Semantic ordered representation", "Missing evidence is explicit", "Role fit remains a lens"],
    capabilitySlugs: ["evidence-design", "accessibility", "responsive-design"],
    evidenceIds: ["EVD-DI-SOURCE", "EVD-DI-TESTS"],
    nextAction: "Verify every public node link and the narrow-mobile stacked path.",
    notClaimed: "Course participation does not automatically produce demonstrated capability or role readiness.",
  }),
  systemTicket({
    key: "PRODUCT-232",
    issueType: "Story",
    title: "Add compact Delivery Pulse summaries to Learning",
    publicSummary: "Provide active work, blocked-or-aging work, recent completions, the highest-value next action, and links to the canonical board and roadmap.",
    deliveryStatus: "In Review",
    evidenceState: "Practicing",
    priority: "Medium",
    parentKey: "PRODUCT-228",
    dependencies: ["PRODUCT-229", "PRODUCT-230"],
    definitionOfDone: "Learning uses a compact drill-down rather than a duplicate dashboard and exposes approved aggregates only.",
    acceptanceCriteria: ["At most three summary counts", "Highest-value next action visible", "Canonical board and roadmap links", "No private alerts or notes"],
    capabilitySlugs: ["delivery-modeling", "responsive-design"],
    evidenceIds: ["EVD-DI-SOURCE", "EVD-DI-TESTS"],
    nextAction: "Verify the compact pulse with current production data and no-backend fallback.",
    notClaimed: "The pulse is not a comprehensive project dashboard or a readiness score.",
  }),
  systemTicket({
    key: "PRODUCT-233",
    issueType: "Story",
    title: "Add a classified Bug Log linked to task-board bugs and affected feature work",
    publicSummary: "Use canonical board Bugs as the delivery source while keeping reviewed RCA observations and private evidence references in an admin-only operational view.",
    deliveryStatus: "In Progress",
    evidenceState: "Practicing",
    priority: "High",
    parentKey: "PRODUCT-228",
    dependencies: ["PRODUCT-220"],
    definitionOfDone: "Accepted defects have one stable Bug key, controlled classification, typed relationships, audit history, and separately approved public-safe derivatives.",
    acceptanceCriteria: ["One board Bug per defect", "Controlled category and severity", "Private diagnostic boundary", "Board Bugs saved view"],
    capabilitySlugs: ["delivery-modeling", "root-cause-analysis", "privacy-review"],
    evidenceIds: ["EVD-ADMIN-ACTIVATION"],
    nextAction: "Apply and verify the admin-only operations migration, then test classification persistence and audit history.",
    notClaimed: "No raw provider logs are public and no automated observation creates or resolves a Bug.",
  }),
  systemTicket({
    key: "PRODUCT-234",
    issueType: "Story",
    title: "Evaluate an admin-only Supabase operational-health dashboard",
    publicSummary: "Document a future server-side, bounded, redacted path from managed provider diagnostics to reviewed CareerOS incidents and Bugs.",
    deliveryStatus: "Backlog",
    evidenceState: "Planned",
    priority: "Low",
    parentKey: "PRODUCT-228",
    dependencies: ["PRODUCT-233"],
    definitionOfDone: "A reviewed architecture covers server-only credentials, query allowlists, redaction, retention, rate limits, cost, authorization, and rollback before implementation.",
    acceptanceCriteria: ["No browser management token", "Bounded redacted queries", "Jason-only authorization", "Plan and retention limits documented"],
    capabilitySlugs: ["privacy-review", "root-cause-analysis"],
    evidenceIds: [],
    nextAction: "Keep this in Backlog until a secure server execution boundary and real operational need are approved.",
    notClaimed: "CareerOS does not operate a ClickHouse cluster, Grafana deployment, or live Supabase log client.",
  }),
  systemTicket({
    key: "PRODUCT-235",
    issueType: "Story",
    title: "Verify visualization accessibility, privacy, performance, and responsive behavior",
    publicSummary: "Exercise timeline, metric, evidence-map, Bug-filter, empty, dense, unscheduled, direct-route, and narrow-mobile states before release completion.",
    deliveryStatus: "Ready",
    evidenceState: "Planned",
    priority: "High",
    parentKey: "PRODUCT-228",
    dependencies: ["PRODUCT-229", "PRODUCT-230", "PRODUCT-231", "PRODUCT-232", "PRODUCT-233"],
    definitionOfDone: "Automated and browser checks pass with semantic equivalents, visible focus, reduced motion, no overflow, and no private-data exposure.",
    acceptanceCriteria: ["Desktop and narrow mobile", "Keyboard and screen-reader equivalents", "Empty and all-unscheduled fixtures", "No application console errors"],
    capabilitySlugs: ["testing", "accessibility", "responsive-design", "privacy-review"],
    evidenceIds: [],
    nextAction: "Run the full release matrix after the operations migration is applied.",
    notClaimed: "The visualization release gate remains open until production browser verification completes.",
  }),
  systemTicket({
    key: "PRODUCT-236",
    issueType: "Bug",
    title: "Restore immutable admin membership authorization",
    publicSummary: "Resolved an authentication-versus-application-authorization mismatch by restoring the immutable single-admin membership mapping and verifying the authorization function.",
    deliveryStatus: "Done",
    evidenceState: "Practicing",
    priority: "Highest",
    parentKey: "PRODUCT-220",
    dependencies: [],
    completionDate: "2026-08-08",
    definitionOfDone: "The existing confirmed identity maps to exactly one active private membership and the server-side authorization helper returns true.",
    acceptanceCriteria: ["Existing identity preserved", "Exactly one active membership", "Immutable user identifier used", "No browser email allowlist"],
    capabilitySlugs: ["privacy-review", "root-cause-analysis", "testing"],
    evidenceIds: ["EVD-ADMIN-ACTIVATION"],
    nextAction: "Retain sign-out, expiry, unauthorized deep-link, and non-admin denial as regression coverage under PRODUCT-227.",
    notClaimed: "No identity, email address, membership row, or diagnostic query is published.",
    bugClassification: {
      category: "Authorization",
      severity: "High",
      detectedOn: "2026-08-08",
      resolvedOn: "2026-08-08",
      verifiedOn: "2026-08-08",
      affectedService: "CareerOS admin authorization",
      environment: "Production",
      affectedFeatureKeys: ["PRODUCT-220", "PRODUCT-227", "PRODUCT-233"],
      relatedIncidentKey: "OPS-INC-001",
      publicSymptom: "A confirmed signed-in session could not enter the CareerOS admin workspace.",
      publicRootCause: "The authenticated identity was not yet mapped to the private single-admin membership used by application authorization.",
      publicFix: "The existing identity was preserved and its immutable identifier was mapped to exactly one active membership.",
      publicVerification: "The authorization helper returned true and the same account later opened the live admin board.",
      prevention: "Keep identity provisioning and application membership checks separate, explicit, and regression-tested.",
    },
  }),
  systemTicket({
    key: "PRODUCT-237",
    issueType: "Bug",
    title: "Restore admin magic-link delivery after provider throttling",
    publicSummary: "Recovered passwordless delivery safely after the built-in provider's project email quota rejected a resend.",
    deliveryStatus: "Done",
    evidenceState: "Practicing",
    priority: "High",
    parentKey: "PRODUCT-220",
    dependencies: [],
    completionDate: "2026-08-08",
    definitionOfDone: "The confirmed user and membership remain intact, the quota window clears, and one fresh link establishes an authorized session.",
    acceptanceCriteria: ["Existing user preserved", "Project-wide throttle identified", "One deliberate retry after reset", "Authorized callback verified"],
    capabilitySlugs: ["root-cause-analysis", "privacy-review", "testing"],
    evidenceIds: ["EVD-ADMIN-ACTIVATION"],
    nextAction: "Evaluate custom SMTP separately without presenting it as configured or free.",
    notClaimed: "No raw Auth log, provider identifier, email address, request trace, or account metadata is published.",
    bugClassification: {
      category: "Authentication",
      severity: "Moderate",
      detectedOn: "2026-08-08",
      resolvedOn: "2026-08-08",
      verifiedOn: "2026-08-08",
      affectedService: "Passwordless email delivery",
      environment: "Production",
      affectedFeatureKeys: ["PRODUCT-220", "PRODUCT-233", "PRODUCT-239"],
      relatedIncidentKey: "OPS-INC-002",
      publicSymptom: "A fresh passwordless sign-in message could not be sent.",
      publicRootCause: "The managed built-in mail provider rejected the resend after its project-wide quota was reached.",
      publicFix: "The existing identity and membership were preserved, retries stopped, and one fresh link was requested after the quota window reset.",
      publicVerification: "The new link established a valid session and reached the authorized CareerOS workflow.",
      prevention: "Use deliberate resend behavior and evaluate custom SMTP only after provider, DNS, security, rollback, and cost gates are approved.",
    },
  }),
  systemTicket({
    key: "PRODUCT-238",
    issueType: "Bug",
    title: "Resolve ambiguous acceptance-item index during admin seed",
    publicSummary: "Corrected a post-authentication database failure in the first-login seed and ticket-creation acceptance-item paths.",
    deliveryStatus: "Done",
    evidenceState: "Practicing",
    priority: "Highest",
    parentKey: "PRODUCT-220",
    dependencies: [],
    completionDate: "2026-08-08",
    definitionOfDone: "Both Postgres function paths insert acceptance criteria without an ambiguous-column failure and the authorized board opens successfully.",
    acceptanceCriteria: ["Seed function corrected", "Ticket-creation function corrected", "Regression assertion passes", "Live stored functions and admin board verified"],
    capabilitySlugs: ["root-cause-analysis", "testing", "delivery-modeling"],
    evidenceIds: ["EVD-ADMIN-ACTIVATION"],
    nextAction: "Keep the ON CONFLICT regression assertion in the backend contract suite.",
    notClaimed: "The public record omits raw SQL, private identifiers, provider metadata, and database connection details.",
    bugClassification: {
      category: "Data",
      severity: "High",
      detectedOn: "2026-08-08",
      resolvedOn: "2026-08-08",
      verifiedOn: "2026-08-08",
      affectedService: "Learning admin database functions",
      environment: "Production",
      affectedFeatureKeys: ["PRODUCT-220", "PRODUCT-222", "PRODUCT-233"],
      relatedIncidentKey: "OPS-INC-003",
      publicSymptom: "Authentication succeeded, but the first durable learning seed failed while inserting acceptance criteria.",
      publicRootCause: "A PL/pgSQL local identifier shadowed a same-named table column in an ON CONFLICT target.",
      publicFix: "The local identifier was renamed in both affected functions and a focused regression assertion was added.",
      publicVerification: "Typecheck, 54 tests, the production build, live function-definition checks, and authorized admin-board access passed for release 941520a.",
      prevention: "Keep parameter and local-variable names distinct from table columns and test both insertion paths.",
    },
  }),
  systemTicket({
    key: "PRODUCT-239",
    issueType: "Story",
    title: "Evaluate custom SMTP for passwordless reliability",
    publicSummary: "Practice the SMTP delivery architecture and evaluate provider cost, DNS, credential, observability, test, and rollback requirements before changing production Auth email.",
    deliveryStatus: "Backlog",
    evidenceState: "Planned",
    priority: "Low",
    parentKey: "PRODUCT-228",
    dependencies: ["PRODUCT-237"],
    definitionOfDone: "A provider and cost are approved, DNS and credentials remain server-managed, delivery and rollback tests pass, and the production change is documented.",
    acceptanceCriteria: ["SMTP provider and cost decision", "DNS and secret boundary", "Delivery and failure tests", "Rollback procedure"],
    capabilitySlugs: ["privacy-review", "testing", "root-cause-analysis"],
    evidenceIds: [],
    nextAction: "Compare suitable low-volume SMTP providers and document the free-plan and DNS tradeoffs before configuration.",
    notClaimed: "SMTP is not configured. SFTP is unrelated to passwordless email delivery and is not part of this work.",
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
    nextAction: "Finish the remaining course work and write an original concept summary.",
    notClaimed: "The course is in progress, but its completed modules, completion date, certificate, and learning outcomes are not yet verified.",
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
  sqlTicket({
    key: "SQL-013",
    issueType: "Spike",
    title: "Evaluate supported LinkedIn Learning enterprise progress access",
    publicSummary: "Keep provider API access deferred unless an eligible enterprise arrangement and administrator-provisioned authorization are demonstrated.",
    deliveryStatus: "Backlog",
    evidenceState: "Planned",
    priority: "Low",
    parentKey: "SQL-000",
    dependencies: ["SQL-002"],
    definitionOfDone: "A current supported integration path, authorization model, privacy impact, cost, and fallback are documented without using private endpoints or personal session data.",
    acceptanceCriteria: ["Enterprise eligibility is verified", "No credentials or cookies stored", "Human confirmation remains required", "Manual snapshots remain available"],
    capabilitySlugs: ["privacy-review", "delivery-modeling"],
    evidenceIds: [],
    nextAction: "Keep deferred until Jason has eligible enterprise administrator access.",
    notClaimed: "CareerOS does not have a live LinkedIn Learning API or continuous progress synchronization.",
  }),
  academicTicket({
    key: "CU-NET-000",
    issueType: "Epic",
    title: "Complete CU Boulder Network Systems pathway",
    publicSummary: "Complete the three enrolled courses truthfully and connect them to independent network, Linux, and cloud troubleshooting evidence.",
    deliveryStatus: "In Progress",
    evidenceState: "Learning",
    priority: "Highest",
    dependencies: [],
    definitionOfDone: "All three provider completions are verified, each course has original notes and an applied artifact, and any credit or academic milestone is counted only from private qualifying evidence.",
    acceptanceCriteria: ["Three course completion gates verified", "Independent public-safe artifacts linked", "No restricted coursework published", "Academic claims remain evidence-gated"],
    capabilitySlugs: ["networking-fundamentals", "linux-networking", "cloud-networking", "network-troubleshooting"],
    evidenceIds: [],
    nextAction: "Continue CSCA 5063 and build an original network-stack and packet-flow troubleshooting exercise.",
    notClaimed: "The pathway is not complete, and no earned credit, grade, admission milestone, degree progress, or demonstrated networking capability is claimed.",
  }),
  academicTicket({
    key: "CU-NET-001",
    issueType: "Task",
    title: "Complete CSCA 5063 - Network Systems Foundation",
    publicSummary: "Continue the active foundation course and convert verified concepts into an original packet-flow or protocol-troubleshooting exercise.",
    deliveryStatus: "In Progress",
    evidenceState: "Learning",
    priority: "Highest",
    parentKey: "CU-NET-000",
    dependencies: [],
    definitionOfDone: "Provider completion and actual completion date are verified, Jason writes an original concept summary, and at least one independent applied practice artifact is linked.",
    acceptanceCriteria: ["Provider completion verified", "Original concept summary", "Applied practice linked", "Private grade and credit evidence required before any credit claim"],
    capabilitySlugs: ["networking-fundamentals", "tcp-ip", "network-troubleshooting", "technical-communication"],
    evidenceIds: [],
    nextAction: "Continue with Sharing the Link, then write an original packet-flow explanation.",
    notClaimed: "The verified 20% is course progress only and does not establish completion, credit, a grade, pathway progress, admission, or demonstrated capability.",
  }),
  academicTicket({
    key: "CU-NET-002",
    issueType: "Task",
    title: "Complete CSCA 5073 - Linux Networking",
    publicSummary: "Complete the enrolled Linux networking course and connect verified learning to an independent troubleshooting lab and diagnostic runbook.",
    deliveryStatus: "Ready",
    evidenceState: "Learning",
    priority: "High",
    parentKey: "CU-NET-000",
    dependencies: ["CU-NET-001"],
    definitionOfDone: "Provider completion and actual completion date are verified, Jason writes an original concept summary, and an independent Linux networking artifact is linked.",
    acceptanceCriteria: ["Provider completion verified", "Original concept summary", "Linux lab linked", "No credit claim without private academic evidence"],
    capabilitySlugs: ["linux-networking", "network-troubleshooting", "technical-communication"],
    evidenceIds: [],
    nextAction: "Begin after CSCA 5063 reaches its verified completion gate.",
    notClaimed: "Enrollment does not establish a start date, progress, completion, grade, credit, admission, or demonstrated Linux networking capability.",
  }),
  academicTicket({
    key: "CU-NET-003",
    issueType: "Task",
    title: "Complete CSCA 5083 - Cloud Networking",
    publicSummary: "Complete the enrolled cloud networking course and connect verified learning to an independent architecture and failure-recovery exercise.",
    deliveryStatus: "Backlog",
    evidenceState: "Learning",
    priority: "High",
    parentKey: "CU-NET-000",
    dependencies: ["CU-NET-002"],
    definitionOfDone: "Provider completion and actual completion date are verified, Jason writes an original concept summary, and an independent cloud networking artifact is linked.",
    acceptanceCriteria: ["Provider completion verified", "Original concept summary", "Cloud exercise linked", "No credit claim without private academic evidence"],
    capabilitySlugs: ["cloud-networking", "network-architecture", "cloud-infrastructure", "network-troubleshooting"],
    evidenceIds: [],
    nextAction: "Begin after CSCA 5073 reaches its verified completion gate.",
    notClaimed: "Enrollment does not establish a start date, progress, completion, grade, credit, admission, or demonstrated cloud networking capability.",
  }),
  academicTicket({
    key: "CU-NET-004",
    issueType: "Story",
    title: "Build a network-stack and packet-flow troubleshooting exercise",
    publicSummary: "Create an original explainer and reproducible protocol-troubleshooting exercise independent of restricted or graded course material.",
    deliveryStatus: "Backlog",
    evidenceState: "Planned",
    priority: "High",
    parentKey: "CU-NET-000",
    dependencies: ["CU-NET-001"],
    definitionOfDone: "The packet flow, symptoms, diagnostic method, expected observations, and limitations are independently written, reproducible, reviewed, and public-safe.",
    acceptanceCriteria: ["Original framing", "Reproducible steps", "Expected observations", "Academic-integrity review"],
    capabilitySlugs: ["networking-fundamentals", "tcp-ip", "network-troubleshooting", "technical-communication"],
    evidenceIds: [],
    nextAction: "Wait for enough verified CSCA 5063 context to frame the exercise independently.",
    notClaimed: "No packet-flow exercise or reviewed networking evidence exists yet.",
  }),
  academicTicket({
    key: "CU-NET-005",
    issueType: "Story",
    title: "Build a Linux network troubleshooting lab and diagnostic runbook",
    publicSummary: "Create an independent Linux networking lab with a customer-facing diagnostic sequence and explicit recovery checks.",
    deliveryStatus: "Backlog",
    evidenceState: "Planned",
    priority: "High",
    parentKey: "CU-NET-000",
    dependencies: ["CU-NET-002"],
    definitionOfDone: "The lab is reproducible, failure states are isolated, diagnostics are explained for a customer-facing audience, and recovery is verified.",
    acceptanceCriteria: ["Reproducible environment", "Isolated failure", "Diagnostic runbook", "Recovery evidence"],
    capabilitySlugs: ["linux-networking", "network-troubleshooting", "technical-communication"],
    evidenceIds: [],
    nextAction: "Begin only after relevant Linux networking work is verified.",
    notClaimed: "No Linux lab, runbook, or demonstrated Linux networking capability exists yet.",
  }),
  academicTicket({
    key: "CU-NET-006",
    issueType: "Story",
    title: "Design and test a cloud network failure-recovery scenario",
    publicSummary: "Create an independent cloud network architecture and test one isolated failure and recovery path with evidence and limitations.",
    deliveryStatus: "Backlog",
    evidenceState: "Planned",
    priority: "High",
    parentKey: "CU-NET-000",
    dependencies: ["CU-NET-003"],
    definitionOfDone: "The architecture, failure hypothesis, diagnostics, recovery, validation, cost boundary, and limitations are independently documented and reviewed.",
    acceptanceCriteria: ["Architecture documented", "Failure isolated", "Recovery validated", "Cost and privacy reviewed"],
    capabilitySlugs: ["cloud-networking", "network-architecture", "cloud-infrastructure", "network-troubleshooting"],
    evidenceIds: [],
    nextAction: "Begin only after relevant cloud networking work is verified.",
    notClaimed: "No cloud architecture, failure-recovery test, or demonstrated cloud networking capability exists yet.",
  }),
  academicTicket({
    key: "CU-NET-007",
    issueType: "Story",
    title: "Publish the Network Reliability & Cloud Troubleshooting Lab",
    publicSummary: "Publish a reviewed, public-safe case study only after the independent network, Linux, and cloud artifacts are created and tested.",
    deliveryStatus: "Backlog",
    evidenceState: "Planned",
    priority: "Medium",
    parentKey: "CU-NET-000",
    dependencies: ["CU-NET-004", "CU-NET-005", "CU-NET-006"],
    definitionOfDone: "The public case study links reproducible artifacts, explains customer impact and troubleshooting decisions, and passes academic-integrity, privacy, and technical review.",
    acceptanceCriteria: ["Artifacts are real", "Claims follow evidence", "No restricted coursework", "Public review approved"],
    capabilitySlugs: ["network-troubleshooting", "cloud-networking", "technical-communication", "evidence-design"],
    evidenceIds: [],
    nextAction: "Wait until the three independent applied artifacts are created, tested, and reviewed.",
    notClaimed: "The case study and its underlying artifacts are planned, not completed or publication-ready.",
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
    notClaimed: "This artifact does not prove provider synchronization or generalized product readiness.",
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
  {
    id: "EVD-ADMIN-ACTIVATION",
    type: "Test",
    title: "Sanitized admin activation and database-repair verification",
    dateCreated: "2026-08-08",
    createdAt: "2026-08-08T11:56:56-06:00",
    verificationState: "Verified",
    evidenceStateSupported: "Practicing",
    relatedTicketKeys: ["PRODUCT-220", "PRODUCT-227", "PRODUCT-233", "PRODUCT-236", "PRODUCT-237", "PRODUCT-238"],
    relatedProjectSlug: "careeros-learning-delivery",
    capabilitySlugs: ["testing", "privacy-review", "root-cause-analysis", "delivery-modeling"],
    roleLensSlugs: systemRoles,
    repositoryPath: "src/admin/backendContract.test.ts",
    publicSummary: "Production verification preserved one confirmed identity and immutable admin membership, exercised passwordless access, corrected both affected Postgres function paths, and opened the authorized learning board.",
    limitations: "Raw Auth logs, provider metadata, account identifiers, database diagnostics, and private screenshots remain outside the public artifact.",
    visibility: "Public",
    publicApproved: true,
    approvedAt: "2026-08-08T11:56:56-06:00",
    notClaimed: "This evidence does not complete the remaining non-admin denial, rollback, mutation-persistence, session-expiry, or advisor verification gates.",
  },
  {
    id: "EVD-DI-SOURCE",
    type: "Source code",
    title: "Canonical Delivery Intelligence model and accessible views",
    dateCreated: "2026-08-08",
    createdAt: "2026-08-08T11:56:56-06:00",
    verificationState: "Verified",
    evidenceStateSupported: "Practicing",
    relatedTicketKeys: ["PRODUCT-228", "PRODUCT-229", "PRODUCT-230", "PRODUCT-231", "PRODUCT-232"],
    relatedProjectSlug: "careeros-learning-delivery",
    capabilitySlugs: ["delivery-modeling", "evidence-design", "accessibility", "responsive-design"],
    roleLensSlugs: systemRoles,
    repositoryPath: "src/data/deliveryIntelligence.ts",
    publicSummary: "A shared deterministic model powers portfolio and Learning timeline semantics, compact delivery metrics, explicit unscheduled work, and a canonical evidence relationship path.",
    limitations: "The source is locally verified but remains in release review until production browser and persistence checks complete.",
    visibility: "Public",
    publicApproved: true,
    approvedAt: "2026-08-08T11:56:56-06:00",
    notClaimed: "The model does not forecast completion, infer missing dates, retrieve provider logs, or calculate career readiness.",
  },
  {
    id: "EVD-DI-TESTS",
    type: "Test",
    title: "Delivery metric and timeline truth-boundary tests",
    dateCreated: "2026-08-08",
    createdAt: "2026-08-08T11:56:56-06:00",
    verificationState: "Verified",
    evidenceStateSupported: "Practicing",
    relatedTicketKeys: ["PRODUCT-228", "PRODUCT-229", "PRODUCT-230", "PRODUCT-231", "PRODUCT-232", "PRODUCT-235"],
    relatedProjectSlug: "careeros-learning-delivery",
    capabilitySlugs: ["testing", "delivery-modeling", "privacy-review"],
    roleLensSlugs: ["application-engineer", "forward-deployed-engineer"],
    repositoryPath: "src/data/deliveryIntelligence.test.ts",
    publicSummary: "Focused tests distinguish planned, actual, open-ended, completion-only, and unscheduled work and verify WIP, bounded throughput, aging, and compatible cycle-time inputs.",
    limitations: "Automated model checks do not replace production browser, assistive-technology, or live-data review.",
    visibility: "Public",
    publicApproved: true,
    approvedAt: "2026-08-08T11:56:56-06:00",
    notClaimed: "Passing deterministic tests does not prove every visualization state or production persistence path.",
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
    nextAction: "Verify the secure admin routes and durable public projection in production.",
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
    "Use the verified SQL Essential Training progress to scope the remaining course work",
    "Establish the SQL baseline",
    "Complete only the remaining course work that is realistically finished",
    "Select a synthetic dataset",
    "Define the fictional customer and data-quality scenario",
    "Decide the minimum shareable deliverable",
    "Record the first Five-Minute Evidence Capture entry",
  ],
  highestValueNextAction: "Complete the remaining SQL Essential Training course work, then record Jason's original concept summary before closing SQL-002.",
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
  if (snapshot.scope !== "Course progress") errors.push(`${snapshot.id} must use Course progress scope`);
  if (!snapshot.sourceProvider.trim()) errors.push(`${snapshot.id} requires a source provider`);
  if (!snapshot.verificationLabel.trim()) errors.push(`${snapshot.id} requires a verification label`);
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

export function getCurrentCourseProgress(course: LearningCourse, scope: CourseProgressSnapshot["scope"] = "Course progress") {
  return [...course.progressSnapshots]
    .filter((snapshot) => snapshot.verificationState === "Verified" && snapshot.scope === scope)
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
    if (ticket.parentKey) {
      const parentType = ticketByKey.get(ticket.parentKey)?.issueType;
      const validBugParent = ticket.issueType === "Bug" && parentType === "Story";
      if (parentType !== "Epic" && !validBugParent) errors.push(`${ticket.key} parent must be an Epic, or a directly affected Story for Bugs`);
    }
    ticket.dependencies.forEach((dependency) => {
      if (!ticketByKey.has(dependency) && !dependency.startsWith("PRODUCT-20")) errors.push(`${ticket.key} references unknown dependency ${dependency}`);
    });
    ticket.evidenceIds.forEach((id) => {
      if (!evidenceIds.has(id)) errors.push(`${ticket.key} references unknown evidence ${id}`);
    });
    if (ticket.deliveryStatus === "Done" && !ticket.completionDate) errors.push(`${ticket.key} is Done without a completion date`);
    if (ticket.deliveryStatus === "Done" && (!ticket.definitionOfDone.trim() || ticket.evidenceIds.length === 0)) errors.push(`${ticket.key} is Done without its public definition of done or evidence`);
    if (ticket.issueType === "Bug" && !ticket.bugClassification) errors.push(`${ticket.key} is a Bug without controlled classification`);
    if (ticket.issueType !== "Bug" && ticket.bugClassification) errors.push(`${ticket.key} has Bug classification but is not a Bug`);
    if (ticket.bugClassification) {
      if (!bugCategories.includes(ticket.bugClassification.category)) errors.push(`${ticket.key} has an invalid Bug category`);
      if (!bugSeverities.includes(ticket.bugClassification.severity)) errors.push(`${ticket.key} has an invalid Bug severity`);
      ticket.bugClassification.affectedFeatureKeys.forEach((key) => {
        if (!ticketByKey.has(key)) errors.push(`${ticket.key} references unknown affected feature ${key}`);
      });
    }
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

export function filterLearningTickets(filters: BoardFilters, tickets: readonly LearningTicket[] = learningTickets) {
  return tickets.filter((ticket) =>
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

type TimelineSessionSource = {
  id: string;
  ticketKey: string;
  startedAt?: string;
  date?: string;
  problemCategory?: string;
  outcome?: string;
  publicSummary?: string;
  capabilitySlugs?: string[];
  roleLensSlugs?: string[];
};

export function getLearningTimeline(
  filters: TimelineFilters = {},
  sources: {
    tickets?: readonly LearningTicket[];
    sessions?: readonly TimelineSessionSource[];
    evidence?: readonly LearningEvidence[];
  } = {},
) {
  const events: LearningTimelineEvent[] = [];
  const tickets = sources.tickets ?? learningTickets;
  const sessions: readonly TimelineSessionSource[] = sources.sessions ?? workSessions;
  const evidence = sources.evidence ?? learningEvidence;
  const ticketByKey = new Map(tickets.map((ticket) => [ticket.key, ticket]));

  tickets.forEach((ticket) => {
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

  sessions.forEach((session) => {
    const ticket = ticketByKey.get(session.ticketKey);
    if (!ticket || (!session.startedAt && !session.date)) return;
    events.push({
      id: session.id,
      occurredAt: session.startedAt ?? session.date!,
      type: "Work session recorded",
      title: `${session.ticketKey}: ${session.problemCategory ?? "Recorded work session"}`,
      summary: session.outcome ?? session.publicSummary ?? "An approved work session was recorded.",
      ticketKey: session.ticketKey,
      initiativeSlug: ticket.initiativeSlug,
      capabilitySlugs: session.capabilitySlugs ?? ticket.capabilitySlugs,
      roleLensSlugs: session.roleLensSlugs ?? ticket.roleLensSlugs,
    });
  });

  evidence.forEach((artifact) => {
    const ticket = ticketByKey.get(artifact.relatedTicketKeys[0]);
    if (!ticket) return;
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
