import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { resolveRoute } from "../App";
import { sanitizeLearningAnalyticsProperties } from "../analytics";
import {
  filterLearningTickets,
  getLearningTimeline,
  learningEvidence,
  learningInitiatives,
  learningTickets,
  parseBoardFilters,
  validateLearningData,
  validatePublicationCandidate,
  workSessions,
  type LearningTicket,
} from "./learning";

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
    );
    expect(errors).toEqual(expect.arrayContaining([
      expect.stringContaining("Duplicate initiative identifier"),
      expect.stringContaining("Duplicate ticket identifier"),
      expect.stringContaining("Duplicate session identifier"),
      expect.stringContaining("Duplicate evidence identifier"),
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

  it("parses, combines, and recovers URL filter state", () => {
    const filters = parseBoardFilters("?initiative=healthcare-sql-customer-operations&delivery=Ready&evidence=Learning&capability=sql&role=technical-account-manager&type=Spike");
    expect(filters).toEqual({
      initiative: "healthcare-sql-customer-operations",
      delivery: "Ready",
      evidence: "Learning",
      capability: "sql",
      role: "technical-account-manager",
      issueType: "Spike",
    });
    expect(filterLearningTickets(filters).map((ticket) => ticket.key)).toEqual(["SQL-001"]);
    expect(parseBoardFilters("?delivery=Invented&capability=free-text&type=Unknown")).toEqual({
      initiative: undefined,
      delivery: undefined,
      evidence: undefined,
      capability: undefined,
      role: undefined,
      issueType: undefined,
    });
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
    expect(renderToStaticMarkup(validRoute.element)).toContain("Establish SQL baseline");

    const unknownRoute = resolveRoute("/learning/tickets/PRIVATE-001");
    expect(unknownRoute.title).toBe("Not Found");
    expect(renderToStaticMarkup(unknownRoute.element)).toContain("That page isn’t here");
  });

  it("keeps learning analytics properties to the low-cardinality allowlist", () => {
    expect(sanitizeLearningAnalyticsProperties({
      initiative: "careeros-learning-delivery",
      delivery: "Done",
      note: "arbitrary work-session text",
      email: "person@example.com",
      issueType: "Story",
    })).toEqual({
      initiative: "careeros-learning-delivery",
      delivery: "Done",
      issueType: "Story",
    });
  });

  it("renders native labeled board controls and textual status labels", () => {
    const markup = renderToStaticMarkup(resolveRoute("/learning/board").element);
    expect(markup).toContain("<form");
    expect(markup).toContain("<label>Initiative");
    expect(markup).toContain("<select");
    expect(markup).toContain("<button");
    expect(markup).toContain(">Ready<");
    expect(markup).toContain(">Learning<");
  });

  it("keeps the mobile board stacked without horizontal column scrolling", () => {
    const css = readFileSync(new URL("../styles.css", import.meta.url), "utf8");
    const mobileBlock = css.slice(css.indexOf("@media (max-width: 720px)"), css.indexOf("@media (max-width: 420px)"));
    expect(mobileBlock).toContain(".kanbanBoard");
    expect(mobileBlock).toContain("grid-template-columns: 1fr");
    expect(mobileBlock).toContain(".mobileNavToggle");
    expect(mobileBlock).toContain("display: inline-flex");
  });

  it("preserves existing project, role, and navigation routes", () => {
    ["/", "/projects", "/projects/careeros", "/roles", "/roles/technical-account-manager", "/skills", "/writing", "/roadmap", "/resume-contact"]
      .forEach((path) => expect(resolveRoute(path).title).not.toBe("Not Found"));
  });
});
