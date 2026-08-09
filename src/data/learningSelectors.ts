import type { EvidenceState } from "./site";
import {
  capabilityLabels,
  type CourseStatus,
  type LearningCourse,
  type LearningEvidence,
  type LearningInitiative,
  type LearningTicket,
} from "./learning";
import { deriveDeliveryMetrics } from "./deliveryIntelligence";

const evidenceRank: Record<EvidenceState, number> = {
  Planned: 0,
  Learning: 1,
  Practicing: 2,
  Demonstrated: 3,
};

export function selectTicketByKey(
  tickets: readonly LearningTicket[],
  ticketKey: string,
) {
  const normalizedKey = ticketKey.toUpperCase();
  return tickets.find((ticket) => ticket.key === normalizedKey);
}

export function selectInitiativeBySlug(
  initiatives: readonly LearningInitiative[],
  slug: string,
) {
  return initiatives.find((initiative) => initiative.slug === slug);
}

export function selectCurrentCourses(courses: readonly LearningCourse[]) {
  return courses
    .filter((course) => course.status !== "Completed")
    .sort((a, b) => {
      const rank: Record<CourseStatus, number> = { "In Progress": 0, Enrolled: 1, Completed: 2 };
      return rank[a.status] - rank[b.status] || a.title.localeCompare(b.title);
    });
}

export function selectCompletedCourses(courses: readonly LearningCourse[]) {
  return courses
    .filter((course) => course.status === "Completed")
    .sort((a, b) => (b.completionDate ?? "").localeCompare(a.completionDate ?? "") || a.title.localeCompare(b.title));
}

export function selectCourseStateSummary(courses: readonly LearningCourse[]) {
  return courses.reduce<Record<CourseStatus, number>>((summary, course) => {
    summary[course.status] += 1;
    return summary;
  }, { Enrolled: 0, "In Progress": 0, Completed: 0 });
}

export function selectRecentApprovedEvidence(evidence: readonly LearningEvidence[], limit = 3) {
  return evidence
    .filter((artifact) => artifact.visibility === "Public" && artifact.publicApproved)
    .sort((a, b) =>
      b.approvedAt.localeCompare(a.approvedAt)
      || b.createdAt.localeCompare(a.createdAt)
      || b.dateCreated.localeCompare(a.dateCreated)
      || b.id.localeCompare(a.id))
    .slice(0, Math.max(0, limit));
}

export function selectInitiativeTickets(tickets: readonly LearningTicket[], initiativeSlug: string) {
  return tickets.filter((ticket) => ticket.initiativeSlug === initiativeSlug);
}

export function selectCapabilityProgression(tickets: readonly LearningTicket[]) {
  return Object.entries(capabilityLabels)
    .map(([slug, label]) => {
      const relatedTickets = tickets.filter((ticket) => ticket.capabilitySlugs.includes(slug));
      const state = relatedTickets.reduce<EvidenceState>(
        (highest, ticket) => evidenceRank[ticket.evidenceState] > evidenceRank[highest] ? ticket.evidenceState : highest,
        "Planned",
      );
      return { slug, label, state, ticketCount: relatedTickets.length };
    })
    .filter((item) => item.ticketCount > 0);
}

export function selectCompletedMilestones(initiatives: readonly LearningInitiative[]) {
  return initiatives.flatMap((initiative) => initiative.milestones
    .filter((milestone) => milestone.status === "Completed")
    .map((milestone) => ({ ...milestone, initiative: initiative.title })));
}

export function selectDeliveryPulse(tickets: readonly LearningTicket[], referenceAt: string) {
  return {
    metrics: deriveDeliveryMetrics(tickets, referenceAt),
    activeTickets: tickets.filter((ticket) => ["In Progress", "Blocked", "In Review"].includes(ticket.deliveryStatus)),
  };
}
