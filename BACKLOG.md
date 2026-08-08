# CareerOS implementation backlog

## EPIC 1 — Portfolio launch

- PORT-001 Validate all routes and direct refresh
- PORT-002 Add final public email and reviewed resume
- PORT-003 Add Open Graph image, sitemap, robots, and canonical URL
- PORT-004 Deploy Vercel preview and production environments
- PORT-005 [Active] Add privacy-conscious analytics, attribution, and measurement under `CareerOS Analytics & Integrations`; complete only after production requests and dashboard results are verified
- PORT-006 [Planned] Add a secure inquiry form and private Google Sheets lead-capture workflow under `CareerOS Analytics & Integrations`
- Later milestone: evaluate HubSpot and the LinkedIn Insight Tag under `CareerOS Analytics & Integrations` when measured campaign needs justify added tracking

## EPIC 2 — Featured project evidence

- NERF-001 Recover photos/video/source artifacts
- NERF-002 Confirm hardware inventory and build date
- NERF-003 Create original architecture diagram
- NERF-004 Write retrospective and redesign section
- RALLYE-001 Inventory current hardware and implemented services
- RALLYE-002 Add current power-telemetry screenshots
- RALLYE-003 Create subsystem architecture and data-flow diagram
- RALLYE-004 Publish first engineering experiment
- RALLYE-005 Add offline-first and security design notes

## EPIC 3 — Role-lens proof

- ROLE-101 Senior TSE sanitized troubleshooting case study
- ROLE-102 TAM fictional technical account plan
- ROLE-103 CSE integration onboarding case study
- ROLE-104 Data Analytics support/customer-health dashboard
- ROLE-105 Application Engineer backend debugging lab
- ROLE-106 FDE end-to-end implementation simulation
- ROLE-107 Data Science reproducible model-evaluation case study

## EPIC 4 — Engineering journal and case studies

- CONTENT-001 Markdown content loader
- CONTENT-002 Journal frontmatter schema
- CONTENT-003 Case-study frontmatter schema
- CONTENT-004 Project gallery component
- CONTENT-005 Architecture diagram component
- CONTENT-006 Evidence-link validation

## EPIC 5 — Delivery quality

- QUALITY-001 Add ESLint and formatting
- QUALITY-002 Add component tests
- QUALITY-003 Add Playwright route and accessibility smoke tests
- QUALITY-004 Add GitHub pull-request template
- QUALITY-005 Add Dependabot or dependency update workflow

## EPIC 6 — CareerOS Learning & Delivery System

- PRODUCT-201 [Completed] Add typed learning-event records
- PRODUCT-202 [Completed] Add evidence records and relationships; depends on PRODUCT-201
- PRODUCT-203 [Completed] Connect learning to capabilities and role lenses; depends on PRODUCT-201 and PRODUCT-202
- PRODUCT-204 [Completed] Enforce private/public visibility states; depends on PRODUCT-201 and PRODUCT-202
- PRODUCT-205 [Completed] Add personal capability and delivery timeline; depends on PRODUCT-201 through PRODUCT-203
- PRODUCT-206 [Completed] Add transparent next-action rules; depends on PRODUCT-201 through PRODUCT-205
- PRODUCT-207 Draft STAR stories and public-safe summaries
- PRODUCT-208 Confidentiality review gate before publication
- PRODUCT-209 Evidence search by role, skill, challenge, or result
- PRODUCT-210 Weekly strongest-evidence review prompt
- PRODUCT-211 [Completed] Add the public learning overview; depends on PRODUCT-201 through PRODUCT-203
- PRODUCT-212 [Completed] Add the public read-only Kanban board; depends on PRODUCT-204
- PRODUCT-213 [Completed] Add public ticket-detail routes; depends on PRODUCT-202 and PRODUCT-204
- PRODUCT-214 [Completed] Add initiative and milestone views; depends on PRODUCT-203
- PRODUCT-215 [Completed] Add the work-session and evidence timeline; depends on PRODUCT-201 and PRODUCT-202
- PRODUCT-216 [Ready] Set up private Jira authoring and evaluate a safe one-way export; depends on PRODUCT-204
- PRODUCT-217 [Completed] Seed the healthcare SQL initiative; depends on PRODUCT-204
- PRODUCT-218 [Completed] Verify accessibility, responsiveness, and tests; depends on PRODUCT-211 through PRODUCT-215
- PRODUCT-219 [Completed] Add truthful current-course records, progress snapshots, relationships, and LinkedIn integration boundaries; depends on PRODUCT-211, PRODUCT-213, PRODUCT-217, and PRODUCT-218

`PRODUCT-216` remains open until an authenticated private Jira board and a
controlled, gitignored staging export are actually tested. Public CareerOS has
no live Jira dependency.

## Deferred organization product

- multi-tenant organizations
- LMS/HRIS/Lattice integrations
- manager workflows
- internal opportunity marketplace
- retention-friction analytics
- attrition prediction
