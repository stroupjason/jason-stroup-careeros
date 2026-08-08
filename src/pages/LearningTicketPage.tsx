import { useEffect } from "react";
import { ArrowUpRight, CheckCircle2, Link2 } from "lucide-react";
import { trackPortfolioEvent } from "../analytics";
import { useLearningAdmin, type AdminTicket } from "../admin/AdminContext";
import { AdminTicketPanel } from "../components/AdminTicketPanel";
import { DeliveryBadge, formatLearningDate, VisibilityBadge } from "../components/LearningUI";
import { LinkButton, PageHero, SectionHeader, StateBadge } from "../components/UI";
import { NotFoundPage } from "./NotFoundPage";
import {
  capabilityLabels,
  getLearningInitiative,
  getLearningTicket,
  learningRoleLabels,
  type LearningTicket,
} from "../data/learning";

export function LearningTicketPage({ ticket: fallbackTicket }: { ticket: LearningTicket }) {
  const admin = useLearningAdmin();
  const publicPreview = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("view") === "public";
  const adminMode = admin.authState === "admin" && !publicPreview;
  const ticket = (adminMode
    ? admin.adminTickets.find((item) => item.key === fallbackTicket.key)
    : admin.publicTickets.find((item) => item.key === fallbackTicket.key)) ?? fallbackTicket;
  const initiative = getLearningInitiative(ticket.initiativeSlug)!;
  const sessions = admin.publicSessions.filter((session) => session.ticketKey === ticket.key);
  const evidence = admin.publicEvidence.filter((artifact) => ticket.evidenceIds.includes(artifact.id));
  const effortMinutes = sessions.reduce((total, session) => total + session.durationMinutes, 0);

  useEffect(() => {
    trackPortfolioEvent("Learning Ticket Viewed", {
      delivery: ticket.deliveryStatus,
      evidence: ticket.evidenceState,
      issueType: ticket.issueType,
      initiative: ticket.initiativeSlug,
    });
  }, [ticket.deliveryStatus, ticket.evidenceState, ticket.initiativeSlug, ticket.issueType]);

  return (
    <>
      <PageHero
        eyebrow={`${ticket.key} · ${ticket.issueType} · ${ticket.priority}`}
        title={ticket.title}
        copy={ticket.publicSummary}
        actions={<LinkButton href="/learning/board" secondary>Back to board</LinkButton>}
      />
      <section className="section shell sectionAfterHero">
        <div className="ticketStatusStrip" aria-label="Ticket states">
          <DeliveryBadge status={ticket.deliveryStatus} />
          <StateBadge state={ticket.evidenceState} />
          <VisibilityBadge />
          <span>{initiative.roadmapStatus} roadmap</span>
        </div>
        <div className="ticketContextGrid">
          <article><span className="kicker">Why it matters</span><h2>{initiative.careerObjective}</h2><p>{initiative.goal}</p></article>
          <article><span className="kicker">Public context</span><p>{ticket.publicSummary}</p><strong>Parent initiative: {initiative.title}</strong></article>
        </div>
      </section>

      {adminMode ? <AdminTicketPanel ticket={ticket as AdminTicket} /> : null}

      <section className="section band">
        <div className="shell ticketDefinitionGrid">
          <article>
            <SectionHeader kicker="Definition of done" title="The completion gate" />
            <p>{ticket.definitionOfDone}</p>
          </article>
          <article>
            <SectionHeader kicker="Acceptance criteria" title="What must be true" />
            <ul className="cleanList">{ticket.acceptanceCriteria.map((item) => <li key={item}><CheckCircle2 size={17} aria-hidden="true" /> {item}</li>)}</ul>
          </article>
        </div>
      </section>

      <section className="section shell">
        <SectionHeader kicker="Plan and relationships" title="Dates, dependencies, and public blockers" />
        <div className="ticketPlanGrid">
          <dl>
            <div><dt>Planned start</dt><dd>{ticket.plannedStart ? <time dateTime={ticket.plannedStart}>{formatLearningDate(ticket.plannedStart)}</time> : "Not scheduled"}</dd></div>
            <div><dt>Actual start</dt><dd>{ticket.actualStart ? <time dateTime={ticket.actualStart}>{formatLearningDate(ticket.actualStart)}</time> : "Not recorded"}</dd></div>
            <div><dt>Target</dt><dd>{ticket.targetDate ? <time dateTime={ticket.targetDate}>{formatLearningDate(ticket.targetDate)}</time> : "No verified target"}</dd></div>
            <div><dt>Completed</dt><dd>{ticket.completionDate ? <time dateTime={ticket.completionDate}>{formatLearningDate(ticket.completionDate)}</time> : "Not completed"}</dd></div>
            <div><dt>Jason's estimate</dt><dd>{ticket.userEstimate ? `${ticket.userEstimate} story points` : "Not supplied"}</dd></div>
            <div><dt>Recorded effort</dt><dd>{effortMinutes > 0 ? `${effortMinutes} minutes` : "No timed sessions"}</dd></div>
          </dl>
          <div>
            <h3>Dependencies</h3>
            {ticket.dependencies.length > 0 ? <div className="ticketLinkList">{ticket.dependencies.map((key) => getLearningTicket(key) ? <a key={key} href={`/learning/tickets/${key}`}><Link2 size={15} aria-hidden="true" /> {key}</a> : <span key={key}>{key} · repository backlog dependency</span>)}</div> : <p>No dependencies recorded.</p>}
            <h3>Blockers</h3>
            {ticket.blockers.length > 0 ? <ul className="cleanList">{ticket.blockers.map((blocker) => <li key={blocker.id}>{blocker.status}: {blocker.summary}</li>)}</ul> : <p>No public blockers recorded.</p>}
          </div>
        </div>
      </section>

      <section className="section band">
        <div className="shell">
          <SectionHeader kicker="Work history" title="Approved sessions and evidence" />
          <div className="ticketHistoryGrid">
            <div>
              <h3>Work sessions</h3>
              {sessions.length > 0 ? sessions.map((session) => (
                <article key={session.id}>
                  <time dateTime={session.startedAt}>{formatLearningDate(session.startedAt)}</time>
                  <strong>Recorded work session</strong>
                  <p>{session.publicSummary}</p>
                  <small>{session.durationMinutes} minutes · approved public outcome</small>
                </article>
              )) : <p>No approved work session has been recorded for this ticket.</p>}
            </div>
            <div>
              <h3>Evidence</h3>
              {evidence.length > 0 ? evidence.map((artifact) => (
                <article key={artifact.id}>
                  <span>{artifact.type} · {artifact.verificationState}</span>
                  <strong>{artifact.title}</strong>
                  <p>{artifact.publicSummary}</p>
                  {artifact.repositoryPath ? <small>{artifact.repositoryPath}</small> : null}
                </article>
              )) : <p>No approved evidence is linked yet.</p>}
            </div>
          </div>
        </div>
      </section>

      <section className="section shell ticketConnections">
        <article><SectionHeader kicker="Capabilities" title="What this work supports" /><div className="tags largeTags">{ticket.capabilitySlugs.map((slug) => <span key={slug}>{capabilityLabels[slug as keyof typeof capabilityLabels]}</span>)}</div></article>
        <article><SectionHeader kicker="Role lenses" title="Where it transfers" /><div className="roleLinkList">{ticket.roleLensSlugs.map((slug) => <a key={slug} href={`/roles/${slug}`}>{learningRoleLabels[slug as keyof typeof learningRoleLabels]}</a>)}</div></article>
        <article><SectionHeader kicker="Related project" title="Portfolio context" /><a className="ticketProjectLink" href={`/projects/${ticket.relatedProjectSlug}`}>View project <ArrowUpRight size={17} aria-hidden="true" /></a></article>
      </section>

      <section className="section band">
        <div className="shell ticketTruthBoundary">
          <div><span className="kicker">Next action</span><p>{ticket.nextAction}</p></div>
          <div><span className="kicker">Truth boundary</span><p>{ticket.notClaimed}</p></div>
        </div>
      </section>
    </>
  );
}

export function LearningTicketLookupPage({ ticketKey, fallbackTicket }: { ticketKey: string; fallbackTicket?: LearningTicket }) {
  const admin = useLearningAdmin();
  const publicPreview = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("view") === "public";
  const ticket = (admin.authState === "admin" && !publicPreview
    ? admin.adminTickets.find((item) => item.key === ticketKey.toUpperCase())
    : admin.publicTickets.find((item) => item.key === ticketKey.toUpperCase())) ?? fallbackTicket;
  return ticket ? <LearningTicketPage ticket={ticket} /> : <NotFoundPage />;
}
