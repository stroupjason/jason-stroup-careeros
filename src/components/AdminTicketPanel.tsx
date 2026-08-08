import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Archive, Check, Clock3, FileCheck2, Play, RotateCcw, Save, Square, Upload } from "lucide-react";
import { useLearningAdmin, type AdminTicket, type NewAdminEvidence } from "../admin/AdminContext";
import {
  calculateAssistedEstimate,
  calculateCourseworkTimeRange,
  canUseHistoricalCalibration,
  getTaskHealthGuidance,
  taskCoachFactorKeys,
  type TaskCoachFactors,
  type TaskCoachScore,
} from "../admin/taskCoach";
import { getCurrentCourseProgress, type CourseProgressSource, type CourseProgressValueKind } from "../data/learning";

const factorLabels: Record<(typeof taskCoachFactorKeys)[number], string> = {
  scope: "Scope / complexity",
  uncertainty: "Uncertainty / unknowns",
  dependencies: "Dependencies / blockers",
  environment: "Environment / setup",
  reviewEvidence: "Review / evidence burden",
  contextSwitching: "Context switching",
};

const emptyFactors: TaskCoachFactors = {
  scope: 0,
  uncertainty: 0,
  dependencies: 0,
  environment: 0,
  reviewEvidence: 0,
  contextSwitching: 0,
};

const evidenceTypes: NewAdminEvidence["type"][] = [
  "Course certificate", "Notes", "SQL script", "Query result", "Test", "README", "Diagram",
  "Case study", "Presentation", "Demo", "Reflection", "Pull request", "Source code", "Documentation",
];

function localDateTime(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

export function AdminTicketPanel({ ticket }: { ticket: AdminTicket }) {
  const admin = useLearningAdmin();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(ticket.title);
  const [publicSummary, setPublicSummary] = useState(ticket.publicSummary);
  const [nextAction, setNextAction] = useState(ticket.nextAction);
  const [priority, setPriority] = useState(ticket.priority);
  const [initiativeSlug, setInitiativeSlug] = useState(ticket.initiativeSlug);
  const [dependencies, setDependencies] = useState(ticket.dependencies.join(", "));
  const [capabilitySlugs, setCapabilitySlugs] = useState(ticket.capabilitySlugs.join(", "));
  const [roleLensSlugs, setRoleLensSlugs] = useState(ticket.roleLensSlugs.join(", "));
  const [privateNotes, setPrivateNotes] = useState(ticket.privateNotes ?? "");
  const [publicationApproved, setPublicationApproved] = useState(ticket.publicationApproved);
  const [plannedStart, setPlannedStart] = useState(ticket.plannedStart ?? "");
  const [actualStart, setActualStart] = useState(localDateTime(ticket.actualStart));
  const [targetDate, setTargetDate] = useState(ticket.targetDate ?? "");
  const [userEstimate, setUserEstimate] = useState(ticket.userEstimate?.toString() ?? "");
  const [factors, setFactors] = useState<TaskCoachFactors>(ticket.taskCoachFactors ?? emptyFactors);
  const [sessionPrivateNote, setSessionPrivateNote] = useState("");
  const [sessionPublicSummary, setSessionPublicSummary] = useState("");
  const [sessionNextAction, setSessionNextAction] = useState("");
  const [sessionPublicApproved, setSessionPublicApproved] = useState(false);
  const [manualStartedAt, setManualStartedAt] = useState("");
  const [manualEndedAt, setManualEndedAt] = useState("");
  const [manualPrivateNote, setManualPrivateNote] = useState("");
  const [manualPublicSummary, setManualPublicSummary] = useState("");
  const [manualNextAction, setManualNextAction] = useState("");
  const [manualPublicApproved, setManualPublicApproved] = useState(false);
  const [correctedSessionId, setCorrectedSessionId] = useState("");
  const [progressPercentage, setProgressPercentage] = useState("");
  const [progressObservedAt, setProgressObservedAt] = useState(localDateTime(new Date().toISOString()));
  const [progressSource, setProgressSource] = useState<CourseProgressSource>("Manual");
  const [progressValueKind, setProgressValueKind] = useState<CourseProgressValueKind>("Provider reported");
  const [progressVerified, setProgressVerified] = useState(true);
  const [progressPublicApproved, setProgressPublicApproved] = useState(false);
  const [privateEvidenceReference, setPrivateEvidenceReference] = useState("");
  const [playbackSpeed, setPlaybackSpeed] = useState("");
  const [notesBuffer, setNotesBuffer] = useState("");
  const [evidenceBuffer, setEvidenceBuffer] = useState("");
  const [evidenceId, setEvidenceId] = useState(`EVD-${ticket.key}-`);
  const [evidenceType, setEvidenceType] = useState<NewAdminEvidence["type"]>("Documentation");
  const [evidenceTitle, setEvidenceTitle] = useState("");
  const [evidenceVerification, setEvidenceVerification] = useState<NewAdminEvidence["verificationState"]>("Pending Review");
  const [evidenceSupportedState, setEvidenceSupportedState] = useState<NewAdminEvidence["evidenceStateSupported"]>("Planned");
  const [evidencePublicSummary, setEvidencePublicSummary] = useState("");
  const [evidenceLimitations, setEvidenceLimitations] = useState("");
  const [evidenceTruthBoundary, setEvidenceTruthBoundary] = useState("");
  const [evidencePublicUrl, setEvidencePublicUrl] = useState("");
  const [evidenceRepositoryPath, setEvidenceRepositoryPath] = useState("");
  const [evidencePrivateLocation, setEvidencePrivateLocation] = useState("");
  const [evidencePrivateNotes, setEvidencePrivateNotes] = useState("");
  const [evidenceCapabilities, setEvidenceCapabilities] = useState(ticket.capabilitySlugs.join(", "));
  const [evidenceRoles, setEvidenceRoles] = useState(ticket.roleLensSlugs.join(", "));
  const [evidencePublicApproved, setEvidencePublicApproved] = useState(false);

  const relatedCourse = admin.publicCourses.find((course) => course.relatedTicketKey === ticket.key);
  const currentCourseProgress = relatedCourse ? getCurrentCourseProgress(relatedCourse) : undefined;
  const runningSession = admin.sessions.find((session) => !session.endedAt);
  const ticketAudit = admin.auditEvents.filter((event) => event.entityKey === ticket.key).slice(0, 8);
  const ticketEvidence = admin.adminEvidence.filter((artifact) => artifact.relatedTicketKeys.includes(ticket.key));
  const estimate = calculateAssistedEstimate(factors);
  const activeTicketCount = admin.adminTickets.filter((item) => item.deliveryStatus === "In Progress" && !item.archivedAt).length;
  const healthGuidance = getTaskHealthGuidance({
    deliveryStatus: ticket.deliveryStatus,
    actualStartAt: ticket.actualStart,
    targetDate: ticket.targetDate,
    nextAction: ticket.nextAction,
    hasUnresolvedDependency: ticket.dependencies.some((key) => admin.adminTickets.find((item) => item.key === key)?.deliveryStatus !== "Done"),
    blockerHasNextCheck: ticket.deliveryStatus !== "Blocked",
    mandatoryItemsRemaining: ticket.acceptanceItems.filter((item) => item.mandatory && !item.completedAt).length,
    evidenceApprovalPending: ticket.evidenceIds.length === 0,
    activeTicketCount,
    assistedEstimate: estimate.storyPoints,
  });
  const courseworkRange = useMemo(() => calculateCourseworkTimeRange({
    remainingDurationSeconds: currentCourseProgress?.remainingDurationSeconds,
    playbackSpeed: playbackSpeed ? Number(playbackSpeed) : undefined,
    notesPracticeBufferPercent: notesBuffer ? Number(notesBuffer) : undefined,
    evidenceBufferMinutes: evidenceBuffer ? Number(evidenceBuffer) : undefined,
  }), [currentCourseProgress?.remainingDurationSeconds, evidenceBuffer, notesBuffer, playbackSpeed]);

  const dirty = title !== ticket.title
    || publicSummary !== ticket.publicSummary
    || nextAction !== ticket.nextAction
    || priority !== ticket.priority
    || initiativeSlug !== ticket.initiativeSlug
    || dependencies !== ticket.dependencies.join(", ")
    || capabilitySlugs !== ticket.capabilitySlugs.join(", ")
    || roleLensSlugs !== ticket.roleLensSlugs.join(", ")
    || privateNotes !== (ticket.privateNotes ?? "")
    || publicationApproved !== ticket.publicationApproved
    || plannedStart !== (ticket.plannedStart ?? "")
    || actualStart !== localDateTime(ticket.actualStart)
    || targetDate !== (ticket.targetDate ?? "")
    || userEstimate !== (ticket.userEstimate?.toString() ?? "")
    || JSON.stringify(factors) !== JSON.stringify(ticket.taskCoachFactors ?? emptyFactors);

  useEffect(() => {
    function warnBeforeUnload(event: BeforeUnloadEvent) {
      if (!dirty) return;
      event.preventDefault();
    }
    window.addEventListener("beforeunload", warnBeforeUnload);
    return () => window.removeEventListener("beforeunload", warnBeforeUnload);
  }, [dirty]);

  async function saveTicket(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await admin.updateTicket(ticket, {
      title,
      publicSummary,
      nextAction,
      priority,
      initiativeSlug,
      dependencies: dependencies.split(",").map((value) => value.trim().toUpperCase()).filter(Boolean),
      capabilitySlugs: capabilitySlugs.split(",").map((value) => value.trim()).filter(Boolean),
      roleLensSlugs: roleLensSlugs.split(",").map((value) => value.trim()).filter(Boolean),
      privateNotes: privateNotes || null,
      publicationApproved,
      plannedStart: plannedStart || null,
      actualStart: actualStart ? new Date(actualStart).toISOString() : null,
      targetDate: targetDate || null,
      userEstimate: userEstimate ? Number(userEstimate) : null,
      taskCoachFactors: factors,
    });
    setEditing(false);
  }

  async function submitProgress(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!relatedCourse) return;
    const percentage = progressPercentage === "" ? undefined : Number(progressPercentage);
    await admin.addProgressSnapshot(relatedCourse.id, ticket.key, {
      id: `PROGRESS-${relatedCourse.id}-${crypto.randomUUID()}`,
      scope: "Course progress",
      observedAt: new Date(progressObservedAt).toISOString(),
      source: progressSource,
      sourceProvider: relatedCourse.provider,
      verificationState: progressVerified ? "Verified" : "Candidate",
      verificationLabel: progressVerified ? "Verified by Jason from the supplied source" : "Awaiting Jason confirmation",
      valueKind: progressValueKind,
      percentage,
      relatedEvidenceIds: [],
    }, progressPublicApproved, privateEvidenceReference || undefined);
    setProgressPercentage("");
    setPrivateEvidenceReference("");
  }

  async function submitManualSession(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await admin.addManualWorkSession(
      ticket,
      new Date(manualStartedAt).toISOString(),
      new Date(manualEndedAt).toISOString(),
      {
        privateNote: manualPrivateNote || undefined,
        publicSummary: manualPublicSummary || undefined,
        nextAction: manualNextAction || undefined,
        publicApproved: manualPublicApproved,
      },
      correctedSessionId || undefined,
    );
    setManualStartedAt("");
    setManualEndedAt("");
    setManualPrivateNote("");
    setManualPublicSummary("");
    setManualNextAction("");
    setManualPublicApproved(false);
    setCorrectedSessionId("");
  }

  async function submitEvidence(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const now = new Date();
    await admin.createEvidence(ticket, {
      id: evidenceId.trim().toUpperCase(),
      type: evidenceType,
      title: evidenceTitle.trim(),
      dateCreated: now.toISOString().slice(0, 10),
      createdAt: now.toISOString(),
      verificationState: evidenceVerification,
      evidenceStateSupported: evidenceSupportedState,
      relatedProjectSlug: ticket.relatedProjectSlug,
      capabilitySlugs: evidenceCapabilities.split(",").map((value) => value.trim()).filter(Boolean),
      roleLensSlugs: evidenceRoles.split(",").map((value) => value.trim()).filter(Boolean),
      publicUrl: evidencePublicUrl.trim() || undefined,
      repositoryPath: evidenceRepositoryPath.trim() || undefined,
      publicSummary: evidencePublicSummary.trim(),
      limitations: evidenceLimitations.trim(),
      notClaimed: evidenceTruthBoundary.trim(),
      privateLocation: evidencePrivateLocation.trim() || undefined,
      privateNotes: evidencePrivateNotes.trim() || undefined,
      publicationApproved: evidencePublicApproved,
    });
    setEvidenceId(`EVD-${ticket.key}-`);
    setEvidenceTitle("");
    setEvidencePublicSummary("");
    setEvidenceLimitations("");
    setEvidenceTruthBoundary("");
    setEvidencePublicUrl("");
    setEvidenceRepositoryPath("");
    setEvidencePrivateLocation("");
    setEvidencePrivateNotes("");
    setEvidencePublicApproved(false);
  }

  return (
    <section className="section shell adminTicketWorkspace" aria-labelledby="admin-ticket-heading">
      <header className="adminWorkspaceHeader">
        <div><span className="kicker">Jason-only administration</span><h2 id="admin-ticket-heading">Manage {ticket.key}</h2></div>
        <button className="button secondary" type="button" onClick={() => setEditing((value) => !value)}>{editing ? "Close editor" : "Edit ticket"}</button>
      </header>

      {admin.notice ? <p className="adminNotice" role="status">{admin.notice}</p> : null}
      {dirty ? <p className="adminUnsaved" role="status">Unsaved changes</p> : null}

      {editing ? (
        <form className="adminTicketEditor" onSubmit={(event) => void saveTicket(event)}>
          <fieldset>
            <legend>Public-safe fields</legend>
            <label>Title<input required value={title} onChange={(event) => setTitle(event.currentTarget.value)} /></label>
            <label>Public summary<textarea value={publicSummary} onChange={(event) => setPublicSummary(event.currentTarget.value)} /></label>
            <label>Next action<textarea value={nextAction} onChange={(event) => setNextAction(event.currentTarget.value)} /></label>
            <div className="adminFieldGrid">
              <label>Priority<select value={priority} onChange={(event) => setPriority(event.currentTarget.value as AdminTicket["priority"])}>{["Highest", "High", "Medium", "Low"].map((value) => <option key={value}>{value}</option>)}</select></label>
              <label>Initiative<select value={initiativeSlug} onChange={(event) => setInitiativeSlug(event.currentTarget.value)}>{admin.publicInitiatives.map((initiative) => <option key={initiative.slug} value={initiative.slug}>{initiative.title}</option>)}</select></label>
              <label>Planned start<input type="date" value={plannedStart} onChange={(event) => setPlannedStart(event.currentTarget.value)} /></label>
              <label>Actual start<input type="datetime-local" value={actualStart} onChange={(event) => setActualStart(event.currentTarget.value)} /></label>
              <label>Target date<input type="date" value={targetDate} onChange={(event) => setTargetDate(event.currentTarget.value)} /></label>
              <label>Jason's estimate<select value={userEstimate} onChange={(event) => setUserEstimate(event.currentTarget.value)}><option value="">Not supplied</option>{[1, 2, 3, 5, 8, 13].map((value) => <option key={value} value={value}>{value} story points</option>)}</select></label>
            </div>
            <label>Dependencies (ticket keys, comma separated)<input value={dependencies} onChange={(event) => setDependencies(event.currentTarget.value)} /></label>
            <label>Capabilities (slugs, comma separated)<input value={capabilitySlugs} onChange={(event) => setCapabilitySlugs(event.currentTarget.value)} /></label>
            <label>Role lenses (slugs, comma separated)<input value={roleLensSlugs} onChange={(event) => setRoleLensSlugs(event.currentTarget.value)} /></label>
          </fieldset>
          <fieldset>
            <legend>Private authoring</legend>
            <label>Private notes<textarea value={privateNotes} onChange={(event) => setPrivateNotes(event.currentTarget.value)} /></label>
            <label className="adminCheckItem"><input type="checkbox" checked={publicationApproved} onChange={(event) => setPublicationApproved(event.currentTarget.checked)} /> Approved for the allowlisted public projection</label>
            <small>Private notes never enter the public projection or analytics.</small>
          </fieldset>
          <button className="button primary" type="submit" disabled={!dirty || Boolean(admin.busyAction)}><Save size={16} aria-hidden="true" /> {admin.busyAction ? "Saving..." : "Save changes"}</button>
        </form>
      ) : null}

      <div className="adminWorkspaceGrid">
        <section className="taskCoachPanel">
          <header><span className="kicker">Planning assistance</span><h3>Task coach</h3></header>
          <div className="taskCoachSummary"><strong>{estimate.storyPoints}</strong><span>assisted story points</span><small>Score {estimate.totalScore} of 18 / {estimate.confidence.toLowerCase()} confidence</small></div>
          <p>Story points express relative delivery effort, not hours. Jason's own estimate remains separate.</p>
          <div className="taskCoachFactors">
            {taskCoachFactorKeys.map((key) => (
              <label key={key}>
                <span>{factorLabels[key]} <output>{factors[key]}</output></span>
                <input type="range" min="0" max="3" step="1" value={factors[key]} onChange={(event) => setFactors({ ...factors, [key]: Number(event.currentTarget.value) as TaskCoachScore })} />
              </label>
            ))}
          </div>
          {estimate.splitRecommended ? <p className="adminWarning">This score recommends splitting the ticket or running a discovery spike.</p> : null}
          <ul className="cleanList taskHealthList">{healthGuidance.map((item) => <li key={item}>{item}</li>)}</ul>
          <small>{canUseHistoricalCalibration(0) ? "Historical calibration available" : "Historical calibration unlocks after five comparable completed tickets with valid sessions."}</small>
          {dirty ? <button className="button secondary" type="button" onClick={() => setEditing(true)}>Review and save coach inputs</button> : null}
        </section>

        <section className="adminCompletionPanel">
          <header><span className="kicker">Completion gate</span><h3>Acceptance checklist</h3></header>
          {ticket.acceptanceItems.map((item) => (
            <label className="adminCheckItem" key={item.index}>
              <input type="checkbox" checked={Boolean(item.completedAt)} onChange={(event) => void admin.toggleAcceptanceItem(ticket, item.index, event.currentTarget.checked)} />
              <span>{item.label}{item.mandatory ? " (required)" : ""}</span>
            </label>
          ))}
          <p>A 100% provider value never checks these items automatically.</p>
        </section>
      </div>

      <div className="adminWorkspaceGrid">
        <section className="adminSessionPanel">
          <header><span className="kicker">Recorded effort</span><h3>Work session</h3></header>
          {!runningSession ? (
            <button className="button primary" type="button" onClick={() => void admin.startWorkSession(ticket)} disabled={Boolean(admin.busyAction)}><Play size={16} aria-hidden="true" /> Start work</button>
          ) : runningSession.ticketKey === ticket.key ? (
            <div className="adminSessionCapture">
              <p><Clock3 size={16} aria-hidden="true" /> Running since <time dateTime={runningSession.startedAt}>{new Date(runningSession.startedAt).toLocaleTimeString()}</time></p>
              <label>Private note, evidence, or blocker<textarea value={sessionPrivateNote} onChange={(event) => setSessionPrivateNote(event.currentTarget.value)} /></label>
              <label>What changed (public-safe outcome)<textarea value={sessionPublicSummary} onChange={(event) => { const value = event.currentTarget.value; setSessionPublicSummary(value); if (!value.trim()) setSessionPublicApproved(false); }} /></label>
              <label>Next action<textarea value={sessionNextAction} onChange={(event) => setSessionNextAction(event.currentTarget.value)} /></label>
              <label className="adminCheckItem"><input type="checkbox" disabled={!sessionPublicSummary.trim()} checked={sessionPublicApproved} onChange={(event) => setSessionPublicApproved(event.currentTarget.checked)} /> Approve the public-safe outcome for publication</label>
              <button className="button primary" type="button" onClick={() => void admin.stopWorkSession(runningSession, { privateNote: sessionPrivateNote, publicSummary: sessionPublicSummary, nextAction: sessionNextAction, publicApproved: sessionPublicApproved })}><Square size={16} aria-hidden="true" /> Stop and capture</button>
            </div>
          ) : <p>A work session is already running on {runningSession.ticketKey}.</p>}
          <dl className="adminSessionHistory">
            {admin.sessions.filter((session) => session.ticketKey === ticket.key && session.endedAt).slice(0, 5).map((session) => <div key={session.id} data-superseded={Boolean(session.supersededAt)}><dt><time dateTime={session.startedAt}>{new Date(session.startedAt).toLocaleDateString()}</time>{session.supersededAt ? " · corrected" : ""}</dt><dd>{session.durationMinutes} minutes</dd></div>)}
          </dl>
          <details className="manualSessionEditor">
            <summary>Enter or correct a completed session</summary>
            <form onSubmit={(event) => void submitManualSession(event)}>
              <div className="adminFieldGrid">
                <label>Started at<input type="datetime-local" required value={manualStartedAt} onChange={(event) => setManualStartedAt(event.currentTarget.value)} /></label>
                <label>Ended at<input type="datetime-local" required value={manualEndedAt} onChange={(event) => setManualEndedAt(event.currentTarget.value)} /></label>
              </div>
              <label>Correct an existing session<select value={correctedSessionId} onChange={(event) => setCorrectedSessionId(event.currentTarget.value)}><option value="">No correction</option>{admin.sessions.filter((session) => session.ticketKey === ticket.key && session.endedAt && !session.supersededAt).map((session) => <option key={session.id} value={session.id}>{new Date(session.startedAt).toLocaleString()} · {session.durationMinutes} minutes</option>)}</select></label>
              <label>Private correction, evidence, or blocker note<textarea value={manualPrivateNote} onChange={(event) => setManualPrivateNote(event.currentTarget.value)} /></label>
              <label>What changed (public-safe outcome)<textarea value={manualPublicSummary} onChange={(event) => { const value = event.currentTarget.value; setManualPublicSummary(value); if (!value.trim()) setManualPublicApproved(false); }} /></label>
              <label>Next action<textarea value={manualNextAction} onChange={(event) => setManualNextAction(event.currentTarget.value)} /></label>
              <label className="adminCheckItem"><input type="checkbox" disabled={!manualPublicSummary.trim()} checked={manualPublicApproved} onChange={(event) => setManualPublicApproved(event.currentTarget.checked)} /> Approve the public-safe outcome for publication</label>
              <button className="button secondary" type="submit" disabled={Boolean(admin.busyAction)}><Clock3 size={16} aria-hidden="true" /> Record completed session</button>
            </form>
          </details>
        </section>

        {relatedCourse ? (
          <section className="adminProgressPanel">
            <header><span className="kicker">Human-verified source</span><h3>Update course progress</h3></header>
            <form onSubmit={(event) => void submitProgress(event)}>
              <div className="adminFieldGrid">
                <label>Percentage<input type="number" min="0" max="100" step="0.01" value={progressPercentage} onChange={(event) => setProgressPercentage(event.currentTarget.value)} required={progressValueKind === "Provider reported"} /></label>
                <label>Observed at<input type="datetime-local" required value={progressObservedAt} onChange={(event) => setProgressObservedAt(event.currentTarget.value)} /></label>
                <label>Source<select value={progressSource} onChange={(event) => setProgressSource(event.currentTarget.value as CourseProgressSource)}><option>Manual</option><option>User-provided screenshot</option><option>Browser-assisted verification</option></select></label>
                <label>Value basis<select value={progressValueKind} onChange={(event) => setProgressValueKind(event.currentTarget.value as CourseProgressValueKind)}><option>Provider reported</option><option>Derived</option></select></label>
              </div>
              <label>Private evidence reference<input type="text" value={privateEvidenceReference} onChange={(event) => setPrivateEvidenceReference(event.currentTarget.value)} /></label>
              <label className="adminCheckItem"><input type="checkbox" checked={progressVerified} onChange={(event) => setProgressVerified(event.currentTarget.checked)} /> Jason verified this source</label>
              <label className="adminCheckItem"><input type="checkbox" checked={progressPublicApproved} onChange={(event) => setProgressPublicApproved(event.currentTarget.checked)} /> Approve this safe value for public projection</label>
              <button className="button primary" type="submit" disabled={Boolean(admin.busyAction)}><Upload size={16} aria-hidden="true" /> Record snapshot</button>
              <small>Provider API: Deferred - enterprise administrator access required.</small>
            </form>

            {currentCourseProgress?.remainingDurationSeconds !== undefined ? (
              <details className="courseworkPlanner">
                <summary>Coursework time range</summary>
                <div className="adminFieldGrid">
                  <label>Playback speed<input type="number" min="0.25" max="4" step="0.25" value={playbackSpeed} onChange={(event) => setPlaybackSpeed(event.currentTarget.value)} /></label>
                  <label>Notes / practice buffer %<input type="number" min="0" max="300" value={notesBuffer} onChange={(event) => setNotesBuffer(event.currentTarget.value)} /></label>
                  <label>Evidence buffer minutes<input type="number" min="0" value={evidenceBuffer} onChange={(event) => setEvidenceBuffer(event.currentTarget.value)} /></label>
                </div>
                {courseworkRange.maximumMinutes ? <p>{courseworkRange.minimumMinutes} to {courseworkRange.maximumMinutes} minutes from supplied inputs.</p> : <p>Missing: {courseworkRange.missingInputs.join(", ")}.</p>}
                <small>Excluded: {courseworkRange.exclusions.join("; ")}.</small>
              </details>
            ) : null}
          </section>
        ) : null}
      </div>

      <section className="adminEvidencePanel">
        <header><span className="kicker">Artifact record</span><h3>Evidence metadata and publication</h3></header>
        {ticketEvidence.length ? (
          <div className="adminEvidenceList">
            {ticketEvidence.map((artifact) => (
              <div key={artifact.id}>
                <span><FileCheck2 size={16} aria-hidden="true" /> {artifact.id}</span>
                <strong>{artifact.title}</strong>
                <small>{artifact.verificationState} · {artifact.publicationApproved ? "Published" : "Private"}</small>
                <button className="button secondary" type="button" disabled={Boolean(admin.busyAction) || (!artifact.publicationApproved && artifact.verificationState !== "Verified")} onClick={() => void admin.setEvidencePublication(artifact, !artifact.publicationApproved)}>{artifact.publicationApproved ? "Unpublish" : "Publish approved fields"}</button>
              </div>
            ))}
          </div>
        ) : <p>No durable evidence metadata is linked to this ticket yet.</p>}
        <details className="adminEvidenceEditor">
          <summary>Add evidence metadata</summary>
          <form onSubmit={(event) => void submitEvidence(event)}>
            <div className="adminFieldGrid">
              <label>Evidence ID<input required pattern="EVD-[A-Za-z0-9-]{3,60}" value={evidenceId} onChange={(event) => setEvidenceId(event.currentTarget.value)} /></label>
              <label>Type<select value={evidenceType} onChange={(event) => setEvidenceType(event.currentTarget.value as NewAdminEvidence["type"])}>{evidenceTypes.map((value) => <option key={value}>{value}</option>)}</select></label>
              <label>Verification<select value={evidenceVerification} onChange={(event) => { const value = event.currentTarget.value as NewAdminEvidence["verificationState"]; setEvidenceVerification(value); if (value !== "Verified") setEvidencePublicApproved(false); }}><option>Pending Review</option><option>Verified</option><option>Not Yet Created</option></select></label>
              <label>Evidence state supported<select value={evidenceSupportedState} onChange={(event) => setEvidenceSupportedState(event.currentTarget.value as NewAdminEvidence["evidenceStateSupported"])}><option>Planned</option><option>Learning</option><option>Practicing</option><option>Demonstrated</option></select></label>
            </div>
            <label>Title<input required value={evidenceTitle} onChange={(event) => setEvidenceTitle(event.currentTarget.value)} /></label>
            <label>Public-safe summary<textarea required value={evidencePublicSummary} onChange={(event) => setEvidencePublicSummary(event.currentTarget.value)} /></label>
            <label>Limitations<textarea required value={evidenceLimitations} onChange={(event) => setEvidenceLimitations(event.currentTarget.value)} /></label>
            <label>Truth boundary<textarea required value={evidenceTruthBoundary} onChange={(event) => setEvidenceTruthBoundary(event.currentTarget.value)} /></label>
            <div className="adminFieldGrid">
              <label>Public URL<input type="url" value={evidencePublicUrl} onChange={(event) => setEvidencePublicUrl(event.currentTarget.value)} /></label>
              <label>Repository path<input value={evidenceRepositoryPath} onChange={(event) => setEvidenceRepositoryPath(event.currentTarget.value)} /></label>
              <label>Capabilities<input value={evidenceCapabilities} onChange={(event) => setEvidenceCapabilities(event.currentTarget.value)} /></label>
              <label>Role lenses<input value={evidenceRoles} onChange={(event) => setEvidenceRoles(event.currentTarget.value)} /></label>
            </div>
            <fieldset>
              <legend>Private authoring</legend>
              <label>Private location<input value={evidencePrivateLocation} onChange={(event) => setEvidencePrivateLocation(event.currentTarget.value)} /></label>
              <label>Private notes<textarea value={evidencePrivateNotes} onChange={(event) => setEvidencePrivateNotes(event.currentTarget.value)} /></label>
            </fieldset>
            <label className="adminCheckItem"><input type="checkbox" disabled={evidenceVerification !== "Verified"} checked={evidencePublicApproved} onChange={(event) => setEvidencePublicApproved(event.currentTarget.checked)} /> Publish only the allowlisted fields after verification</label>
            <button className="button primary" type="submit" disabled={Boolean(admin.busyAction)}><FileCheck2 size={16} aria-hidden="true" /> Add evidence</button>
          </form>
        </details>
      </section>

      <section className="adminAuditPanel">
        <header><span className="kicker">Append-only history</span><h3>Recent ticket events</h3></header>
        {ticketAudit.length ? <ol>{ticketAudit.map((event) => <li key={event.id}><time dateTime={event.occurredAt}>{new Date(event.occurredAt).toLocaleString()}</time><strong>{event.action.replace(/_/g, " ")}</strong><small>Correlation {event.correlationId.slice(0, 8)}</small></li>)}</ol> : <p>No admin mutations have been recorded for this ticket.</p>}
      </section>

      <div className="adminDangerZone">
        <button className="button secondary" type="button" onClick={() => void admin.undoLastMove(ticket.key)}><RotateCcw size={16} aria-hidden="true" /> Undo last safe move</button>
        <button className="button secondary" type="button" onClick={() => void admin.archiveTicket(ticket, !ticket.archivedAt)}><Archive size={16} aria-hidden="true" /> {ticket.archivedAt ? "Restore ticket" : "Archive ticket"}</button>
        <span><Check size={16} aria-hidden="true" /> No hard deletion</span>
      </div>
    </section>
  );
}
