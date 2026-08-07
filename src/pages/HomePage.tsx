import type { ReactNode } from "react";
import {
  Activity,
  BarChart3,
  Braces,
  MapPin,
  Network,
  ServerCog,
  ShieldCheck,
  Target,
  Users,
} from "lucide-react";
import {
  capabilities,
  nextAction,
  profile,
  projects,
  roleLenses,
} from "../data/site";
import {
  LinkButton,
  ProjectCard,
  RoleCard,
  SectionHeader,
  StateBadge,
} from "../components/UI";

const featuredRoles = roleLenses.filter((role) =>
  [
    "senior-technical-support-engineer",
    "technical-account-manager",
    "customer-success-engineer",
    "data-analytics",
    "application-engineer",
  ].includes(role.slug),
);

export function HomePage() {
  return (
    <>
      <section className="hero shell">
        <div className="eyebrow">
          <span className="pulse" /> {profile.currentRole} · customer engineering
          · analytics · builder
        </div>
        <h1>
          {profile.headline.split("—")[0]}
          <span>—{profile.headline.split("—")[1]}</span>
        </h1>
        <p className="heroCopy">{profile.summary}</p>
        <div className="heroActions">
          <LinkButton href="/projects">See the work</LinkButton>
          <LinkButton href="/roles" secondary>
            Explore role lenses
          </LinkButton>
        </div>

        <div className="signalGrid">
          <Signal icon={<ServerCog />} label="Current role" value="Technical Support Engineer" />
          <Signal icon={<ShieldCheck />} label="Strongest evidence" value="Production troubleshooting" />
          <Signal icon={<Braces />} label="Active bridge" value="Backend development" />
          <Signal icon={<MapPin />} label="Based in" value={profile.location} />
        </div>
      </section>

      <section className="proof shell">
        <p>ONE CORE IDENTITY, MULTIPLE TRUTHFUL LENSES</p>
        <div className="proofStatement">
          <span>customer context</span>
          <i>+</i>
          <span>systems investigation</span>
          <i>+</i>
          <span>data and delivery</span>
          <i>=</i>
          <strong>high-leverage technical work</strong>
        </div>
      </section>

      <section className="section shell">
        <SectionHeader
          kicker="Featured work"
          title="Built, active, and next—with every state visible."
          copy="The portfolio separates demonstrated work, active builds, and the next backend evidence lab instead of presenting every project as complete."
        />
        <div className="projectGrid">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>

      <section className="section band">
        <div className="shell">
          <SectionHeader
            kicker="Role lenses"
            title="Broad experience without a blurry identity."
            copy="Each page reorganizes the same evidence for a recruiter's question. It does not claim that every role is equally mature."
          />
          <div className="roleGrid">
            {featuredRoles.map((role) => (
              <RoleCard key={role.slug} role={role} />
            ))}
          </div>
          <div className="inlineCallout">
            <Target size={22} />
            <div>
              <strong>The focus remains clear.</strong>
              <p>
                Senior TSE, TAM, CSE, and Data Analytics are credible near-term
                lenses. Application Engineering is the active bridge. FDE is the
                long-term convergence role. Data Science is explicitly exploratory.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section shell" id="capability-evidence">
        <SectionHeader
          kicker="Capability evidence"
          title="No fake percentages. Only proof states."
          copy="The site distinguishes demonstrated work from active practice, learning, and future plans."
        />
        <div className="capabilityGrid">
          {capabilities.slice(0, 8).map((capability) => (
            <article className="capabilityCard" key={capability.name}>
              <StateBadge state={capability.state} />
              <h3>{capability.name}</h3>
              <p>{capability.evidence}</p>
              <div className="supports">
                {capability.supports.map((role) => (
                  <span key={role}>{role}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section band">
        <div className="shell archetypeGrid">
          <Archetype
            icon={<Activity />}
            title="Support and reliability"
            copy="Production troubleshooting, RCA, logs, incidents, documentation, and customer communication."
          />
          <Archetype
            icon={<Users />}
            title="Customer engineering"
            copy="Technical discovery, integration guidance, enablement, adoption, and stakeholder ownership."
          />
          <Archetype
            icon={<Network />}
            title="Implementation and deployment"
            copy="Prototyping, integration, field constraints, end-to-end delivery, and production feedback."
          />
          <Archetype
            icon={<BarChart3 />}
            title="Data and business insight"
            copy="SQL, dashboards, telemetry, product analytics, operational context, and recommendations."
          />
        </div>
      </section>

      <section className="section shell">
        <article className="nextAction">
          <div className="nextActionIcon">
            <Target size={26} />
          </div>
          <div>
            <span className="kicker">Highest-leverage next action</span>
            <h2>{nextAction.title}</h2>
            <p>{nextAction.action}</p>
            <small>{nextAction.why}</small>
          </div>
        </article>
      </section>
    </>
  );
}

function Signal({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="signal">
      <div>{icon}</div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function Archetype({
  icon,
  title,
  copy,
}: {
  icon: ReactNode;
  title: string;
  copy: string;
}) {
  return (
    <article className="archetypeCard">
      <div>{icon}</div>
      <h3>{title}</h3>
      <p>{copy}</p>
    </article>
  );
}
