import { LinkButton, PageHero } from "../components/UI";

export function NotFoundPage() {
  return (
    <PageHero
      eyebrow="404"
      title="This evidence path does not exist yet."
      copy="Return to the portfolio or explore the current projects and role lenses."
      actions={
        <>
          <LinkButton href="/">Home</LinkButton>
          <LinkButton href="/projects" secondary>
            Projects
          </LinkButton>
        </>
      }
    />
  );
}
