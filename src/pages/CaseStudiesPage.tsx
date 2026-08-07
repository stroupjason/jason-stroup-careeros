import { ArrowUpRight } from "lucide-react";
import { PageHero, SectionHeader } from "../components/UI";
import { caseStudies } from "../data/site";

export function CaseStudiesPage() {
  return (
    <>
      <PageHero
        eyebrow="Case studies"
        title="Problem → investigation → system → evidence."
        copy="The case-study system turns projects and public-safe technical lessons into a repeatable story a recruiter or hiring manager can evaluate."
      />
      <section className="section shell sectionAfterHero">
        <SectionHeader
          kicker="Current pipeline"
          title="Honest status, not polished fiction"
          copy="Each case study stays visibly labeled until its artifacts, diagrams, code, and outcomes are ready."
        />
        <div className="caseStudyGrid">
          {caseStudies.map((study) => (
            <article className="caseStudyCard" key={study.title}>
              <span>{study.state}</span>
              <h3>{study.title}</h3>
              <p>{study.summary}</p>
              <a href={study.href}>
                View project evidence <ArrowUpRight size={16} />
              </a>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
