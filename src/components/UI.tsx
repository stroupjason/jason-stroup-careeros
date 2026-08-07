import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { evidenceStates, type EvidenceState, type Project, type RoleLens } from "../data/site";

export function StateBadge({ state }: { state: EvidenceState }) {
  return <span className={`stateBadge state-${state.toLowerCase()}`}>{state}</span>;
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

export function ProjectCard({ project }: { project: Project }) {
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
        <a href={`/projects/${project.slug}`}>
          View project <ArrowUpRight size={16} />
        </a>
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
      <a href={`/roles/${role.slug}`}>
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
}: {
  href: string;
  children: ReactNode;
  secondary?: boolean;
  external?: boolean;
}) {
  return (
    <a
      className={secondary ? "button secondary" : "button primary"}
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
    >
      {children} <ArrowUpRight size={17} />
    </a>
  );
}
