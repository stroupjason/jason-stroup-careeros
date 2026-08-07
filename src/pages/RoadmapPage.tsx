import { PageHero, SectionHeader } from "../components/UI";
import { roadmap } from "../data/site";

export function RoadmapPage() {
  return (
    <>
      <PageHero
        eyebrow="Public roadmap"
        title="Build the next proof in the right order."
        copy="CareerOS is live. The next priorities strengthen owned project evidence and backend delivery."
      />
      <section className="section shell sectionAfterHero">
        <SectionHeader
          kicker="Execution sequence"
          title="Public beta complete. Project proof next."
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
    </>
  );
}
