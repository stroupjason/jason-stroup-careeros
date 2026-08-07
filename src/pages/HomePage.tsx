import type { ReactNode } from "react";
import { BarChart3, Braces, Headphones, Users } from "lucide-react";
import { profile, projects, roleLenses } from "../data/site";
import { LinkButton, ProjectCard, SectionHeader } from "../components/UI";

const featuredProjects = projects.filter((project) =>
  ["careeros", "automatic-nerf-turret", "rallye-control"].includes(project.slug),
);

const featuredRoles = roleLenses.filter((role) =>
  ["senior-technical-support-engineer", "technical-account-manager", "customer-success-engineer"].includes(
    role.slug,
  ),
);

export function HomePage() {
  return (
    <>
      <section className="hero shell">
        <div className="eyebrow">
          <span className="pulse" /> Technical Support Engineer · Northern Colorado
        </div>
        <h1>I turn complex customer problems into clear technical solutions.</h1>
        <p className="heroCopy">
          I specialize in SaaS troubleshooting, integrations, observability,
          analytics, and customer ownership while building deeper backend delivery skills.
        </p>
        <div className="heroActions">
          <LinkButton href="/projects">View projects</LinkButton>
          <LinkButton href="/roles" secondary>
            Explore role fit
          </LinkButton>
        </div>
      </section>

      <section className="section band">
        <div className="shell">
          <SectionHeader kicker="What I do" title="Customer context, technical depth, clear action." />
          <div className="archetypeGrid compactArchetypeGrid">
            <Focus icon={<Headphones />} title="Troubleshoot" copy="Trace complex SaaS, API, integration, and data issues." />
            <Focus icon={<Users />} title="Own the customer path" copy="Set expectations and coordinate across technical teams." />
            <Focus icon={<BarChart3 />} title="Explain the signal" copy="Use logs, dashboards, SQL, and operational context." />
            <Focus icon={<Braces />} title="Build forward" copy="Turn investigations into tested backend delivery." />
          </div>
        </div>
      </section>

      <section className="section shell">
        <SectionHeader
          kicker="Featured projects"
          title="Proof through products and prototypes."
          copy="CareerOS is live; the Nerf Turret is a demonstrated prototype; Rallye Control is an active build."
        />
        <div className="projectGrid featuredProjectGrid">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>

      <section className="section band">
        <div className="shell">
          <SectionHeader
            kicker="Role alignment"
            title="Strong now. Deliberate about what comes next."
            copy="Senior Technical Support Engineer is my strongest fit. TAM and CSE are close adjacent paths; analytics is a secondary strength."
          />
          <div className="compactRoleLinks">
            {featuredRoles.map((role) => <a href={`/roles/${role.slug}`} key={role.slug}>{role.title}</a>)}
          </div>
          <div className="inlineCallout">
            <Braces size={22} />
            <div>
              <strong>Growth direction</strong>
              <p>Application Engineering is my active bridge toward a long-term Forward Deployed Engineer path. Data Science remains exploratory.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section shell">
        <article className="nextAction contactAction">
          <div>
            <span className="kicker">Let’s connect</span>
            <h2>See my work and connect.</h2>
            <p>Explore the evidence, then reach me through LinkedIn or review my public code on GitHub.</p>
            <div className="heroActions"><LinkButton href="/resume-contact">Contact</LinkButton></div>
          </div>
        </article>
      </section>
    </>
  );
}

function Focus({
  icon,
  title,
  copy,
}: {
  icon: ReactNode;
  title: string;
  copy: string;
}) {
  return (
    <article className="archetypeCard compactFocus">
      <div>{icon}</div>
      <h3>{title}</h3>
      <p>{copy}</p>
    </article>
  );
}
