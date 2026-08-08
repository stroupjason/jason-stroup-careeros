# Private Jira setup for CareerOS Learning

## Current decision

Jira Cloud Free is recommended as Jason's private day-to-day operating layer.
It is not required for the public site, is not currently connected, and must
not become a browser runtime dependency.

Current Jira Free facts were reviewed against official Atlassian documentation
on August 7, 2026:

- up to 10 Jira users
- 2 GB file storage
- 100 Jira automation flow runs per month
- Community support

Limits can change. Recheck the official [Jira Cloud plan comparison](https://support.atlassian.com/jira-cloud-administration/docs/explore-jira-cloud-plans/)
and [automation usage limits](https://support.atlassian.com/cloud-automation/docs/how-is-my-usage-calculated/)
before relying on them.

## Create the private project

1. Sign in to Atlassian or create an Atlassian account.
2. Create a Jira Cloud site if the account does not already have one.
3. Create a team-managed Kanban space/project named `CareerOS Learning`.
4. Request the key `LEARN` when available. A different private key is fine and
   must never be copied into the public client data.
5. Configure columns in this order: `Backlog`, `Ready`, `In Progress`,
   `Blocked`, `In Review`, `Done`.
6. Confirm Epic, Story, Task, Bug, and Spike work types are available. If Spike
   is unavailable, use Task with a `spike` label rather than over-customizing.
7. Set a working work-in-progress limit of one item in `In Progress`.

Recommended labels:

- `skill-sql`
- `healthcare`
- `role-tam`
- `evidence`
- `public-candidate`
- `private`
- `blocked`

Use labels or one component for initiatives. Avoid custom fields until the
board has enough real use to justify them.

## Seed the first private epic

Create one private epic for the healthcare SQL preparation initiative. The
private epic may include the company-specific planning context that is excluded
from public CareerOS.

Create private work items corresponding to public SQL-001 through SQL-012.
Preserve these rules:

- SQL-001, SQL-002, and SQL-004 begin Ready.
- Applied environment, investigation, testing, publication, and retrospective
  work begins in Backlog.
- Do not mark the course complete before verifying its exact title, remaining
  modules, and completion artifact.
- Do not attach interview messages, recruiter notes, compensation, or private
  company material to any public derivative.
- SQL-011 is Private. It is the company-specific shareable-brief task and must
  not enter the client bundle unless Jason later approves a sanitized public
  derivative.

The public ticket definitions and dependencies are documented in
`src/data/learning.ts`. The private Jira records may contain more operational
detail, but that detail is never authoritative public content.

## Daily workflow

1. Pull the highest-value Ready ticket into In Progress.
2. Keep one primary item in progress.
3. Add raw notes and private blockers only in Jira.
4. Before stopping, record the next action.
5. Move work to In Review when its definition of done and evidence exist.
6. Move it to Done only after the completion date and required artifact are
   verified.
7. Create a separate public-safe derivative only when publication is useful.

## Weekly evidence review

1. Review Done and In Review work.
2. Check whether artifacts support Learning, Practicing, or Demonstrated.
3. Remove private details from a proposed public derivative.
4. Add a clear limitation and `notClaimed` statement.
5. Approve the public derivative deliberately.
6. Run typecheck, tests, and build before publishing.
7. Choose one highest-value next action for the next week.

## Optional API token

Do not create a token until a local one-way adapter is actually being tested.
Atlassian currently recommends scoped tokens when supported. Tokens default to
an expiration and can be configured from one to 365 days. Review the current
[Atlassian API token guidance](https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/)
before creating one.

Potential local-only environment variables for a future adapter:

```text
JIRA_BASE_URL=
JIRA_ACCOUNT_EMAIL=
JIRA_API_TOKEN=
JIRA_PROJECT_KEY=
```

Never prefix these values with `VITE_`. Never add them to Vercel for the public
site. Never commit `.env` files, token values, account email addresses, site
URLs, cloud IDs, or private issue keys.

To revoke or rotate a token:

1. Open the Atlassian account security API-token page.
2. Revoke the existing token. Revocation permanently disables it.
3. Create a replacement with the shortest useful expiration and minimum scope.
4. Update only the local secret store.
5. Run a read-only authentication check before any export.

## Future one-way export boundary

No export adapter is implemented or tested today.

When PRODUCT-216 is started, the adapter must:

1. Run locally or in a server-only build step.
2. Read only explicitly selected issues.
3. Write raw results only to a gitignored private staging directory.
4. Never copy comments, attachments, account identifiers, reporter names,
   private links, or history into client data.
5. Produce no public record automatically.
6. Require Jason to create and approve a sanitized derivative.
7. Fail public validation when approval or a truth boundary is missing.
8. Keep a manual Jira export path for portability and backup.

The private staging directory should remain under an ignored path such as
`private/jira-staging/`. Repository policy already ignores `private/**` except
the approved empty intake placeholder.

## Troubleshooting and plan limits

- If the desired key is unavailable, use another private key and keep it out of
  public data.
- If a workflow type is unavailable, use Task plus a label before adding custom
  configuration.
- If automation reaches its monthly quota, continue manually. The workflow does
  not require automation.
- If the Free site approaches storage limits, remove unnecessary attachments
  and export a backup rather than moving private files into Git.
- Atlassian may deactivate inactive Free sites. Keep manual exports so CareerOS
  is not locked into the service.
- If a token returns 401, verify its expiration, scope, account access, and the
  current endpoint rules in Atlassian's official documentation.

