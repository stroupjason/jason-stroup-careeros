import { Github, Linkedin, Mail } from "lucide-react";
import { PageHero, SectionHeader } from "../components/UI";
import { profile } from "../data/site";

export function ResumeContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Resume and contact"
        title="Start with the role lens that matches your need."
        copy="The public site is designed to give recruiters one coherent profile, supporting projects, and an honest view of current evidence and growth areas."
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
        <article className="contactCard">
          <Mail size={26} />
          <h2>Email</h2>
          <p>
            Add a recruiter-safe contact address before launch. The starter does
            not invent or expose one.
          </p>
          <span>TODO: reviewed public email</span>
        </article>
      </section>
      <section className="section shell">
        <SectionHeader
          kicker="Role lenses"
          title="Choose the evidence view that matches the role"
          copy="Each lens uses the same underlying facts while making current fit, gaps, and the next proof explicit."
        />
        <div className="roleLinkList largeTags">
          <a href="/roles/senior-technical-support-engineer">Senior TSE</a>
          <a href="/roles/technical-account-manager">TAM</a>
          <a href="/roles/customer-success-engineer">CSE</a>
          <a href="/roles/data-analytics">Data Analytics</a>
          <a href="/roles/application-engineer">Application Engineer</a>
        </div>
      </section>
      <section className="section band">
        <div className="shell">
          <SectionHeader
            kicker="Resume"
            title="Add one reviewed master resume, then role-specific versions"
            copy="The package intentionally leaves the resume file out until the current document is reviewed for accuracy, contact privacy, and alignment with the live site."
          />
          <div className="inlineCallout">
            <Mail size={22} />
            <div>
              <strong>Launch requirement</strong>
              <p>
                Place the final file at <code>public/resume/Jason-Stroup-Resume.pdf</code>
                and add a visible download button only after reviewing every
                claim against the evidence model.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
