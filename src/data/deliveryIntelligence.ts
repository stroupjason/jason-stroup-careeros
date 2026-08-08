import type {
  CareerTrack,
  DeliveryStatus,
  LearningCourse,
  LearningEvidence,
  LearningInitiative,
  LearningTicket,
} from "./learning";

const DAY_MS = 86_400_000;
const activeStatuses = new Set<DeliveryStatus>(["In Progress", "Blocked", "In Review"]);

export type TimelineWindowKind = "planned" | "actual" | "open" | "completed" | "unscheduled";

export type DeliveryTimelineItem = {
  key: string;
  title: string;
  initiativeSlug: string;
  initiativeTitle: string;
  status: DeliveryStatus;
  kind: TimelineWindowKind;
  start?: string;
  end?: string;
  label: string;
  blocked: boolean;
  hasDependencies: boolean;
  hasEvidence: boolean;
  href: string;
};

export type DeliveryTimeline = {
  scheduled: DeliveryTimelineItem[];
  unscheduled: DeliveryTimelineItem[];
  rangeStart?: string;
  rangeEnd?: string;
};

export type DeliveryMetrics = {
  workInProgress: number;
  throughput: number;
  throughputWindowDays: number;
  medianCycleDays?: number;
  comparableCycleCount: number;
  agingActiveCount: number;
  blockedCount: number;
};

export type EvidenceMapNode = {
  id: string;
  kind: "track" | "initiative" | "course" | "ticket" | "activity" | "evidence" | "capability" | "role";
  label: string;
  detail: string;
  href?: string;
  state: "Verified" | "In progress" | "Planned";
};

type EvidenceActivitySession = {
  id: string;
  ticketKey: string;
  startedAt?: string;
  date?: string;
  outcome?: string;
  publicSummary?: string;
};

function toTimestamp(value?: string) {
  if (!value) return undefined;
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : undefined;
}

function toDateKey(timestamp: number) {
  return new Date(timestamp).toISOString().slice(0, 10);
}

function daysBetween(start: number, end: number) {
  return (end - start) / DAY_MS;
}

function timelineItem(
  ticket: LearningTicket,
  initiatives: ReadonlyMap<string, LearningInitiative>,
): DeliveryTimelineItem {
  const plannedStart = toTimestamp(ticket.plannedStart);
  const target = toTimestamp(ticket.targetDate);
  const actualStart = toTimestamp(ticket.actualStart);
  const completed = toTimestamp(ticket.completionDate);
  const initiativeTitle = initiatives.get(ticket.initiativeSlug)?.title ?? ticket.initiativeSlug;
  const base = {
    key: ticket.key,
    title: ticket.title,
    initiativeSlug: ticket.initiativeSlug,
    initiativeTitle,
    status: ticket.deliveryStatus,
    blocked: ticket.deliveryStatus === "Blocked" || ticket.blockers.some((blocker) => blocker.status === "Open"),
    hasDependencies: ticket.dependencies.length > 0,
    hasEvidence: ticket.evidenceIds.length > 0,
    href: `/learning/tickets/${ticket.key}`,
  };

  if (actualStart !== undefined && completed !== undefined && completed >= actualStart) {
    return {
      ...base,
      kind: "actual",
      start: toDateKey(actualStart),
      end: toDateKey(completed),
      label: `Actual ${toDateKey(actualStart)} to ${toDateKey(completed)}`,
    };
  }
  if (actualStart !== undefined) {
    return {
      ...base,
      kind: "open",
      start: toDateKey(actualStart),
      label: `In progress since ${toDateKey(actualStart)}; no verified target`,
    };
  }
  if (completed !== undefined) {
    return {
      ...base,
      kind: "completed",
      start: toDateKey(completed),
      end: toDateKey(completed),
      label: `Completed ${toDateKey(completed)}; actual start not recorded`,
    };
  }
  if (plannedStart !== undefined && target !== undefined && target >= plannedStart) {
    return {
      ...base,
      kind: "planned",
      start: toDateKey(plannedStart),
      end: toDateKey(target),
      label: `Planned ${toDateKey(plannedStart)} to ${toDateKey(target)}`,
    };
  }
  return {
    ...base,
    kind: "unscheduled",
    label: plannedStart !== undefined
      ? `Planned start ${toDateKey(plannedStart)}; no verified target window`
      : "No verified delivery window",
  };
}

export function buildDeliveryTimeline(
  tickets: readonly LearningTicket[],
  initiatives: readonly LearningInitiative[],
): DeliveryTimeline {
  const initiativeMap = new Map(initiatives.map((initiative) => [initiative.slug, initiative]));
  const items = tickets.map((ticket) => timelineItem(ticket, initiativeMap));
  const scheduled = items
    .filter((item) => item.kind !== "unscheduled")
    .sort((a, b) => (a.start ?? "").localeCompare(b.start ?? "") || a.key.localeCompare(b.key));
  const unscheduled = items
    .filter((item) => item.kind === "unscheduled")
    .sort((a, b) => a.initiativeTitle.localeCompare(b.initiativeTitle) || a.key.localeCompare(b.key));
  const timestamps = scheduled.flatMap((item) => [toTimestamp(item.start), toTimestamp(item.end)]).filter((value): value is number => value !== undefined);

  return {
    scheduled,
    unscheduled,
    rangeStart: timestamps.length ? toDateKey(Math.min(...timestamps)) : undefined,
    rangeEnd: timestamps.length ? toDateKey(Math.max(...timestamps)) : undefined,
  };
}

export function deriveDeliveryMetrics(
  tickets: readonly LearningTicket[],
  referenceAt: string,
  throughputWindowDays = 30,
  agingThresholdDays = 14,
): DeliveryMetrics {
  const reference = toTimestamp(referenceAt);
  if (reference === undefined) throw new Error("A valid metric reference timestamp is required.");
  const windowStart = reference - throughputWindowDays * DAY_MS;
  const cycleTimes = tickets.flatMap((ticket) => {
    const start = toTimestamp(ticket.actualStart);
    const completed = toTimestamp(ticket.completionDate);
    return start !== undefined && completed !== undefined && completed >= start
      ? [daysBetween(start, completed)]
      : [];
  }).sort((a, b) => a - b);
  const midpoint = Math.floor(cycleTimes.length / 2);
  const medianCycleDays = cycleTimes.length === 0
    ? undefined
    : cycleTimes.length % 2 === 1
      ? cycleTimes[midpoint]
      : (cycleTimes[midpoint - 1] + cycleTimes[midpoint]) / 2;

  return {
    workInProgress: tickets.filter((ticket) => activeStatuses.has(ticket.deliveryStatus)).length,
    throughput: tickets.filter((ticket) => {
      const completed = toTimestamp(ticket.completionDate);
      return completed !== undefined && completed >= windowStart && completed <= reference;
    }).length,
    throughputWindowDays,
    medianCycleDays,
    comparableCycleCount: cycleTimes.length,
    agingActiveCount: tickets.filter((ticket) => {
      const started = toTimestamp(ticket.actualStart);
      return activeStatuses.has(ticket.deliveryStatus)
        && started !== undefined
        && started <= reference
        && daysBetween(started, reference) >= agingThresholdDays;
    }).length,
    blockedCount: tickets.filter((ticket) => ticket.deliveryStatus === "Blocked").length,
  };
}

export function buildEvidenceDeliveryMap({
  initiativeSlug,
  track,
  initiatives,
  courses,
  tickets,
  sessions,
  evidence,
}: {
  initiativeSlug: string;
  track: CareerTrack;
  initiatives: readonly LearningInitiative[];
  courses: readonly LearningCourse[];
  tickets: readonly LearningTicket[];
  sessions: readonly EvidenceActivitySession[];
  evidence: readonly LearningEvidence[];
}): EvidenceMapNode[] {
  const initiative = initiatives.find((item) => item.slug === initiativeSlug);
  if (!initiative) return [];
  const course = courses.find((item) => item.initiativeSlug === initiativeSlug);
  const initiativeTickets = tickets.filter((item) => item.initiativeSlug === initiativeSlug);
  const ticket = course
    ? initiativeTickets.find((item) => item.key === course.relatedTicketKey)
    : initiativeTickets.find((item) => activeStatuses.has(item.deliveryStatus)) ?? initiativeTickets[0];
  if (!ticket) return [];
  const session = sessions
    .filter((item) => item.ticketKey === ticket.key && item.startedAt)
    .sort((a, b) => (b.startedAt ?? "").localeCompare(a.startedAt ?? ""))[0];
  const progress = course?.progressSnapshots
    .filter((item) => item.verificationState === "Verified")
    .sort((a, b) => b.observedAt.localeCompare(a.observedAt))[0];
  const artifact = evidence.find((item) => ticket.evidenceIds.includes(item.id) || course?.evidenceIds.includes(item.id));
  const capability = ticket.capabilitySlugs[0] ?? course?.capabilitySlugs[0];
  const role = ticket.roleLensSlugs[0] ?? initiative.roleLensSlugs[0];
  const activityLabel = session
    ? `Work session ${session.date ?? toDateKey(toTimestamp(session.startedAt) ?? 0)}`
    : progress
      ? `${course?.title ?? "Course"} progress snapshot`
      : "No verified session or progress snapshot";
  const activityDetail = session
    ? session.outcome ?? session.publicSummary ?? "Approved work session"
    : progress
      ? `${progress.verificationLabel}; course scope only`
      : "Activity remains planned until a verified record exists.";

  return [
    { id: track.slug, kind: "track", label: track.title, detail: track.currentRoleFocus, href: "/learning", state: "In progress" },
    { id: initiative.slug, kind: "initiative", label: initiative.title, detail: initiative.currentPhase, href: `/learning/board?initiative=${initiative.slug}`, state: "In progress" },
    ...(course ? [{ id: course.id, kind: "course" as const, label: course.title, detail: course.notClaimed, href: `/learning/tickets/${course.relatedTicketKey}`, state: "In progress" as const }] : []),
    { id: ticket.key, kind: "ticket", label: `${ticket.key} ${ticket.title}`, detail: ticket.nextAction, href: `/learning/tickets/${ticket.key}`, state: ticket.deliveryStatus === "Done" ? "Verified" : "In progress" },
    { id: session?.id ?? progress?.id ?? `${ticket.key}-activity-pending`, kind: "activity", label: activityLabel, detail: activityDetail, state: session || progress ? "Verified" : "Planned" },
    { id: artifact?.id ?? `${ticket.key}-evidence-pending`, kind: "evidence", label: artifact?.title ?? "Applied evidence not yet verified", detail: artifact?.limitations ?? ticket.notClaimed, href: artifact?.publicUrl, state: artifact ? "Verified" : "Planned" },
    ...(capability ? [{ id: capability, kind: "capability" as const, label: capability, detail: artifact ? "Supported only to the artifact's verified evidence state." : "Capability claim remains below Demonstrated until applied evidence exists.", href: `/skills#${capability}`, state: artifact ? "Verified" as const : "Planned" as const }] : []),
    ...(role ? [{ id: role, kind: "role" as const, label: role, detail: "Role fit is a lens over evidence, not a credential.", href: `/roles/${role}`, state: artifact ? "Verified" as const : "Planned" as const }] : []),
  ];
}
