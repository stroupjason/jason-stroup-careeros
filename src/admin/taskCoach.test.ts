import { describe, expect, it } from "vitest";
import {
  calculateAssistedEstimate,
  calculateCourseworkTimeRange,
  canUseHistoricalCalibration,
  getTaskHealthGuidance,
  taskCoachFactorKeys,
  type TaskCoachFactors,
} from "./taskCoach";

function factorsForTotal(total: number): TaskCoachFactors {
  const factors = Object.fromEntries(taskCoachFactorKeys.map((key) => [key, 0])) as TaskCoachFactors;
  let remaining = total;
  taskCoachFactorKeys.forEach((key) => {
    const value = Math.min(3, remaining) as 0 | 1 | 2 | 3;
    factors[key] = value;
    remaining -= value;
  });
  return factors;
}

describe("deterministic task coach", () => {
  it.each([
    [0, 1], [2, 1], [3, 2], [5, 2], [6, 3], [8, 3], [9, 5], [11, 5],
    [12, 8], [14, 8], [15, 13], [18, 13],
  ])("maps score %i to %i story points", (score, storyPoints) => {
    expect(calculateAssistedEstimate(factorsForTotal(score)).storyPoints).toBe(storyPoints);
  });

  it("recommends a split at 13 without expressing story points as hours", () => {
    const estimate = calculateAssistedEstimate(factorsForTotal(15));
    expect(estimate.splitRecommended).toBe(true);
    expect(estimate).not.toHaveProperty("hours");
  });

  it("keeps coursework planning incomplete when an input is unknown", () => {
    const range = calculateCourseworkTimeRange({ remainingDurationSeconds: 14_742 });
    expect(range.maximumMinutes).toBeUndefined();
    expect(range.missingInputs).toContain("playback speed");
  });

  it("calculates a transparent range from supplied inputs", () => {
    const range = calculateCourseworkTimeRange({
      remainingDurationSeconds: 3_600,
      playbackSpeed: 2,
      notesPracticeBufferPercent: 50,
      evidenceBufferMinutes: 15,
    });
    expect(range).toMatchObject({ minimumMinutes: 45, maximumMinutes: 60, missingInputs: [] });
  });

  it("flags missing active-work facts as guidance instead of silently changing them", () => {
    const guidance = getTaskHealthGuidance({
      deliveryStatus: "In Progress",
      hasUnresolvedDependency: false,
      blockerHasNextCheck: true,
      mandatoryItemsRemaining: 2,
      evidenceApprovalPending: true,
      activeTicketCount: 3,
    });
    expect(guidance).toEqual(expect.arrayContaining([
      expect.stringContaining("Actual start is unknown"),
      expect.stringContaining("target is optional"),
      expect.stringContaining("mandatory completion"),
      expect.stringContaining("soft limit"),
    ]));
  });

  it("requires five comparable completions before historical calibration", () => {
    expect(canUseHistoricalCalibration(4)).toBe(false);
    expect(canUseHistoricalCalibration(5)).toBe(true);
  });
});
