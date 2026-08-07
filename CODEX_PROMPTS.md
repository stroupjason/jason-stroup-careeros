# Codex prompt pack — CareerOS v5

Use one prompt at a time. Review every generated claim before merging.

## Prompt 1 — Audit the complete v5 package

Act as a senior frontend engineer, portfolio strategist, accessibility reviewer,
and technical hiring manager.

Read:

- `README.md`
- `START_HERE.md`
- `SPRINT_001.md`
- `CONFIDENTIALITY.md`
- `docs/SITE_MAP.md`
- `docs/ROLE_LENS_STRATEGY.md`
- `docs/PROJECT_CONTENT_MODEL.md`
- `src/data/site.ts`
- all source components and pages

Context:

- Jason is currently a Technical Support Engineer.
- His demonstrated strengths are enterprise SaaS troubleshooting, APIs,
  integrations, observability, Docker/Linux, data-flow analysis, customer
  communication, analytics, and regulated environments.
- He is developing deeper Python/MongoDB/backend contribution through approved
  backend development work, but has not claimed completed production backend
  ownership.
- The portfolio uses one core identity and multiple role lenses.
- Senior TSE, TAM, CSE, and Data Analytics are immediate lenses.
- Application Engineering is the active bridge.
- FDE is the long-term convergence role.
- Data Science is exploratory and must not be presented as current mastery.

Do not edit files.

Audit:

1. TypeScript and Vite build correctness
2. direct-route behavior and Vercel rewrite configuration
3. accessibility and responsive behavior
4. navigation and recruiter journey
5. unsupported or inflated claims
6. role-lens breadth versus homepage focus
7. whether projects link to useful evidence
8. missing SEO, sitemap, robots, and Open Graph work
9. confidentiality and employer-sensitive exposure
10. the smallest changes needed to complete Sprint 001

Return:

- current architecture
- blocking problems
- truthfulness/privacy risks
- recruiter-confusion risks
- prioritized file-level changes
- proposed pull-request sequence
- commands to verify each stage

## Prompt 2 — Complete Sprint 001

Read all Sprint 001 and policy files, then implement only the work required to
make the current multipage portfolio production-ready.

Requirements:

- preserve Vite + React + TypeScript
- preserve one core professional identity
- preserve the role priority hierarchy
- preserve evidence states
- fix direct-route, TypeScript, accessibility, and responsive issues
- ensure all routes in `docs/SITE_MAP.md` render
- ensure project and role detail pages use typed data
- do not add authentication, Supabase, HR features, or AI scoring
- do not add new roles
- do not invent project facts, dates, metrics, links, or completed work
- do not expose employer or customer information
- run typecheck and production build

At the end return:

- changed files
- verification commands and results
- routes manually tested
- screenshots Jason should capture
- remaining Sprint 001 items
- concise pull-request title and description

## Prompt 3 — Recruiter focus test

Act as three different recruiters reviewing the deployed site:

1. Senior Technical Support / customer engineering recruiter
2. Technical Account Manager / Customer Success Engineering recruiter
3. Application Engineer / Forward Deployed Engineering recruiter

Also review the Data Analytics and Data Science lenses.

For each recruiter, answer:

- What professional identity is understood in the first 20 seconds?
- Which project is most persuasive?
- Which claims feel credible?
- Which claims feel broad, confusing, or unsupported?
- Is the role-lens architecture helpful or distracting?
- What one content change would most improve conversion?

Rules:

- Do not rewrite the site yet.
- Do not recommend deleting legitimate breadth simply because it is broad.
- Distinguish a navigation/content-hierarchy problem from a real positioning
  problem.
- Flag Data Science if it appears equal in priority to current paths.

Return a prioritized recommendation list.

## Prompt 4 — Finish the Automatic Nerf Turret project page

Use these as the only factual sources:

- `docs/projects/AUTOMATIC_NERF_TURRET.md`
- personally owned media Jason adds under
  `public/projects/automatic-nerf-turret/`
- any source files Jason explicitly places in the repository

Create a polished project page emphasizing:

- Python and OpenCV
- Raspberry Pi/Linux edge execution
- motion detection and object tracking
- 360-degree tracking behavior
- servo-driven hardware control
- SQLAlchemy and state/workflow coordination
- end-to-end prototype testing
- technical failures and tradeoffs
- what Jason would redesign today

Rules:

- retain explicit placeholders for facts that remain unknown
- do not invent the build date
- do not invent hardware models, accuracy, latency, reliability, or performance
- do not invent source links or metrics
- distinguish original evidence from later reconstruction
- connect the evidence to Data Science foundations, Application Engineering,
  CSE, and FDE without claiming role mastery
- add accessible media captions and alt text

Return:

- changed files
- every claim used and its source
- missing facts/media
- verification commands
- pull-request description

## Prompt 5 — Finish the Rallye Control project page

Use these as the only factual sources:

- `docs/projects/RALLYE_CONTROL.md`
- subsystem states in `src/data/site.ts`
- personally owned media Jason adds under `public/projects/rallye-control/`
- current implementation notes Jason explicitly adds

Build a project page and build journal for the solar trailer telemetry system.

Required sections:

- off-grid trailer problem
- current physical and software architecture
- solar/power telemetry
- Raspberry Pi edge environment
- local connectivity constraints
- MQTT data-flow design
- ESP32 sensor-node roadmap
- Python/FastAPI and Docker service roadmap
- dashboards and alerting
- React Native/Expo mobile-control roadmap
- offline-first and security considerations
- subsystem evidence-state table
- next reproducible engineering experiment

Rules:

- never imply every planned subsystem is implemented
- do not invent power-system specifications, sensors, message schemas, metrics,
  screenshots, repository links, or completion percentages
- do not add security-camera/computer-vision claims or details
- use Practicing, Learning, and Planned labels precisely
- connect the project to Data Analytics, CSE, Application Engineering, and FDE
- use Jason's original diagrams and photographs only as evidence

Return:

- changed files
- subsystem state review
- missing facts/media
- next recommended experiment
- verification commands
- pull-request description

## Prompt 6 — Strengthen the role-lens pages

Read `docs/ROLE_LENS_STRATEGY.md`, `CONFIDENTIALITY.md`, and all role data.

Improve the recruiter usefulness of these pages without broadening scope:

- Senior Technical Support Engineer
- Technical Account Manager
- Customer Success Engineer
- Data Analytics
- Application Engineer
- Forward Deployed Engineer
- Data Science

Every page must include:

- fit and priority
- concise role-specific positioning
- demonstrated evidence only
- linked supporting projects
- material gaps
- highest-value next proof
- explicit truth boundary
- role-specific keywords used naturally

Special rules:

- Data Science remains exploratory.
- FDE remains long-term.
- Application Engineering remains an active bridge, not a completed transition.
- TAM/CSE pages may emphasize transferable experience but may not claim formal
  titles or commercial ownership that is not evidenced.
- Data Analytics may claim practical analytics tools and context but not senior
  analytics or advanced statistics without evidence.
- Do not duplicate entire resumes on role pages.

After editing, explain how the site retains one coherent identity.

## Prompt 7 — Add a Markdown journal and case-study system

Implement Markdown-driven content for `/journal` and `/case-studies`.

Frontmatter for journal entries:

- title
- date
- status
- technologies
- capabilities
- evidence_state
- confidentiality
- summary

Frontmatter for case studies:

- title
- date
- status
- project_slug
- problem_category
- technologies
- capabilities
- role_lenses
- evidence_state
- confidentiality
- summary

Required case-study sections:

- problem
- context
- constraints
- architecture
- investigation or design process
- testing
- outcome
- lessons
- evidence links
- truth boundary

Generate templates and loaders. Do not create fake completed entries.

## Prompt 8 — Build the Data Analytics proof project

Create a specification and starter for a public support-operations or
customer-health analytics project.

It should demonstrate:

- a public or synthetic dataset
- SQL transformation
- documented data model
- Python analysis when useful
- dashboard or clear visual output
- metric definitions
- business question
- recommendation
- limitations
- reproducible setup

Do not use employer data or imply that synthetic metrics are professional
outcomes. Connect the finished artifact to Data Analytics, TAM, CSE, and Value
Engineering capabilities.

## Prompt 9 — Build the exploratory Data Science proof project

Create a project specification—not a completed achievement—for one rigorous,
reproducible data-science case study.

Prefer a computer-vision or operational-prediction problem that connects
naturally to Jason's existing evidence.

The specification must require:

- public dataset
- baseline
- train/validation/test strategy
- evaluation metrics
- error analysis
- model limitations
- reproducible notebook or pipeline
- README
- ethical and data-quality considerations
- optional deployment only after evaluation is sound

Do not convert the Nerf turret into evidence of advanced data-science mastery.
It is applied computer-vision prototyping evidence and a foundation for the next
project.

## Prompt 10 — Add resume and recruiter conversion

Implement the final resume/contact page after Jason adds a reviewed resume and
public email.

Requirements:

- clear LinkedIn, GitHub, email, and resume actions
- no phone number or precise home address unless Jason explicitly approves
- role-lens links near the resume
- downloadable resume with descriptive filename
- print-safe behavior
- event analytics only if privacy-respecting analytics are configured
- no fake testimonials or recruiter logos

## Prompt 11 — SEO, sitemap, and deployment

Prepare the site for Vercel production deployment.

Add or verify:

- page-specific titles and descriptions
- canonical URL configuration with a placeholder until domain is known
- Open Graph metadata and image placeholder
- sitemap containing every route in `docs/SITE_MAP.md`
- robots.txt
- Vercel direct-route rewrites
- 404 behavior
- deployment README
- environment-variable documentation if any variables are introduced
- accessibility and Lighthouse checklist

Do not add analytics, cookies, or tracking without documenting privacy impact.

## Prompt 12 — Final truth and confidentiality audit

Act as an adversarial reviewer before public launch.

For every public claim:

- identify its evidence source
- label it Demonstrated, Practicing, Learning, or Planned
- flag unsupported dates, metrics, titles, ownership, or outcomes
- flag internal/employer/customer details
- flag planned Rallye Control subsystems described as completed
- flag Data Science language that overstates readiness
- flag formal TAM/CSE/Application Engineer/FDE title implications
- flag broken or placeholder links that look real

Return a launch-blocking checklist. Do not edit files until Jason reviews the
findings.
