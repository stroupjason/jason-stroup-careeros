import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ProjectCard } from "../components/UI";
import { ProjectDetailPage } from "../pages/ProjectDetailPage";
import { ProjectsPage } from "../pages/ProjectsPage";
import { BusinessPage } from "../pages/BusinessPage";
import { CaseStudiesPage } from "../pages/CaseStudiesPage";
import { businessProfile, professionalEngagements, projects, roleLenses } from "./site";

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

describe("anonymized professional engagement boundaries", () => {
  it("exposes four distinct summaries with explicit evidence gaps and no unverified proof links", () => {
    expect(professionalEngagements).toHaveLength(4);
    expect(new Set(projects.map((project) => project.slug)).size).toBe(projects.length);
    for (const engagement of professionalEngagements) {
      expect(projects).toContain(engagement);
      expect(engagement.professionalEngagement).toBe(true);
      expect(engagement.unknowns.length).toBeGreaterThan(0);
      expect(engagement.sourceUrl).toBeUndefined();
      expect(engagement.liveUrl).toBeUndefined();
      const markup = renderToStaticMarkup(<ProjectDetailPage project={engagement} />);
      expect(markup).toContain("Anonymized professional account");
      expect(markup).toContain("Public artifacts pending");
      expect(markup).not.toContain("Verified facts");
    }
  });

  it("keeps the professional roster separate from company clients and the business site honestly planned", () => {
    expect(renderToStaticMarkup(<CaseStudiesPage />)).toContain("not a Stroup Software Solutions client list");
    const markup = renderToStaticMarkup(<BusinessPage />);
    expect(businessProfile.domain).toBe("stroup-software-solutions.com");
    expect(markup).toContain("Business website in development");
    expect(markup).toContain("Discuss a project on LinkedIn");
    expect(markup).not.toContain("<form");
  });

  it("keeps role project references resolvable and Data Science exploratory", () => {
    for (const role of roleLenses) {
      for (const slug of role.relevantProjects) {
        expect(projects.some((project) => project.slug === slug)).toBe(true);
      }
    }
    expect(roleLenses.find((role) => role.slug === "data-science")?.group).toBe("Exploratory");
  });
});
