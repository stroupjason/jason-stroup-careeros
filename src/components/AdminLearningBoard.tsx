import { useEffect, useMemo, useState, type FormEvent } from "react";
import { DragDropProvider, type DragEndEvent } from "@dnd-kit/react";
import { isSortableOperation, useSortable } from "@dnd-kit/react/sortable";
import { move } from "@dnd-kit/helpers";
import { GripVertical, RotateCcw, Save, X } from "lucide-react";
import { useLearningAdmin, type AdminTicket, type NewAdminTicket } from "../admin/AdminContext";
import { deliveryStatuses, issueTypes, type DeliveryStatus } from "../data/learning";
import { TicketCard } from "./LearningUI";

type GroupedKeys = Record<DeliveryStatus, string[]>;

function groupTickets(tickets: AdminTicket[]): GroupedKeys {
  return Object.fromEntries(deliveryStatuses.map((status) => [
    status,
    tickets
      .filter((ticket) => !ticket.archivedAt && ticket.deliveryStatus === status)
      .sort((a, b) => a.rank - b.rank || a.key.localeCompare(b.key))
      .map((ticket) => ticket.key),
  ])) as GroupedKeys;
}

function SortableAdminTicket({
  ticket,
  index,
  onMoveRequested,
}: {
  ticket: AdminTicket;
  index: number;
  onMoveRequested: (ticket: AdminTicket, status: DeliveryStatus) => void;
}) {
  const { ref, handleRef, isDragging } = useSortable({
    id: ticket.key,
    index,
    group: ticket.deliveryStatus,
    type: "learning-ticket",
    data: { ticketKey: ticket.key },
  });

  return (
    <div ref={ref} className={`adminSortableTicket ${isDragging ? "dragging" : ""}`}>
      <div className="adminTicketToolbar" data-no-drag>
        <button
          className="iconButton dragHandle"
          type="button"
          ref={handleRef}
          aria-label={`Move ${ticket.key}. Press Enter or Space, then use arrow keys.`}
          title="Move ticket"
        >
          <GripVertical size={17} aria-hidden="true" />
        </button>
        <label>
          <span className="srOnly">Move {ticket.key} to</span>
          <select
            value={ticket.deliveryStatus}
            onChange={(event) => onMoveRequested(ticket, event.currentTarget.value as DeliveryStatus)}
          >
            {deliveryStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
        </label>
      </div>
      <TicketCard ticket={ticket} />
    </div>
  );
}

type PendingMove = {
  ticket: AdminTicket;
  status: DeliveryStatus;
  rank: number;
  rollback: GroupedKeys;
};

function CreateTicketForm() {
  const admin = useLearningAdmin();
  const [key, setKey] = useState("");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [issueType, setIssueType] = useState<NewAdminTicket["issueType"]>("Task");
  const [status, setStatus] = useState<DeliveryStatus>("Backlog");
  const [priority, setPriority] = useState<NewAdminTicket["priority"]>("Medium");
  const [initiative, setInitiative] = useState(admin.publicInitiatives[0]?.slug ?? "");
  const [parentKey, setParentKey] = useState("");
  const [dependencies, setDependencies] = useState("");
  const [definition, setDefinition] = useState("");
  const [criteria, setCriteria] = useState("");
  const [nextAction, setNextAction] = useState("");
  const [capabilities, setCapabilities] = useState("");
  const [roles, setRoles] = useState("");
  const [projectSlug, setProjectSlug] = useState("careeros-learning-delivery");
  const [truthBoundary, setTruthBoundary] = useState("");
  const [privateNotes, setPrivateNotes] = useState("");
  const [publicationApproved, setPublicationApproved] = useState(false);

  function commaList(value: string) {
    return value.split(",").map((item) => item.trim()).filter(Boolean);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await admin.createTicket({
      key: key.trim().toUpperCase(),
      issueType,
      title: title.trim(),
      publicSummary: summary.trim(),
      deliveryStatus: status,
      evidenceState: "Planned",
      priority,
      initiativeSlug: initiative,
      parentKey: parentKey.trim().toUpperCase() || undefined,
      dependencies: commaList(dependencies).map((item) => item.toUpperCase()),
      definitionOfDone: definition.trim(),
      acceptanceCriteria: criteria.split("\n").map((item) => item.trim()).filter(Boolean),
      capabilitySlugs: commaList(capabilities),
      roleLensSlugs: commaList(roles),
      nextAction: nextAction.trim(),
      relatedProjectSlug: projectSlug.trim(),
      notClaimed: truthBoundary.trim(),
      privateNotes: privateNotes.trim() || undefined,
      publicationApproved,
    });
    setKey("");
    setTitle("");
    setSummary("");
    setDefinition("");
    setCriteria("");
    setNextAction("");
    setTruthBoundary("");
    setPrivateNotes("");
    setPublicationApproved(false);
  }

  return (
    <details className="adminCreateTicket">
      <summary>Create ticket</summary>
      <form onSubmit={(event) => void submit(event)}>
        <div className="adminFieldGrid">
          <label>Ticket key<input required pattern="[A-Za-z][A-Za-z0-9-]{2,31}" value={key} onChange={(event) => setKey(event.currentTarget.value)} /></label>
          <label>Issue type<select value={issueType} onChange={(event) => setIssueType(event.currentTarget.value as NewAdminTicket["issueType"])}>{issueTypes.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label>Status<select value={status} onChange={(event) => setStatus(event.currentTarget.value as DeliveryStatus)}>{deliveryStatuses.filter((item) => item !== "Done").map((item) => <option key={item}>{item}</option>)}</select></label>
          <label>Priority<select value={priority} onChange={(event) => setPriority(event.currentTarget.value as NewAdminTicket["priority"])}>{["Highest", "High", "Medium", "Low"].map((item) => <option key={item}>{item}</option>)}</select></label>
          <label>Initiative<select required value={initiative} onChange={(event) => setInitiative(event.currentTarget.value)}>{admin.publicInitiatives.map((item) => <option key={item.slug} value={item.slug}>{item.title}</option>)}</select></label>
          <label>Parent epic key<input value={parentKey} onChange={(event) => setParentKey(event.currentTarget.value)} /></label>
        </div>
        <label>Title<input required value={title} onChange={(event) => setTitle(event.currentTarget.value)} /></label>
        <label>Public-safe summary<textarea required value={summary} onChange={(event) => setSummary(event.currentTarget.value)} /></label>
        <label>Definition of done<textarea required value={definition} onChange={(event) => setDefinition(event.currentTarget.value)} /></label>
        <label>Acceptance criteria, one per line<textarea required value={criteria} onChange={(event) => setCriteria(event.currentTarget.value)} /></label>
        <label>Next action<textarea required value={nextAction} onChange={(event) => setNextAction(event.currentTarget.value)} /></label>
        <label>Truth boundary<textarea required value={truthBoundary} onChange={(event) => setTruthBoundary(event.currentTarget.value)} /></label>
        <div className="adminFieldGrid">
          <label>Dependencies, comma separated<input value={dependencies} onChange={(event) => setDependencies(event.currentTarget.value)} /></label>
          <label>Capability slugs<input value={capabilities} onChange={(event) => setCapabilities(event.currentTarget.value)} /></label>
          <label>Role slugs<input value={roles} onChange={(event) => setRoles(event.currentTarget.value)} /></label>
          <label>Related project slug<input required value={projectSlug} onChange={(event) => setProjectSlug(event.currentTarget.value)} /></label>
        </div>
        <label>Private notes<textarea value={privateNotes} onChange={(event) => setPrivateNotes(event.currentTarget.value)} /></label>
        <label className="adminCheckItem"><input type="checkbox" checked={publicationApproved} onChange={(event) => setPublicationApproved(event.currentTarget.checked)} /> Publish the allowlisted public fields immediately</label>
        <button className="button primary" type="submit" disabled={Boolean(admin.busyAction)}><Save size={16} aria-hidden="true" /> Create ticket</button>
      </form>
    </details>
  );
}

export function AdminLearningBoard({ tickets, allTickets }: { tickets: AdminTicket[]; allTickets: AdminTicket[] }) {
  const admin = useLearningAdmin();
  const [groupedKeys, setGroupedKeys] = useState<GroupedKeys>(() => groupTickets(tickets));
  const [pendingMove, setPendingMove] = useState<PendingMove>();
  const [announcement, setAnnouncement] = useState("");
  const [lastMovedTicket, setLastMovedTicket] = useState<string>();
  const [actualStartMode, setActualStartMode] = useState<"keep_unknown" | "now" | "verified_date">("keep_unknown");
  const [actualStartAt, setActualStartAt] = useState("");
  const [blockerReason, setBlockerReason] = useState("");
  const [blockerNextCheck, setBlockerNextCheck] = useState("");
  const [completedAt, setCompletedAt] = useState("");
  const [overrideReason, setOverrideReason] = useState("");
  const ticketByKey = useMemo(() => new Map(allTickets.map((ticket) => [ticket.key, ticket])), [allTickets]);
  const activeTicketCount = allTickets.filter((ticket) => !ticket.archivedAt && ticket.deliveryStatus === "In Progress").length;

  useEffect(() => setGroupedKeys(groupTickets(tickets)), [tickets]);

  function rankForMove(keys: GroupedKeys, status: DeliveryStatus, ticketKey: string) {
    const index = keys[status].indexOf(ticketKey);
    const previous = index > 0 ? ticketByKey.get(keys[status][index - 1])?.rank : undefined;
    const next = index < keys[status].length - 1 ? ticketByKey.get(keys[status][index + 1])?.rank : undefined;
    if (previous !== undefined && next !== undefined && previous < next) return (previous + next) / 2;
    if (previous !== undefined) {
      const maximumRank = Math.max(previous, ...allTickets.filter((ticket) => !ticket.archivedAt && ticket.deliveryStatus === status && ticket.key !== ticketKey).map((ticket) => ticket.rank));
      return maximumRank + 1000;
    }
    if (next !== undefined) {
      const minimumRank = Math.min(next, ...allTickets.filter((ticket) => !ticket.archivedAt && ticket.deliveryStatus === status && ticket.key !== ticketKey).map((ticket) => ticket.rank));
      return Math.max(1, minimumRank / 2);
    }
    return 1000;
  }

  function requiresTransitionDetails(ticket: AdminTicket, status: DeliveryStatus) {
    const activeCount = activeTicketCount - (ticket.deliveryStatus === "In Progress" ? 1 : 0) + (status === "In Progress" ? 1 : 0);
    return (status === "In Progress" && !ticket.actualStart)
      || status === "Blocked"
      || status === "In Review"
      || status === "Done"
      || (status === "In Progress" && ticket.deliveryStatus !== "In Progress" && activeCount > 2);
  }

  async function persistMove(moveRequest: PendingMove) {
    try {
      await admin.moveTicket(moveRequest.ticket, moveRequest.status, moveRequest.rank, {
        actualStartMode,
        actualStartAt: actualStartMode === "verified_date" ? actualStartAt : undefined,
        blockerReason: moveRequest.status === "Blocked" ? blockerReason : undefined,
        blockerNextCheck: moveRequest.status === "Blocked" ? blockerNextCheck : undefined,
        completedAt: moveRequest.status === "Done" ? completedAt : undefined,
        overrideReason: overrideReason || undefined,
      });
      setAnnouncement(`${moveRequest.ticket.key} moved to ${moveRequest.status}.`);
      setLastMovedTicket(moveRequest.ticket.key);
      setPendingMove(undefined);
    } catch {
      setGroupedKeys(moveRequest.rollback);
      setAnnouncement(`${moveRequest.ticket.key} was not moved. The board was restored.`);
    }
  }

  function stageMove(ticket: AdminTicket, status: DeliveryStatus, nextGroups: GroupedKeys, rollback: GroupedKeys) {
    if (status === ticket.deliveryStatus && nextGroups[status].indexOf(ticket.key) === rollback[status].indexOf(ticket.key)) return;
    const moveRequest = { ticket, status, rank: rankForMove(nextGroups, status, ticket.key), rollback };
    if (requiresTransitionDetails(ticket, status)) {
      setPendingMove(moveRequest);
      return;
    }
    void persistMove(moveRequest);
  }

  function handleDragEnd(event: DragEndEvent) {
    if (event.canceled || !isSortableOperation(event.operation)) return;
    const sourceKey = String(event.operation.source?.id ?? "");
    const ticket = ticketByKey.get(sourceKey);
    if (!ticket) return;
    const rollback = groupedKeys;
    const nextGroups = move(groupedKeys, event) as GroupedKeys;
    const nextStatus = deliveryStatuses.find((status) => nextGroups[status].includes(sourceKey));
    if (!nextStatus) return;
    setGroupedKeys(nextGroups);
    stageMove(ticket, nextStatus, nextGroups, rollback);
  }

  function handleSelectMove(ticket: AdminTicket, status: DeliveryStatus) {
    if (status === ticket.deliveryStatus) return;
    const rollback = groupedKeys;
    const nextGroups = Object.fromEntries(deliveryStatuses.map((group) => [
      group,
      groupedKeys[group].filter((key) => key !== ticket.key),
    ])) as GroupedKeys;
    nextGroups[status] = [...nextGroups[status], ticket.key];
    setGroupedKeys(nextGroups);
    stageMove(ticket, status, nextGroups, rollback);
  }

  function cancelPendingMove() {
    if (pendingMove) setGroupedKeys(pendingMove.rollback);
    setPendingMove(undefined);
  }

  return (
    <>
      <div className="adminBoardHeader">
        <div>
          <strong>Admin board controls</strong>
          <span>Drag with pointer or touch, use the keyboard handle, or choose a status.</span>
        </div>
        <button
          className="button secondary"
          type="button"
          onClick={() => lastMovedTicket && void admin.undoLastMove(lastMovedTicket)}
          disabled={Boolean(admin.busyAction) || !lastMovedTicket}
        >
          <RotateCcw size={16} aria-hidden="true" /> Undo last move
        </button>
      </div>
      <CreateTicketForm />
      <p className="srOnly" aria-live="assertive">{announcement}</p>
      {activeTicketCount > 2 ? <p className="adminWarning" role="status">The two-ticket active-work soft limit is exceeded. Record the reason when adding more active work.</p> : null}
      <DragDropProvider onDragEnd={handleDragEnd}>
        <div className="kanbanBoard adminKanbanBoard">
          {deliveryStatuses.filter((status) => status !== "Backlog").map((status) => (
            <section className="kanbanColumn" key={status} aria-labelledby={`admin-column-${status.replace(/\s+/g, "-")}`}>
              <header><h3 id={`admin-column-${status.replace(/\s+/g, "-")}`}>{status}</h3><span>{groupedKeys[status].length}</span></header>
              <div className="kanbanTicketList">
                {groupedKeys[status].map((key, index) => {
                  const ticket = ticketByKey.get(key);
                  return ticket ? <SortableAdminTicket key={key} ticket={ticket} index={index} onMoveRequested={handleSelectMove} /> : null;
                })}
                {groupedKeys[status].length === 0 ? <p>No tickets in this state.</p> : null}
              </div>
            </section>
          ))}
        </div>
        <section className="adminBacklog" aria-labelledby="admin-backlog-heading">
          <header><h3 id="admin-backlog-heading">Backlog</h3><span>{groupedKeys.Backlog.length}</span></header>
          <div className="backlogTicketGrid">
            {groupedKeys.Backlog.map((key, index) => {
              const ticket = ticketByKey.get(key);
              return ticket ? <SortableAdminTicket key={key} ticket={ticket} index={index} onMoveRequested={handleSelectMove} /> : null;
            })}
          </div>
        </section>
      </DragDropProvider>

      {pendingMove ? (
        <div className="adminDialogBackdrop" role="presentation">
          <section className="adminDialog" role="dialog" aria-modal="true" aria-labelledby="transition-dialog-title">
            <header>
              <div><span className="kicker">Validated transition</span><h2 id="transition-dialog-title">Move {pendingMove.ticket.key} to {pendingMove.status}</h2></div>
              <button className="iconButton" type="button" onClick={cancelPendingMove} aria-label="Cancel move"><X size={18} /></button>
            </header>
            {pendingMove.status === "In Progress" && !pendingMove.ticket.actualStart ? (
              <fieldset>
                <legend>When did real work begin?</legend>
                <label><input type="radio" name="actual-start-mode" checked={actualStartMode === "keep_unknown"} onChange={() => setActualStartMode("keep_unknown")} /> Keep the actual start unknown</label>
                <label><input type="radio" name="actual-start-mode" checked={actualStartMode === "now"} onChange={() => setActualStartMode("now")} /> Work starts now</label>
                <label><input type="radio" name="actual-start-mode" checked={actualStartMode === "verified_date"} onChange={() => setActualStartMode("verified_date")} /> Enter an earlier verified time</label>
                {actualStartMode === "verified_date" ? <input type="datetime-local" required value={actualStartAt} onChange={(event) => setActualStartAt(event.currentTarget.value)} /> : null}
              </fieldset>
            ) : null}
            {pendingMove.status === "Blocked" ? (
              <div className="adminDialogFields">
                <label>Private blocker reason<textarea required value={blockerReason} onChange={(event) => setBlockerReason(event.currentTarget.value)} /></label>
                <label>Next unblock check or action<textarea required value={blockerNextCheck} onChange={(event) => setBlockerNextCheck(event.currentTarget.value)} /></label>
              </div>
            ) : null}
            {pendingMove.status === "Done" ? (
              <div className="adminDialogFields">
                <p>All mandatory acceptance items and linked evidence must already be verified.</p>
                <label>Actual completion time<input type="datetime-local" required value={completedAt} onChange={(event) => setCompletedAt(event.currentTarget.value)} /></label>
              </div>
            ) : null}
            {pendingMove.status === "In Review" ? (
              <div className="adminDialogFields">
                <p>{pendingMove.ticket.acceptanceItems.filter((item) => item.mandatory && !item.completedAt).length} mandatory completion items remain.</p>
                <p>{pendingMove.ticket.evidenceIds.length > 0 ? `${pendingMove.ticket.evidenceIds.length} approved evidence link(s) are present.` : "No approved evidence is linked yet."}</p>
              </div>
            ) : null}
            {pendingMove.status === "In Progress" && pendingMove.ticket.deliveryStatus !== "In Progress" && activeTicketCount + 1 > 2 ? (
              <label>Reason for exceeding the two-ticket soft limit<textarea required value={overrideReason} onChange={(event) => setOverrideReason(event.currentTarget.value)} /></label>
            ) : null}
            <footer>
              <button className="button secondary" type="button" onClick={cancelPendingMove}>Cancel</button>
              <button className="button primary" type="button" onClick={() => void persistMove(pendingMove)} disabled={Boolean(admin.busyAction)}>
                <Save size={16} aria-hidden="true" /> {admin.busyAction ? "Saving..." : "Confirm move"}
              </button>
            </footer>
          </section>
        </div>
      ) : null}
    </>
  );
}
