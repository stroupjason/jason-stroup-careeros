import { BookOpen, Github, Linkedin, Workflow } from "lucide-react";
import { PageHero, SectionHeader } from "../components/UI";
import { profile } from "../data/site";

export function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Jason"
        title="The technical professional between the customer, the data, and the codebase."
        copy={profile.coreIdentity}
      />
      <section className="section shell sectionAfterHero aboutPageGrid">
        <article>
          <SectionHeader kicker="Current strength" title="Customer context plus technical depth" />
          <p>
            My strongest professional evidence comes from owning difficult SaaS
            problems across customer communication, APIs, integrations, logs,
            data flows, observability, documentation, and cross-functional
            escalation.
          </p>
          <p>
            That experience gives me a practical view of how systems fail in the
            real world and how technical decisions affect customers, support
            teams, product teams, and business outcomes.
          </p>
        </article>
        <article>
          <SectionHeader kicker="Direction" title="Expand the ownership boundary" />
          <p>
            I am developing deeper backend, testing, deployment, analytics, and
            implementation evidence. The goal is not to abandon customer-facing
            work. It is to own more of the complete path from ambiguity to
            architecture, delivery, validation, and measurable value.
          </p>
          <p>
            CareerOS is both the organizing system for that journey and a product
            demonstrating how I approach a real problem with domain modeling,
            software, privacy, documentation, and business thinking.
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
          <a href="/journal">
            <BookOpen size={20} /> Learning journal
          </a>
        </div>
      </section>
    </>
  );
}
