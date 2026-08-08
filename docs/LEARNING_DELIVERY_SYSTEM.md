# CareerOS Learning & Delivery System

## Purpose

The Learning & Delivery System turns career objectives into planned work,
records real execution and blockers, connects reviewed artifacts to
capabilities and role lenses, and publishes only recruiter-safe evidence.

It is a personal CareerOS workflow. It is not an LMS, an employee-scoring
system, an organization workspace, or a claim that every planned capability is
already demonstrated.

## Two visibility layers

### Private operating layer

The approved CareerOS Supabase project is the canonical durable authoring layer
for tickets, ordering, sessions, blockers, progress snapshots, evidence
metadata, checklists, and append-only audit events. Access is limited to
Jason's immutable authenticated user ID. Jira remains optional and unconnected.

### Public portfolio layer

CareerOS renders an allowlisted, read-only Supabase projection with the typed
records in `src/data/learning.ts` as its last-known static fallback. The browser
never receives private-schema rows, a service-role key, a database password,
or raw Jira payloads.

The public layer excludes:

- private Jira URLs and external issue identifiers
- API tokens, account email addresses, and credentials
- interview notes, recruiter messages, compensation, and private feedback
- employer or customer data, copied tickets, logs, screenshots, or architecture
- PHI, PII, real patient data, and real customer incidents
- unverified course completion, artifacts, metrics, or outcomes

## Work hierarchy

The model supports this traceable path:

`Career objective -> Initiative -> Epic -> Story/Task/Bug/Spike -> Work session -> Evidence -> Capability -> Role lens -> Public project`

The phase-one record types are:

- `LearningInitiative`: macro goal, roadmap state, milestone progress, current
  phase, and next action
- `LearningTicket`: delivery work, dates, dependencies, completion rules,
  capabilities, evidence, and truth boundary
- `WorkSession`: the Five-Minute Evidence Capture record linked to one ticket
- `LearningEvidence`: reviewed artifact, verification state, relationships,
  limitations, and publication approval
- `LearningCourse`: provider metadata, ticket and project relationships,
  evidence state, current focus, next action, and an append-only collection of
  timestamped progress snapshots

Course progress is selected from the newest verified snapshot. Newer candidate
snapshots do not replace it. A snapshot records its source and whether its value
was provider reported or derived; it is not automatically a work session,
evidence artifact, completion claim, or capability-state change. LinkedIn
Learning remains a human-approved import boundary documented in
`docs/LINKEDIN_LEARNING_INTEGRATION.md`.

## Status vocabularies

These fields are deliberately separate:

| Concern | Values |
|---|---|
| Delivery status | Backlog, Ready, In Progress, Blocked, In Review, Done |
| Roadmap status | Active, Next, Planned, Completed |
| Evidence state | Demonstrated, Practicing, Learning, Planned |
| Visibility | Private, Public Draft, Public |

A completed course ticket supports a completed delivery claim. It does not by
itself change SQL to Demonstrated. Original applied work can support Practicing;
a reviewed artifact or verified professional outcome may support Demonstrated.

## Publication gate

Every client-visible record requires:

- `visibility: "Public"`
- `publicApproved: true`
- a public-safe summary
- a non-empty `notClaimed` truth boundary
- valid parent, dependency, and evidence references
- no private source fields, credentials, email addresses, or Atlassian URLs

`assertValidLearningData()` runs when the public module loads. Focused tests
exercise duplicate identifiers, relationships, dependency cycles, Done-ticket
evidence rules, approval, private fields, filters, routes, chronology, and the
truthful healthcare SQL seed.

Automated checks do not make a record safe. Human approval remains required.

## Five-Minute Evidence Capture

When real work occurs, create a reviewed derivative with:

1. Date and optional start/end time
2. Ticket key
3. Problem category
4. Capability practiced or demonstrated
5. What I did
6. Outcome
7. What I learned
8. Next action
9. Role lens supported
10. Evidence created
11. Public-safe blocker, when applicable
12. Confirmation that private details were removed

Do not create a public entry when the only available description contains
private, employer, customer, patient, interview, or recruiter information.

## Public routes

- `/learning`: overview, focus, sprint, initiatives, evidence, and progression
- `/learning/board`: read-only status board and shareable filters
- `/learning/timeline`: dated sessions, artifacts, and publication events
- `/learning/tickets/:ticketKey`: public ticket detail and truth boundary
- `/projects/careeros-learning-delivery`: implementation case study
- `/projects/healthcare-sql-customer-operations`: active planning record

Unknown and private ticket keys use the established not-found experience.

## Healthcare SQL initiative

The public record now includes verified metadata and a reviewed, duration-based
progress snapshot for `SQL Essential Training` by Walter Shields. Its related
ticket `SQL-002` remains In Progress. No completed module, certificate, study
session, or applied SQL evidence is published without verification. The
immediate action is:

> Complete the remaining SQL Essential Training course work, then record
> Jason's original concept summary before closing SQL-002.

The eventual case study must use a small, licensed synthetic or public dataset.
It must not use PHI, PII, real patient data, employer data, interview materials,
or a real customer incident. Synthea is a candidate, not a selected dataset.

`SQL-011` is intentionally absent from the client bundle. It is private,
company-specific preparation that must remain outside the public projection
until Jason explicitly approves a public derivative.

## Current integration boundary

The browser uses a publishable Supabase key and short-lived user sessions;
authorization is enforced by membership-aware database functions and RLS. A
private authoring row is never serialized wholesale. Approved public DTOs are
refreshed transactionally after mutations, while the checked-in typed snapshot
keeps the public site useful when Supabase or analytics is unavailable.

LinkedIn and Coursera progress remains human-verified. Provider API work is
deferred until supported administrator access exists.

## Review cadence

Daily:

- keep work in progress to one primary ticket
- record the next action before stopping
- add a short evidence capture only after real work occurs
- move blocked work to Blocked with a public-safe blocker summary only when safe

Weekly:

- review completed tickets and evidence links
- confirm evidence states still match the proof
- approve or reject public derivatives
- choose one highest-value next action
- export the durable authoring data through a deliberate admin-only recovery
  process when useful
