import { CheckCircle2, Search } from "lucide-react";
import { LinkButton, PageHero, SectionHeader, StateBadge } from "../components/UI";
import { projects, type RoleLens } from "../data/site";

export function RoleDetailPage({ role }: { role: RoleLens }) {
  const relevantProjects = projects.filter((project) =>
    role.relevantProjects.includes(project.slug),
  );

  return (
    <>
      <PageHero
        eyebrow={role.eyebrow ?? `${role.group} fit · ${role.fit}`}
        title={role.title}
        copy={role.headline}
        actions={
          <>
            <LinkButton href="/roles" secondary>All role fit</LinkButton>
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
            <p className="roleContribution">{role.contribution}</p>
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
            title="Why this fit is credible"
          />
          <div className="factGrid">
            {role.demonstratedEvidence.slice(0, 4).map((evidence) => (
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
          title="Supporting work"
        />
        <div className="compactProjectLinks">
          {relevantProjects.map((project) => (
            <a href={`/projects/${project.slug}`} key={project.slug}>
              <span>{project.shortTitle}</span><StateBadge state={project.evidenceState} />
            </a>
          ))}
        </div>
      </section>

      <section className="section band">
        <div className="shell stillBuilding">
          <SectionHeader kicker="Still building" title="The proof that would strengthen this fit" />
          <ul className="cleanList">{role.gaps.slice(0, role.gapDisplayLimit ?? 3).map((gap) => <li key={gap}>{gap}</li>)}</ul>
          <div className="nextProofLine"><span className="kicker">Next proof</span><p>{role.nextProof}</p></div>
          <small>{role.scopeNote}</small>
        </div>
      </section>
    </>
  );
}
