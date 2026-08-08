import { useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";
import {
  captureCampaignAttribution,
  filterAnalyticsEvent,
} from "./analytics";
import { SiteLayout } from "./components/SiteLayout";
import { projects, roleLenses } from "./data/site";
import { getLearningTicket } from "./data/learning";
import { AboutPage } from "./pages/AboutPage";
import { CaseStudiesPage } from "./pages/CaseStudiesPage";
import { HomePage } from "./pages/HomePage";
import { JournalPage } from "./pages/JournalPage";
import { LearningBoardPage } from "./pages/LearningBoardPage";
import { LearningOverviewPage } from "./pages/LearningOverviewPage";
import { LearningTicketPage } from "./pages/LearningTicketPage";
import { LearningTimelinePage } from "./pages/LearningTimelinePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ProjectDetailPage } from "./pages/ProjectDetailPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { ResumeContactPage } from "./pages/ResumeContactPage";
import { RoadmapPage } from "./pages/RoadmapPage";
import { RoleDetailPage } from "./pages/RoleDetailPage";
import { RolesPage } from "./pages/RolesPage";
import { SkillsPage } from "./pages/SkillsPage";
import { WritingPage } from "./pages/WritingPage";

function normalizePath(pathname: string) {
  if (pathname === "/") return "/";
  return pathname.replace(/\/+$/, "") || "/";
}

const productionSiteUrl = "https://www.jasonstroup.website";

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
    captureCampaignAttribution();
    const pageTitle = path === "/" ? route.title : `${route.title} | Jason Stroup CareerOS`;
    const canonicalUrl = `${productionSiteUrl}${path === "/" ? "/" : path}`;
    const imageUrl = `${productionSiteUrl}/og-careeros.png`;

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
    setMeta('meta[property="og:url"]', "property", "og:url", canonicalUrl);
    setCanonical(canonicalUrl);
    if (window.location.hash) {
      window.requestAnimationFrame(() => {
        document.getElementById(window.location.hash.slice(1))?.scrollIntoView();
      });
    } else {
      window.scrollTo(0, 0);
    }
  }, [path, route.description, route.title]);

  return (
    <>
      <SiteLayout currentPath={path}>{route.element}</SiteLayout>
      <Analytics beforeSend={filterAnalyticsEvent} />
    </>
  );
}

export function resolveRoute(path: string) {
  if (path === "/") {
    return {
      title: "Jason Stroup | Technical Solutions, Integrations & Application Support",
      description:
        "Jason Stroup is a customer-facing technical systems professional specializing in SaaS integrations, application support, troubleshooting, data, and software delivery.",
      element: <HomePage />,
    };
  }
  if (path === "/projects") {
    return {
      title: "Projects",
      description:
        "CareerOS, privacy-conscious analytics and integrations, computer vision, edge telemetry, and backend debugging projects.",
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
        "Jason Stroup's public CareerOS roadmap for analytics, integrations, owned project evidence, and software delivery.",
      element: <RoadmapPage />,
    };
  }
  if (path === "/learning") {
    return {
      title: "Learning & Delivery",
      description:
        "Jason Stroup's public Learning & Delivery workflow for planned work, approved evidence, capability progression, and truthful next actions.",
      element: <LearningOverviewPage />,
    };
  }
  if (path === "/learning/board") {
    return {
      title: "Learning Work Board",
      description:
        "A read-only, recruiter-safe board of Jason Stroup's approved learning and project-delivery tickets.",
      element: <LearningBoardPage />,
    };
  }
  if (path === "/learning/timeline") {
    return {
      title: "Learning Evidence Timeline",
      description:
        "A dated public timeline of approved CareerOS work sessions, artifacts, milestones, and publication decisions.",
      element: <LearningTimelinePage />,
    };
  }
  if (path.startsWith("/learning/tickets/")) {
    const ticketKey = path.replace("/learning/tickets/", "");
    const ticket = getLearningTicket(ticketKey);
    if (ticket) {
      return {
        title: `${ticket.key}: ${ticket.title}`,
        description: ticket.publicSummary,
        element: <LearningTicketPage ticket={ticket} />,
      };
    }
  }
  if (path === "/writing") {
    return {
      title: "Technical Writing",
      description:
        "Technical writing by Jason Stroup on SaaS integrations, troubleshooting, APIs, application behavior, customer-facing engineering, and software delivery.",
      element: <WritingPage />,
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
