import { LinkButton, PageHero, RoleCard, SectionHeader } from "../components/UI";
import { roleLenses } from "../data/site";

export function RolesPage() {
  const priorityRoles = roleLenses.filter((role) =>
    ["senior-technical-support-engineer", "technical-account-manager", "customer-success-engineer"].includes(role.slug),
  );
  const analytics = roleLenses.find((role) => role.slug === "data-analytics")!;
  const directions = roleLenses.filter((role) => ["application-engineer", "forward-deployed-engineer", "data-science"].includes(role.slug));

  return (
    <>
      <PageHero
        eyebrow="Role Fit"
        title="Where my experience fits now—and where it is growing."
        copy="I lead with customer-facing technical depth, then show adjacent and longer-term paths without treating every role as equally mature."
        actions={<LinkButton href="/skills" secondary>Review skills & learning</LinkButton>}
      />
      <section className="section shell sectionAfterHero">
        <SectionHeader kicker="Strongest alignment" title="Customer-facing technical roles" copy="Senior TSE is the clearest fit; TAM and CSE are strong adjacent paths." />
        <div className="roleGrid priorityRoleGrid">{priorityRoles.map((role) => <RoleCard key={role.slug} role={role} />)}</div>
      </section>
      <section className="section band"><div className="shell">
        <SectionHeader kicker="Secondary strength" title="Data Analytics" copy="SQL, dashboards, product data, and operational context support a credible secondary lens." />
        <div className="singleRole"><RoleCard role={analytics} /></div>
      </div></section>
      <section className="section shell">
        <SectionHeader kicker="Where I’m heading" title="Engineering delivery, then forward deployment" copy="These paths are roadmaps, not current-role claims." />
        <div className="directionList">{directions.map((role) => <a href={`/roles/${role.slug}`} key={role.slug}><span>{role.title}</span><small>{role.priority}</small></a>)}</div>
      </section>
    </>
  );
}
