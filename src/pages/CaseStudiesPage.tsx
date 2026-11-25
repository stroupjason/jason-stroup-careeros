import { PageHero, ProjectCard } from "../components/UI";
import { professionalEngagements } from "../data/site";

export function CaseStudiesPage() {
  return (
    <>
      <PageHero
        eyebrow="Professional engagements"
        title="From ambiguous problems to practical results."
        copy="My contributions across data interpretation, incident automation, operational reporting, and cybersecurity SaaS."
      />
      <section className="section shell sectionAfterHero">
        <p className="engagementNote">These are anonymized professional engagements, not a Stroup Software Solutions client list or client endorsements. Summaries reflect my account of the work; public supporting artifacts and quantified outcomes are pending.</p>
        <div className="projectGrid">
          {professionalEngagements.map((project) => <ProjectCard key={project.slug} project={project} />)}
        </div>
      </section>
    </>
  );
}
