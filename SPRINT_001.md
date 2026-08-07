# Sprint 001 — Launch the multipage CareerOS portfolio

## Sprint goal

Deploy a truthful, responsive, recruiter-safe website that includes the full
page structure, featured projects, and role lenses without confusing breadth
with current mastery.

## Scope

### SITE-001 — Verify multipage routing

Definition of done:

- every route in `docs/SITE_MAP.md` renders directly
- browser refresh works on Vercel
- navigation current-state styling works
- unknown routes render a useful 404 page

### SITE-002 — Validate homepage positioning

Definition of done:

- one core identity appears above the fold
- current role is clear
- featured projects are visible
- role breadth is explained as lenses
- Data Science is not presented as a primary current identity

### PROJECT-001 — Complete project pages

Definition of done:

- CareerOS, Automatic Nerf Turret, Rallye Control, and the backend lab have pages
- project type, status, evidence state, problem, outcome, stack, and role relevance render
- unknown facts remain explicit
- no planned Rallye subsystem is represented as completed

### PROJECT-002 — Add first owned media

Definition of done:

- at least one original artifact is added for each featured personal project
- alt text is useful
- no stock or AI-generated image is presented as project evidence
- missing media uses a neutral placeholder, not invented proof

### ROLE-001 — Validate all role lenses

Definition of done:

- Senior TSE, TAM, CSE, Data Analytics, Application Engineer, Software Engineer, FDE, and Data Science render
- each page includes current evidence, project links, gaps, next proof, and truth boundary
- role priority is visible
- no page implies Jason currently holds that title unless true

### BRAND-001 — Align recruiter narrative

Definition of done:

- homepage, About, LinkedIn summary, GitHub profile, and resume use one core identity
- role pages change emphasis, not facts
- project pages link back to capabilities and roles

### ACCESS-001 — Accessibility and responsiveness

Definition of done:

- keyboard navigation works
- focus styles remain visible
- headings are ordered logically
- color contrast is acceptable
- mobile navigation wraps cleanly
- reduced-motion preference is respected

### SEO-001 — Route metadata and sharing

Definition of done:

- each route sets an appropriate page title and description
- production canonical URL is added after domain selection
- Open Graph image is added
- sitemap/robots are generated or documented

### QA-001 — Build and recruiter journey

Definition of done:

- `npm run typecheck` succeeds
- `npm run build` succeeds
- direct route refresh succeeds in preview deployment
- recruiter journey from Home → project → role lens → contact takes fewer than five minutes
- no broken placeholder links are visible

## Explicitly deferred

- database and authentication
- private evidence workspace UI
- resume generator
- organization workspaces
- Lattice/HR integrations
- retention intelligence
- AI scoring
