import { useEffect } from "react";
import { Filter, RotateCcw } from "lucide-react";
import { trackPortfolioEvent } from "../analytics";
import { TicketCard } from "../components/LearningUI";
import { PageHero, SectionHeader } from "../components/UI";
import {
  capabilityLabels,
  deliveryStatuses,
  filterLearningTickets,
  issueTypes,
  learningInitiatives,
  learningRoleLabels,
  parseBoardFilters,
  type DeliveryStatus,
} from "../data/learning";

const boardColumns: DeliveryStatus[] = ["Ready", "In Progress", "Blocked", "In Review", "Done"];

export function LearningBoardPage() {
  const search = typeof window === "undefined" ? "" : window.location.search;
  const filters = parseBoardFilters(search);
  const filteredTickets = filterLearningTickets(filters);
  const visibleFilters = Object.entries(filters).filter((entry): entry is [string, string] => Boolean(entry[1]));

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
  }, [filters.capability, filters.delivery, filters.evidence, filters.initiative, filters.issueType, filters.role, visibleFilters.length]);

  return (
    <>
      <PageHero
        eyebrow="Public work board"
        title="Approved work, grouped by delivery state."
        copy="This is a read-only projection. Raw notes, private preparation, external-system identifiers, and unreviewed artifacts do not appear here."
      />
      <section className="section shell sectionAfterHero">
        <SectionHeader kicker="Filters" title="Narrow the board without exposing private detail." />
        <form className="learningFilters" action="/learning/board" method="get">
          <label>Initiative<select name="initiative" defaultValue={filters.initiative ?? ""}><option value="">All initiatives</option>{learningInitiatives.map((item) => <option key={item.slug} value={item.slug}>{item.title}</option>)}</select></label>
          <label>Delivery status<select name="delivery" defaultValue={filters.delivery ?? ""}><option value="">All delivery states</option>{deliveryStatuses.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
          <label>Evidence state<select name="evidence" defaultValue={filters.evidence ?? ""}><option value="">All evidence states</option>{["Demonstrated", "Practicing", "Learning", "Planned"].map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
          <label>Capability<select name="capability" defaultValue={filters.capability ?? ""}><option value="">All capabilities</option>{Object.entries(capabilityLabels).map(([slug, label]) => <option key={slug} value={slug}>{label}</option>)}</select></label>
          <label>Role lens<select name="role" defaultValue={filters.role ?? ""}><option value="">All role lenses</option>{Object.entries(learningRoleLabels).map(([slug, label]) => <option key={slug} value={slug}>{label}</option>)}</select></label>
          <label>Issue type<select name="type" defaultValue={filters.issueType ?? ""}><option value="">All issue types</option>{issueTypes.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
          <div className="learningFilterActions">
            <button className="button primary" type="submit"><Filter size={17} aria-hidden="true" /> Apply filters</button>
            <a className="button secondary" href="/learning/board"><RotateCcw size={17} aria-hidden="true" /> Reset</a>
          </div>
        </form>
        <p className="learningResultCount" aria-live="polite">{filteredTickets.length} public {filteredTickets.length === 1 ? "ticket" : "tickets"}</p>
      </section>

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
    </>
  );
}
