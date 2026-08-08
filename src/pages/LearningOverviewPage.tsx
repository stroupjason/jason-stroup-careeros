import { useEffect } from "react";
import { ArrowUpRight, Award, CheckCircle2, ExternalLink } from "lucide-react";
import { trackPortfolioEvent } from "../analytics";
import { useLearningAdmin } from "../admin/AdminContext";
import { DeliveryPulse } from "../components/DeliveryIntelligence";
import { CurrentLearningCourseCard, formatLearningDate } from "../components/LearningUI";
import { LinkButton, PageHero, SectionHeader, StateBadge } from "../components/UI";
import {
  capabilityLabels,
  academicPrograms,
  academicSpecializations,
  careerTrack,
  currentLearningSprint,
  getLearningTicket,
  getInitiativeProgress,
} from "../data/learning";
import type { EvidenceState } from "../data/site";

const evidenceRank: Record<EvidenceState, number> = {
  Planned: 0,
  Learning: 1,
  Practicing: 2,
  Demonstrated: 3,
};

export function LearningOverviewPage() {
  const admin = useLearningAdmin();
  const publicTickets = admin.publicTickets;
  const publicCourses = admin.publicCourses;
  const publicEvidence = admin.publicEvidence;
  const publicInitiatives = admin.publicInitiatives;
  const currentCourses = publicCourses.filter((course) => course.status === "In Progress");
  const completedCourses = publicCourses.filter((course) => course.status === "Completed");
  const cuCourses = publicCourses.filter((course) => course.academicProgramSlug === "cu-boulder-mscs");
  const academicProgram = academicPrograms[0];
  const networkPathway = academicSpecializations[0];
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

  const capabilityProgression = Object.entries(capabilityLabels).map(([slug, label]) => {
    const relatedTickets = publicTickets.filter((ticket) => ticket.capabilitySlugs.includes(slug));
    const state = relatedTickets.reduce<EvidenceState>(
      (highest, ticket) => evidenceRank[ticket.evidenceState] > evidenceRank[highest] ? ticket.evidenceState : highest,
      "Planned",
    );
    return { slug, label, state, ticketCount: relatedTickets.length };
  }).filter((item) => item.ticketCount > 0);
  const completedMilestones = publicInitiatives.flatMap((initiative) =>
    initiative.milestones
      .filter((milestone) => milestone.status === "Completed")
      .map((milestone) => ({ ...milestone, initiative: initiative.title })));

  return (
    <>
      <PageHero
        eyebrow="Learning & Delivery"
        title="Learning that produces reviewable proof."
        copy="A public, read-only view of planned work, real execution history, blockers, evidence, and next actions. Private operating notes remain outside the public projection."
        actions={
          <>
            <LinkButton href="/learning/board">View work board</LinkButton>
            <LinkButton href="/learning/timeline" secondary>Review timeline</LinkButton>
          </>
        }
      />

      <section className="section shell sectionAfterHero" id="career-track">
        <SectionHeader
          kicker="Career Track"
          title={careerTrack.title}
          copy="One connected path from active course work to original applied evidence, without combining course, degree, project, or role readiness into one percentage."
        />
        <div className="careerTrackSummary">
          <div className="careerTrackDirection">
            <span className="kicker">Current role focus</span>
            <h3>{careerTrack.currentRoleFocus}</h3>
            <p>{careerTrack.progression}</p>
          </div>
          <dl>
            <div><dt>Academic foundation</dt><dd>{careerTrack.academicFoundation}</dd></div>
            <div><dt>Active pathway</dt><dd>{careerTrack.currentAcademicPathway}</dd></div>
            <div><dt>Complementary learning</dt><dd>{careerTrack.complementaryLearning}</dd></div>
            <div><dt>Current sprint goal</dt><dd>{careerTrack.currentSprintGoal}</dd></div>
          </dl>
          <div className="careerTrackActions">
            <strong>Next: {careerTrack.highestValueNextAction}</strong>
            <a href="/learning/board">Open linked work board <ArrowUpRight size={16} aria-hidden="true" /></a>
            <a href="/learning/timeline">Review evidence timeline <ArrowUpRight size={16} aria-hidden="true" /></a>
          </div>
        </div>
      </section>

      <section className="section shell" id="currently-learning">
        <SectionHeader
          kicker="Currently Learning"
          title="Course work connected to applied proof."
          copy="Current progress is published only after a source and observation date are verified. Course completion and applied capability remain separate claims."
        />
        <div className="currentlyLearningList">
          {currentCourses.map((course) => <CurrentLearningCourseCard course={course} key={course.id} />)}
        </div>
      </section>

      <section className="section band academicPathwaySection" id="cu-boulder-mscs">
        <div className="shell">
          <SectionHeader
            kicker="CU Boulder MS-CS coursework"
            title={networkPathway.title}
            copy="Three enrolled courses on Coursera. Only verified course-level progress is shown; academic and applied-evidence claims remain separate."
          />
          <div className="academicProgramContext">
            <div><span>Program status</span><strong>Pursuing coursework</strong></div>
            <div><span>Curriculum context</span><strong>{academicProgram.totalCredits}-credit curriculum</strong></div>
            <div><span>Pathway</span><strong>{networkPathway.subtitle}</strong></div>
            <div><span>Courses</span><strong>{academicProgram.coursesEnrolled} enrolled</strong></div>
            <div><span>Earned credits</span><strong>{academicProgram.earnedCreditsLabel}</strong></div>
            <div><span>Admission</span><strong>{academicProgram.admissionStatus}</strong></div>
          </div>
          <div className="academicCourseGrid">
            {cuCourses.map((course) => <CurrentLearningCourseCard course={course} key={course.id} />)}
          </div>
          <div className="academicPathwayFooter">
            <p>{academicProgram.notClaimed}</p>
            <a href={academicProgram.publicUrl} target="_blank" rel="noreferrer">CU Boulder curriculum <ExternalLink size={15} aria-hidden="true" /></a>
            <a href={networkPathway.publicUrl} target="_blank" rel="noreferrer">Coursera pathway <ExternalLink size={15} aria-hidden="true" /></a>
          </div>
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
            kicker="Delivery Pulse"
            title="A compact view of active learning delivery"
            copy="Counts come from approved records. Missing dates stay unscheduled, and story points are never translated into hours."
          />
          <DeliveryPulse tickets={publicTickets} initiatives={publicInitiatives} nextAction={currentLearningSprint.highestValueNextAction} />
        </div>
      </section>

      <section className="section shell">
        <SectionHeader
          kicker="Active initiatives"
          title="Macro progress stays separate from ticket status."
          copy="Milestone counts come from completed evidence gates, not estimated percentages."
        />
        <div className="learningInitiativeGrid">
          {publicInitiatives.map((initiative) => {
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
                  <div><dt>Start</dt><dd>{initiative.startDate ? <time dateTime={initiative.startDate}>{formatLearningDate(initiative.startDate)}</time> : "Not recorded"}</dd></div>
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
          {publicEvidence.map((artifact) => (
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
