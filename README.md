# Jason Stroup — CareerOS Portfolio v5

CareerOS is Jason Stroup's public, recruiter-safe technical portfolio and the
first working slice of an evidence-backed career development product.

The site presents **one coherent professional identity** through several
truthful recruiter lenses. It does not market Jason as seven unrelated
professionals.

## Core identity

> Customer-facing technical systems professional specializing in
> troubleshooting, integrations, analytics, solution delivery, and business
> value.

## What v5 contains

### Full site structure

- Home
- Projects index
- Individual project pages
- Role-lens index
- Individual role pages
- Roadmap
- Engineering journal
- Case studies
- About
- Resume/contact

### Featured personal projects

- **Automatic Nerf Turret** — demonstrated Raspberry Pi/OpenCV motion-detection
  and 360-degree tracking prototype integrating Python, camera processing,
  SQLAlchemy-backed state/workflow logic, servo control, and end-to-end testing.
- **Rallye Control — Solar Trailer Telemetry** — active edge/IoT build for an
  off-grid trailer. Subsystems are independently labeled Demonstrated,
  Practicing, Learning, or Planned so proposed architecture is not presented as
  completed implementation.
- **CareerOS** — the portfolio product itself.
- **Python/MongoDB Debugging Lab** — the next public backend evidence build,
  clearly labeled as not yet completed.

### Recruiter role lenses

- Senior Technical Support Engineer
- Technical Account Manager
- Customer Success Engineer
- Data Analytics
- Application Engineer
- Forward Deployed Engineer
- Data Science

The breadth is controlled through explicit priority:

- **Immediate:** Senior TSE, TAM, CSE, Data Analytics
- **Bridge:** Application Engineer
- **Long-term:** Forward Deployed Engineer
- **Exploratory:** Data Science

Data Science is not presented as a current job-ready identity. It documents the
credible foundation—Python, SQL, analytics, and an OpenCV project—plus the
substantial modeling and evaluation gaps still to be proved.

## Run locally

```bash
npm install
npm run dev
```

## Validate

```bash
npm run typecheck
npm run build
```

## Deploy

The starter includes `vercel.json` so direct links such as
`/roles/data-analytics` and `/projects/automatic-nerf-turret` resolve through the
single Vite application on Vercel.

## Start here

1. Read `AGENTS.md`; Codex loads it automatically from the repository root.
2. Read `START_HERE.md` and `CONFIDENTIALITY.md`.
3. Read `docs/PROJECT_BINDINGS.md` and `docs/ROLE_LENS_STRATEGY.md`.
4. Review every fact in `src/data/site.ts`.
5. Add only media and links Jason personally owns and has verified.
6. Give Codex Prompt 1 from `CODEX_PROMPTS.md`.
7. Complete Sprint 001 before adding authentication, databases, or HR features.

## Public evidence rule

Every public claim must be one of:

- **Demonstrated** — supported by professional experience or a working project
- **Practicing** — actively exercised through approved work or independent builds
- **Learning** — active development without a mastery claim
- **Planned** — intentionally deferred

No customer data, employer code, internal architecture, copied tickets, private
manager notes, or unsupported metrics belong in this repository.
