import { AlertTriangle, ArrowUpRight, BookOpenCheck, ExternalLink, FileCheck2, Route } from "lucide-react";
import { trackPortfolioEvent } from "../analytics";
import { useLearningAdmin } from "../admin/AdminContext";
import type { LearningCourse, LearningTicket } from "../data/learning";
import {
  capabilityLabels,
  getCourseProgressPercentage,
  getCurrentCourseProgress,
  getLearningInitiative,
  getLearningTicket,
  learningRoleLabels,
} from "../data/learning";
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

export function CurrentLearningCourseCard({ course }: { course: LearningCourse }) {
  const admin = useLearningAdmin();
  const publicPreview = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("view") === "public";
  const adminMode = admin.authState === "admin" && !publicPreview;
  const initiative = getLearningInitiative(course.initiativeSlug)!;
  const ticket = getLearningTicket(course.relatedTicketKey)!;
  const adminTicket = admin.adminTickets.find((item) => item.key === course.relatedTicketKey);
  const currentProgress = getCurrentCourseProgress(course);
  const currentPercentage = currentProgress ? getCourseProgressPercentage(currentProgress) : undefined;

  return (
    <article className="currentLearningCourse">
      <div className="currentLearningCourseHeading">
        <div>
          <span className="kicker">{course.provider} / {course.kind}</span>
          <h2>{course.courseNumber ? `${course.courseNumber} - ` : ""}{course.title}</h2>
          <p>Instructor {course.instructor} / {course.providerUpdated}</p>
        </div>
        <div className="currentLearningCourseStates" aria-label="Course states">
          <DeliveryBadge status={ticket.deliveryStatus} />
          <StateBadge state={course.evidenceState} />
        </div>
      </div>

      <div className="courseProgressPanel">
        <div className="courseProgressHeading">
          <span>Course progress</span>
          <strong>{currentPercentage === undefined ? course.status : `${currentPercentage}%`}</strong>
        </div>
        {currentPercentage === undefined ? (
          <p className="courseProgressPending">No verified current percentage is published.</p>
        ) : (
          <progress
            aria-label={`Course progress for ${course.title}`}
            max={100}
            value={currentPercentage}
          >
            {currentPercentage}%
          </progress>
        )}
        <dl className="courseProgressMeta">
          <div>
            <dt>Progress verified</dt>
            <dd>{currentProgress ? <time dateTime={currentProgress.observedAt}>{formatLearningDate(currentProgress.observedAt)}</time> : "Not yet"}</dd>
          </div>
          <div>
            <dt>Course metadata</dt>
            <dd><time dateTime={course.metadataVerifiedAt}>{formatLearningDate(course.metadataVerifiedAt)}</time></dd>
          </div>
          <div>
            <dt>Evidence state</dt>
            <dd>{course.evidenceState}</dd>
          </div>
          {currentProgress ? (
            <div>
              <dt>Progress source</dt>
              <dd>{currentProgress.source}</dd>
            </div>
          ) : null}
          {currentProgress ? (
            <div>
              <dt>Value basis</dt>
              <dd>{currentProgress.valueKind}</dd>
            </div>
          ) : null}
          {course.enrollmentState ? (
            <div>
              <dt>Enrollment</dt>
              <dd>{course.enrollmentState}</dd>
            </div>
          ) : null}
          {currentProgress?.totalDurationSeconds !== undefined ? (
            <div>
              <dt>Total duration</dt>
              <dd>{formatCourseDuration(currentProgress.totalDurationSeconds)}</dd>
            </div>
          ) : null}
          {currentProgress?.completedDurationSeconds !== undefined ? (
            <div>
              <dt>Completed</dt>
              <dd>{formatCourseDuration(currentProgress.completedDurationSeconds)}</dd>
            </div>
          ) : null}
          {currentProgress?.remainingDurationSeconds !== undefined ? (
            <div>
              <dt>Remaining</dt>
              <dd>{formatCourseDuration(currentProgress.remainingDurationSeconds)}</dd>
            </div>
          ) : null}
        </dl>
      </div>

      <div className="courseLearningContext">
        <div>
          <span className="kicker">Current learning focus</span>
          <p>{course.currentLearningFocus}</p>
        </div>
        <div>
          <span className="kicker">Highest-value next action</span>
          <p>{course.nextAction}</p>
        </div>
      </div>

      <div className="courseApplicationNote">
        <BookOpenCheck size={20} aria-hidden="true" />
        <p>{course.learningCategory === "Academic program coursework"
          ? "Course work supports the Network Systems pathway. Independent, reviewed troubleshooting artifacts are the stronger evidence of applied capability."
          : "Course completion supports foundational SQL knowledge. The applied healthcare SQL investigation is the stronger evidence of capability."}</p>
      </div>

      <div className="tags courseCapabilityTags" aria-label="Relevant capabilities">
        {course.capabilitySlugs.map((slug) => (
          <span key={slug}>{capabilityLabels[slug as keyof typeof capabilityLabels]}</span>
        ))}
      </div>

      <div className="currentLearningCourseActions">
        <a href={`/learning/tickets/${ticket.key}`}>{ticket.key}: View learning ticket <ArrowUpRight size={16} aria-hidden="true" /></a>
        <a href={`/projects/${course.relatedProjectSlug}`}><Route size={16} aria-hidden="true" /> View applied project</a>
        <a
          href={course.publicUrl}
          target="_blank"
          rel="noreferrer"
          onClick={() => trackPortfolioEvent("Learning Course Opened", {
            provider: course.providerSlug,
            course: course.slug,
            evidence: course.evidenceState,
            delivery: ticket.deliveryStatus,
            initiative: initiative.slug,
            ctaLocation: "current-learning",
          })}
        >
          Open course page <ExternalLink size={16} aria-hidden="true" />
        </a>
      </div>
      {adminMode && adminTicket ? (
        <div className="courseAdminActions" aria-label={`Admin actions for ${course.title}`}>
          <a className="button secondary" href={`/learning/tickets/${ticket.key}?adminAction=progress`}>Update progress</a>
          <a className="button secondary" href={`/learning/tickets/${ticket.key}`}>Edit ticket</a>
          <button className="button primary" type="button" onClick={() => void admin.startWorkSession(adminTicket)} disabled={Boolean(admin.busyAction)}>Start work</button>
        </div>
      ) : null}
    </article>
  );
}

export function formatCourseDuration(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours ? `${hours}h` : "", minutes ? `${minutes}m` : "", seconds ? `${seconds}s` : ""]
    .filter(Boolean)
    .join(" ") || "0m";
}

export function formatLearningDate(date: string) {
  const normalized = date.length === 10 ? `${date}T12:00:00` : date;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(normalized));
}
