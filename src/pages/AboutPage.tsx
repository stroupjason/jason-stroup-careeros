import { BookOpenCheck, Github, Linkedin, Workflow } from "lucide-react";
import { PageHero, SectionHeader } from "../components/UI";
import { businessProfile, profile } from "../data/site";

export function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="I work between the customer, the data, and the codebase."
        copy={`I’m the founder of ${businessProfile.name}, building software, platform automation, and data-driven solutions from ${profile.location}. ${profile.availability}.`}
      />
      <section className="section shell sectionAfterHero aboutPageGrid">
        <article>
          <SectionHeader kicker={`Founded ${businessProfile.founded}`} title={businessProfile.name} />
          <p>{businessProfile.engineering}</p>
          <p>{businessProfile.principles}</p>
          <p>A dedicated business site is next. <a href="/business">Explore the business direction</a> or <a href="/case-studies">review my professional engagements</a>.</p>
        </article>
        <article>
          <SectionHeader kicker="Services" title="Custom marketing and advertising" />
          <p>{businessProfile.marketing}</p>
          <p>{businessProfile.markets}</p>
        </article>
      </section>
      <section className="section band">
        <div className="shell aboutLinks">
          <a href={profile.linkedin} target="_blank" rel="noreferrer">
            <Linkedin size={20} /> LinkedIn
          </a>
          <a href={profile.github} target="_blank" rel="noreferrer">
            <Github size={20} /> GitHub
          </a>
          <a href="/projects">
            <Workflow size={20} /> Projects
          </a>
          <a href="/skills">
            <BookOpenCheck size={20} /> Skills & learning
          </a>
        </div>
      </section>
    </>
  );
}
