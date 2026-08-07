import { EvidenceLegend, PageHero, ProjectCard, SectionHeader, StateBadge } from "../components/UI";
import { projects } from "../data/site";

export function ProjectsPage() {
  return (
    <>
      <PageHero
        eyebrow="Projects"
        title="Technical work with clear proof states."
        copy="I separate demonstrated work, active builds, and planned proof so each project is easy to evaluate."
      />
      <section className="section shell sectionAfterHero">
        <SectionHeader
          kicker="Featured work"
          title="Demonstrated and active"
          copy="Three projects show product thinking, computer vision, edge systems, and technical delivery."
        />
        <div className="projectGrid featuredProjectGrid">
          {projects.slice(0, 3).map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
        <article className="plannedProject">
          <div><StateBadge state="Planned" /><h2>Python/MongoDB Debugging Lab</h2></div>
          <p>A safe backend lab is specified but not built. It will demonstrate symptom-to-code tracing, tests, deployment, and validation.</p>
          <a href="/projects/python-mongodb-debugging-lab">View planned proof</a>
        </article>
        <EvidenceLegend />
      </section>
    </>
  );
}
