import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session } from "@supabase/supabase-js";
import {
  learningCourses,
  learningEvidence,
  learningInitiatives,
  learningTickets,
  workSessions,
  type CourseProgressSnapshot,
  type DeliveryStatus,
  type LearningCourse,
  type LearningEvidence,
  type LearningInitiative,
  type LearningTicket,
} from "../data/learning";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import type { TaskCoachFactors } from "./taskCoach";
import {
  isPasskeySupported,
  isCanonicalPasskeyOrigin,
  requirePasskeyResult,
  type PasskeyRecord,
} from "./adminAuth";

const baselineTicketKeys = [
  "LDS-001",
  "PRODUCT-211",
  "PRODUCT-212",
  "PRODUCT-213",
  "PRODUCT-214",
  "PRODUCT-215",
  "PRODUCT-219",
  "PRODUCT-216",
  "PRODUCT-217",
  "PRODUCT-218",
  "SQL-000",
  "SQL-001",
  "SQL-002",
  "SQL-003",
  "SQL-004",
  "SQL-005",
  "SQL-006",
  "SQL-007",
  "SQL-008",
  "SQL-009",
  "SQL-010",
  "SQL-012",
] as const;

export type AdminTicket = LearningTicket & {
  revision: number;
  rank: number;
  privateNotes?: string;
  archivedAt?: string;
  taskCoachFactors?: TaskCoachFactors;
  publicationApproved: boolean;
  acceptanceItems: Array<{
    index: number;
    label: string;
    mandatory: boolean;
    completedAt?: string;
  }>;
};

export type AdminWorkSession = {
  id: string;
  ticketKey: string;
  startedAt: string;
  endedAt?: string;
  durationMinutes?: number;
  privateNote?: string;
  publicSummary?: string;
  publicApproved: boolean;
  correctedFrom?: string;
  supersededAt?: string;
};

export type PublicWorkSession = {
  id: string;
  ticketKey: string;
  startedAt: string;
  endedAt: string;
  durationMinutes: number;
  publicSummary: string;
  publicApproved: true;
};

type WorkSessionCapture = {
  privateNote?: string;
  publicSummary?: string;
  nextAction?: string;
  publicApproved?: boolean;
};

export type AdminAuditEvent = {
  id: string;
  occurredAt: string;
  entityType: string;
  entityKey: string;
  action: string;
  beforeSummary?: Record<string, unknown>;
  afterSummary?: Record<string, unknown>;
  correlationId: string;
  reversible: boolean;
};

export type AdminBugRecord = {
  bugKey: string;
  category: LearningTicket["bugClassification"] extends infer Classification
    ? Classification extends { category: infer Category } ? Category : never
    : never;
  severity: LearningTicket["bugClassification"] extends infer Classification
    ? Classification extends { severity: infer Severity } ? Severity : never
    : never;
  incidentKey: string;
  affectedFeatureKeys: string[];
  reporterSource: string;
  verificationState: "Candidate" | "Confirmed" | "Resolved" | "Verified" | "Duplicate";
  privateDiagnosticNotes?: string;
  publicDerivative: NonNullable<LearningTicket["bugClassification"]>;
  publicDerivativeApproved: boolean;
  revision: number;
  updatedAt: string;
};

export type AdminOperationalIncident = {
  incidentKey: string;
  title: string;
  status: "Open" | "Monitoring" | "Resolved";
  severity: AdminBugRecord["severity"];
  detectedOn: string;
  resolvedOn?: string;
  affectedService: string;
  publicSymptom: string;
  publicImpact: string;
  publicRootCause: string;
  publicResolution: string;
  publicPrevention: string;
  privateEvidenceReference?: string;
  relatedTicketKey: string;
  relatedProjectSlug: string;
  capabilitySlugs: string[];
  publicationApproved: boolean;
  revision: number;
  updatedAt: string;
};

export type AdminBugObservation = {
  id: string;
  bugKey: string;
  observedAt: string;
  observationType: "Symptom" | "Diagnostic" | "Hypothesis" | "Root cause" | "Fix" | "Verification" | "Reopen" | "Duplicate review";
  privateNote: string;
  publicSummary?: string;
  publicApproved: boolean;
  createdAt: string;
};

export type AdminEvidence = Omit<LearningEvidence, "approvedAt"> & {
  approvedAt?: string;
  revision: number;
  privateLocation?: string;
  privateNotes?: string;
  publicationApproved: boolean;
  archivedAt?: string;
};

export type NewAdminEvidence = {
  id: string;
  type: LearningEvidence["type"];
  title: string;
  dateCreated: string;
  createdAt: string;
  verificationState: LearningEvidence["verificationState"];
  evidenceStateSupported: LearningEvidence["evidenceStateSupported"];
  relatedProjectSlug: string;
  capabilitySlugs: string[];
  roleLensSlugs: string[];
  publicUrl?: string;
  repositoryPath?: string;
  publicSummary: string;
  limitations: string;
  notClaimed: string;
  privateLocation?: string;
  privateNotes?: string;
  publicationApproved: boolean;
};

type PublicLearningSnapshot = {
  projectionReady: boolean;
  tickets: LearningTicket[];
  courses: LearningCourse[];
  initiatives: LearningInitiative[];
  evidence: LearningEvidence[];
  sessions: PublicWorkSession[];
};

type AdminLearningSnapshot = PublicLearningSnapshot & {
  adminTickets: AdminTicket[];
  adminSessions: AdminWorkSession[];
  adminEvidence: AdminEvidence[];
  auditEvents: AdminAuditEvent[];
};

type AdminOperationsSnapshot = {
  bugRecords: AdminBugRecord[];
  incidents: AdminOperationalIncident[];
  observations: AdminBugObservation[];
};

type TicketPatchKey =
  | "title"
  | "publicSummary"
  | "nextAction"
  | "priority"
  | "initiativeSlug"
  | "dependencies"
  | "capabilitySlugs"
  | "roleLensSlugs"
  | "plannedStart"
  | "actualStart"
  | "targetDate"
  | "completionDate"
  | "userEstimate"
  | "taskCoachFactors"
  | "privateNotes"
  | "publicationApproved"
;

type TicketPatch = {
  [Key in TicketPatchKey]?: AdminTicket[Key] | null;
};

export type NewAdminTicket = {
  key: string;
  issueType: LearningTicket["issueType"];
  title: string;
  publicSummary: string;
  deliveryStatus: DeliveryStatus;
  evidenceState: LearningTicket["evidenceState"];
  priority: LearningTicket["priority"];
  initiativeSlug: string;
  parentKey?: string;
  dependencies: string[];
  plannedStart?: string;
  definitionOfDone: string;
  acceptanceCriteria: string[];
  capabilitySlugs: string[];
  roleLensSlugs: string[];
  nextAction: string;
  relatedProjectSlug: string;
  notClaimed: string;
  privateNotes?: string;
  publicationApproved: boolean;
};

type MoveContext = {
  actualStartMode?: "keep_unknown" | "now" | "verified_date";
  actualStartAt?: string;
  blockerReason?: string;
  blockerNextCheck?: string;
  completedAt?: string;
  overrideReason?: string;
};

type AdminContextValue = {
  configured: boolean;
  session: Session | null;
  authState: "loading" | "anonymous" | "unauthorized" | "admin";
  passkeySupported: boolean;
  passkeyOriginReady: boolean;
  passkeys: PasskeyRecord[];
  adminTickets: AdminTicket[];
  sessions: AdminWorkSession[];
  auditEvents: AdminAuditEvent[];
  publicTickets: LearningTicket[];
  publicCourses: LearningCourse[];
  publicInitiatives: LearningInitiative[];
  publicEvidence: LearningEvidence[];
  publicSessions: PublicWorkSession[];
  adminEvidence: AdminEvidence[];
  bugRecords: AdminBugRecord[];
  incidents: AdminOperationalIncident[];
  bugObservations: AdminBugObservation[];
  busyAction?: string;
  notice?: string;
  requestMagicLink: (email: string) => Promise<void>;
  signInWithPasskey: () => Promise<void>;
  registerPasskey: () => Promise<void>;
  listPasskeys: () => Promise<void>;
  renamePasskey: (passkeyId: string, friendlyName: string) => Promise<void>;
  deletePasskey: (passkeyId: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshAdmin: () => Promise<void>;
  createTicket: (ticket: NewAdminTicket) => Promise<void>;
  moveTicket: (ticket: AdminTicket, status: DeliveryStatus, rank: number, context?: MoveContext) => Promise<void>;
  updateTicket: (ticket: AdminTicket, patch: TicketPatch) => Promise<void>;
  toggleAcceptanceItem: (ticket: AdminTicket, index: number, completed: boolean) => Promise<void>;
  startWorkSession: (ticket: AdminTicket) => Promise<void>;
  stopWorkSession: (session: AdminWorkSession, capture: WorkSessionCapture) => Promise<void>;
  addManualWorkSession: (ticket: AdminTicket, startedAt: string, endedAt: string, capture: WorkSessionCapture, correctedFrom?: string) => Promise<void>;
  addProgressSnapshot: (courseId: string, ticketKey: string, snapshot: CourseProgressSnapshot, publicApproved: boolean, privateEvidenceReference?: string) => Promise<void>;
  createEvidence: (ticket: AdminTicket, evidence: NewAdminEvidence) => Promise<void>;
  setEvidencePublication: (evidence: AdminEvidence, publicApproved: boolean) => Promise<void>;
  archiveTicket: (ticket: AdminTicket, archive: boolean) => Promise<void>;
  undoLastMove: (ticketKey: string) => Promise<void>;
  updateBugRecord: (record: AdminBugRecord, patch: {
    category?: AdminBugRecord["category"];
    severity?: AdminBugRecord["severity"];
    affectedFeatureKeys?: string[];
    verificationState?: AdminBugRecord["verificationState"];
    privateDiagnosticNotes?: string;
    publicDerivativeApproved?: boolean;
  }) => Promise<void>;
  addBugObservation: (bugKey: string, observation: Omit<AdminBugObservation, "id" | "bugKey" | "createdAt">) => Promise<void>;
  clearNotice: () => void;
};

const AdminContext = createContext<AdminContextValue | null>(null);

const staticPublicSessions: PublicWorkSession[] = workSessions.flatMap((session) => {
  if (!session.startedAt || !session.endedAt) return [];
  return [{
    id: session.id,
    ticketKey: session.ticketKey,
    startedAt: session.startedAt,
    endedAt: session.endedAt,
    durationMinutes: Math.round((new Date(session.endedAt).getTime() - new Date(session.startedAt).getTime()) / 60_000),
    publicSummary: session.outcome,
    publicApproved: true,
  }];
});

function rpcErrorMessage(error: { message?: string; code?: string } | null) {
  if (!error) return "The change could not be saved.";
  if (error.code === "40001") return "This record changed in another session. Refresh before saving again.";
  if (error.code === "42501") return "This account is not authorized for the CareerOS admin workspace.";
  return error.message || "The change could not be saved.";
}

function makeCorrelationId() {
  return crypto.randomUUID();
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [authState, setAuthState] = useState<AdminContextValue["authState"]>("loading");
  const [adminSnapshot, setAdminSnapshot] = useState<AdminLearningSnapshot | null>(null);
  const [publicSnapshot, setPublicSnapshot] = useState<PublicLearningSnapshot | null>(null);
  const [operationsSnapshot, setOperationsSnapshot] = useState<AdminOperationsSnapshot | null>(null);
  const [passkeys, setPasskeys] = useState<PasskeyRecord[]>([]);
  const [busyAction, setBusyAction] = useState<string>();
  const [notice, setNotice] = useState<string>();

  const loadPublicSnapshot = useCallback(async () => {
    if (!supabase) return;
    const { data, error } = await supabase.rpc("learning_public_snapshot");
    if (!error && data && typeof data === "object") setPublicSnapshot(data as PublicLearningSnapshot);
  }, []);

  const loadAdminSnapshot = useCallback(async () => {
    if (!supabase) return;
    const { data, error } = await supabase.rpc("learning_admin_snapshot");
    if (error) throw new Error(rpcErrorMessage(error));
    setAdminSnapshot(data as AdminLearningSnapshot);
  }, []);

  const loadOperationsSnapshot = useCallback(async () => {
    if (!supabase) return;
    const { data, error } = await supabase.rpc("learning_admin_operations_snapshot");
    if (error) throw new Error(rpcErrorMessage(error));
    setOperationsSnapshot(data as AdminOperationsSnapshot);
  }, []);

  const loadPasskeys = useCallback(async () => {
    const client = supabase;
    if (!client) return;
    const data = await requirePasskeyResult(
      () => client.auth.passkey.list(),
      "manage",
    );
    setPasskeys(data);
  }, []);

  const ensureSeeded = useCallback(async () => {
    if (!supabase) return;
    const { data, error } = await supabase.rpc("learning_admin_seed", {
      p_snapshot: {
        tickets: learningTickets,
        courses: learningCourses,
        initiatives: learningInitiatives,
        evidence: learningEvidence,
        sessions: workSessions,
        baselineTicketKeys,
      },
      p_expected_baseline_count: baselineTicketKeys.length,
      p_correlation_id: makeCorrelationId(),
    });
    if (error) throw new Error(rpcErrorMessage(error));
    if (data?.baselineCount !== baselineTicketKeys.length) throw new Error("The durable ticket seed did not preserve the 22-ticket production baseline.");
    const { error: operationsError } = await supabase.rpc("learning_admin_seed_operations", {
      p_correlation_id: makeCorrelationId(),
    });
    if (operationsError) throw new Error(rpcErrorMessage(operationsError));
  }, []);

  const authorizeSession = useCallback(async (nextSession: Session | null) => {
    setSession(nextSession);
    if (!supabase || !nextSession) {
      setAuthState("anonymous");
      setAdminSnapshot(null);
      setOperationsSnapshot(null);
      setPasskeys([]);
      return;
    }
    setAuthState("loading");
    const { data, error } = await supabase.rpc("learning_admin_is_authorized");
    if (error || data !== true) {
      setAuthState("unauthorized");
      setAdminSnapshot(null);
      setOperationsSnapshot(null);
      setPasskeys([]);
      return;
    }
    setAuthState("admin");
    try {
      await ensureSeeded();
      await Promise.all([loadAdminSnapshot(), loadOperationsSnapshot(), loadPublicSnapshot(), loadPasskeys()]);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "The admin workspace could not be loaded.");
    }
  }, [ensureSeeded, loadAdminSnapshot, loadOperationsSnapshot, loadPasskeys, loadPublicSnapshot]);

  useEffect(() => {
    if (!supabase) {
      setAuthState("anonymous");
      return;
    }
    void loadPublicSnapshot();
    void supabase.auth.getSession().then(({ data }) => authorizeSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      window.setTimeout(() => void authorizeSession(nextSession), 0);
    });
    return () => listener.subscription.unsubscribe();
  }, [authorizeSession, loadPublicSnapshot]);

  const runMutation = useCallback(async (action: string, rpcName: string, parameters: Record<string, unknown>) => {
    if (!supabase || authState !== "admin") throw new Error("Admin authorization is required.");
    setBusyAction(action);
    setNotice(undefined);
    try {
      const { error } = await supabase.rpc(rpcName, parameters);
      if (error) throw new Error(rpcErrorMessage(error));
      await Promise.all([loadAdminSnapshot(), loadOperationsSnapshot(), loadPublicSnapshot()]);
      setNotice("Saved. The audit history and approved public projection are current.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "The change could not be saved.";
      setNotice(message);
      throw new Error(message);
    } finally {
      setBusyAction(undefined);
    }
  }, [authState, loadAdminSnapshot, loadOperationsSnapshot, loadPublicSnapshot]);

  const value = useMemo<AdminContextValue>(() => ({
    configured: isSupabaseConfigured,
    session,
    authState,
    passkeySupported: typeof window !== "undefined" && isPasskeySupported({
      PublicKeyCredential: window.PublicKeyCredential,
      credentials: window.navigator.credentials,
    }),
    passkeyOriginReady: typeof window !== "undefined" && isCanonicalPasskeyOrigin(window.location.origin),
    passkeys,
    adminTickets: adminSnapshot?.adminTickets ?? [],
    sessions: adminSnapshot?.adminSessions ?? [],
    auditEvents: adminSnapshot?.auditEvents ?? [],
    publicTickets: publicSnapshot?.projectionReady ? publicSnapshot.tickets : learningTickets,
    publicCourses: publicSnapshot?.projectionReady ? publicSnapshot.courses : learningCourses,
    publicInitiatives: publicSnapshot?.projectionReady ? publicSnapshot.initiatives : learningInitiatives,
    publicEvidence: publicSnapshot?.projectionReady ? (publicSnapshot.evidence ?? learningEvidence) : learningEvidence,
    publicSessions: publicSnapshot?.projectionReady ? (publicSnapshot.sessions ?? staticPublicSessions) : staticPublicSessions,
    adminEvidence: adminSnapshot?.adminEvidence ?? [],
    bugRecords: operationsSnapshot?.bugRecords ?? [],
    incidents: operationsSnapshot?.incidents ?? [],
    bugObservations: operationsSnapshot?.observations ?? [],
    busyAction,
    notice,
    requestMagicLink: async (email) => {
      if (!supabase) {
        setNotice("Admin authentication is not configured in this deployment.");
        return;
      }
      setBusyAction("sign-in");
      try {
        await supabase.auth.signInWithOtp({
          email: email.trim(),
          options: {
            shouldCreateUser: false,
            emailRedirectTo: `${window.location.origin}/admin/login`,
          },
        });
      } catch {
        // Keep transport failures neutral so the response cannot enumerate users.
      } finally {
        setBusyAction(undefined);
        setNotice("If this address is authorized, a secure sign-in link is on its way.");
      }
    },
    signInWithPasskey: async () => {
      const client = supabase;
      if (!client) {
        setNotice("Admin authentication is not configured in this deployment.");
        return;
      }
      if (!isPasskeySupported({ PublicKeyCredential: window.PublicKeyCredential, credentials: window.navigator.credentials })) {
        setNotice("This browser does not support passkey sign-in. Use email recovery.");
        return;
      }
      if (!isCanonicalPasskeyOrigin(window.location.origin)) {
        setNotice("Passkey sign-in is available only at https://www.jasonstroup.website. Use email recovery here.");
        return;
      }
      setBusyAction("passkey-sign-in");
      setNotice(undefined);
      try {
        const data = await requirePasskeyResult(
          () => client.auth.signInWithPasskey(),
          "sign-in",
        );
        await authorizeSession(data.session);
      } catch (error) {
        setNotice(error instanceof Error ? error.message : "Passkey sign-in failed. Use email recovery.");
      } finally {
        setBusyAction(undefined);
      }
    },
    registerPasskey: async () => {
      const client = supabase;
      if (!client || authState !== "admin") throw new Error("Admin authorization is required before registering a passkey.");
      if (!isCanonicalPasskeyOrigin(window.location.origin)) {
        setNotice("Register passkeys only at https://www.jasonstroup.website.");
        return;
      }
      setBusyAction("passkey-register");
      setNotice(undefined);
      try {
        await requirePasskeyResult(() => client.auth.registerPasskey(), "register");
        await loadPasskeys();
        setNotice("Passkey registered. It can now be used for CareerOS sign-in on the canonical production origin.");
      } catch (error) {
        setNotice(error instanceof Error ? error.message : "Passkey registration failed.");
      } finally {
        setBusyAction(undefined);
      }
    },
    listPasskeys: async () => {
      if (authState !== "admin") return;
      setBusyAction("passkey-list");
      try {
        await loadPasskeys();
      } catch (error) {
        setNotice(error instanceof Error ? error.message : "Passkeys could not be loaded.");
      } finally {
        setBusyAction(undefined);
      }
    },
    renamePasskey: async (passkeyId, friendlyName) => {
      const client = supabase;
      if (!client || authState !== "admin") throw new Error("Admin authorization is required.");
      const name = friendlyName.trim();
      if (!name || name.length > 120) {
        setNotice("Passkey names must contain 1 to 120 characters.");
        return;
      }
      setBusyAction(`passkey-rename-${passkeyId}`);
      try {
        await requirePasskeyResult(
          () => client.auth.passkey.update({ passkeyId, friendlyName: name }),
          "manage",
        );
        await loadPasskeys();
        setNotice("Passkey name updated.");
      } catch (error) {
        setNotice(error instanceof Error ? error.message : "The passkey name could not be updated.");
      } finally {
        setBusyAction(undefined);
      }
    },
    deletePasskey: async (passkeyId) => {
      const client = supabase;
      if (!client || authState !== "admin") throw new Error("Admin authorization is required.");
      if (passkeys.length <= 1) {
        setNotice("The only registered passkey cannot be removed here. Register a replacement first.");
        return;
      }
      setBusyAction(`passkey-delete-${passkeyId}`);
      try {
        await requirePasskeyResult(() => client.auth.passkey.delete({ passkeyId }), "manage");
        await loadPasskeys();
        setNotice("Passkey removed. Other registered passkeys and email recovery remain available.");
      } catch (error) {
        setNotice(error instanceof Error ? error.message : "The passkey could not be removed.");
      } finally {
        setBusyAction(undefined);
      }
    },
    signOut: async () => {
      if (supabase) await supabase.auth.signOut({ scope: "local" });
      setSession(null);
      setAdminSnapshot(null);
      setOperationsSnapshot(null);
      setPasskeys([]);
      setAuthState("anonymous");
      setNotice("Signed out.");
    },
    refreshAdmin: async () => {
      await Promise.all([loadAdminSnapshot(), loadOperationsSnapshot()]);
    },
    createTicket: (ticket) => runMutation(`create-${ticket.key}`, "learning_admin_create_ticket", {
      p_ticket: ticket,
      p_correlation_id: makeCorrelationId(),
    }),
    moveTicket: (ticket, status, rank, context = {}) => runMutation(`move-${ticket.key}`, "learning_admin_move_ticket", {
      p_key: ticket.key,
      p_status: status,
      p_rank: rank,
      p_expected_revision: ticket.revision,
      p_context: context,
      p_correlation_id: makeCorrelationId(),
    }),
    updateTicket: (ticket, patch) => runMutation(`update-${ticket.key}`, "learning_admin_update_ticket", {
      p_key: ticket.key,
      p_patch: patch,
      p_expected_revision: ticket.revision,
      p_correlation_id: makeCorrelationId(),
    }),
    toggleAcceptanceItem: (ticket, index, completed) => runMutation(`criterion-${ticket.key}-${index}`, "learning_admin_toggle_acceptance", {
      p_key: ticket.key,
      p_item_index: index,
      p_completed: completed,
      p_expected_revision: ticket.revision,
      p_correlation_id: makeCorrelationId(),
    }),
    startWorkSession: (ticket) => runMutation(`session-start-${ticket.key}`, "learning_admin_start_session", {
      p_key: ticket.key,
      p_expected_revision: ticket.revision,
      p_correlation_id: makeCorrelationId(),
    }),
    stopWorkSession: (workSession, capture) => runMutation(`session-stop-${workSession.id}`, "learning_admin_stop_session", {
      p_session_id: workSession.id,
      p_capture: capture,
      p_correlation_id: makeCorrelationId(),
    }),
    addManualWorkSession: (ticket, startedAt, endedAt, capture, correctedFrom) => runMutation(`session-manual-${ticket.key}`, "learning_admin_add_manual_session", {
      p_key: ticket.key,
      p_started_at: startedAt,
      p_ended_at: endedAt,
      p_capture: capture,
      p_corrected_from: correctedFrom ?? null,
      p_correlation_id: makeCorrelationId(),
    }),
    addProgressSnapshot: (courseId, ticketKey, snapshot, publicApproved, privateEvidenceReference) => runMutation(`progress-${courseId}`, "learning_admin_add_progress_snapshot", {
      p_course_id: courseId,
      p_ticket_key: ticketKey,
      p_snapshot: snapshot,
      p_public_approved: publicApproved,
      p_private_evidence_reference: privateEvidenceReference,
      p_correlation_id: makeCorrelationId(),
    }),
    createEvidence: (ticket, evidence) => runMutation(`evidence-create-${evidence.id}`, "learning_admin_create_evidence", {
      p_ticket_key: ticket.key,
      p_evidence: evidence,
      p_correlation_id: makeCorrelationId(),
    }),
    setEvidencePublication: (evidence, publicApproved) => runMutation(`evidence-publish-${evidence.id}`, "learning_admin_set_evidence_publication", {
      p_id: evidence.id,
      p_public_approved: publicApproved,
      p_expected_revision: evidence.revision,
      p_correlation_id: makeCorrelationId(),
    }),
    archiveTicket: (ticket, archive) => runMutation(`${archive ? "archive" : "restore"}-${ticket.key}`, "learning_admin_archive_ticket", {
      p_key: ticket.key,
      p_archive: archive,
      p_expected_revision: ticket.revision,
      p_correlation_id: makeCorrelationId(),
    }),
    undoLastMove: (ticketKey) => runMutation(`undo-${ticketKey}`, "learning_admin_undo_last_move", {
      p_key: ticketKey,
      p_correlation_id: makeCorrelationId(),
    }),
    updateBugRecord: (record, patch) => runMutation(`bug-update-${record.bugKey}`, "learning_admin_update_bug_record", {
      p_bug_key: record.bugKey,
      p_patch: patch,
      p_expected_revision: record.revision,
      p_correlation_id: makeCorrelationId(),
    }),
    addBugObservation: (bugKey, observation) => runMutation(`bug-observation-${bugKey}`, "learning_admin_add_bug_observation", {
      p_bug_key: bugKey,
      p_observation: observation,
      p_correlation_id: makeCorrelationId(),
    }),
    clearNotice: () => setNotice(undefined),
  }), [adminSnapshot, authState, authorizeSession, busyAction, loadAdminSnapshot, loadOperationsSnapshot, loadPasskeys, notice, operationsSnapshot, passkeys, publicSnapshot, runMutation, session]);

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useLearningAdmin() {
  const context = useContext(AdminContext);
  if (!context) throw new Error("useLearningAdmin must be used inside AdminProvider");
  return context;
}
