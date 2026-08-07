import { Target } from "lucide-react";
import { PageHero, SectionHeader } from "../components/UI";
import { nextAction, roadmap } from "../data/site";

export function RoadmapPage() {
  return (
    <>
      <PageHero
        eyebrow="Public roadmap"
        title="Ship proof in the right order."
        copy="The roadmap protects the immediate portfolio launch while keeping backend development and the long-term FDE path focused."
      />
      <section className="section shell sectionAfterHero">
        <SectionHeader
          kicker="Execution sequence"
          title="Portfolio first. Evidence next. Platform later."
          copy="A small deployed product and credible artifacts are more valuable than an elaborate Gantt chart or unfinished HR platform."
        />
        <div className="roadmap">
          {roadmap.map((item) => (
            <div className={`roadmapItem ${item.status}`} key={item.phase}>
              <div className="phase">{item.phase}</div>
              <div>
                <div className="roadmapMeta">
                  <span>{item.date}</span>
                  <b>{item.status}</b>
                </div>
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="section shell">
        <article className="nextAction">
          <div className="nextActionIcon">
            <Target size={26} />
          </div>
          <div>
            <span className="kicker">Current decision</span>
            <h2>{nextAction.title}</h2>
            <p>{nextAction.action}</p>
            <small>{nextAction.why}</small>
          </div>
        </article>
      </section>
    </>
  );
}
