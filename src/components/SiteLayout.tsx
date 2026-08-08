import { useEffect, useState, type ReactNode } from "react";
import { ArrowUpRight, Github, Linkedin, Menu, X } from "lucide-react";
import {
  isAnalyticsEnabled,
  setAnalyticsEnabled,
  subscribeToAnalyticsPreference,
  trackPortfolioEvent,
} from "../analytics";
import { profile } from "../data/site";

type SiteLayoutProps = {
  currentPath: string;
  children: ReactNode;
};

const navItems = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/skills", label: "Skills" },
  { href: "/learning", label: "Learning" },
  { href: "/roles", label: "Role Fit" },
  { href: "/writing", label: "Writing" },
  { href: "/roadmap", label: "Roadmap" },
  { href: "/resume-contact", label: "Contact", cta: true },
];

function isActive(currentPath: string, href: string) {
  if (href === "/") return currentPath === "/";
  return currentPath === href || currentPath.startsWith(`${href}/`);
}

export function SiteLayout({ currentPath, children }: SiteLayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [anonymousAnalytics, setAnonymousAnalytics] = useState(isAnalyticsEnabled);

  useEffect(() => {
    setMenuOpen(false);
  }, [currentPath]);

  useEffect(() => {
    if (!menuOpen) return;

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  useEffect(
    () => subscribeToAnalyticsPreference(() => setAnonymousAnalytics(isAnalyticsEnabled())),
    [],
  );

  return (
    <div className="siteFrame">
      <a className="skipLink" href="#main-content">
        Skip to main content
      </a>
      <header className="siteHeader">
        <nav className="nav shell" aria-label="Primary navigation">
          <a className="brand" href="/" aria-label="Jason Stroup home">
            JS<span>.</span>
          </a>
          <button
            className="mobileNavToggle"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="primary-navigation-links"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
          <div
            className={`navLinks ${menuOpen ? "open" : ""}`}
            id="primary-navigation-links"
          >
            {navItems.map((item) => (
              <a
                className={`${item.cta ? "navCta" : ""} ${
                  isActive(currentPath, item.href) ? "active" : ""
                }`.trim()}
                href={item.href}
                key={item.href}
                aria-current={isActive(currentPath, item.href) ? "page" : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {item.label} {item.cta ? <ArrowUpRight size={15} aria-hidden="true" /> : null}
              </a>
            ))}
          </div>
        </nav>
      </header>

      <main id="main-content">{children}</main>

      <footer className="footer">
        <div className="shell footerGrid">
          <div>
            <a className="brand footerBrand" href="/" aria-label="Jason Stroup home">
              JS<span>.</span>
            </a>
            <p>{profile.coreIdentity}</p>
          </div>
          <div className="footerLinks">
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              onClick={() =>
                trackPortfolioEvent("External Profile Opened", {
                  profile: "linkedin",
                  location: "footer",
                })
              }
            >
              <Linkedin size={17} /> LinkedIn
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              onClick={() =>
                trackPortfolioEvent("External Profile Opened", {
                  profile: "github",
                  location: "footer",
                })
              }
            >
              <Github size={17} /> GitHub
            </a>
            <a href="/projects">Projects</a>
            <a href="/skills">Skills</a>
            <a href="/learning">Learning</a>
            <a href="/roles">Role Fit</a>
            <a href="/writing">Writing</a>
            <a href="/roadmap">Roadmap</a>
            <a href="/about">About</a>
            <a href="/resume-contact">
              Contact <ArrowUpRight size={17} />
            </a>
          </div>
          <p className="footerNote">
            Public-safe evidence only. No customer data, employer source code,
            internal architecture, or unsupported claims.
          </p>
          <label className="analyticsPreference">
            <input
              type="checkbox"
              checked={anonymousAnalytics}
              onChange={(event) => {
                setAnalyticsEnabled(event.currentTarget.checked);
                setAnonymousAnalytics(event.currentTarget.checked);
              }}
            />
            <span>Share anonymous usage</span>
          </label>
        </div>
      </footer>
    </div>
  );
}
