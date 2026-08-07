import { BookOpenCheck, ExternalLink } from "lucide-react";
import { LinkButton, PageHero, SectionHeader, StateBadge } from "../components/UI";
import {
  developingSkills,
  evidenceStates,
  learningProfiles,
  projects,
  roleLenses,
  skillCategories,
  skills,
  type EvidenceSource,
  type Skill,
} from "../data/site";

const sourceTypeLabels: Record<EvidenceSource["type"], string> = {
  work: "Work",
  project: "Project",
  assessment: "Assessment",
  credential: "Credential",
  course: "Course",
  lab: "Lab",
};

export function SkillsPage() {
  const visibleProfiles = learningProfiles.filter(
    (profile) => profile.visible && profile.publicVerified && profile.url,
  );

  return (
    <>
      <PageHero
        eyebrow="Skills & learning"
        title="Skills backed by work, projects, and continuous learning."
        copy="What I use today, what I’m strengthening, and the evidence behind each skill."
      />

      <section className="section shell sectionAfterHero compactSkillsIntro">
        <aside className="skillsLegend" aria-label="CareerOS skill status legend">
          <p>
            CareerOS status reflects the evidence available today. Provider assessments and
            credentials appear only when their exact public results can be verified.
          </p>
          <div>
            {evidenceStates.map((item) => <StateBadge state={item.state} key={item.state} />)}
          </div>
        </aside>
      </section>

      <section className="section band">
        <div className="shell">
          <SectionHeader
            kicker="Evidence-backed skills"
            title="What I use today"
            copy="Each skill links to public-safe evidence."
          />
          <div className="skillGroups">
            {skillCategories.map((category) => {
              const categorySkills = skills.filter(
                (skill) => skill.visible && skill.category === category,
              );
              return (
                <section className="skillGroup" aria-labelledby={`skill-group-${slugify(category)}`} key={category}>
                  <h3 id={`skill-group-${slugify(category)}`}>{category}</h3>
                  <div className="skillGrid">
                    {categorySkills.map((skill) => <SkillCard skill={skill} key={skill.id} />)}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section shell" id="currently-developing">
        <SectionHeader
          kicker="Currently developing"
          title="The next engineering proof"
          copy="Current priorities for the Application and Software Engineer paths."
        />
        <div className="skillGrid developingSkillGrid">
          {developingSkills.filter((skill) => skill.visible).map((skill) => (
            <SkillCard skill={skill} key={skill.id} />
          ))}
        </div>
        <div className="heroActions">
          <LinkButton href="/roles/application-engineer">Application Engineer fit</LinkButton>
          <LinkButton href="/roadmap" secondary>View roadmap</LinkButton>
        </div>
      </section>

      <section className="section band">
        <div className="shell">
          <SectionHeader
            kicker="Learning profiles"
            title="Verified public learning"
            copy="Verified public profiles."
          />
          <div className="learningProfileGrid">
            {visibleProfiles.map((profile) => (
              <article className="learningProfileCard" key={profile.provider}>
                <BookOpenCheck size={25} aria-hidden="true" />
                <span className="kicker">{profile.provider}</span>
                <h3>{profile.label}</h3>
                <p>{profile.description}</p>
                <a href={profile.url} target="_blank" rel="noopener noreferrer">
                  {profile.actionLabel}
                  <ExternalLink size={16} aria-hidden="true" />
                  <span className="srOnly"> (opens in a new tab)</span>
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function SkillCard({ skill }: { skill: Skill }) {
  const relatedProjects = projects.filter((project) =>
    skill.relatedProjectSlugs.includes(project.slug),
  );
  const relatedRoles = roleLenses.filter((role) =>
    skill.relatedRoleSlugs.includes(role.slug),
  );

  return (
    <article className="skillCard">
      <div className="skillCardState">
        <StateBadge state={skill.careerOsStatus} />
      </div>
      <h4>{skill.name}</h4>
      <p>{skill.evidenceSummary}</p>
      <div className="skillSources" aria-label="Evidence sources">
        {skill.evidenceSources.map((source) => (
          <div key={`${source.type}-${source.label}`}>
            <span>{sourceTypeLabels[source.type]}</span>
            {source.url ? (
              <a
                href={source.url}
                target={source.url.startsWith("http") ? "_blank" : undefined}
                rel={source.url.startsWith("http") ? "noopener noreferrer" : undefined}
              >
                {source.label}
                {source.url.startsWith("http") ? <ExternalLink size={14} aria-hidden="true" /> : null}
              </a>
            ) : <strong>{source.label}</strong>}
          </div>
        ))}
      </div>
      {skill.platformAssessment?.verified ? (
        <div className="platformAssessment">
          <span>{skill.platformAssessment.label}</span>
          <strong>{skill.platformAssessment.level}</strong>
          {skill.platformAssessment.assessedOn ? <small>{skill.platformAssessment.assessedOn}</small> : null}
        </div>
      ) : null}
      <div className="skillConnections" aria-label="Related CareerOS evidence">
        {relatedProjects.map((project) => (
          <a aria-label={`Project: ${project.shortTitle}`} href={`/projects/${project.slug}`} key={project.slug}>{project.shortTitle}</a>
        ))}
        {relatedRoles.slice(0, 2).map((role) => (
          <a aria-label={`Role fit: ${role.title}`} href={`/roles/${role.slug}`} key={role.slug}>{role.title}</a>
        ))}
      </div>
      {skill.lastVerified ? <small className="lastVerified">Last verified {skill.lastVerified}</small> : null}
    </article>
  );
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
