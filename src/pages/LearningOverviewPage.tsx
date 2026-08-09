import { useEffect, useMemo } from "react";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { trackPortfolioEvent } from "../analytics";
import { useLearningAdmin } from "../admin/AdminContext";
import { LearningLocalNav } from "../components/LearningLocalNav";
import { CurrentLearningCourseCard, formatLearningDate } from "../components/LearningUI";
import { LinkButton, PageHero, SectionHeader, StateBadge } from "../components/UI";
import { careerTrack, currentLearningSprint, type LearningEvidence } from "../data/learning";
import {
  selectCourseStateSummary,
  selectCurrentCourses,
  selectRecentApprovedEvidence,
  selectTicketByKey,
} from "../data/learningSelectors";

function evidenceDestination(artifact: LearningEvidence) {
  if (artifact.publicUrl) return { href: artifact.publicUrl, label: "Open verified artifact", external: true };
  if (artifact.relatedTicketKeys[0]) return { href: `/learning/tickets/${artifact.relatedTicketKeys[0]}`, label: `View ${artifact.relatedTicketKeys[0]}`, external: false };
  if (artifact.relatedProjectSlug) return { href: `/projects/${artifact.relatedProjectSlug}`, label: "View related project", external: false };
  return undefined;
}

export function LearningOverviewPage() {
  const admin = useLearningAdmin();
  const currentCourses = useMemo(() => selectCurrentCourses(admin.publicCourses), [admin.publicCourses]);
  const courseSummary = useMemo(() => selectCourseStateSummary(admin.publicCourses), [admin.publicCourses]);
  const recentEvidence = useMemo(() => selectRecentApprovedEvidence(admin.publicEvidence, 3), [admin.publicEvidence]);

  useEffect(() => {
    trackPortfolioEvent("Learning Overview Viewed", {});
    currentCourses.forEach((course) => {
      const ticket = selectTicketByKey(admin.publicTickets, course.relatedTicketKey);
      if (!ticket) return;
      trackPortfolioEvent("Current Learning Viewed", {
        provider: course.providerSlug,
        course: course.slug,
        evidence: course.evidenceState,
        delivery: ticket.deliveryStatus,
        initiative: course.initiativeSlug,
      });
    });
  }, [admin.publicTickets, currentCourses]);

  return (
    <>
      <PageHero
        eyebrow="Learning & Delivery"
        title="Learning that produces reviewable proof."
        copy="A recruiter-scannable view of current course work, its evidence boundaries, and the next action connecting learning to delivery."
        actions={
          <>
            <LinkButton href="/learning/board">Open Delivery</LinkButton>
            <LinkButton href="/learning/timeline" secondary>Review Timeline</LinkButton>
          </>
        }
      />
      <LearningLocalNav current="Overview" />

      <section className="section shell sectionAfterHero" id="career-track">
        <SectionHeader
          kicker="Career context"
          title={careerTrack.title}
          copy="Course progress, delivery status, evidence maturity, and role fit remain separate claims."
        />
        <div className="careerTrackSummary compactCareerTrack">
          <div className="careerTrackDirection">
            <span className="kicker">Current role focus</span>
            <h3>{careerTrack.currentRoleFocus}</h3>
            <p>{careerTrack.progression}</p>
          </div>
          <dl>
            <div><dt>Academic foundation</dt><dd>{careerTrack.academicFoundation}</dd></div>
            <div><dt>Active pathway</dt><dd>{careerTrack.currentAcademicPathway}</dd></div>
            <div><dt>Complementary learning</dt><dd>{careerTrack.complementaryLearning}</dd></div>
          </dl>
        </div>
      </section>

      <section className="section band courseStateSection">
        <div className="shell">
          <SectionHeader kicker="Course state" title="Exact records, without a combined score." />
          <dl className="courseStateSummary" aria-label="Course state counts">
            <div><dt>Enrolled</dt><dd>{courseSummary.Enrolled}</dd></div>
            <div><dt>In Progress</dt><dd>{courseSummary["In Progress"]}</dd></div>
            <div><dt>Completed</dt><dd>{courseSummary.Completed}</dd></div>
          </dl>
        </div>
      </section>

      <section className="section shell" id="currently-learning">
        <SectionHeader
          kicker="Current courses"
          title="Course work connected to applied delivery."
          copy="Enrolled and in-progress records stay distinct. Progress appears only when its source and observation date are verified."
        />
        {currentCourses.length ? (
          <div className="currentlyLearningList">
            {currentCourses.map((course) => <CurrentLearningCourseCard course={course} key={course.id} />)}
          </div>
        ) : <p className="learningEmptyState">No current approved course records are available.</p>}
      </section>

      <section className="section band">
        <div className="shell learningFocus">
          <div>
            <span className="kicker">Highest-value next action</span>
            <h2>{currentLearningSprint.highestValueNextAction}</h2>
            <p>SQL-002 remains an active learning ticket. Course activity does not claim a completed course, applied finding, or project outcome.</p>
          </div>
          <a href="/learning/tickets/SQL-002">Open SQL-002 <ArrowUpRight size={17} aria-hidden="true" /></a>
        </div>
      </section>

      <section className="section shell">
        <SectionHeader
          kicker="Recent evidence"
          title="The three newest approved artifacts."
          copy="Only allowlisted public evidence is shown; private locations and notes never enter this view."
        />
        {recentEvidence.length ? (
          <div className="learningEvidenceList recentEvidenceList">
            {recentEvidence.map((artifact) => {
              const destination = evidenceDestination(artifact);
              return (
                <article key={artifact.id}>
                  <div>
                    <span className="kicker">{artifact.type}</span>
                    <h3>{artifact.title}</h3>
                    <time dateTime={artifact.approvedAt}>{formatLearningDate(artifact.approvedAt)}</time>
                  </div>
                  <StateBadge state={artifact.evidenceStateSupported} />
                  <p>{artifact.publicSummary}</p>
                  <small>{artifact.limitations}</small>
                  {destination ? (
                    <a href={destination.href} target={destination.external ? "_blank" : undefined} rel={destination.external ? "noreferrer" : undefined}>
                      {destination.label} {destination.external ? <ExternalLink size={15} aria-hidden="true" /> : <ArrowUpRight size={15} aria-hidden="true" />}
                    </a>
                  ) : null}
                </article>
              );
            })}
          </div>
        ) : <p className="learningEmptyState">No approved public evidence is available yet.</p>}
      </section>

      <section className="section band">
        <div className="shell learningOverviewDestinations">
          <div><span className="kicker">Delivery</span><p>Search, filter, and inspect canonical ticket state.</p><a href="/learning/board">Open Delivery <ArrowUpRight size={16} aria-hidden="true" /></a></div>
          <div><span className="kicker">Timeline</span><p>Review planned, actual, open, and completed work.</p><a href="/learning/timeline">Open Timeline <ArrowUpRight size={16} aria-hidden="true" /></a></div>
        </div>
      </section>
    </>
  );
}
