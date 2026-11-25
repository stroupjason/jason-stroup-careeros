import { EvidenceLegend, LinkButton, PageHero, ProjectCard, SectionHeader, StateBadge } from "../components/UI";
import { projects } from "../data/site";

export function ProjectsPage() {
  const activeProjects = projects.filter((project) => project.evidenceState !== "Planned");
  const plannedProjects = projects.filter((project) => project.evidenceState === "Planned");

  return (
    <>
      <PageHero
        eyebrow="Projects"
        title="Technical work with clear proof states."
        copy="I separate demonstrated work, active builds, and planned proof so each project is easy to evaluate."
        actions={<LinkButton href="/case-studies" secondary>Professional engagements</LinkButton>}
      />
      <section className="section shell sectionAfterHero">
        <SectionHeader
          kicker="Featured work"
          title="Demonstrated and active"
          copy="Products, personal builds, and anonymized professional work show how I approach technical delivery."
        />
        <div className="projectGrid projectCollectionGrid">
          {activeProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
        {plannedProjects.map((project) => (
          <article className="plannedProject" key={project.slug}>
            <div><StateBadge state="Planned" /><h2>{project.title}</h2></div>
            <p>{project.summary}</p>
            <a href={`/projects/${project.slug}`}>View planned proof</a>
          </article>
        ))}
        <EvidenceLegend />
      </section>
    </>
  );
}
