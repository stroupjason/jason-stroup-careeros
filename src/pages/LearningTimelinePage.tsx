import { useEffect } from "react";
import { Filter, RotateCcw } from "lucide-react";
import { trackPortfolioEvent } from "../analytics";
import { useLearningAdmin } from "../admin/AdminContext";
import { formatLearningDate } from "../components/LearningUI";
import { PageHero, SectionHeader } from "../components/UI";
import {
  capabilityLabels,
  getLearningTimeline,
  learningRoleLabels,
  parseTimelineFilters,
} from "../data/learning";

export function LearningTimelinePage() {
  const admin = useLearningAdmin();
  const search = typeof window === "undefined" ? "" : window.location.search;
  const filters = parseTimelineFilters(search);
  const events = getLearningTimeline(filters, {
    tickets: admin.publicTickets,
    sessions: admin.publicSessions,
    evidence: admin.publicEvidence,
  });

  useEffect(() => trackPortfolioEvent("Learning Timeline Viewed", {}), []);

  return (
    <>
      <PageHero
        eyebrow="Work and evidence timeline"
        title="Chronology from real records only."
        copy="Events are derived from dated tickets, approved work sessions, and reviewed artifacts. Current state is never backfilled into invented history."
      />
      <section className="section shell sectionAfterHero">
        <SectionHeader kicker="Timeline filters" title="Follow one initiative, capability, or role lens." />
        <form className="learningFilters timelineFilters" action="/learning/timeline" method="get">
          <label>Initiative<select name="initiative" defaultValue={filters.initiative ?? ""}><option value="">All initiatives</option>{admin.publicInitiatives.map((item) => <option key={item.slug} value={item.slug}>{item.title}</option>)}</select></label>
          <label>Capability<select name="capability" defaultValue={filters.capability ?? ""}><option value="">All capabilities</option>{Object.entries(capabilityLabels).map(([slug, label]) => <option key={slug} value={slug}>{label}</option>)}</select></label>
          <label>Role lens<select name="role" defaultValue={filters.role ?? ""}><option value="">All role lenses</option>{Object.entries(learningRoleLabels).map(([slug, label]) => <option key={slug} value={slug}>{label}</option>)}</select></label>
          <div className="learningFilterActions">
            <button className="button primary" type="submit"><Filter size={17} aria-hidden="true" /> Apply filters</button>
            <a className="button secondary" href="/learning/timeline"><RotateCcw size={17} aria-hidden="true" /> Reset</a>
          </div>
        </form>
        <p className="learningResultCount" aria-live="polite">{events.length} dated {events.length === 1 ? "event" : "events"}</p>
      </section>
      <section className="section band">
        <div className="shell">
          <SectionHeader kicker="Approved chronology" title="Work, artifacts, and publication decisions" />
          <ol className="learningTimeline">
            {events.map((event) => (
              <li key={event.id}>
                <div className="timelineMarker" aria-hidden="true" />
                <div>
                  <time dateTime={event.occurredAt}>{formatLearningDate(event.occurredAt)}</time>
                  <span>{event.type}</span>
                  <h3>{event.title}</h3>
                  <p>{event.summary}</p>
                  {event.ticketKey ? <a href={`/learning/tickets/${event.ticketKey}`}>View {event.ticketKey}</a> : null}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
