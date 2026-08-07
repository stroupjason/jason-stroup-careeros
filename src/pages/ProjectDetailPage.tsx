import { AlertCircle, CheckCircle2, FolderOpen, ImageOff } from "lucide-react";
import { LinkButton, PageHero, SectionHeader, StateBadge } from "../components/UI";
import type { Project } from "../data/site";

const roleSlugs: Record<string, string> = {
  "Senior TSE": "senior-technical-support-engineer",
  TAM: "technical-account-manager",
  CSE: "customer-success-engineer",
  "Data Analytics": "data-analytics",
  "Application Engineer": "application-engineer",
  FDE: "forward-deployed-engineer",
  "Data Science": "data-science",
};

export function ProjectDetailPage({ project }: { project: Project }) {
  return (
    <>
      <PageHero
        eyebrow={`${project.type} · ${project.status}`}
        title={project.title}
        copy={project.summary}
        actions={
          <LinkButton href="/projects" secondary>
            All projects
          </LinkButton>
        }
      />

      <section className="section shell sectionAfterHero">
        <div className="projectOverviewGrid">
          <article className="overviewCard">
            <span className="kicker">Evidence state</span>
            <StateBadge state={project.evidenceState} />
            <h2>{project.status}</h2>
            <p>
              This label describes the current public evidence—not the ambition
              of the project.
            </p>
          </article>
          <article className="overviewCard">
            <span className="kicker">Problem</span>
            <h2>What needed to be solved</h2>
            <p>{project.problem}</p>
          </article>
          <article className="overviewCard">
            <span className="kicker">Outcome</span>
            <h2>What exists today</h2>
            <p>{project.outcome}</p>
          </article>
        </div>
      </section>

      <section className="section band">
        <div className="shell">
          <SectionHeader
            kicker="Verified facts"
            title="What this portfolio can safely claim"
            copy="These statements are intentionally narrower than a polished marketing story."
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

      <section className="section shell">
        <SectionHeader
          kicker="Owned evidence"
          title="Artifacts, not invented proof"
          copy="Only personally owned, reviewed media belongs here. Reconstruction material must remain labeled as reconstruction."
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
              <h2>Original artifact not added yet</h2>
              <p>
                No photograph, video, source archive, or reviewed reconstruction is
                currently available. Add approved files under <code>{project.mediaPath}</code>.
              </p>
            </div>
          </div>
        )}
      </section>

      {project.subsystems ? (
        <section className="section shell">
          <SectionHeader
            kicker="Subsystem evidence"
            title="Active architecture without pretending everything is finished"
            copy="Each subsystem earns its own evidence state."
          />
          <div className="capabilityGrid">
            {project.subsystems.map((subsystem) => (
              <article className="capabilityCard" key={subsystem.name}>
                <StateBadge state={subsystem.state} />
                <h3>{subsystem.name}</h3>
                <p>{subsystem.detail}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="section shell twoColumnSection">
        <article>
          <SectionHeader kicker="Technology" title="Stack and systems" />
          <div className="tags largeTags">
            {project.stack.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </article>
        <article>
          <SectionHeader kicker="Capability" title="What the project demonstrates" />
          <ul className="cleanList capabilityLinks">
            {project.capabilities.map((item) => (
              <li key={item}>
                <a href="/#capability-evidence">{item}</a>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="section band">
        <div className="shell twoColumnSection">
          <article>
            <SectionHeader
              kicker="Role relevance"
              title="Where this evidence matters"
            />
            <div className="roleLinkList">
              {project.roleLinks.map((role) => (
                <a href={`/roles/${roleSlugs[role]}`} key={role}>
                  {role}
                </a>
              ))}
            </div>
          </article>
          <article>
            <SectionHeader
              kicker="Evidence gaps"
              title="What still needs to be recovered or built"
            />
            <div className="warningList">
              {project.unknowns.map((unknown) => (
                <div key={unknown}>
                  <AlertCircle size={19} />
                  <p>{unknown}</p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="section shell">
        <article className="nextAction compactAction">
          <div className="nextActionIcon">
            <FolderOpen size={25} />
          </div>
          <div>
            <span className="kicker">Next portfolio step</span>
            <h2>Add one original artifact</h2>
            <p>
              Recover a photograph, source file, or demonstration—or create an
              original architecture diagram and retrospective based only on
              verified facts.
            </p>
            <small>
              The project becomes more credible through evidence, not through
              more ambitious copy.
            </small>
          </div>
        </article>
      </section>
    </>
  );
}
