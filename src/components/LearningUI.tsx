import { AlertTriangle, ArrowUpRight, FileCheck2 } from "lucide-react";
import type { LearningTicket } from "../data/learning";
import { capabilityLabels, getLearningInitiative, learningRoleLabels } from "../data/learning";
import { StateBadge } from "./UI";

export function DeliveryBadge({ status }: { status: LearningTicket["deliveryStatus"] }) {
  return <span className={`deliveryBadge delivery-${status.toLowerCase().replace(/\s+/g, "-")}`}>{status}</span>;
}

export function VisibilityBadge() {
  return <span className="visibilityBadge">Public · Approved</span>;
}

export function TicketCard({ ticket }: { ticket: LearningTicket }) {
  const initiative = getLearningInitiative(ticket.initiativeSlug)!;
  const openBlockers = ticket.blockers.filter((blocker) => blocker.status === "Open");

  return (
    <article className="learningTicketCard">
      <div className="learningTicketMeta">
        <a href={`/learning/tickets/${ticket.key}`}>{ticket.key}</a>
        <span>{ticket.issueType}</span>
        <span>{ticket.priority}</span>
      </div>
      <h3><a href={`/learning/tickets/${ticket.key}`}>{ticket.title}</a></h3>
      <p>{ticket.publicSummary}</p>
      <div className="learningTicketStates">
        <DeliveryBadge status={ticket.deliveryStatus} />
        <StateBadge state={ticket.evidenceState} />
      </div>
      <small className="learningTicketParent">{initiative.title}</small>
      {ticket.targetDate ? (
        <time dateTime={ticket.targetDate}>Target {formatLearningDate(ticket.targetDate)}</time>
      ) : null}
      <div className="tags learningTicketTags">
        {ticket.capabilitySlugs.slice(0, 3).map((slug) => <span key={slug}>{capabilityLabels[slug as keyof typeof capabilityLabels]}</span>)}
        {ticket.roleLensSlugs.slice(0, 2).map((slug) => <span key={slug}>{learningRoleLabels[slug as keyof typeof learningRoleLabels]}</span>)}
      </div>
      <div className="learningTicketFooter">
        <span><FileCheck2 size={15} aria-hidden="true" /> {ticket.evidenceIds.length} evidence</span>
        {openBlockers.length > 0 ? <span><AlertTriangle size={15} aria-hidden="true" /> Blocked</span> : null}
        <a href={`/learning/tickets/${ticket.key}`} aria-label={`View ${ticket.key}: ${ticket.title}`}>
          Details <ArrowUpRight size={15} aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}

export function formatLearningDate(date: string) {
  const normalized = date.length === 10 ? `${date}T12:00:00` : date;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(normalized));
}
