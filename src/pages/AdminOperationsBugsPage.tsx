import { useMemo, useState, type FormEvent } from "react";
import { ArrowUpRight, Bug as BugIcon, FileLock2, Plus, Save } from "lucide-react";
import {
  useLearningAdmin,
  type AdminBugObservation,
  type AdminBugRecord,
} from "../admin/AdminContext";
import { DeliveryBadge } from "../components/LearningUI";
import { PageHero, SectionHeader } from "../components/UI";
import { bugCategories, bugSeverities } from "../data/learning";

const observationTypes: AdminBugObservation["observationType"][] = [
  "Symptom",
  "Diagnostic",
  "Hypothesis",
  "Root cause",
  "Fix",
  "Verification",
  "Reopen",
  "Duplicate review",
];

function BugRecordEditor({ record }: { record: AdminBugRecord }) {
  const admin = useLearningAdmin();
  const ticket = admin.adminTickets.find((item) => item.key === record.bugKey);
  const incident = admin.incidents.find((item) => item.incidentKey === record.incidentKey);
  const observations = admin.bugObservations.filter((item) => item.bugKey === record.bugKey);
  const [category, setCategory] = useState(record.category);
  const [severity, setSeverity] = useState(record.severity);
  const [verificationState, setVerificationState] = useState(record.verificationState);
  const [privateDiagnosticNotes, setPrivateDiagnosticNotes] = useState(record.privateDiagnosticNotes ?? "");
  const [publicDerivativeApproved, setPublicDerivativeApproved] = useState(record.publicDerivativeApproved);
  const [observationType, setObservationType] = useState<AdminBugObservation["observationType"]>("Diagnostic");
  const [privateNote, setPrivateNote] = useState("");
  const [publicSummary, setPublicSummary] = useState("");
  const [publicApproved, setPublicApproved] = useState(false);

  async function saveClassification(event: FormEvent) {
    event.preventDefault();
    await admin.updateBugRecord(record, {
      category,
      severity,
      verificationState,
      privateDiagnosticNotes,
      publicDerivativeApproved,
    }).catch(() => undefined);
  }

  async function addObservation(event: FormEvent) {
    event.preventDefault();
    await admin.addBugObservation(record.bugKey, {
      observedAt: new Date().toISOString(),
      observationType,
      privateNote,
      publicSummary: publicSummary || undefined,
      publicApproved,
    }).then(() => {
      setPrivateNote("");
      setPublicSummary("");
      setPublicApproved(false);
    }).catch(() => undefined);
  }

  return (
    <article className="operationsBugRecord">
      <header>
        <div>
          <span className="kicker">{record.bugKey} / {record.incidentKey}</span>
          <h2>{ticket?.title ?? incident?.title ?? record.bugKey}</h2>
        </div>
        {ticket ? <DeliveryBadge status={ticket.deliveryStatus} /> : null}
      </header>
      <div className="operationsBugFacts">
        <span><strong>{record.category}</strong> Category</span>
        <span><strong>{record.severity}</strong> Severity</span>
        <span><strong>{record.verificationState}</strong> Verification</span>
        <span><strong>{incident?.affectedService ?? "Not recorded"}</strong> Affected service</span>
      </div>
      {incident ? (
        <div className="operationsIncidentSummary">
          <div><h3>Sanitized symptom</h3><p>{incident.publicSymptom}</p></div>
          <div><h3>Root cause</h3><p>{incident.publicRootCause}</p></div>
          <div><h3>Resolution</h3><p>{incident.publicResolution}</p></div>
          <div><h3>Follow-up</h3><p>{incident.publicPrevention}</p></div>
        </div>
      ) : null}
      <div className="operationsBugLinks">
        <a href={`/learning/tickets/${record.bugKey}`}>Open board ticket <ArrowUpRight size={15} aria-hidden="true" /></a>
        {record.affectedFeatureKeys.map((key) => <a key={key} href={`/learning/tickets/${key}`}>{key}</a>)}
      </div>
      <details className="operationsEditor">
        <summary>Classification and private RCA</summary>
        <form onSubmit={(event) => void saveClassification(event)}>
          <div className="adminFieldGrid">
            <label>Category<select value={category} onChange={(event) => setCategory(event.currentTarget.value as AdminBugRecord["category"])}>{bugCategories.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label>Severity<select value={severity} onChange={(event) => setSeverity(event.currentTarget.value as AdminBugRecord["severity"])}>{bugSeverities.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label>Verification<select value={verificationState} onChange={(event) => setVerificationState(event.currentTarget.value as AdminBugRecord["verificationState"])}>{["Candidate", "Confirmed", "Resolved", "Verified", "Duplicate"].map((item) => <option key={item}>{item}</option>)}</select></label>
          </div>
          <label>Private diagnostic notes<textarea value={privateDiagnosticNotes} onChange={(event) => setPrivateDiagnosticNotes(event.currentTarget.value)} /></label>
          <label className="adminCheckItem"><input type="checkbox" checked={publicDerivativeApproved} onChange={(event) => setPublicDerivativeApproved(event.currentTarget.checked)} /> Public-safe derivative approved</label>
          <button className="button primary" type="submit" disabled={Boolean(admin.busyAction)}><Save size={16} aria-hidden="true" /> Save classification</button>
        </form>
      </details>
      <details className="operationsEditor">
        <summary>Diagnostic observations ({observations.length})</summary>
        {observations.length ? <ol className="bugObservationList">{observations.map((observation) => <li key={observation.id}><time dateTime={observation.observedAt}>{new Date(observation.observedAt).toLocaleString()}</time><strong>{observation.observationType}</strong><p>{observation.privateNote}</p><small>{observation.publicApproved ? "Public derivative approved" : "Private only"}</small></li>)}</ol> : <p>No durable observations recorded.</p>}
        <form onSubmit={(event) => void addObservation(event)}>
          <label>Observation type<select value={observationType} onChange={(event) => setObservationType(event.currentTarget.value as AdminBugObservation["observationType"])}>{observationTypes.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label>Private observation<textarea required value={privateNote} onChange={(event) => setPrivateNote(event.currentTarget.value)} /></label>
          <label>Optional public-safe summary<textarea value={publicSummary} onChange={(event) => setPublicSummary(event.currentTarget.value)} /></label>
          <label className="adminCheckItem"><input type="checkbox" disabled={!publicSummary.trim()} checked={publicApproved} onChange={(event) => setPublicApproved(event.currentTarget.checked)} /> Approve public-safe summary</label>
          <button className="button secondary" type="submit" disabled={Boolean(admin.busyAction)}><Plus size={16} aria-hidden="true" /> Add observation</button>
        </form>
      </details>
    </article>
  );
}

export function AdminOperationsBugsPage() {
  const admin = useLearningAdmin();
  const [category, setCategory] = useState("");
  const [severity, setSeverity] = useState("");
  const [status, setStatus] = useState("");
  const filtered = useMemo(() => admin.bugRecords.filter((record) => {
    const ticket = admin.adminTickets.find((item) => item.key === record.bugKey);
    return (!category || record.category === category)
      && (!severity || record.severity === severity)
      && (!status || ticket?.deliveryStatus === status);
  }), [admin.adminTickets, admin.bugRecords, category, severity, status]);

  if (admin.authState !== "admin") {
    return (
      <>
        <PageHero eyebrow="Private operations" title="Admin authorization required." copy="This route does not expose operational records without the existing CareerOS admin membership." />
        <section className="section shell sectionAfterHero"><a className="button primary" href="/admin/login"><FileLock2 size={16} aria-hidden="true" /> Open secure sign in</a></section>
      </>
    );
  }

  return (
    <>
      <PageHero eyebrow="Jason-only operations" title="Classified Bug Log" copy="Canonical board Bugs own delivery state. This private view adds controlled classification, incident context, diagnostic observations, and publication review." />
      <section className="section shell sectionAfterHero">
        <SectionHeader kicker="Bug filters" title="Review one operational slice" />
        <div className="operationsFilters">
          <label>Category<select value={category} onChange={(event) => setCategory(event.currentTarget.value)}><option value="">All categories</option>{bugCategories.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label>Severity<select value={severity} onChange={(event) => setSeverity(event.currentTarget.value)}><option value="">All severities</option>{bugSeverities.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label>Board status<select value={status} onChange={(event) => setStatus(event.currentTarget.value)}><option value="">All statuses</option>{["Backlog", "Ready", "In Progress", "Blocked", "In Review", "Done"].map((item) => <option key={item}>{item}</option>)}</select></label>
          <a className="button secondary" href="/learning/board?type=Bug"><BugIcon size={16} aria-hidden="true" /> Open Bugs board</a>
        </div>
        <p className="learningResultCount" aria-live="polite">{filtered.length} classified {filtered.length === 1 ? "Bug" : "Bugs"}</p>
      </section>
      <section className="section band">
        <div className="shell operationsBugList">
          {filtered.map((record) => <BugRecordEditor key={`${record.bugKey}-${record.revision}`} record={record} />)}
          {!filtered.length ? <p>No Bug records match these filters.</p> : null}
          {admin.notice ? <p className="adminNotice" role="status">{admin.notice}</p> : null}
        </div>
      </section>
    </>
  );
}
