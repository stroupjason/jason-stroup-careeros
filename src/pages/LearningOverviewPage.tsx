import { useEffect } from "react";
import { ArrowUpRight, Award, CheckCircle2, CircleDot, Clock3, ExternalLink, FileCheck2 } from "lucide-react";
import { trackPortfolioEvent } from "../analytics";
import { CurrentLearningCourseCard, formatLearningDate } from "../components/LearningUI";
import { LinkButton, PageHero, SectionHeader, StateBadge } from "../components/UI";
import {
  capabilityLabels,
  currentLearningSprint,
  getLearningTicket,
  getInitiativeProgress,
  learningCourses,
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

const currentCourses = learningCourses.filter((course) => course.status === "In Progress");
const completedCourses = learningCourses.filter((course) => course.status === "Completed");

export function LearningOverviewPage() {
  useEffect(() => {
    trackPortfolioEvent("Learning Overview Viewed", {});
    currentCourses.forEach((course) => {
      const ticket = getLearningTicket(course.relatedTicketKey)!;
      trackPortfolioEvent("Current Learning Viewed", {
        provider: course.providerSlug,
        course: course.slug,
        evidence: course.evidenceState,
        delivery: ticket.deliveryStatus,
        initiative: course.initiativeSlug,
      });
    });
  }, []);

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

      <section className="section shell sectionAfterHero" id="currently-learning">
        <SectionHeader
          kicker="Currently Learning"
          title="Course work connected to applied proof."
          copy="Current progress is published only after a source and observation date are verified. Course completion and applied capability remain separate claims."
        />
        <div className="currentlyLearningList">
          {currentCourses.map((course) => <CurrentLearningCourseCard course={course} key={course.id} />)}
        </div>
      </section>

      <section className="section shell">
        <SectionHeader kicker="Current focus" title="Start with facts, then build the proof." />
        <div className="learningFocus">
          <div>
            <span className="kicker">Highest-value next action</span>
            <h2>{currentLearningSprint.highestValueNextAction}</h2>
            <p>A screenshot-supported progress snapshot is verified and published as a duration-derived value. No completion, certificate, SQL session, query result, or project outcome is claimed.</p>
          </div>
          <a href="/learning/tickets/SQL-002">Open SQL-002 <ArrowUpRight size={17} aria-hidden="true" /></a>
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

      <section className="section shell">
        <SectionHeader
          kicker="Completed Courses & Credentials"
          title="Completion records keep their evidence boundaries."
          copy="A completed course is listed separately from a professional certification and never substitutes for applied work."
        />
        {completedCourses.length === 0 ? (
          <div className="completedLearningEmpty">
            <Award size={22} aria-hidden="true" />
            <div>
              <h3>No verified completed courses or credentials are published yet.</h3>
              <p>SQL Essential Training will move here only after completion is verified. Its delivery ticket can remain open until every definition-of-done requirement is met.</p>
            </div>
          </div>
        ) : (
          <div className="completedCourseList">
            {completedCourses.map((course) => (
              <article key={course.id}>
                <div>
                  <span className="kicker">{course.kind}</span>
                  <h3>{course.title}</h3>
                  <p>{course.provider} / {course.instructor}</p>
                  <div className="tags">
                    {course.capabilitySlugs.map((slug) => <span key={slug}>{capabilityLabels[slug as keyof typeof capabilityLabels]}</span>)}
                  </div>
                </div>
                <StateBadge state={course.evidenceState} />
                <dl>
                  <div><dt>Completed</dt><dd>{course.completionDate ? <time dateTime={course.completionDate}>{formatLearningDate(course.completionDate)}</time> : "Not recorded"}</dd></div>
                  <div><dt>Related work</dt><dd><a href={`/projects/${course.relatedProjectSlug}`}>Applied project</a></dd></div>
                </dl>
                {course.certificateUrl ? <a href={course.certificateUrl} target="_blank" rel="noreferrer">Certificate <ExternalLink size={15} aria-hidden="true" /></a> : null}
              </article>
            ))}
          </div>
        )}
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
