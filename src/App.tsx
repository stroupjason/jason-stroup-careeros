import { useEffect } from "react";
import { SiteLayout } from "./components/SiteLayout";
import { projects, roleLenses } from "./data/site";
import { AboutPage } from "./pages/AboutPage";
import { CaseStudiesPage } from "./pages/CaseStudiesPage";
import { HomePage } from "./pages/HomePage";
import { JournalPage } from "./pages/JournalPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ProjectDetailPage } from "./pages/ProjectDetailPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { ResumeContactPage } from "./pages/ResumeContactPage";
import { RoadmapPage } from "./pages/RoadmapPage";
import { RoleDetailPage } from "./pages/RoleDetailPage";
import { RolesPage } from "./pages/RolesPage";
import { SkillsPage } from "./pages/SkillsPage";

function normalizePath(pathname: string) {
  if (pathname === "/") return "/";
  return pathname.replace(/\/+$/, "") || "/";
}

function setMeta(selector: string, attribute: "name" | "property", key: string, content: string) {
  let element = document.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

function setCanonical(href?: string) {
  const existing = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!href) {
    existing?.remove();
    return;
  }
  const element = existing ?? document.createElement("link");
  element.setAttribute("rel", "canonical");
  element.setAttribute("href", href);
  if (!existing) document.head.appendChild(element);
}

export function App() {
  const path = normalizePath(window.location.pathname);
  const route = resolveRoute(path);

  useEffect(() => {
    const pageTitle = `${route.title} | Jason Stroup CareerOS`;
    const configuredSiteUrl = import.meta.env.VITE_SITE_URL?.replace(/\/$/, "");
    const canonicalUrl = configuredSiteUrl
      ? `${configuredSiteUrl}${path === "/" ? "/" : path}`
      : undefined;
    const imageUrl = `${configuredSiteUrl ?? window.location.origin}/og-careeros.png`;

    document.title = pageTitle;
    setMeta('meta[name="description"]', "name", "description", route.description);
    setMeta('meta[property="og:title"]', "property", "og:title", pageTitle);
    setMeta('meta[property="og:description"]', "property", "og:description", route.description);
    setMeta('meta[property="og:type"]', "property", "og:type", "website");
    setMeta('meta[property="og:image"]', "property", "og:image", imageUrl);
    setMeta('meta[property="og:image:alt"]', "property", "og:image:alt", "Jason Stroup CareerOS portfolio");
    setMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", pageTitle);
    setMeta('meta[name="twitter:description"]', "name", "twitter:description", route.description);
    setMeta('meta[name="twitter:image"]', "name", "twitter:image", imageUrl);
    if (canonicalUrl) {
      setMeta('meta[property="og:url"]', "property", "og:url", canonicalUrl);
    } else {
      document.querySelector('meta[property="og:url"]')?.remove();
    }
    setCanonical(canonicalUrl);
    if (window.location.hash) {
      window.requestAnimationFrame(() => {
        document.getElementById(window.location.hash.slice(1))?.scrollIntoView();
      });
    } else {
      window.scrollTo(0, 0);
    }
  }, [path, route.description, route.title]);

  return <SiteLayout currentPath={path}>{route.element}</SiteLayout>;
}

function resolveRoute(path: string) {
  if (path === "/") {
    return {
      title: "Technical Portfolio",
      description:
        "Jason Stroup's CareerOS portfolio: technical support, customer engineering, analytics, backend development, and forward-deployment evidence.",
      element: <HomePage />,
    };
  }
  if (path === "/projects") {
    return {
      title: "Projects",
      description:
        "CareerOS, Automatic Nerf Turret, Rallye Control solar trailer telemetry, and backend debugging projects.",
      element: <ProjectsPage />,
    };
  }
  if (path === "/skills") {
    return {
      title: "Skills & Learning",
      description:
        "Jason Stroup's evidence-backed technical skills, current learning, supporting projects, and public learning profiles.",
      element: <SkillsPage />,
    };
  }
  if (path.startsWith("/projects/")) {
    const slug = path.replace("/projects/", "");
    const project = projects.find((item) => item.slug === slug);
    if (project) {
      return {
        title: project.title,
        description: project.summary,
        element: <ProjectDetailPage project={project} />,
      };
    }
  }
  if (path === "/roles") {
    return {
      title: "Role Fit",
      description:
        "Recruiter role fit for Senior TSE, TAM, CSE, Data Analytics, Application Engineering, Software Engineering, FDE, and exploratory Data Science.",
      element: <RolesPage />,
    };
  }
  if (path.startsWith("/roles/")) {
    const slug = path.replace("/roles/", "");
    const role = roleLenses.find((item) => item.slug === slug);
    if (role) {
      return {
        title: role.title,
        description: role.headline,
        element: <RoleDetailPage role={role} />,
      };
    }
  }
  if (path === "/roadmap") {
    return {
      title: "Roadmap",
      description:
        "Jason Stroup's public CareerOS execution roadmap from portfolio launch to backend evidence and forward deployment.",
      element: <RoadmapPage />,
    };
  }
  if (path === "/journal") {
    return {
      title: "Engineering Journal",
      description:
        "A reserved space for future public-safe engineering notes backed by completed work.",
      element: <JournalPage />,
    };
  }
  if (path === "/case-studies") {
    return {
      title: "Case Studies",
      description:
        "A reserved space for future technical case studies with supporting artifacts.",
      element: <CaseStudiesPage />,
    };
  }
  if (path === "/about") {
    return {
      title: "About",
      description:
        "About Jason Stroup: customer-facing technical systems professional, builder, and CareerOS creator.",
      element: <AboutPage />,
    };
  }
  if (path === "/resume-contact") {
    return {
      title: "Contact",
      description: "Connect with Jason Stroup through LinkedIn and GitHub.",
      element: <ResumeContactPage />,
    };
  }
  return {
    title: "Not Found",
    description: "The requested CareerOS page was not found.",
    element: <NotFoundPage />,
  };
}
