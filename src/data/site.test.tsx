import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ProjectCard } from "../components/UI";
import { ProjectDetailPage } from "../pages/ProjectDetailPage";
import { ProjectsPage } from "../pages/ProjectsPage";
import { projects } from "./site";

const careerOS = projects.find((project) => project.slug === "careeros")!;
const nerfTurret = projects.find((project) => project.slug === "automatic-nerf-turret")!;

describe("public project source proof", () => {
  it("assigns a verified source only to CareerOS", () => {
    expect(careerOS.sourceUrl).toBe("https://github.com/stroupjason/jason-stroup-careeros");
    expect(careerOS.ownership?.statement).toBe("Built and operated by Jason Stroup.");
    expect(projects.filter((project) => project.sourceUrl)).toEqual([careerOS]);
  });

  it("renders secure source access and ownership on the CareerOS detail page", () => {
    const markup = renderToStaticMarkup(<ProjectDetailPage project={careerOS} />);

    expect(markup).toContain("View source on GitHub");
    expect(markup).toContain("Built and operated by Jason Stroup.");
    expect(markup).toContain('target="_blank"');
    expect(markup).toContain('rel="noreferrer"');
    expect(markup).toContain("CareerOS Learning &amp; Delivery project");
    expect(markup).not.toContain("/admin");
  });

  it("keeps source actions off projects without a verified repository", () => {
    const detailMarkup = renderToStaticMarkup(<ProjectDetailPage project={nerfTurret} />);
    const cardMarkup = renderToStaticMarkup(<ProjectCard project={nerfTurret} />);

    expect(detailMarkup).not.toContain("View source on GitHub");
    expect(cardMarkup).not.toContain(">Source ");
  });

  it("shows the compact source action only in the primary projects experience", () => {
    const projectsMarkup = renderToStaticMarkup(<ProjectsPage />);
    const homeCardMarkup = renderToStaticMarkup(
      <ProjectCard project={careerOS} location="home" />,
    );

    expect(projectsMarkup).toContain(">Source ");
    expect(projectsMarkup).toContain('target="_blank"');
    expect(homeCardMarkup).not.toContain(">Source ");
  });
});
