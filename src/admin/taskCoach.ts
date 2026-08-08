export const taskCoachFactorKeys = [
  "scope",
  "uncertainty",
  "dependencies",
  "environment",
  "reviewEvidence",
  "contextSwitching",
] as const;

export type TaskCoachFactorKey = (typeof taskCoachFactorKeys)[number];
export type TaskCoachScore = 0 | 1 | 2 | 3;
export type TaskCoachFactors = Record<TaskCoachFactorKey, TaskCoachScore>;
export type EstimateConfidence = "Low" | "Medium" | "High";

export type AssistedEstimate = {
  totalScore: number;
  storyPoints: 1 | 2 | 3 | 5 | 8 | 13;
  confidence: EstimateConfidence;
  reasons: string[];
  splitRecommended: boolean;
};

export function calculateAssistedEstimate(
  factors: TaskCoachFactors,
  explanations: Partial<Record<TaskCoachFactorKey, string>> = {},
): AssistedEstimate {
  const totalScore = taskCoachFactorKeys.reduce((total, key) => total + factors[key], 0);
  const storyPoints = totalScore <= 2
    ? 1
    : totalScore <= 5
      ? 2
      : totalScore <= 8
        ? 3
        : totalScore <= 11
          ? 5
          : totalScore <= 14
            ? 8
            : 13;
  const suppliedReasons = taskCoachFactorKeys
    .filter((key) => factors[key] > 0)
    .map((key) => explanations[key]?.trim())
    .filter((reason): reason is string => Boolean(reason));
  const explainedFactorCount = suppliedReasons.length;
  const activeFactorCount = taskCoachFactorKeys.filter((key) => factors[key] > 0).length;
  const confidence: EstimateConfidence = activeFactorCount === 0
    ? "Low"
    : explainedFactorCount === activeFactorCount
      ? "High"
      : explainedFactorCount >= Math.ceil(activeFactorCount / 2)
        ? "Medium"
        : "Low";

  return {
    totalScore,
    storyPoints,
    confidence,
    reasons: suppliedReasons,
    splitRecommended: storyPoints === 13,
  };
}

export type CourseworkTimeRangeInput = {
  remainingDurationSeconds?: number;
  playbackSpeed?: number;
  notesPracticeBufferPercent?: number;
  evidenceBufferMinutes?: number;
};

export type CourseworkTimeRange = {
  minimumMinutes?: number;
  maximumMinutes?: number;
  missingInputs: string[];
  exclusions: string[];
};

export function calculateCourseworkTimeRange(input: CourseworkTimeRangeInput): CourseworkTimeRange {
  const missingInputs: string[] = [];
  if (input.remainingDurationSeconds === undefined) missingInputs.push("verified remaining course duration");
  if (input.playbackSpeed === undefined) missingInputs.push("playback speed");
  if (input.notesPracticeBufferPercent === undefined) missingInputs.push("notes and practice buffer");
  if (input.evidenceBufferMinutes === undefined) missingInputs.push("completion evidence buffer");
  if (missingInputs.length > 0) {
    return {
      missingInputs,
      exclusions: ["Exercises with unknown duration", "Review or rewatch time not represented by the supplied buffers"],
    };
  }

  if (input.remainingDurationSeconds! < 0) throw new Error("Remaining duration cannot be negative");
  if (input.playbackSpeed! <= 0 || input.playbackSpeed! > 4) throw new Error("Playback speed must be greater than 0 and no more than 4");
  if (input.notesPracticeBufferPercent! < 0 || input.notesPracticeBufferPercent! > 300) throw new Error("Notes and practice buffer must be between 0 and 300 percent");
  if (input.evidenceBufferMinutes! < 0) throw new Error("Evidence buffer cannot be negative");

  const playbackMinutes = input.remainingDurationSeconds! / 60 / input.playbackSpeed!;
  const bufferedMinutes = playbackMinutes * (1 + input.notesPracticeBufferPercent! / 100) + input.evidenceBufferMinutes!;
  return {
    minimumMinutes: Math.ceil(playbackMinutes + input.evidenceBufferMinutes!),
    maximumMinutes: Math.ceil(bufferedMinutes),
    missingInputs: [],
    exclusions: ["Exercises with unknown duration", "Unplanned remediation, provider outages, and unrelated study"],
  };
}

export type TaskHealthInput = {
  deliveryStatus: string;
  actualStartAt?: string;
  targetDate?: string;
  nextAction?: string;
  hasUnresolvedDependency: boolean;
  blockerHasNextCheck: boolean;
  mandatoryItemsRemaining: number;
  evidenceApprovalPending: boolean;
  activeTicketCount: number;
  activeTicketLimit?: number;
  assistedEstimate?: number;
};

export function getTaskHealthGuidance(input: TaskHealthInput) {
  const guidance: string[] = [];
  if (!input.nextAction?.trim()) guidance.push("Add one concrete next action.");
  if (input.deliveryStatus === "In Progress" && !input.actualStartAt) guidance.push("Actual start is unknown; record it only if verified.");
  if (input.deliveryStatus === "In Progress" && !input.targetDate) guidance.push("A target is optional, but may help planning.");
  if (input.hasUnresolvedDependency) guidance.push("Review the unresolved dependency before committing the next move.");
  if (input.deliveryStatus === "Blocked" && !input.blockerHasNextCheck) guidance.push("Add a private unblock check or next action.");
  if (input.mandatoryItemsRemaining > 0) guidance.push(`${input.mandatoryItemsRemaining} mandatory completion item${input.mandatoryItemsRemaining === 1 ? " remains" : "s remain"}.`);
  if (input.evidenceApprovalPending) guidance.push("Evidence or publication approval is still pending.");
  if (input.activeTicketCount > (input.activeTicketLimit ?? 2)) guidance.push("The active-ticket soft limit is exceeded.");
  if (input.assistedEstimate === 13) guidance.push("Split this ticket or run a discovery spike before committing to delivery.");
  return guidance;
}

export function canUseHistoricalCalibration(comparableCompletedTicketCount: number) {
  return comparableCompletedTicketCount >= 5;
}
