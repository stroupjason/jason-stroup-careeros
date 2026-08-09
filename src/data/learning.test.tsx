import { renderToStaticMarkup } from "react-dom/server";
import type { ReactNode } from "react";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { resolveRoute } from "../App";
import { AdminProvider } from "../admin/AdminContext";
import { sanitizeLearningAnalyticsProperties } from "../analytics";
import { CurrentLearningCourseCard, formatCourseDuration } from "../components/LearningUI";
import {
  completeLearningCourse,
  filterLearningTickets,
  getCourseProgressPercentage,
  getCurrentCourseProgress,
  getLearningTicket,
  getLearningTimeline,
  learningCourses,
  learningEvidence,
  learningInitiatives,
  learningTickets,
  parseBoardFilters,
  parseTimelineFilters,
  recordCourseProgress,
  validateCourseProgressSnapshot,
  validateLearningData,
  validatePublicationCandidate,
  workSessions,
  type CourseProgressSnapshot,
  type LearningCourse,
  type LearningTicket,
} from "./learning";

const verifiedProgress40: CourseProgressSnapshot = {
  id: "TEST-PROGRESS-40",
  scope: "Course progress",
  observedAt: "2026-08-07T12:00:00-06:00",
  source: "Manual",
  sourceProvider: "Test provider",
  verificationState: "Verified",
  verificationLabel: "Verified test value",
  valueKind: "Provider reported",
  percentage: 40,
  totalDurationSeconds: 16_560,
  completedDurationSeconds: 6_624,
  relatedEvidenceIds: [],
};

const verifiedProgress60: CourseProgressSnapshot = {
  ...verifiedProgress40,
  id: "TEST-PROGRESS-60",
  observedAt: "2026-08-07T14:00:00-06:00",
  percentage: 60,
  completedDurationSeconds: 9_936,
};

const newerCandidate90: CourseProgressSnapshot = {
  ...verifiedProgress40,
  id: "TEST-PROGRESS-CANDIDATE-90",
  observedAt: "2026-08-07T15:00:00-06:00",
  source: "User-provided screenshot",
  verificationState: "Candidate",
  percentage: 90,
  completedDurationSeconds: 14_904,
};

function renderWithAdminProvider(element: ReactNode) {
  return renderToStaticMarkup(<AdminProvider>{element}</AdminProvider>);
}

function courseMarkup(markup: string, title: string) {
  const start = markup.indexOf(title);
  return start < 0 ? "" : markup.slice(start, markup.indexOf("</article>", start));
}

describe("Learning & Delivery public data", () => {
  it("passes the complete public-data validator", () => {
    expect(validateLearningData()).toEqual([]);
  });

  it("rejects duplicate identifiers across each record type", () => {
    const errors = validateLearningData(
      [...learningInitiatives, learningInitiatives[0]],
      [...learningTickets, learningTickets[0]],
      [...workSessions, workSessions[0]],
      [...learningEvidence, learningEvidence[0]],
      [...learningCourses, learningCourses[0]],
    );
    expect(errors).toEqual(expect.arrayContaining([
      expect.stringContaining("Duplicate initiative identifier"),
      expect.stringContaining("Duplicate ticket identifier"),
      expect.stringContaining("Duplicate session identifier"),
      expect.stringContaining("Duplicate evidence identifier"),
      expect.stringContaining("Duplicate course identifier"),
    ]));
  });

  it("rejects broken references and dependency cycles", () => {
    const broken = { ...learningTickets[1], dependencies: ["MISSING-001"] } as LearningTicket;
    expect(validateLearningData(learningInitiatives, [learningTickets[0], broken], [], learningEvidence))
      .toEqual(expect.arrayContaining([expect.stringContaining("unknown dependency MISSING-001")]));

    const first = { ...learningTickets[0], key: "CYCLE-001", dependencies: ["CYCLE-002"], evidenceIds: [] } as LearningTicket;
    const second = { ...learningTickets[0], key: "CYCLE-002", dependencies: ["CYCLE-001"], evidenceIds: [] } as LearningTicket;
    expect(validateLearningData(learningInitiatives, [first, second], [], []))
      .toEqual(expect.arrayContaining([expect.stringContaining("Dependency cycle")]));
  });

  it("requires completion dates and evidence for Done tickets", () => {
    const invalidDone = { ...learningTickets[1], completionDate: undefined, evidenceIds: [] } as LearningTicket;
    const errors = validateLearningData(learningInitiatives, [learningTickets[0], invalidDone], [], learningEvidence);
    expect(errors).toEqual(expect.arrayContaining([
      expect.stringContaining("Done without a completion date"),
      expect.stringContaining("Done without its public definition of done or evidence"),
    ]));
  });

  it("requires human approval and rejects raw private export fields", () => {
    const rawExport = {
      visibility: "Public Draft",
      publicApproved: false,
      notClaimed: "",
      jiraKey: "LEARN-1",
      jiraUrl: "https://example.atlassian.net/browse/LEARN-1",
      accountEmail: "person@example.com",
      comments: ["private note"],
    };
    expect(validatePublicationCandidate(rawExport)).toEqual(expect.arrayContaining([
      "Candidate visibility must be Public",
      "Candidate requires human public approval",
      "Candidate requires a truth boundary",
      expect.stringContaining("forbidden public field"),
      expect.stringContaining("public-forbidden text"),
    ]));
  });

  it("keeps the healthcare SQL seed truthful and excludes private SQL-011", () => {
    const sqlTickets = learningTickets.filter((ticket) => ticket.key.startsWith("SQL-"));
    expect(sqlTickets.every((ticket) => ticket.deliveryStatus !== "Done")).toBe(true);
    expect(sqlTickets.every((ticket) => ticket.evidenceState !== "Demonstrated")).toBe(true);
    expect(learningEvidence.some((item) => item.relatedProjectSlug === "healthcare-sql-customer-operations")).toBe(false);
    expect(learningTickets.some((ticket) => ticket.key === "SQL-011")).toBe(false);
  });

  it("records the verified course metadata and preserves existing relationships", () => {
    const course = learningCourses[0];
    const ticket = getLearningTicket(course.relatedTicketKey)!;

    expect(course.title).toBe("SQL Essential Training");
    expect(course.provider).toBe("LinkedIn Learning");
    expect(course.instructor).toBe("Walter Shields");
    expect(course.providerUpdated).toBe("May 2024");
    expect(course.status).toBe("In Progress");
    expect(course.evidenceState).toBe("Learning");
    expect(course.initiativeSlug).toBe("healthcare-sql-customer-operations");
    expect(course.relatedProjectSlug).toBe("healthcare-sql-customer-operations");
    expect(ticket.key).toBe("SQL-002");
    expect(ticket.deliveryStatus).toBe("In Progress");
    expect(course.progressSnapshots).toEqual([expect.objectContaining({
      observedAt: "2026-08-07T18:45:10-06:00",
      source: "User-provided screenshot",
      verificationState: "Verified",
      valueKind: "Derived",
      totalDurationSeconds: 16_560,
      completedDurationSeconds: 1_818,
      remainingDurationSeconds: 14_742,
    })]);
    expect(getCourseProgressPercentage(getCurrentCourseProgress(course)!)).toBe(11);
  });

  it("rejects invalid course percentages, timestamps, and durations", () => {
    expect(validateCourseProgressSnapshot({ ...verifiedProgress40, percentage: 101 }))
      .toContain("TEST-PROGRESS-40 percentage must be between 0 and 100");
    expect(validateCourseProgressSnapshot({ ...verifiedProgress40, observedAt: "not-a-date" }))
      .toContain("TEST-PROGRESS-40 has an invalid observation timestamp");
    expect(validateCourseProgressSnapshot({ ...verifiedProgress40, completedDurationSeconds: -1 }))
      .toContain("TEST-PROGRESS-40 completed duration cannot be negative");
    expect(validateCourseProgressSnapshot({ ...verifiedProgress40, completedDurationSeconds: 20_000 }))
      .toContain("TEST-PROGRESS-40 completed duration cannot exceed total duration");
  });

  it("derives progress only from labeled duration inputs", () => {
    const derived: CourseProgressSnapshot = {
      id: "TEST-DERIVED-11",
      scope: "Course progress",
      observedAt: "2026-08-07T12:00:00-06:00",
      source: "User-provided screenshot",
      sourceProvider: "Test provider",
      verificationState: "Candidate",
      verificationLabel: "Candidate test value",
      valueKind: "Derived",
      totalDurationSeconds: 16_560,
      remainingDurationSeconds: 14_742,
      relatedEvidenceIds: [],
    };
    expect(validateCourseProgressSnapshot(derived)).toEqual([]);
    expect(getCourseProgressPercentage(derived)).toBe(11);
    expect(formatCourseDuration(derived.totalDurationSeconds!)).toBe("4h 36m");
  });

  it("selects the newest verified snapshot instead of a newer candidate", () => {
    const course = {
      ...learningCourses[0],
      progressSnapshots: [verifiedProgress40, newerCandidate90, verifiedProgress60],
    } as LearningCourse;
    expect(getCurrentCourseProgress(course)?.id).toBe("TEST-PROGRESS-60");
    expect(getCourseProgressPercentage(getCurrentCourseProgress(course)!)).toBe(60);
    expect(validateLearningData(learningInitiatives, learningTickets, workSessions, learningEvidence, [course]))
      .toContain("TEST-PROGRESS-CANDIDATE-90 is an unverified candidate and cannot enter public course data");
  });

  it("appends progress without replacing history or fabricating a work session", () => {
    const course = { ...learningCourses[0], progressSnapshots: [verifiedProgress40] } as LearningCourse;
    const sessionCount = workSessions.length;
    const updated = recordCourseProgress(course, newerCandidate90);

    expect(updated.progressSnapshots.map((snapshot) => snapshot.id)).toEqual([
      "TEST-PROGRESS-40",
      "TEST-PROGRESS-CANDIDATE-90",
    ]);
    expect(course.progressSnapshots).toHaveLength(1);
    expect(workSessions).toHaveLength(sessionCount);
  });

  it("keeps course completion separate from ticket completion and SQL evidence maturity", () => {
    const verified100 = {
      ...verifiedProgress60,
      id: "TEST-PROGRESS-100",
      observedAt: "2026-08-07T19:00:00-06:00",
      percentage: 100,
      completedDurationSeconds: 16_560,
    };
    const course = recordCourseProgress(learningCourses[0], verified100);
    const completed = completeLearningCourse(course, "2026-08-07");

    expect(completed.status).toBe("Completed");
    expect(completed.progressSnapshots).toEqual(course.progressSnapshots);
    expect(completed.relatedTicketKey).toBe(course.relatedTicketKey);
    expect(completed.initiativeSlug).toBe(course.initiativeSlug);
    expect(completed.relatedProjectSlug).toBe(course.relatedProjectSlug);
    expect(completed.evidenceState).toBe("Learning");
    expect(getLearningTicket("SQL-002")?.deliveryStatus).toBe("In Progress");
    expect(getLearningTicket("SQL-002")?.acceptanceCriteria.length).toBeGreaterThan(1);
  });

  it("parses, combines, and recovers URL filter state", () => {
    const filters = parseBoardFilters("?q=baseline&initiative=healthcare-sql-customer-operations&delivery=Ready&evidence=Learning&capability=sql&role=technical-account-manager&type=Spike");
    expect(filters).toEqual({
      query: "baseline",
      initiative: "healthcare-sql-customer-operations",
      delivery: "Ready",
      evidence: "Learning",
      capability: "sql",
      role: "technical-account-manager",
      issueType: "Spike",
    });
    expect(filterLearningTickets(filters).map((ticket) => ticket.key)).toEqual(["SQL-001"]);
    expect(parseBoardFilters("?delivery=Invented&capability=free-text&type=Unknown")).toEqual({
      query: undefined,
      initiative: undefined,
      delivery: undefined,
      evidence: undefined,
      capability: undefined,
      role: undefined,
      issueType: undefined,
    });
    expect(parseTimelineFilters("?initiative=healthcare-sql-customer-operations&kind=actual")).toEqual({
      initiative: "healthcare-sql-customer-operations",
      capability: undefined,
      role: undefined,
      kind: "actual",
    });
    expect(parseTimelineFilters("?kind=invented").kind).toBeUndefined();
  });

  it("searches only public-safe ticket key, title, and summary fields", () => {
    const candidate = {
      ...learningTickets[0],
      key: "SEARCH-001",
      title: "Visible title phrase",
      publicSummary: "Approved summary phrase",
      nextAction: "private-shaped next action phrase",
    } as LearningTicket;
    expect(filterLearningTickets({ query: "search-001" }, [candidate])).toHaveLength(1);
    expect(filterLearningTickets({ query: "visible title" }, [candidate])).toHaveLength(1);
    expect(filterLearningTickets({ query: "approved summary" }, [candidate])).toHaveLength(1);
    expect(filterLearningTickets({ query: "private-shaped" }, [candidate])).toHaveLength(0);
    expect(filterLearningTickets({ query: "VISIBLE", delivery: candidate.deliveryStatus }, [candidate])).toHaveLength(1);
  });

  it("derives a reverse-chronological timeline from source records", () => {
    const events = getLearningTimeline();
    expect(events.length).toBeGreaterThan(learningTickets.length);
    expect(events.every((event, index) => index === 0 || events[index - 1].occurredAt >= event.occurredAt)).toBe(true);
    expect(events.some((event) => event.type === "Work session recorded" && event.id === workSessions[0].id)).toBe(true);
    expect(events.some((event) => event.id.includes("blocker"))).toBe(false);
  });

  it("renders valid public ticket routes and keeps unknown keys on the not-found route", () => {
    const validRoute = resolveRoute("/learning/tickets/SQL-001");
    expect(validRoute.title).toContain("SQL-001");
    expect(renderWithAdminProvider(validRoute.element)).toContain("Establish SQL baseline");

    const unknownRoute = resolveRoute("/learning/tickets/PRIVATE-001");
    expect(unknownRoute.title).toContain("PRIVATE-001");
    expect(renderWithAdminProvider(unknownRoute.element)).toContain("That page isn’t here");
  });

  it("keeps learning analytics properties to the low-cardinality allowlist", () => {
    expect(sanitizeLearningAnalyticsProperties({
      initiative: "careeros-learning-delivery",
      delivery: "Done",
      note: "arbitrary work-session text",
      email: "person@example.com",
      issueType: "Story",
      provider: "linkedin-learning",
      course: "sql-essential-training-linkedin-learning",
      ctaLocation: "current-learning",
      percentage: "90",
      completedDuration: "4h",
      currentModule: "private free text",
    })).toEqual({
      initiative: "careeros-learning-delivery",
      delivery: "Done",
      issueType: "Story",
      provider: "linkedin-learning",
      course: "sql-essential-training-linkedin-learning",
      ctaLocation: "current-learning",
    });
  });

  it("renders the verified current learning snapshot", () => {
    const markup = renderWithAdminProvider(resolveRoute("/learning").element);
    expect(markup).toContain("Current courses");
    expect(markup).toContain("SQL Essential Training");
    expect(markup).toContain("Walter Shields");
    expect(markup).toContain('aria-label="Course progress for SQL Essential Training"');
    expect(markup).toContain('value="11"');
    expect(markup).toContain('max="100"');
    expect(markup).toContain("30m 18s");
    expect(markup).toContain("4h 5m 42s");
    expect(markup).toContain("User-provided screenshot");
    expect(markup).toContain("Derived");
    expect(markup).toContain('href="/learning/tickets/SQL-002"');
    expect(markup).toContain('href="/projects/healthcare-sql-customer-operations"');
    expect(markup).toContain('aria-label="Course state counts"');
    expect(markup).toContain('aria-label="Learning workspace"');
    expect(markup).toContain("The three newest approved artifacts");
  });

  it("renders compact Career context and all three current CU Boulder course cards", () => {
    const markup = renderWithAdminProvider(resolveRoute("/learning").element);
    expect(markup).toContain("Career context");
    expect(markup).toContain("Customer-Facing Technical Engineering");
    expect(markup).toContain("Technical Account Management");
    expect(markup).toContain("University of Colorado Boulder Master of Science in Computer Science coursework");
    expect(markup).toContain("Network Systems: Principles and Practice");
    expect(markup).toContain("CSCA 5063 - Network Systems Foundation");
    expect(markup).toContain("CSCA 5073 - Network Principles in Practice: Linux Networking");
    expect(markup).toContain("CSCA 5083 - Network Principles in Practice: Cloud Networking");
    expect(markup).toContain('href="/learning/tickets/CU-NET-001"');
    expect(markup).toContain('href="/learning/tickets/CU-NET-002"');
    expect(markup).toContain('href="/learning/tickets/CU-NET-003"');
  });

  it("renders 20 percent only as CSCA 5063 course progress", () => {
    const markup = renderWithAdminProvider(resolveRoute("/learning").element);
    expect(markup).toContain('aria-label="Course progress for Network Systems Foundation"');
    expect(markup).toContain('value="20"');
    const csca5073 = courseMarkup(markup, "CSCA 5073");
    const csca5083 = courseMarkup(markup, "CSCA 5083");
    expect(csca5073).toContain("No verified current percentage is published");
    expect(csca5073).not.toContain("value=\"20\"");
    expect(csca5083).toContain("No verified current percentage is published");
  });

  it("renders verified numeric progress as an accessible course progress element", () => {
    const course = { ...learningCourses[0], progressSnapshots: [verifiedProgress60] } as LearningCourse;
    const markup = renderWithAdminProvider(<CurrentLearningCourseCard course={course} />);
    expect(markup).toContain('aria-label="Course progress for SQL Essential Training"');
    expect(markup).toContain('value="60"');
    expect(markup).toContain('max="100"');
    expect(markup).not.toMatch(/proficiency progress|mastery progress/i);
  });

  it("keeps one Learning navigation item and no competing Education area", () => {
    const layoutSource = readFileSync(new URL("../components/SiteLayout.tsx", import.meta.url), "utf8");
    expect(layoutSource).toContain('{ href: "/learning", label: "Learning" }');
    expect(layoutSource).not.toMatch(/label: "(?:Education|Currently Learning)"/);
  });

  it("keeps private LinkedIn state out of public records", () => {
    const publicCourseData = JSON.stringify(learningCourses);
    expect(publicCourseData).not.toMatch(/password|cookie|accessToken|accountId|certificateId/);
    expect(publicCourseData).not.toMatch(/linkedin\.com\/learning\/(?:me|my-learning|in-progress)/i);
  });

  it("renders native labeled board controls and textual status labels", () => {
    const markup = renderWithAdminProvider(resolveRoute("/learning/board").element);
    expect(markup).toContain("<form");
    expect(markup).toContain('type="search"');
    expect(markup).toContain('name="q"');
    expect(markup).toContain("<label>Initiative");
    expect(markup).toContain("<select");
    expect(markup).toContain("<button");
    expect(markup).toContain(">Ready<");
    expect(markup).toContain(">Learning<");
    expect(markup).toContain("Delivery Pulse");
  });

  it("renders timeline kinds as shareable filter links", () => {
    const markup = renderWithAdminProvider(resolveRoute("/learning/timeline").element);
    expect(markup).toContain("Planned window");
    expect(markup).toContain("Actual work");
    expect(markup).toContain("Open-ended work");
    expect(markup).toContain("Completion milestone");
    expect(markup).toContain('aria-label="Filter timeline by work kind"');
  });

  it("keeps the mobile board stacked without horizontal column scrolling", () => {
    const css = readFileSync(new URL("../styles.css", import.meta.url), "utf8");
    const mobileBlock = css.slice(css.indexOf("@media (max-width: 720px)"), css.indexOf("@media (max-width: 420px)"));
    expect(mobileBlock).toContain(".kanbanBoard");
    expect(mobileBlock).toContain(".courseProgressMeta");
    expect(mobileBlock).toContain("grid-template-columns: 1fr");
    expect(mobileBlock).toContain(".mobileNavToggle");
    expect(mobileBlock).toContain("display: inline-flex");
  });

  it("preserves existing project, role, and navigation routes", () => {
    ["/", "/projects", "/projects/careeros", "/roles", "/roles/technical-account-manager", "/skills", "/writing", "/roadmap", "/resume-contact"]
      .forEach((path) => expect(resolveRoute(path).title).not.toBe("Not Found"));
  });
});
