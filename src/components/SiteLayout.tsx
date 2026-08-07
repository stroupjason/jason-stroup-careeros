import type { ReactNode } from "react";
import { ArrowUpRight, Github, Linkedin } from "lucide-react";
import { profile } from "../data/site";

type SiteLayoutProps = {
  currentPath: string;
  children: ReactNode;
};

const navItems = [
  { href: "/projects", label: "Projects" },
  { href: "/skills", label: "Skills" },
  { href: "/roles", label: "Role Fit" },
  { href: "/about", label: "About" },
];

function isActive(currentPath: string, href: string) {
  if (href === "/") return currentPath === "/";
  return currentPath === href || currentPath.startsWith(`${href}/`);
}

export function SiteLayout({ currentPath, children }: SiteLayoutProps) {
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
          <div className="navLinks">
            {navItems.map((item) => (
              <a
                className={isActive(currentPath, item.href) ? "active" : ""}
                href={item.href}
                key={item.href}
                aria-current={isActive(currentPath, item.href) ? "page" : undefined}
              >
                {item.label}
              </a>
            ))}
            <a
              className={`navCta ${isActive(currentPath, "/resume-contact") ? "active" : ""}`}
              href="/resume-contact"
              aria-current={isActive(currentPath, "/resume-contact") ? "page" : undefined}
            >
              Contact <ArrowUpRight size={15} />
            </a>
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
            <a href={profile.linkedin} target="_blank" rel="noreferrer">
              <Linkedin size={17} /> LinkedIn
            </a>
            <a href={profile.github} target="_blank" rel="noreferrer">
              <Github size={17} /> GitHub
            </a>
            <a href="/projects">Projects</a>
            <a href="/skills">Skills</a>
            <a href="/roles">Role Fit</a>
            <a href="/roadmap">Roadmap</a>
            <a href="/resume-contact">
              Contact <ArrowUpRight size={17} />
            </a>
          </div>
          <p className="footerNote">
            Public-safe evidence only. No customer data, employer source code,
            internal architecture, or unsupported claims.
          </p>
        </div>
      </footer>
    </div>
  );
}
