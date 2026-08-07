import { Github, Linkedin } from "lucide-react";
import { PageHero, SectionHeader } from "../components/UI";
import { profile } from "../data/site";

export function ResumeContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="See my work and connect."
        copy="LinkedIn is the best way to reach me. GitHub shows my public repositories and code history."
      />
      <section className="section shell sectionAfterHero contactGrid">
        <article className="contactCard">
          <Linkedin size={26} />
          <h2>LinkedIn</h2>
          <p>Professional history, current role, and direct messaging.</p>
          <a href={profile.linkedin} target="_blank" rel="noreferrer">
            Open LinkedIn
          </a>
        </article>
        <article className="contactCard">
          <Github size={26} />
          <h2>GitHub</h2>
          <p>Repositories, code history, project documentation, and public proof.</p>
          <a href={profile.github} target="_blank" rel="noreferrer">
            Open GitHub
          </a>
        </article>
      </section>
      <section className="section shell">
        <SectionHeader
          kicker="Role Fit"
          title="Choose the view that matches your need"
          copy="Each page uses the same evidence while making current strengths and growth areas clear."
        />
        <div className="roleLinkList largeTags">
          <a href="/roles/senior-technical-support-engineer">Senior TSE</a>
          <a href="/roles/technical-account-manager">TAM</a>
          <a href="/roles/customer-success-engineer">CSE</a>
          <a href="/roles/data-analytics">Data Analytics</a>
          <a href="/roles/application-engineer">Application Engineer</a>
        </div>
      </section>
    </>
  );
}
