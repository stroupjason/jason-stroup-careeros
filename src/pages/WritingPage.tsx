import { ArrowUpRight } from "lucide-react";
import { PageHero, SectionHeader } from "../components/UI";
import { publicationProfiles, writingEntries, writingThemes } from "../data/site";

function formatPublicationDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

export function WritingPage() {
  const featuredWriting = writingEntries.filter((entry) => entry.featured);

  return (
    <>
      <PageHero
        eyebrow="TECHNICAL WRITING"
        title="Turning complex technical work into useful, practical guidance."
        copy="I write about SaaS integrations, technical troubleshooting, APIs, application behavior, customer-facing engineering, and the lessons that emerge from solving real technical problems."
      />

      <section className="section shell sectionAfterHero">
        <SectionHeader
          kicker="Featured writing"
          title="Published technical guidance."
          copy="Evidence-backed writing grounded in technical investigation and customer outcomes."
        />
        <div className="writingGrid">
          {featuredWriting.map((entry) => (
            <article className="writingCard" key={entry.id}>
              <a
                href={entry.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Read ${entry.title} on ${entry.platform}`}
              >
                <div className="writingMeta">
                  <span>{entry.platform}</span>
                  {entry.publicationDate ? (
                    <time dateTime={entry.publicationDate}>
                      {formatPublicationDate(entry.publicationDate)}
                    </time>
                  ) : null}
                </div>
                <h3>{entry.title}</h3>
                <p>{entry.summary}</p>
                <div className="tags" aria-label="Article topics">
                  {entry.topics.map((topic) => (
                    <span key={topic}>{topic}</span>
                  ))}
                </div>
                <span className="writingAction">
                  Read on {entry.platform} <ArrowUpRight size={17} aria-hidden="true" />
                </span>
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="section band">
        <div className="shell">
          <SectionHeader
            kicker="Writing themes"
            title="Current evidence and future directions."
            copy="Published themes are separated from areas planned for continued writing."
          />
          <div className="writingThemes">
            {writingThemes.map((theme) => (
              <article key={theme.title}>
                <div>
                  <h3>{theme.title}</h3>
                  <span className={theme.status === "Published" ? "published" : "future"}>
                    {theme.status}
                  </span>
                </div>
                <p>{theme.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section shell">
        <SectionHeader
          kicker="Publication profiles"
          title="Follow the writing."
          copy="Verified profiles for published work and professional updates."
        />
        <div className="publicationProfiles">
          {publicationProfiles.map((profile) => (
            <a
              href={profile.url}
              target="_blank"
              rel="noopener noreferrer"
              key={profile.platform}
            >
              <span>
                <strong>{profile.platform}</strong>
                <small>{profile.description}</small>
              </span>
              <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          ))}
        </div>
      </section>

      <section className="section writingFuture">
        <div className="shell">
          <span className="kicker">Future writing</span>
          <h2>More practical notes will follow the work.</h2>
          <p>
            Future entries will document verified lessons from troubleshooting, integrations,
            application support, and software delivery as that evidence develops.
          </p>
        </div>
      </section>
    </>
  );
}
