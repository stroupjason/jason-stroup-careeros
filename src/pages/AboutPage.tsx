import { BookOpenCheck, Github, Linkedin, Workflow } from "lucide-react";
import { PageHero, SectionHeader } from "../components/UI";
import { profile } from "../data/site";

export function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="I work between the customer, the data, and the codebase."
        copy="I’m a customer-facing technical systems professional with deep experience in SaaS troubleshooting, integrations, observability, analytics, and customer ownership. Based in Fort Collins, Colorado, and open to remote opportunities."
      />
      <section className="section shell sectionAfterHero aboutPageGrid">
        <article>
          <SectionHeader kicker="Current strength" title="Customer context plus technical depth" />
          <p>
            I investigate difficult SaaS problems across APIs, integrations, logs,
            data flows, and runtime signals while keeping customers and internal teams aligned.
          </p>
        </article>
        <article>
          <SectionHeader kicker="Direction" title="Own more of the delivery path" />
          <p>
            I’m building deeper backend, testing, deployment, and implementation
            evidence so I can carry customer ambiguity farther into delivery and validation.
          </p>
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
