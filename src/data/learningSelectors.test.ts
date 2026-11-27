import { describe, expect, it } from "vitest";
import {
  learningCourses,
  learningEvidence,
  learningInitiatives,
  learningTickets,
} from "./learning";
import {
  selectCapabilityProgression,
  selectCompletedMilestones,
  selectCourseStateSummary,
  selectCurrentCourses,
  selectInitiativeBySlug,
  selectRecentApprovedEvidence,
  selectTicketByKey,
} from "./learningSelectors";

describe("Learning snapshot selectors", () => {
  it("uses only the supplied canonical snapshot", () => {
    const fallback = learningTickets.find((ticket) => ticket.key === "PRODUCT-243")!;
    const canonical = { ...fallback, deliveryStatus: "Done" as const, completionDate: "2026-08-08" };
    expect(selectTicketByKey([canonical], "product-243")).toBe(canonical);
    expect(selectTicketByKey([], "product-243")).toBeUndefined();

    const fallbackInitiative = learningInitiatives[0];
    const canonicalInitiative = { ...fallbackInitiative, currentPhase: "Canonical phase" };
    expect(selectInitiativeBySlug([canonicalInitiative], fallbackInitiative.slug)).toBe(canonicalInitiative);
    expect(selectInitiativeBySlug([], fallbackInitiative.slug)).toBeUndefined();
  });

  it("derives exact course states without relabeling enrollment as backlog", () => {
    const summary = selectCourseStateSummary(learningCourses);
    expect(summary.Enrolled + summary["In Progress"] + summary.Completed).toBe(learningCourses.length);
    expect(selectCurrentCourses(learningCourses).every((course) => course.status !== "Completed")).toBe(true);
  });

  it("selects only the newest approved public evidence", () => {
    const selected = selectRecentApprovedEvidence([...learningEvidence].reverse(), 3);
    expect(selected).toHaveLength(Math.min(3, learningEvidence.length));
    expect(selected.every((artifact) => artifact.publicApproved && artifact.visibility === "Public")).toBe(true);
    expect(selected.every((artifact, index) => index === 0 || selected[index - 1].approvedAt >= artifact.approvedAt)).toBe(true);
  });

  it("derives capability and milestone summaries from supplied snapshot records", () => {
    expect(selectCapabilityProgression(learningTickets).length).toBeGreaterThan(0);
    expect(selectCompletedMilestones(learningInitiatives).every((milestone) => milestone.status === "Completed")).toBe(true);
  });
});
