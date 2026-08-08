# CareerOS repository instructions

## Mission and current phase

This repository is Jason Stroup's public, recruiter-safe technical portfolio
and the first public slice of CareerOS. The current goal is to maintain a
truthful portfolio and complete approved, focused CareerOS increments. Jason
explicitly authorized the public Learning & Delivery System on August 7, 2026.
That authorization covers typed personal learning records, approved public
projections, and private Jira setup guidance; it does not authorize
multi-tenant organizations, employee scoring, HRIS or Lattice integrations, or
a generalized SaaS product.

## Read before editing

Read these files in order:

1. `CONFIDENTIALITY.md`
2. `START_HERE.md`
3. `SPRINT_001.md`
4. `docs/PROJECT_BINDINGS.md`
5. The relevant project or role document under `docs/`
6. `src/data/site.ts` and the source files affected by the task

`SPRINT_001.md` defines current scope. `BACKLOG.md` is later work and does not
authorize scope expansion.

## Truth and positioning rules

- Preserve one core identity: customer-facing technical systems professional
  specializing in troubleshooting, integrations, analytics, solution delivery,
  and business value.
- Treat role pages as lenses over the same evidence, never as credentials.
- Keep Senior TSE as the strongest current alignment; TAM and CSE as strong
  adjacent lenses; and Data Analytics as a transferable secondary lens.
  Application Engineer is the primary engineering bridge, Software Engineer is
  an active development path, FDE is long-term, and Data Science is exploratory.
- Use only Demonstrated, Practicing, Learning, and Planned evidence states as
  defined in `docs/EVIDENCE_MODEL.md`.
- Never invent dates, metrics, titles, links, project facts, completion states,
  technologies, or outcomes.
- Preserve explicit unknowns and placeholders until Jason supplies verified
  facts or personally owned evidence.

## Confidentiality boundary

Follow `CONFIDENTIALITY.md` strictly. Do not add employer code, internal names,
customer data, production artifacts, copied tickets, private notes, credentials,
or non-public architecture. Private apprenticeship records and raw work or
interview transcripts are planning inputs outside this public repository. Use
only sanitized, independently written, public-safe derivatives when Jason has
approved them.

## Repository conventions

- Keep portfolio content typed in `src/data/site.ts`. Learning & Delivery
  records live in the focused `src/data/learning.ts` module. Do not publish raw
  Jira records or move private operating notes into either client module.
- Keep routes synchronized with `docs/SITE_MAP.md`.
- Put personally owned public media under `public/projects/<project-slug>/`.
- Put the reviewed public resume at
  `public/resume/Jason-Stroup-Resume.pdf` only after Jason approves it.
- Do not commit `.env` files, secrets, private intake material, generated
  `dist/`, or `node_modules/`.
- Do not deploy, publish, create external accounts, or change production
  services unless Jason explicitly asks.

## Validation

Use Node 22 and npm. After relevant changes, run:

```bash
npm ci
npm run typecheck
npm run build
```

For route, accessibility, or responsive changes, also verify every route in
`docs/SITE_MAP.md`, direct refresh behavior, keyboard navigation, visible focus,
mobile layout, and reduced-motion behavior. Report any check that could not be
run; do not claim it passed.

## Definition of done

A change is done only when it stays within the requested scope, preserves the
truth and confidentiality boundaries, passes the applicable checks, and leaves
the repository with a concise summary of changed files, verification results,
remaining placeholders, and any decision Jason must make.
