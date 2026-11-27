import { useEffect } from "react";
import { Bug as BugIcon, Filter, RotateCcw } from "lucide-react";
import { trackPortfolioEvent } from "../analytics";
import { useLearningAdmin, type AdminTicket } from "../admin/AdminContext";
import { AdminLearningBoard } from "../components/AdminLearningBoard";
import { DeliveryPulse } from "../components/DeliveryIntelligence";
import { LearningLocalNav } from "../components/LearningLocalNav";
import { TicketCard } from "../components/LearningUI";
import { PageHero, SectionHeader } from "../components/UI";
import {
  capabilityLabels,
  currentLearningSprint,
  deliveryStatuses,
  filterLearningTickets,
  getInitiativeProgress,
  issueTypes,
  learningRoleLabels,
  parseBoardFilters,
  type DeliveryStatus,
} from "../data/learning";
import { selectCapabilityProgression, selectCompletedMilestones } from "../data/learningSelectors";

const boardColumns: DeliveryStatus[] = ["Ready", "In Progress", "Blocked", "In Review", "Done"];

export function LearningBoardPage() {
  const admin = useLearningAdmin();
  const search = typeof window === "undefined" ? "" : window.location.search;
  const publicPreview = new URLSearchParams(search).get("view") === "public";
  const adminMode = admin.authState === "admin" && !publicPreview;
  const filters = parseBoardFilters(search);
  const sourceTickets = adminMode ? admin.adminTickets.filter((ticket) => !ticket.archivedAt) : admin.publicTickets;
  const filteredTickets = filterLearningTickets(filters, sourceTickets);
  const visibleFilters = Object.entries(filters).filter((entry): entry is [string, string] => Boolean(entry[1]));
  const capabilities = selectCapabilityProgression(admin.publicTickets);
  const completedMilestones = selectCompletedMilestones(admin.publicInitiatives);

  useEffect(() => {
    trackPortfolioEvent("Learning Board Viewed", {});
    if (visibleFilters.length > 0) {
      trackPortfolioEvent("Learning Board Filtered", {
        initiative: filters.initiative,
        delivery: filters.delivery,
        evidence: filters.evidence,
        capability: filters.capability,
        role: filters.role,
        issueType: filters.issueType,
      });
    }
  }, [filters.capability, filters.delivery, filters.evidence, filters.initiative, filters.issueType, filters.query, filters.role, visibleFilters.length]);

  return (
    <>
      <PageHero
        eyebrow={adminMode ? "Jason-only admin workspace" : "Public work board"}
        title={adminMode ? "Manage the existing learning delivery board." : "Approved work, grouped by delivery state."}
        copy={adminMode
          ? "Moves, edits, sessions, and progress updates persist through the authorized CareerOS data layer and create audit history."
          : "This is a read-only projection. Raw notes, private preparation, external-system identifiers, and unreviewed artifacts do not appear here."}
      />
      <LearningLocalNav current="Delivery" />

      <section className="section shell sectionAfterHero learningDeliveryPulse">
        <SectionHeader
          kicker="Delivery Pulse"
          title="Current execution, without an invented score."
          copy="Active work, verified throughput, and schedule truth are derived from the canonical public ticket snapshot."
        />
        <DeliveryPulse
          tickets={admin.publicTickets}
          initiatives={admin.publicInitiatives}
          nextAction={currentLearningSprint.highestValueNextAction}
        />
      </section>

      <section className="section band learningDeliverySummary">
        <div className="shell">
          <SectionHeader kicker="Delivery shape" title="Initiatives, capabilities, and completed milestones." />
          <div className="learningMacroSummary">
            <div>
              <span className="kicker">Initiatives</span>
              <ul>{admin.publicInitiatives.map((initiative) => {
                const progress = getInitiativeProgress(initiative);
                return <li key={initiative.slug}><strong>{initiative.title}</strong><span>{progress.completed} of {progress.total} milestones complete</span></li>;
              })}</ul>
            </div>
            <div>
              <span className="kicker">Capability progression</span>
              <ul>{capabilities.map((capability) => <li key={capability.slug}><strong>{capability.label}</strong><span>{capability.state} across {capability.ticketCount} {capability.ticketCount === 1 ? "ticket" : "tickets"}</span></li>)}</ul>
            </div>
            <div>
              <span className="kicker">Completed milestones</span>
              {completedMilestones.length ? <ul>{completedMilestones.map((milestone) => <li key={`${milestone.initiative}-${milestone.title}`}><strong>{milestone.title}</strong><span>{milestone.initiative}</span></li>)}</ul> : <p>No approved completed milestones are recorded.</p>}
            </div>
          </div>
        </div>
      </section>

      <section className="section shell sectionAfterHero">
        <SectionHeader kicker="Search and filters" title="Find approved delivery work." copy="Search checks ticket key, title, and public summary only." />
        <form className="learningFilters" action="/learning/board" method="get">
          <label className="learningSearchField">Search approved tickets<input type="search" name="q" defaultValue={filters.query ?? ""} maxLength={120} placeholder="Key, title, or public summary" /></label>
          <label>Initiative<select name="initiative" defaultValue={filters.initiative ?? ""}><option value="">All initiatives</option>{admin.publicInitiatives.map((item) => <option key={item.slug} value={item.slug}>{item.title}</option>)}</select></label>
          <label>Delivery status<select name="delivery" defaultValue={filters.delivery ?? ""}><option value="">All delivery states</option>{deliveryStatuses.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
          <label>Evidence state<select name="evidence" defaultValue={filters.evidence ?? ""}><option value="">All evidence states</option>{["Demonstrated", "Practicing", "Learning", "Planned"].map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
          <label>Capability<select name="capability" defaultValue={filters.capability ?? ""}><option value="">All capabilities</option>{Object.entries(capabilityLabels).map(([slug, label]) => <option key={slug} value={slug}>{label}</option>)}</select></label>
          <label>Role lens<select name="role" defaultValue={filters.role ?? ""}><option value="">All role lenses</option>{Object.entries(learningRoleLabels).map(([slug, label]) => <option key={slug} value={slug}>{label}</option>)}</select></label>
          <label>Issue type<select name="type" defaultValue={filters.issueType ?? ""}><option value="">All issue types</option>{issueTypes.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
          <div className="learningFilterActions">
            <button className="button primary" type="submit"><Filter size={17} aria-hidden="true" /> Apply filters</button>
            <a className="button secondary" href="/learning/board"><RotateCcw size={17} aria-hidden="true" /> Reset</a>
            <a className="button secondary" href="/learning/board?type=Bug"><BugIcon size={17} aria-hidden="true" /> Bugs</a>
          </div>
        </form>
        <p className="learningResultCount" aria-live="polite">{filteredTickets.length} {adminMode ? "managed" : "public"} {filteredTickets.length === 1 ? "ticket" : "tickets"}</p>
        {filteredTickets.length === 0 ? <div className="learningNoResults" role="status"><h3>No approved tickets match.</h3><p>Change the search or filters to restore the board.</p><a href="/learning/board">Reset search and filters</a></div> : null}
      </section>

      {adminMode ? (
        <section className="section band learningBoardSection" aria-labelledby="board-heading">
          <div className="shell">
            <SectionHeader kicker="Admin board" title="Backlog through done" />
            <div className="adminBoardTools"><a className="button secondary" href="/admin/operations/bugs"><BugIcon size={16} aria-hidden="true" /> Open private Bug Log</a></div>
            <h2 className="srOnly" id="board-heading">Learning delivery admin board</h2>
            <AdminLearningBoard tickets={filteredTickets as AdminTicket[]} allTickets={sourceTickets as AdminTicket[]} filtered={visibleFilters.length > 0} />
            {admin.notice ? <p className="adminNotice" role="status">{admin.notice}</p> : null}
          </div>
        </section>
      ) : (<>
      <section className="section band learningBoardSection" aria-labelledby="board-heading">
        <div className="shell">
          <SectionHeader kicker="Focused board" title="Ready through done" />
          <h2 className="srOnly" id="board-heading">Learning delivery ticket board</h2>
          <div className="kanbanBoard">
            {boardColumns.map((status) => {
              const columnTickets = filteredTickets.filter((ticket) => ticket.deliveryStatus === status);
              return (
                <section className="kanbanColumn" key={status} aria-labelledby={`column-${status.replace(/\s+/g, "-")}`}>
                  <header><h3 id={`column-${status.replace(/\s+/g, "-")}`}>{status}</h3><span>{columnTickets.length}</span></header>
                  <div className="kanbanTicketList">
                    {columnTickets.length > 0 ? columnTickets.map((ticket) => <TicketCard key={ticket.key} ticket={ticket} />) : <p>No approved tickets in this state.</p>}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section shell">
        <SectionHeader kicker="Backlog" title="Sequenced work that is not ready yet." />
        <div className="backlogTicketGrid">
          {filteredTickets.filter((ticket) => ticket.deliveryStatus === "Backlog").map((ticket) => <TicketCard key={ticket.key} ticket={ticket} />)}
        </div>
        {filteredTickets.every((ticket) => ticket.deliveryStatus !== "Backlog") ? <p>No backlog tickets match the current filters.</p> : null}
      </section>
      </>)}
    </>
  );
}
