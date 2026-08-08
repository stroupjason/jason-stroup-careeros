# LinkedIn Learning progress decision

## Decision

CareerOS does not scrape LinkedIn Learning, store LinkedIn credentials, or make
browser-to-LinkedIn runtime requests. The public site renders reviewed course
records from `src/data/learning.ts` and remains fully functional when LinkedIn
and analytics are unavailable.

The supported update path is deliberately human controlled:

1. Jason reads the progress shown in his own authenticated LinkedIn Learning
   session.
2. He supplies a manual value or a narrowly scoped screenshot, or explicitly
   authorizes a browser-assisted check.
3. The value enters review as a timestamped candidate with its source and
   provider-reported or derived status recorded.
4. Jason confirms the candidate before it becomes the current public snapshot.
5. CareerOS publishes only the reviewed derivative. It never publishes account
   details, private learning-history URLs, cookies, screenshots, transcripts,
   exercise answers, or copied course material.

Browser assistance is an explicit, one-time observation workflow, not
continuous synchronization. It must not persist a password, cookie, token,
authenticated URL, account identifier, or unrelated profile information.

## Why there is no personal API integration

LinkedIn's official Reporting API FAQ says the reporting APIs expose learner
progress to organization administrators and require a LinkedIn Learning
enterprise license plus admin access to provision API keys. The official xAPI
documentation describes system-to-system webhooks configured in LinkedIn
Learning admin settings and enabled by an account administrator.

Those are enterprise administration paths, not a standard personal LinkedIn
OAuth feed. CareerOS therefore has no provider API source and no LinkedIn
environment variables. A future integration can be reconsidered only if Jason
has an eligible enterprise arrangement, administrator authorization, approved
data handling, and a server-side implementation that passes a new privacy
review.

Official sources checked August 7, 2026:

- [LinkedIn Learning Reporting API FAQs](https://learn.microsoft.com/en-us/linkedin/learning/reporting/reporting-docs/reporting-api-faq)
- [LinkedIn Learning xAPI activity webhooks](https://learn.microsoft.com/en-us/linkedin/learning/integrations/xapi)

## Current course truth boundary

`SQL Essential Training` by Walter Shields is recorded as an in-progress
LinkedIn Learning course related to `SQL-002` and the Healthcare Customer
Operations SQL Case Study.

No numeric current progress is public. An earlier screenshot-derived value of
approximately 11 percent was described as historical and conflicts with a later
description that the course is nearly finished. It remains an unverified
candidate outside the public client record until Jason confirms a current
provider value and observation time.

A progress snapshot is not a work session and does not prove comprehension.
Course completion can support a course-completion record, but it does not make
SQL `Practicing` or `Demonstrated`, complete the applied project, or satisfy
every requirement of the delivery ticket. Those claims require original notes,
reproducible queries, validated outputs, and reviewed applied work.
