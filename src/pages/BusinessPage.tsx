import { LinkButton, PageHero, SectionHeader } from "../components/UI";
import { businessProfile, profile } from "../data/site";

export function BusinessPage() {
  return (
    <>
      <PageHero
        eyebrow="Business website in development"
        title={businessProfile.name}
        copy="Custom software, platform automation, and marketing built around real business needs."
        actions={
          <>
            <LinkButton href={profile.linkedin} external>Discuss a project on LinkedIn</LinkButton>
            <LinkButton href="/case-studies" secondary>Explore my professional work</LinkButton>
          </>
        }
      />
      <section className="section shell sectionAfterHero aboutPageGrid">
        <article>
          <SectionHeader kicker="Engineering" title="Software and automation" />
          <p>{businessProfile.engineering}</p>
          <p>{businessProfile.principles}</p>
        </article>
        <article>
          <SectionHeader kicker="Growth" title="Custom marketing and advertising" />
          <p>{businessProfile.marketing}</p>
          <p>{businessProfile.markets}</p>
        </article>
      </section>
      <section className="section shell">
        <SectionHeader kicker="Next priority" title="A dedicated business home" />
        <p>The dedicated site for {businessProfile.domain} is planned. Service packages, original content, and a clear project-inquiry path come next. This portfolio remains focused on my experience and evidence; LinkedIn is the current way to discuss a project.</p>
      </section>
    </>
  );
}
