# Start here — CareerOS v5

## Immediate goal

Launch a polished public portfolio that makes Jason's unusual combination of
customer-facing technical work, integrations, analytics, troubleshooting, and
independent building understandable to a recruiter in under five minutes.

This is **not** the organization/LMS/retention product yet.

## The positioning decision

The site can include Data Analytics, Data Science, TAM, CSE, Application
Engineering, Software Engineering, and FDE pages without becoming unfocused
**only because they are role lenses rather than separate identities**.

The homepage must always lead with the same core identity:

> Customer-facing technical systems professional specializing in
> troubleshooting, integrations, analytics, solution delivery, and business
> value.

Role pages then reorder evidence and show gaps.

## First actions

1. Unzip the package into a new GitHub repository.
2. Confirm the root contains `AGENTS.md`, `package-lock.json`, and
   `docs/PROJECT_BINDINGS.md`.
3. Create branch `feat/v5-multipage-portfolio`.
4. Run:

```bash
npm ci
npm run typecheck
npm run build
npm run dev
```

5. Ask Codex: `Summarize the active repository instructions and current sprint
   without editing files.` Confirm that it cites `AGENTS.md`,
   `CONFIDENTIALITY.md`, and `SPRINT_001.md`.
6. Open every route in `docs/SITE_MAP.md`.
7. Review the project facts in:
   - `docs/projects/AUTOMATIC_NERF_TURRET.md`
   - `docs/projects/RALLYE_CONTROL.md`
8. Review every role page for truthful priority and evidence.
9. Give Codex Prompt 1 from `CODEX_PROMPTS.md`.
10. Fix audit findings before adding new features.

## Content Jason should add first

### Automatic Nerf Turret

- original photos or video
- surviving source code or archive
- exact hardware list
- original build date if recoverable
- original architecture diagram or a clearly labeled reconstruction
- honest notes about failures and what would be redesigned

### Rallye Control

- trailer and power-system photographs
- current hardware inventory
- current telemetry source and screenshots
- architecture diagram
- subsystem-by-subsystem implementation status
- first reproducible engineering experiment

### Recruiter readiness

- reviewed public email address
- reviewed master resume PDF
- final production URL
- Open Graph image
- one strong public case study

## Do not add yet

- authentication
- Supabase
- HRIS or Lattice integrations
- employee attrition scoring
- manager dashboards
- organization workspaces
- numeric role-readiness percentages
- more role pages beyond the explicitly approved Software Engineer lens
- unsupported project metrics

## Definition of a useful first release

A recruiter can quickly answer:

1. What does Jason do well today?
2. What has he actually built?
3. Which roles are credible now versus future directions?
4. What evidence supports each claim?
5. How do I contact him or review his code?
