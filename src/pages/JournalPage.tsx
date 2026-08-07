import { BookOpen, FileText } from "lucide-react";
import { PageHero, SectionHeader } from "../components/UI";
import { journalEntries } from "../data/site";

export function JournalPage() {
  return (
    <>
      <PageHero
        eyebrow="Engineering journal"
        title="A visible history of how learning becomes capability."
        copy="The journal will document decisions, experiments, debugging lessons, architecture notes, project retrospectives, and evidence milestones without publishing employer-confidential details."
      />
      <section className="section shell sectionAfterHero">
        <SectionHeader
          kicker="Initial entries"
          title="Templates before invented accomplishments"
          copy="Draft and planned entries are labeled clearly until the underlying work exists."
        />
        <div className="journalGrid">
          {journalEntries.map((entry) => (
            <article className="journalCard" key={entry.title}>
              <div className="journalIcon">
                {entry.status === "Draft" ? <FileText /> : <BookOpen />}
              </div>
              <div className="cardTop">
                <span>{entry.date}</span>
                <b>{entry.status}</b>
              </div>
              <h3>{entry.title}</h3>
              <p>{entry.summary}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
