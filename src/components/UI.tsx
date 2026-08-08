import type { ReactNode } from "react";
import { ArrowUpRight, Github } from "lucide-react";
import { trackPortfolioEvent } from "../analytics";
import { evidenceStates, type EvidenceState, type Project, type RoleLens } from "../data/site";

export function StateBadge({
  state,
  label = state,
}: {
  state: EvidenceState;
  label?: string;
}) {
  return <span className={`stateBadge state-${state.toLowerCase()}`}>{label}</span>;
}

export function PageHero({
  eyebrow,
  title,
  copy,
  actions,
}: {
  eyebrow: string;
  title: ReactNode;
  copy: string;
  actions?: ReactNode;
}) {
  return (
    <section className="pageHero shell">
      <span className="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      <p>{copy}</p>
      {actions ? <div className="heroActions">{actions}</div> : null}
    </section>
  );
}

export function SectionHeader({
  kicker,
  title,
  copy,
}: {
  kicker: string;
  title: string;
  copy?: string;
}) {
  return (
    <header className="sectionHeader">
      <div>
        <span className="kicker">{kicker}</span>
        <h2>{title}</h2>
      </div>
      {copy ? <p>{copy}</p> : null}
    </header>
  );
}

export function ProjectCard({
  project,
  location = "projects",
}: {
  project: Project;
  location?: "home" | "projects" | "role-lens";
}) {
  return (
    <article className="projectCard">
      <div className="cardTop">
        <span>{project.type}</span>
        <StateBadge state={project.evidenceState} />
      </div>
      <h3>{project.title}</h3>
      <p>{project.summary}</p>
      <div className="tags">
        {project.stack.slice(0, 6).map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
      <div className="projectFooter">
        <small>{project.status}</small>
        <div className="projectActions">
          <a
            href={`/projects/${project.slug}`}
            onClick={() =>
              trackPortfolioEvent("Project Opened", {
                project: project.slug,
                location,
              })
            }
          >
            View project <ArrowUpRight size={16} aria-hidden="true" />
          </a>
          {location === "projects" && project.sourceUrl ? (
            <a href={project.sourceUrl} target="_blank" rel="noreferrer">
              Source <Github size={16} aria-hidden="true" />
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function RoleCard({ role }: { role: RoleLens }) {
  return (
    <article className="roleLensCard">
      <div className="cardTop">
        <span>{role.group}</span>
        <b>{role.fit}</b>
      </div>
      <h3>{role.title}</h3>
      <p>{role.headline}</p>
      <small>{role.priority}</small>
      <a
        href={`/roles/${role.slug}`}
        onClick={() =>
          trackPortfolioEvent("Role Lens Opened", {
            role: role.slug,
            location: "roles",
          })
        }
      >
        View role fit <ArrowUpRight size={16} />
      </a>
    </article>
  );
}

export function EvidenceLegend() {
  return (
    <aside className="evidenceLegend" aria-label="Project and proof status">
      <strong>Project / proof status</strong>
      <div>
        {evidenceStates.map((item) => (
          <span key={item.state}>
            <StateBadge state={item.state} /> {item.definition}
          </span>
        ))}
      </div>
    </aside>
  );
}

export function LinkButton({
  href,
  children,
  secondary = false,
  external = false,
  analytics,
}: {
  href: string;
  children: ReactNode;
  secondary?: boolean;
  external?: boolean;
  analytics?: {
    destination: "projects" | "roles" | "contact" | "live-project";
    location: "home-hero" | "home-contact" | "project-hero" | "role-hero";
  };
}) {
  return (
    <a
      className={secondary ? "button secondary" : "button primary"}
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      onClick={() => {
        if (analytics) trackPortfolioEvent("Primary CTA Selected", analytics);
      }}
    >
      {children} <ArrowUpRight size={17} />
    </a>
  );
}
