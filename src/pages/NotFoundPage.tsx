import { LinkButton, PageHero } from "../components/UI";

export function NotFoundPage() {
  return (
    <PageHero
      eyebrow="404"
      title="That page isn’t here."
      copy="Return home or explore the current projects and role fit."
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
