import { BookOpenCheck, Github, Linkedin, Newspaper, PenLine, type LucideIcon } from "lucide-react";
import { trackPortfolioEvent } from "../analytics";
import { PageHero, SectionHeader } from "../components/UI";
import { profile, publicationProfiles } from "../data/site";

type ContactLink = {
  label: string;
  description: string;
  href: string;
  external: boolean;
  icon: LucideIcon;
};

export function ResumeContactPage() {
  const mediumProfile = publicationProfiles.find((item) => item.platform === "Medium");
  const contactLinks: ContactLink[] = [
    {
      label: "LinkedIn",
      description: "Professional history, current updates, and direct messaging.",
      href: profile.linkedin,
      external: true,
      icon: Linkedin,
    },
    {
      label: "GitHub",
      description: "Repositories, code history, documentation, and public project evidence.",
      href: profile.github,
      external: true,
      icon: Github,
    },
    {
      label: "Skills",
      description: "Evidence-backed capabilities, project connections, and current learning.",
      href: "/skills",
      external: false,
      icon: BookOpenCheck,
    },
    {
      label: "Writing",
      description: "Published technical guidance and future writing directions.",
      href: "/writing",
      external: false,
      icon: PenLine,
    },
    ...(mediumProfile
      ? [
          {
            label: "Medium",
            description: mediumProfile.description,
            href: mediumProfile.url,
            external: true,
            icon: Newspaper,
          },
        ]
      : []),
  ];

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="See my work and connect."
        copy="LinkedIn is the best way to reach me. GitHub shows my public repositories and code history."
      />
      <section className="section shell sectionAfterHero">
        <SectionHeader
          kicker="Profiles"
          title="Writing and professional profiles"
          copy="Verified destinations for Jason's work, technical writing, and professional background."
        />
        <div className="contactProfileLinks">
          {contactLinks.map(({ description, external, href, icon: Icon, label }) => (
            <a
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              key={label}
              onClick={() => {
                if (external) {
                  trackPortfolioEvent("External Profile Opened", {
                    profile: label.toLowerCase() as "github" | "linkedin" | "medium",
                    location: "contact",
                  });
                }
              }}
            >
              <Icon size={22} aria-hidden="true" />
              <span>
                <strong>{label}</strong>
                <small>{description}</small>
              </span>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
