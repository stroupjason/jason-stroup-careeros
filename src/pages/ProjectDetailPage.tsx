import { CheckCircle2, ImageOff } from "lucide-react";
import { trackPortfolioEvent } from "../analytics";
import { LinkButton, PageHero, SectionHeader, StateBadge } from "../components/UI";
import type { EvidenceState, InitiativePhaseStatus, Project } from "../data/site";

const roleSlugs: Record<string, string> = {
  "Senior TSE": "senior-technical-support-engineer",
  TAM: "technical-account-manager",
  CSE: "customer-success-engineer",
  "Data Analytics": "data-analytics",
  "Application Engineer": "application-engineer",
  FDE: "forward-deployed-engineer",
  "Data Science": "data-science",
};

const phaseEvidenceState: Record<InitiativePhaseStatus, EvidenceState> = {
  Completed: "Demonstrated",
  Active: "Practicing",
  Next: "Learning",
  Planned: "Planned",
};

export function ProjectDetailPage({ project }: { project: Project }) {
  return (
    <>
      <PageHero
        eyebrow={`${project.type} · ${project.status}`}
        title={project.title}
        copy={project.summary}
        actions={
          <>
            <LinkButton
              href="/projects"
              secondary
              analytics={{ destination: "projects", location: "project-hero" }}
            >
              All projects
            </LinkButton>
            {project.liveUrl ? (
              <LinkButton
                href={project.liveUrl}
                external
                analytics={{ destination: "live-project", location: "project-hero" }}
              >
                View live beta
              </LinkButton>
            ) : null}
          </>
        }
      />

      <section className="section shell sectionAfterHero">
        <div className="projectOverviewGrid">
          <article className="overviewCard">
            <span className="kicker">Project status</span>
            <StateBadge state={project.evidenceState} />
            <h2>{project.status}</h2>
          </article>
          <article className="overviewCard">
            <span className="kicker">Problem</span>
            <p>{project.problem}</p>
          </article>
          <article className="overviewCard">
            <span className="kicker">What exists</span>
            <p>{project.outcome}</p>
          </article>
        </div>
      </section>

      <section className="section shell projectApproach">
        <SectionHeader kicker="Approach" title="How I worked the problem" />
        <p>{project.approach}</p>
        <div className="tags largeTags">
          {project.capabilities.map((item) => <span key={item}>{item}</span>)}
        </div>
      </section>

      <section className="section band">
        <div className="shell">
          <SectionHeader
            kicker="Verified facts"
            title="What I can support"
          />
          <div className="factGrid">
            {project.verifiedFacts.map((fact) => (
              <div className="factItem" key={fact}>
                <CheckCircle2 size={20} />
                <p>{fact}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {project.detailSections ? (
        <section className="section shell">
          <SectionHeader
            kicker="Implementation decisions"
            title="Architecture, privacy, and verification"
          />
          <div className="projectDetailSections">
            {project.detailSections.map((section) => (
              <article key={section.title}>
                <div className="projectDetailSectionHeading">
                  <div>
                    <span className="kicker">{section.kicker}</span>
                    <h3>{section.title}</h3>
                  </div>
                  <StateBadge state={section.state} />
                </div>
                <p>{section.summary}</p>
                <ul className="cleanList">
                  {section.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {project.initiative ? (
        <section className="section band">
          <div className="shell">
            <SectionHeader
              kicker="Implementation phases"
              title="One initiative, five evidence gates"
              copy={`Started ${project.initiative.started}. ${project.initiative.currentPhase} is the current phase.`}
            />
            <div className="initiativePhaseGrid">
              {project.initiative.phases.map((phase) => (
                <article className={`initiativePhase phase-${phase.status.toLowerCase()}`} key={phase.phase}>
                  <div className="roadmapMeta">
                    <span>Phase {phase.phase}</span>
                    <StateBadge
                      state={phaseEvidenceState[phase.status]}
                      label={phase.status}
                    />
                  </div>
                  <h3>{phase.title}</h3>
                  <p>{phase.summary}</p>
                  {phase.ticket ? <small>{phase.ticket}</small> : null}
                  <ul className="cleanList">
                    {phase.milestones.map((milestone) => (
                      <li key={milestone}>{milestone}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="section shell">
        <SectionHeader
          kicker="Project proof"
          title={project.liveUrl ? "Live beta" : project.media?.length ? "Reviewed artifacts" : "Still building"}
        />
        {project.media?.length ? (
          <div className="mediaGrid">
            {project.media.map((item) => (
              <figure className="mediaCard" key={item.src}>
                <img src={item.src} alt={item.alt} loading="lazy" />
                <figcaption>{item.caption}</figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <div className="evidencePlaceholder" role="status">
            <ImageOff size={30} aria-hidden="true" />
            <div>
              <h2>{project.proofNote}</h2>
            </div>
          </div>
        )}
      </section>

      {project.subsystems ? (
        <section className="section shell">
          <SectionHeader
            kicker="Subsystem status"
            title="Built and planned components"
          />
          <div className="capabilityGrid">
            {project.subsystems.slice(0, 3).map((subsystem) => (
              <article className="capabilityCard" key={subsystem.name}>
                <StateBadge state={subsystem.state} />
                <h3>{subsystem.name}</h3>
                <p>{subsystem.detail}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="section shell projectConnections">
        <article>
          <SectionHeader kicker="Technology" title="Stack" />
          <div className="tags largeTags">
            {project.stack.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </article>
        <article>
          <SectionHeader kicker="Role relevance" title="Where it fits" />
          <div className="roleLinkList">
            {project.roleLinks.map((role) => (
              <a
                href={`/roles/${roleSlugs[role]}`}
                key={role}
                onClick={() =>
                  trackPortfolioEvent("Role Lens Opened", {
                    role: roleSlugs[role],
                    location: "project",
                  })
                }
              >
                {role}
              </a>
            ))}
          </div>
        </article>
      </section>

      <section className="section band">
        <div className="shell nextProofLine">
          <span className="kicker">Next proof</span>
          <p>{project.nextProof}</p>
        </div>
      </section>
    </>
  );
}
