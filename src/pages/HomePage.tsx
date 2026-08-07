import type { ReactNode } from "react";
import { ArrowUpRight, BarChart3, Braces, Headphones, Users } from "lucide-react";
import { projects, roleLenses } from "../data/site";
import { LinkButton, ProjectCard, SectionHeader } from "../components/UI";

const featuredProjects = projects.filter((project) =>
  ["careeros", "automatic-nerf-turret", "rallye-control"].includes(project.slug),
);

const roleSelector = [
  { slug: "senior-technical-support-engineer", label: "Senior TSE", context: "Strong current fit", strong: true },
  { slug: "technical-account-manager", label: "TAM", context: "Strong adjacent fit", strong: true },
  { slug: "customer-success-engineer", label: "CSE", context: "Strong adjacent fit", strong: true },
  { slug: "data-analytics", label: "Data Analytics", context: "Transferable secondary", strong: false },
  { slug: "application-engineer", label: "Application Engineer", context: "Engineering bridge", strong: false },
  { slug: "software-engineer", label: "Software Engineer", context: "Active development path", strong: false },
];

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

      <section className="section shell homeRoleSelector">
        <SectionHeader
          kicker="Role-specific view"
          title="Choose the view that matches your need."
          copy="Choose a role to see the experience, projects, and skills most relevant to your search."
        />
        <div className="homeRoleSelectorGrid">
          {roleSelector.map((item) => {
            const role = roleLenses.find((candidate) => candidate.slug === item.slug)!;
            return (
              <a
                className={`homeRoleSelectorCard${item.strong ? " strongFit" : ""}`}
                href={`/roles/${role.slug}`}
                key={role.slug}
              >
                <span>{item.label}</span>
                <small>{item.context}</small>
                <ArrowUpRight size={17} aria-hidden="true" />
              </a>
            );
          })}
        </div>
      </section>

      <section className="section band">
        <div className="shell">
          <SectionHeader kicker="What I do" title="Customer context, technical depth, clear action." />
          <div className="archetypeGrid compactArchetypeGrid">
            <Focus icon={<Headphones />} title="Troubleshoot" copy="Trace complex SaaS, API, integration, and data issues." />
            <Focus icon={<Users />} title="Own the customer path" copy="Set expectations and coordinate across technical teams." />
            <Focus icon={<BarChart3 />} title="Explain the signal" copy="Use logs, dashboards, SQL, and operational context." />
            <Focus icon={<Braces />} title="Build forward" copy="Turn investigations into maintainable software." />
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
