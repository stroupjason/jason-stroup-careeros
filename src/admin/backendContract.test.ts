import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { academicPrograms, academicSpecializations, careerTrack, getLearningTicket, learningCourses, learningTickets } from "../data/learning";

const migration = readFileSync(new URL("../../supabase/migrations/20260808000100_learning_admin.sql", import.meta.url), "utf8");
const operationsMigration = readFileSync(new URL("../../supabase/migrations/20260808000200_delivery_intelligence_operations.sql", import.meta.url), "utf8");
const adminSource = readFileSync(new URL("./AdminContext.tsx", import.meta.url), "utf8");
const supabaseSource = readFileSync(new URL("../lib/supabase.ts", import.meta.url), "utf8");

describe("CareerOS backend and CU coursework contract", () => {
  it("preserves the exact 22-ticket production baseline while extending the backlog", () => {
    const baselineKeys = [
      "LDS-001", "PRODUCT-211", "PRODUCT-212", "PRODUCT-213", "PRODUCT-214", "PRODUCT-215",
      "PRODUCT-219", "PRODUCT-216", "PRODUCT-217", "PRODUCT-218", "SQL-000", "SQL-001",
      "SQL-002", "SQL-003", "SQL-004", "SQL-005", "SQL-006", "SQL-007", "SQL-008",
      "SQL-009", "SQL-010", "SQL-012",
    ];
    expect(baselineKeys).toHaveLength(22);
    expect(baselineKeys.every((key) => learningTickets.some((ticket) => ticket.key === key))).toBe(true);
    expect(migration).toContain("Baseline parity failed");
    expect(migration).toContain("on conflict (key) do nothing");
  });

  it("models the Career Track without a combined readiness percentage", () => {
    expect(careerTrack.title).toBe("Customer-Facing Technical Engineering");
    expect(careerTrack.currentRoleFocus).toBe("Technical Account Management");
    expect(JSON.stringify(careerTrack)).not.toMatch(/readiness|percentage/i);
  });

  it("keeps CU academic statuses and credit claims separate", () => {
    const program = academicPrograms[0];
    const pathway = academicSpecializations[0];
    expect(program).toMatchObject({ totalCredits: 30, breadthCredits: 15, electiveCredits: 15, coursesEnrolled: 3, coursesCompleted: 0, earnedCreditsLabel: "Not yet verified", admissionStatus: "Not verified" });
    expect(pathway).toMatchObject({ courseCount: 3, status: "In Progress", evidenceState: "Learning" });
    expect(pathway).not.toHaveProperty("percentage");
  });

  it("records only the verified CSCA 5063 course-scoped percentage", () => {
    const courses = learningCourses.filter((course) => course.academicProgramSlug === "cu-boulder-mscs");
    expect(courses.map((course) => course.courseNumber)).toEqual(["CSCA 5063", "CSCA 5073", "CSCA 5083"]);
    expect(courses[0].progressSnapshots).toEqual([expect.objectContaining({
      scope: "Course progress",
      percentage: 20,
      source: "User-provided screenshot",
      sourceProvider: "Coursera",
      valueKind: "Provider reported",
      verificationState: "Verified",
      observedAt: "2026-08-08T12:00:00-06:00",
    })]);
    expect(courses[1].progressSnapshots).toEqual([]);
    expect(courses[2].progressSnapshots).toEqual([]);
  });

  it("preserves SQL-002 unknown dates, estimate, effort, and completion", () => {
    const ticket = getLearningTicket("SQL-002")!;
    expect(ticket).toMatchObject({ deliveryStatus: "In Progress", plannedStart: "2026-08-08" });
    expect(ticket.actualStart).toBeUndefined();
    expect(ticket.targetDate).toBeUndefined();
    expect(ticket.completionDate).toBeUndefined();
    expect(ticket.userEstimate).toBeUndefined();
  });

  it("enforces private authoring, immutable audit, and stale-write rejection in SQL", () => {
    const privateTables = [
      "admin_memberships", "learning_initiatives", "learning_tickets", "acceptance_items",
      "learning_courses", "learning_evidence", "progress_snapshots", "work_sessions",
      "learning_blockers", "audit_events",
    ];
    privateTables.forEach((table) => expect(migration).toContain(`alter table private.${table} enable row level security`));
    expect(migration).toContain("revoke all on schema private from public, anon, authenticated");
    expect(migration).toContain("raise exception 'Stale ticket revision' using errcode = '40001'");
    expect(migration).toContain("insert into private.audit_events");
    expect(migration).toContain("before update or delete on private.audit_events");
    expect(migration).toContain("raise exception 'Audit events are append-only'");
    expect(migration).not.toMatch(/update private\.audit_events|delete from private\.audit_events/i);
  });

  it("authorizes through the immutable membership and preserves session corrections", () => {
    expect(migration).toMatch(/function public\.learning_admin_is_authorized\(\)[\s\S]*?security definer/);
    expect(migration).toContain("learning_admin_add_manual_session");
    expect(migration).toContain("superseded_at");
    expect(migration).toContain("A valid start and end are required");
    expect(migration).toContain("set resolved_at = now()");
  });

  it("exposes only publishable browser configuration and disables public account creation", () => {
    expect(supabaseSource).toContain("VITE_SUPABASE_PUBLISHABLE_KEY");
    expect(supabaseSource).not.toMatch(/service.role|database.password|secret.key/i);
    expect(adminSource).toContain("shouldCreateUser: false");
    expect(adminSource).toContain("If this address is authorized");
    expect(adminSource).not.toMatch(/accountEmail|adminEmail/);
  });

  it("keeps provider API progress deferred and human confirmation explicit", () => {
    expect(getLearningTicket("SQL-013")?.deliveryStatus).toBe("Backlog");
    expect(adminSource).toContain("p_public_approved");
    expect(migration).toContain("Only verified progress can enter the public projection");
    expect(migration).not.toMatch(/linkedin.*password|coursera.*password/i);
  });

  it("projects only approved evidence while private locations remain private", () => {
    expect(migration).toContain("create table if not exists public.learning_public_evidence");
    expect(migration).toContain("learning_admin_create_evidence");
    expect(migration).toContain("learning_admin_set_evidence_publication");
    expect(migration).toContain("private_location");
    expect(migration).not.toMatch(/learning_public_evidence[\s\S]{0,500}private_location/i);
  });

  it("keeps the verified static projection until the durable baseline is ready", () => {
    expect(migration).toContain("'projectionReady', (select count(*) from public.learning_public_tickets) >= 22");
    expect(adminSource).toContain("publicSnapshot?.projectionReady ? publicSnapshot.tickets : learningTickets");
  });

  it("keeps acceptance-item loop variables distinct from SQL column names", () => {
    expect(migration).toContain("acceptance_index integer");
    expect(migration).toContain("values (item->>'key', acceptance_index");
    expect(migration).not.toContain("item_index integer;");
    expect(migration).not.toContain("item_index integer := 0;");
  });

  it("reconciles Delivery Intelligence without duplicating the existing admin hierarchy", () => {
    expect(getLearningTicket("PRODUCT-228")).toMatchObject({ issueType: "Epic", deliveryStatus: "In Progress" });
    ["PRODUCT-229", "PRODUCT-230", "PRODUCT-231", "PRODUCT-232", "PRODUCT-233", "PRODUCT-234", "PRODUCT-235"].forEach((key) => {
      expect(getLearningTicket(key)?.parentKey).toBe("PRODUCT-228");
    });
    expect(getLearningTicket("PRODUCT-234")?.deliveryStatus).toBe("Backlog");
    expect(getLearningTicket("PRODUCT-239")).toMatchObject({ deliveryStatus: "Backlog", issueType: "Story" });
    expect(getLearningTicket("PRODUCT-239")?.notClaimed).toContain("SFTP is unrelated");
    expect(getLearningTicket("PRODUCT-240")).toMatchObject({
      deliveryStatus: "In Review",
      issueType: "Story",
      relatedProjectSlug: "careeros",
    });
  });

  it("tracks each resolved activation defect as one classified canonical Bug", () => {
    const bugKeys = ["PRODUCT-236", "PRODUCT-237", "PRODUCT-238"];
    const bugs = learningTickets.filter((ticket) => bugKeys.includes(ticket.key));
    expect(bugs).toHaveLength(3);
    bugs.forEach((bug) => {
      expect(bug).toMatchObject({ issueType: "Bug", parentKey: "PRODUCT-220", deliveryStatus: "Done" });
      expect(bug.bugClassification).toBeDefined();
    });
    expect(getLearningTicket("PRODUCT-237")?.bugClassification?.category).toBe("Authentication");
    expect(getLearningTicket("PRODUCT-238")?.bugClassification?.category).toBe("Data");
    expect(JSON.stringify(bugs)).not.toMatch(/@|project_ref|request.?id|ip address|raw log/i);
  });

  it("keeps operational RCA records private and membership-authorized", () => {
    ["operational_incidents", "bug_records", "bug_observations"].forEach((table) => {
      expect(operationsMigration).toContain(`alter table private.${table} enable row level security`);
    });
    expect(operationsMigration).toContain("using ((select private.is_learning_admin()))");
    expect(operationsMigration).toContain("revoke all on private.operational_incidents, private.bug_records, private.bug_observations from public, anon, authenticated");
    expect(operationsMigration).toContain("learning_admin_update_bug_record");
    expect(operationsMigration).toContain("learning_admin_add_bug_observation");
    expect(operationsMigration).toContain("insert into private.audit_events");
    expect(operationsMigration).toContain("else public_data - 'bugClassification'");
    expect(operationsMigration).not.toMatch(/service.role|management.api.token|database.password/i);
  });

  it("keeps an authorized session authorized when workspace loading reports an operational error", () => {
    expect(adminSource).toMatch(/setAuthState\("admin"\);\s+try \{\s+await ensureSeeded\(\)/);
    expect(adminSource).toContain("learning_admin_seed_operations");
    expect(adminSource).toContain("learning_admin_operations_snapshot");
    expect(adminSource).not.toMatch(/catch \(error\) \{\s+setAuthState\("unauthorized"\)/);
  });
});
