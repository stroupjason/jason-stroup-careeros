# CareerOS project bindings and sources of truth

## What is bound automatically

Codex discovers `AGENTS.md` from the Git repository root and applies it to work
in this repository. Repository files, Git history, configured local tools, and
explicitly connected MCP servers are available according to the active Codex
permissions.

## What is not bound automatically

The ChatGPT Library `/CareerOS` folder, ChatGPT project conversations, Otter
recordings, and private work documents are not runtime dependencies of this
website and must not be assumed to appear in a local Codex session. Bring in a
specific, approved, public-safe artifact only when the task requires it.

## Source-of-truth map

| Concern | Authoritative source |
|---|---|
| Public website code and content | This Git repository |
| Durable Codex behavior | Root `AGENTS.md` |
| Public/private boundary | `CONFIDENTIALITY.md` |
| Current implementation scope | `SPRINT_001.md` |
| Future implementation ideas | `BACKLOG.md` |
| Routes | `docs/SITE_MAP.md` |
| Role positioning | `docs/ROLE_LENS_STRATEGY.md` and `docs/CAREER_PATH.md` |
| Evidence terminology | `docs/EVIDENCE_MODEL.md` |
| Public project facts | `docs/projects/` plus Jason-approved owned evidence |
| Rendered typed site content | `src/data/site.ts` |
| Public Learning & Delivery records | `src/data/learning.ts` |
| Learning workflow and publication rules | `docs/LEARNING_DELIVERY_SYSTEM.md` |
| LinkedIn Learning progress boundary | `docs/LINKEDIN_LEARNING_INTEGRATION.md` |
| Private Jira setup guidance | `docs/JIRA_LEARNING_SETUP.md` |
| Private apprenticeship and raw work evidence | Outside the public repository |

## Sync rule

Once this package is initialized as a Git repository, Git becomes the
executable source of truth. Library zip files are snapshots for handoff and
recovery; they do not stay synchronized with Git. Make website changes in Git,
then create a deliberate snapshot only when one is needed.

## External systems

- GitHub: source control and pull requests after the repository is created.
- Vercel: preview and production deployment after Jason connects the repository.
- Otter: source material for private review; never publish raw transcripts.
- Jira: optional private authoring only; it is not bound, connected, or a public
  runtime dependency.
- Supabase, authentication, HR systems, and AI scoring: not bound and explicitly
  outside the approved scope unless Jason changes it.
