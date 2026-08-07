import { PageHero, ProjectCard, SectionHeader } from "../components/UI";
import { projects } from "../data/site";

export function ProjectsPage() {
  return (
    <>
      <PageHero
        eyebrow="Projects"
        title="Technical work with a reason to exist."
        copy="These projects demonstrate computer vision, edge and IoT systems, product thinking, backend debugging, analytics, and the ability to connect a problem to a working solution."
      />
      <section className="section shell sectionAfterHero">
        <SectionHeader
          kicker="Featured portfolio"
          title="Demonstrated, active, and next-build work"
          copy="Every project page separates verified facts, current evidence, planned work, and missing proof."
        />
        <div className="projectGrid">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>
    </>
  );
}
