import { useEffect } from "react";
import { ArrowUpRight, CheckCircle2, CircleDot, Clock3, FileCheck2 } from "lucide-react";
import { trackPortfolioEvent } from "../analytics";
import { DeliveryBadge, formatLearningDate } from "../components/LearningUI";
import { LinkButton, PageHero, SectionHeader, StateBadge } from "../components/UI";
import {
  capabilityLabels,
  currentLearningSprint,
  getInitiativeProgress,
  learningEvidence,
  learningInitiatives,
  learningTickets,
  workSessions,
  type DeliveryStatus,
} from "../data/learning";
import type { EvidenceState } from "../data/site";

const evidenceRank: Record<EvidenceState, number> = {
  Planned: 0,
  Learning: 1,
  Practicing: 2,
  Demonstrated: 3,
};

export function LearningOverviewPage() {
  useEffect(() => trackPortfolioEvent("Learning Overview Viewed", {}), []);

  const statusCounts = learningTickets.reduce<Partial<Record<DeliveryStatus, number>>>((counts, ticket) => {
    counts[ticket.deliveryStatus] = (counts[ticket.deliveryStatus] ?? 0) + 1;
    return counts;
  }, {});
  const capabilityProgression = Object.entries(capabilityLabels).map(([slug, label]) => {
    const relatedTickets = learningTickets.filter((ticket) => ticket.capabilitySlugs.includes(slug));
    const state = relatedTickets.reduce<EvidenceState>(
      (highest, ticket) => evidenceRank[ticket.evidenceState] > evidenceRank[highest] ? ticket.evidenceState : highest,
      "Planned",
    );
    return { slug, label, state, ticketCount: relatedTickets.length };
  }).filter((item) => item.ticketCount > 0);
  const completedMilestones = learningInitiatives.flatMap((initiative) =>
    initiative.milestones
      .filter((milestone) => milestone.status === "Completed")
      .map((milestone) => ({ ...milestone, initiative: initiative.title })));

  return (
    <>
      <PageHero
        eyebrow="Learning & Delivery"
        title="Learning that produces reviewable proof."
        copy="A public, read-only view of planned work, real execution history, blockers, evidence, and next actions. Private operating notes remain outside this site."
        actions={
          <>
            <LinkButton href="/learning/board">View work board</LinkButton>
            <LinkButton href="/learning/timeline" secondary>Review timeline</LinkButton>
          </>
        }
      />

      <section className="section shell sectionAfterHero">
        <SectionHeader kicker="Current focus" title="Start with facts, then build the proof." />
        <div className="learningFocus">
          <div>
            <span className="kicker">Highest-value next action</span>
            <h2>{currentLearningSprint.highestValueNextAction}</h2>
            <p>No healthcare SQL session, course completion, certificate, query result, or project outcome is recorded yet.</p>
          </div>
          <a href="/learning/tickets/SQL-001">Open SQL-001 <ArrowUpRight size={17} aria-hidden="true" /></a>
        </div>
      </section>

      <section className="section band">
        <div className="shell">
          <SectionHeader
            kicker="Delivery health"
            title="The work, without vanity metrics."
            copy="Counts are derived from approved records. Hours appear only after sessions include verified start and end times."
          />
          <div className="learningMetricGrid">
            <div><CheckCircle2 size={20} aria-hidden="true" /><strong>{statusCounts.Done ?? 0}</strong><span>Tickets completed</span></div>
            <div><CircleDot size={20} aria-hidden="true" /><strong>{statusCounts.Ready ?? 0}</strong><span>Ready to begin</span></div>
            <div><Clock3 size={20} aria-hidden="true" /><strong>{workSessions.length}</strong><span>Recorded sessions</span></div>
            <div><FileCheck2 size={20} aria-hidden="true" /><strong>{learningEvidence.length}</strong><span>Approved artifacts</span></div>
          </div>
        </div>
      </section>

      <section className="section shell">
        <SectionHeader
          kicker="Active initiatives"
          title="Macro progress stays separate from ticket status."
          copy="Milestone counts come from completed evidence gates, not estimated percentages."
        />
        <div className="learningInitiativeGrid">
          {learningInitiatives.map((initiative) => {
            const progress = getInitiativeProgress(initiative);
            return (
              <article className="learningInitiative" key={initiative.slug}>
                <div className="learningInitiativeHeading">
                  <div>
                    <span className="kicker">{initiative.currentPhase}</span>
                    <h3>{initiative.title}</h3>
                  </div>
                  <StateBadge state={initiative.evidenceState} />
                </div>
                <p>{initiative.publicSummary}</p>
                <dl>
                  <div><dt>Roadmap</dt><dd>{initiative.roadmapStatus}</dd></div>
                  <div><dt>Milestones</dt><dd>{progress.completed} of {progress.total} complete</dd></div>
                  <div><dt>Start</dt><dd><time dateTime={initiative.startDate}>{formatLearningDate(initiative.startDate)}</time></dd></div>
                </dl>
                <strong>Next: {initiative.nextAction}</strong>
                <a href={`/learning/board?initiative=${initiative.slug}`}>View initiative tickets <ArrowUpRight size={16} aria-hidden="true" /></a>
              </article>
            );
          })}
        </div>
      </section>

      <section className="section band">
        <div className="shell learningSprintLayout">
          <div>
            <span className="kicker">Current sprint</span>
            <h2>{currentLearningSprint.title}</h2>
            <p><time dateTime={currentLearningSprint.startDate}>{formatLearningDate(currentLearningSprint.startDate)}</time> to <time dateTime={currentLearningSprint.endDate}>{formatLearningDate(currentLearningSprint.endDate)}</time></p>
            <p>These are candidates, not a promise that every seed ticket will be completed in one weekend.</p>
          </div>
          <ul className="cleanList learningSprintGoals">
            {currentLearningSprint.goals.map((goal) => <li key={goal}>{goal}</li>)}
          </ul>
        </div>
      </section>

      <section className="section shell">
        <SectionHeader kicker="Recent evidence" title="Approved artifacts, with their limits attached." />
        <div className="learningEvidenceList">
          {learningEvidence.map((artifact) => (
            <article key={artifact.id}>
              <div><span className="kicker">{artifact.type}</span><h3>{artifact.title}</h3></div>
              <StateBadge state={artifact.evidenceStateSupported} />
              <p>{artifact.publicSummary}</p>
              <small>{artifact.limitations}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="section band">
        <div className="shell">
          <SectionHeader kicker="Capability progression" title="Evidence state follows the work." />
          <div className="capabilityProgression">
            {capabilityProgression.map((capability) => (
              <div key={capability.slug}>
                <span>{capability.label}</span>
                <StateBadge state={capability.state} />
                <small>{capability.ticketCount} related {capability.ticketCount === 1 ? "ticket" : "tickets"}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section shell">
        <SectionHeader kicker="Completed milestones" title="Evidence gates already met." />
        <div className="completedMilestoneList">
          {completedMilestones.map((milestone) => (
            <div key={milestone.id}>
              <CheckCircle2 size={18} aria-hidden="true" />
              <span><strong>{milestone.title}</strong><small>{milestone.initiative}</small></span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
