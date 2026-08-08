import { ArrowUpRight } from "lucide-react";
import { trackPortfolioEvent } from "../analytics";
import { PageHero, SectionHeader, StateBadge } from "../components/UI";
import {
  projects,
  roadmap,
  type EvidenceState,
  type InitiativePhaseStatus,
} from "../data/site";

const phaseEvidenceState: Record<InitiativePhaseStatus, EvidenceState> = {
  Completed: "Demonstrated",
  Active: "Practicing",
  Next: "Learning",
  Planned: "Planned",
};

export function RoadmapPage() {
  const initiativeProjects = projects.filter((project) => project.initiative);

  return (
    <>
      <PageHero
        eyebrow="Public roadmap"
        title="Build the next proof in the right order."
        copy="CareerOS is live. Active initiatives strengthen product measurement, owned project evidence, and software delivery."
      />
      <section className="section shell sectionAfterHero">
        <SectionHeader
          kicker="Active initiatives"
          title="Platform work with explicit evidence gates."
          copy="Completed, active, next, and planned work stays connected to one parent project and one public status model."
        />
        <div className="initiativeList">
          {initiativeProjects.map((project) => {
            const initiative = project.initiative!;
            const completedMilestones = initiative.phases.reduce(
              (count, phase) =>
                count + (
                  phase.status === "Completed"
                    ? phase.milestones.length
                    : phase.completedMilestones?.length ?? 0
                ),
              0,
            );
            const totalMilestones = initiative.phases.reduce(
              (count, phase) => count + phase.milestones.length,
              0,
            );

            return (
              <article className="initiativeCard" key={project.slug}>
                <div className="initiativeCardHeader">
                  <div>
                    <span className="kicker">Started {initiative.started}</span>
                    <h2>{project.title}</h2>
                  </div>
                  <StateBadge state="Practicing" label={initiative.status} />
                </div>
                <p>{initiative.summary}</p>
                <div className="initiativeMetrics" aria-label="Initiative progress">
                  <span><strong>{initiative.currentPhase}</strong><small>Current phase</small></span>
                  <span><strong>{completedMilestones} of {totalMilestones}</strong><small>Milestones complete</small></span>
                  <span><strong>{initiative.relatedTickets.join(" + ")}</strong><small>Related backlog</small></span>
                </div>
                <div className="initiativeProgression">
                  {initiative.phases.map((phase) => (
                    <div key={phase.phase}>
                      <span>Phase {phase.phase}</span>
                      <strong>{phase.title}</strong>
                      <StateBadge
                        state={phaseEvidenceState[phase.status]}
                        label={phase.status}
                      />
                    </div>
                  ))}
                </div>
                <div className="tags largeTags">
                  {project.stack.map((technology) => <span key={technology}>{technology}</span>)}
                </div>
                <a
                  className="initiativeLink"
                  href={`/projects/${project.slug}`}
                  onClick={() =>
                    trackPortfolioEvent("Project Opened", {
                      project: project.slug,
                      location: "roadmap",
                    })
                  }
                >
                  View project <ArrowUpRight size={17} aria-hidden="true" />
                </a>
              </article>
            );
          })}
        </div>
      </section>
      <section className="section shell">
        <SectionHeader
          kicker="Execution sequence"
          title="Public beta complete. Product and project proof next."
        />
        <div className="roadmap">
          {roadmap.map((item) => (
            <div className={`roadmapItem ${item.status}`} key={item.phase}>
              <div className="phase">{item.phase}</div>
              <div>
                <div className="roadmapMeta">
                  <span>{item.date}</span>
                  <b>{item.status}</b>
                </div>
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
