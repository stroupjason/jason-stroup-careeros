import type { CSSProperties } from "react";
import { ArrowRight, Ban, CalendarClock, CheckCircle2, GitBranch, TimerReset } from "lucide-react";
import {
  buildDeliveryTimeline,
  deriveDeliveryMetrics,
  type DeliveryTimeline,
  type EvidenceMapNode,
} from "../data/deliveryIntelligence";
import type { LearningInitiative, LearningTicket } from "../data/learning";

type TimelineStyle = CSSProperties & {
  "--timeline-start": string;
  "--timeline-span": string;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}T12:00:00Z`));
}

function timelineStyle(itemStart: string | undefined, itemEnd: string | undefined, timeline: DeliveryTimeline): TimelineStyle {
  const rangeStart = Date.parse(`${timeline.rangeStart ?? "1970-01-01"}T00:00:00Z`);
  const rangeEnd = Date.parse(`${timeline.rangeEnd ?? timeline.rangeStart ?? "1970-01-02"}T00:00:00Z`);
  const range = Math.max(rangeEnd - rangeStart, 86_400_000);
  const start = itemStart ? Date.parse(`${itemStart}T00:00:00Z`) : rangeStart;
  const end = itemEnd ? Date.parse(`${itemEnd}T00:00:00Z`) : rangeEnd;
  const offset = Math.max(0, Math.min(96, ((start - rangeStart) / range) * 100));
  const span = Math.max(2.5, Math.min(100 - offset, ((Math.max(end, start) - start) / range) * 100));
  return { "--timeline-start": `${offset}%`, "--timeline-span": `${span}%` };
}

export function DeliveryMetricSummary({ tickets, referenceAt }: { tickets: readonly LearningTicket[]; referenceAt: string }) {
  const metrics = deriveDeliveryMetrics(tickets, referenceAt);
  const cycleTimeLabel = metrics.medianCycleDays === undefined
    ? "Withheld"
    : metrics.medianCycleDays < 1
      ? "<1d"
      : `${Number(metrics.medianCycleDays.toFixed(1))}d`;
  return (
    <div className="deliveryMetricSummary" aria-label="Delivery flow metrics">
      <div><TimerReset size={18} aria-hidden="true" /><strong>{metrics.workInProgress}</strong><span>Current WIP</span><small>In Progress + Blocked + In Review</small></div>
      <div><CheckCircle2 size={18} aria-hidden="true" /><strong>{metrics.throughput}</strong><span>30-day throughput</span><small>Verified completion timestamps only</small></div>
      <div><CalendarClock size={18} aria-hidden="true" /><strong>{cycleTimeLabel}</strong><span>Median cycle time</span><small>{metrics.comparableCycleCount ? `${metrics.comparableCycleCount} comparable completed tickets` : "Actual starts are missing"}</small></div>
    </div>
  );
}

export function DeliveryTimelineView({ tickets, initiatives, compact = false }: {
  tickets: readonly LearningTicket[];
  initiatives: readonly LearningInitiative[];
  compact?: boolean;
}) {
  const timeline = buildDeliveryTimeline(tickets, initiatives);
  const scheduled = compact ? timeline.scheduled.slice(-6) : timeline.scheduled;
  const unscheduled = compact ? timeline.unscheduled.slice(0, 4) : timeline.unscheduled;

  return (
    <div className={`deliveryTimelineView${compact ? " compact" : ""}`}>
      <div className="deliveryTimelineLegend" aria-label="Timeline legend">
        <span className="planned">Planned window</span>
        <span className="actual">Actual work</span>
        <span className="open">Open-ended work</span>
        <span className="completed">Completion milestone</span>
      </div>
      {timeline.rangeStart && timeline.rangeEnd ? (
        <div className="deliveryTimelineAxis" aria-hidden="true"><span>{formatDate(timeline.rangeStart)}</span><span>{formatDate(timeline.rangeEnd)}</span></div>
      ) : null}
      <ol className="deliveryTimelineRows" aria-label="Scheduled delivery work">
        {scheduled.map((item) => (
          <li key={item.key}>
            <div className="deliveryTimelineLabel">
              <a href={item.href}><strong>{item.key}</strong> {item.title}</a>
              <small>{item.initiativeTitle} / {item.status}</small>
              <span className="deliveryTimelineMobileText">{item.label}</span>
            </div>
            <div className="deliveryTimelineTrack">
              <span className={`deliveryTimelineBar ${item.kind}`} style={timelineStyle(item.start, item.end, timeline)} aria-hidden="true" />
              <span className="deliveryTimelineText">{item.label}</span>
            </div>
            <div className="deliveryTimelineSignals" aria-label="Relationships and evidence">
              {item.blocked ? <span><Ban size={14} aria-hidden="true" /> Blocked</span> : null}
              {item.hasDependencies ? <span><GitBranch size={14} aria-hidden="true" /> Dependencies</span> : null}
              {item.hasEvidence ? <span><CheckCircle2 size={14} aria-hidden="true" /> Evidence</span> : null}
            </div>
          </li>
        ))}
      </ol>
      <div className="deliveryUnscheduled">
        <h3>Unscheduled</h3>
        <p>These items remain usable without invented dates.</p>
        {unscheduled.length ? <ul>{unscheduled.map((item) => <li key={item.key}><a href={item.href}><strong>{item.key}</strong> {item.title}</a><span>{item.label}</span></li>)}</ul> : <p>No unscheduled items in this view.</p>}
      </div>
    </div>
  );
}

export function EvidenceDeliveryMap({ nodes }: { nodes: readonly EvidenceMapNode[] }) {
  return (
    <div className="evidenceDeliveryMap">
      {nodes.length ? (
        <ol aria-label="Evidence delivery relationship">
          {nodes.map((node, index) => (
            <li key={`${node.kind}-${node.id}`}>
              <article>
                <span>{node.kind}</span>
                <h3>{node.href ? <a href={node.href}>{node.label}</a> : node.label}</h3>
                <p>{node.detail}</p>
                <small>{node.state}</small>
              </article>
              {index < nodes.length - 1 ? <ArrowRight size={18} aria-hidden="true" /> : null}
            </li>
          ))}
        </ol>
      ) : <p>No canonical relationship path is available for this initiative.</p>}
      <p className="evidenceMapBoundary">Course activity can lead to applied evidence, but it does not automatically prove capability or role readiness.</p>
    </div>
  );
}

export function DeliveryPulse({ tickets, initiatives, nextAction }: {
  tickets: readonly LearningTicket[];
  initiatives: readonly LearningInitiative[];
  nextAction: string;
}) {
  const referenceAt = new Date().toISOString();
  const metrics = deriveDeliveryMetrics(tickets, referenceAt);
  const activeTickets = tickets.filter((ticket) => ["In Progress", "Blocked", "In Review"].includes(ticket.deliveryStatus));
  return (
    <div className="deliveryPulse">
      <div className="deliveryPulseNumbers">
        <span><strong>{metrics.workInProgress}</strong> active work items</span>
        <span><strong>{metrics.blockedCount + metrics.agingActiveCount}</strong> blocked or aging</span>
        <span><strong>{metrics.throughput}</strong> completed in 30 days</span>
      </div>
      <div className="deliveryPulseNext"><span className="kicker">Highest-value next action</span><strong>{nextAction}</strong></div>
      <DeliveryTimelineView tickets={activeTickets} initiatives={initiatives} compact />
      <div className="deliveryPulseActions"><a className="button primary" href="/learning/board">Open work board</a><a className="button secondary" href="/roadmap?initiative=careeros-learning-delivery">Full delivery timeline</a></div>
    </div>
  );
}
