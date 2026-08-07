import { AlertCircle, CheckCircle2, Search, Target } from "lucide-react";
import { LinkButton, PageHero, ProjectCard, SectionHeader } from "../components/UI";
import { projects, type RoleLens } from "../data/site";

export function RoleDetailPage({ role }: { role: RoleLens }) {
  const relevantProjects = projects.filter((project) =>
    role.relevantProjects.includes(project.slug),
  );

  return (
    <>
      <PageHero
        eyebrow={`${role.group} role lens · ${role.fit}`}
        title={role.title}
        copy={role.headline}
        actions={
          <>
            <LinkButton href="/roles" secondary>
              All role lenses
            </LinkButton>
            <LinkButton href="/projects">See supporting projects</LinkButton>
          </>
        }
      />

      <section className="section shell sectionAfterHero">
        <div className="roleSummaryGrid">
          <article className="roleSummaryMain">
            <span className="kicker">Positioning</span>
            <h2>{role.priority}</h2>
            <p>{role.overview}</p>
          </article>
          <article className="recruiterTakeaway">
            <Search size={24} />
            <span className="kicker">Recruiter takeaway</span>
            <p>{role.recruiterTakeaway}</p>
          </article>
        </div>
      </section>

      <section className="section band">
        <div className="shell">
          <SectionHeader
            kicker="Current evidence"
            title="Why this role is a credible lens"
            copy="The page starts with evidence already demonstrated rather than desired future skills."
          />
          <div className="factGrid">
            {role.demonstratedEvidence.map((evidence) => (
              <div className="factItem" key={evidence}>
                <CheckCircle2 size={20} />
                <p>{evidence}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section shell">
        <SectionHeader
          kicker="Project proof"
          title="The work that supports this lens"
          copy="A role page is only useful when it links back to concrete projects and evidence."
        />
        <div className="projectGrid">
          {relevantProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>

      <section className="section band">
        <div className="shell twoColumnSection">
          <article>
            <SectionHeader
              kicker="Gap analysis"
              title="What prevents a stronger claim today"
            />
            <div className="warningList">
              {role.gaps.map((gap) => (
                <div key={gap}>
                  <AlertCircle size={19} />
                  <p>{gap}</p>
                </div>
              ))}
            </div>
          </article>
          <article>
            <SectionHeader
              kicker="Truth boundary"
              title="What this page does not claim"
            />
            <ul className="cleanList">
              {role.notClaimed.map((claim) => (
                <li key={claim}>{claim}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="section shell">
        <article className="nextAction compactAction">
          <div className="nextActionIcon">
            <Target size={25} />
          </div>
          <div>
            <span className="kicker">Highest-value proof for this role</span>
            <h2>Build the next missing artifact</h2>
            <p>{role.nextProof}</p>
            <small>
              Keywords supported by this lens: {role.keywords.join(" · ")}
            </small>
          </div>
        </article>
      </section>
    </>
  );
}
