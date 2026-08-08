import { describe, expect, it } from "vitest";
import type { LearningInitiative, LearningTicket } from "./learning";
import { buildDeliveryTimeline, deriveDeliveryMetrics } from "./deliveryIntelligence";

const initiative: LearningInitiative = {
  slug: "delivery",
  title: "Delivery",
  goal: "Test delivery semantics",
  roadmapStatus: "Active",
  evidenceState: "Practicing",
  careerObjective: "Test",
  roleLensSlugs: [],
  currentPhase: "Test",
  nextAction: "Test",
  publicSummary: "Test",
  milestones: [],
  visibility: "Public",
  publicApproved: true,
  notClaimed: "No extra claim",
};

function ticket(patch: Partial<LearningTicket> & Pick<LearningTicket, "key">): LearningTicket {
  return {
    issueType: "Task",
    title: patch.key,
    publicSummary: "Test",
    deliveryStatus: "Ready",
    evidenceState: "Planned",
    priority: "Medium",
    initiativeSlug: "delivery",
    dependencies: [],
    blockers: [],
    createdAt: "2026-08-01T00:00:00Z",
    definitionOfDone: "Test",
    acceptanceCriteria: [],
    capabilitySlugs: [],
    roleLensSlugs: [],
    evidenceIds: [],
    nextAction: "Test",
    relatedProjectSlug: "delivery",
    visibility: "Public",
    publicApproved: true,
    notClaimed: "No extra claim",
    ...patch,
  };
}

describe("Delivery Intelligence", () => {
  it("keeps missing date windows explicitly unscheduled", () => {
    const timeline = buildDeliveryTimeline([
      ticket({ key: "NO-DATES" }),
      ticket({ key: "START-ONLY", plannedStart: "2026-08-08" }),
    ], [initiative]);

    expect(timeline.scheduled).toHaveLength(0);
    expect(timeline.unscheduled.map((item) => item.key)).toEqual(["NO-DATES", "START-ONLY"]);
    expect(timeline.unscheduled[1].label).toContain("no verified target window");
  });

  it("distinguishes planned, actual, open-ended, and completion-only work", () => {
    const timeline = buildDeliveryTimeline([
      ticket({ key: "PLANNED", plannedStart: "2026-08-01", targetDate: "2026-08-04" }),
      ticket({ key: "ACTUAL", actualStart: "2026-08-02T10:00:00Z", completionDate: "2026-08-03T10:00:00Z", deliveryStatus: "Done" }),
      ticket({ key: "OPEN", actualStart: "2026-08-05T10:00:00Z", deliveryStatus: "In Progress" }),
      ticket({ key: "MILESTONE", completionDate: "2026-08-06T10:00:00Z", deliveryStatus: "Done" }),
    ], [initiative]);

    expect(timeline.scheduled.map((item) => item.kind)).toEqual(["planned", "actual", "open", "completed"]);
    expect(timeline.rangeStart).toBe("2026-08-01");
    expect(timeline.rangeEnd).toBe("2026-08-06");
  });

  it("derives WIP, bounded throughput, aging, and median cycle time", () => {
    const metrics = deriveDeliveryMetrics([
      ticket({ key: "ACTIVE", deliveryStatus: "In Progress", actualStart: "2026-07-20T12:00:00Z" }),
      ticket({ key: "BLOCKED", deliveryStatus: "Blocked", actualStart: "2026-08-07T12:00:00Z" }),
      ticket({ key: "DONE-ONE", deliveryStatus: "Done", actualStart: "2026-08-01T12:00:00Z", completionDate: "2026-08-03T12:00:00Z" }),
      ticket({ key: "DONE-TWO", deliveryStatus: "Done", actualStart: "2026-08-01T12:00:00Z", completionDate: "2026-08-05T12:00:00Z" }),
      ticket({ key: "OLD", deliveryStatus: "Done", completionDate: "2026-06-01T12:00:00Z" }),
    ], "2026-08-08T12:00:00Z", 30, 14);

    expect(metrics.workInProgress).toBe(2);
    expect(metrics.blockedCount).toBe(1);
    expect(metrics.agingActiveCount).toBe(1);
    expect(metrics.throughput).toBe(2);
    expect(metrics.medianCycleDays).toBe(3);
    expect(metrics.comparableCycleCount).toBe(2);
  });

  it("withholds cycle time when actual starts are unknown", () => {
    const metrics = deriveDeliveryMetrics([
      ticket({ key: "DONE", deliveryStatus: "Done", completionDate: "2026-08-08T10:00:00Z" }),
    ], "2026-08-08T12:00:00Z");

    expect(metrics.throughput).toBe(1);
    expect(metrics.medianCycleDays).toBeUndefined();
    expect(metrics.comparableCycleCount).toBe(0);
  });
});
