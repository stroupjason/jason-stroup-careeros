# CareerOS Learning admin backend

## Decision

CareerOS uses one approved Supabase free-plan project for durable learning
authoring and passwordless authentication. The public Vite application uses
only the project URL and publishable key. Authorization depends on database
policies and an immutable `auth.users.id` membership, never on key secrecy or a
client-side email comparison.

The checked-in records in `src/data/learning.ts` remain the reviewed recovery
snapshot. They render when Supabase is unavailable and seed the durable tables
idempotently after the authorized administrator signs in.

## Data boundary

- `private.*` stores authoring rows, notes, evidence locations, sessions,
  blockers, progress snapshots, memberships, and audit events.
- `public.learning_public_*` stores allowlisted DTOs only.
- Anonymous and authenticated visitors can read the public projection.
- Only the pre-provisioned admin membership can call authoring RPCs.
- Audit events are append-only; ordinary administration has no hard delete.
- Every ticket mutation carries an expected revision and rejects stale writes.
- Progress publication requires a verified source and explicit approval.

No service-role key, database password, admin UUID, account identifier, grade,
or private academic record belongs in Vite environment variables, Git, browser
analytics, or a public DTO.

## Authentication and session authority

The stable owner route is `/admin`, with `/admin/login` retained as the exact
Magic Link callback. The Supabase client persists and refreshes the browser
session, detects PKCE callback sessions, and opts into experimental passkeys.
Public self-sign-up remains disabled.

The production passkey configuration is Jason-controlled:

- RP display name: `careerOS` (prefer `CareerOS` in a future dashboard review)
- RP ID: `www.jasonstroup.website`
- RP origin: `https://www.jasonstroup.website`

Do not enroll passkeys on Vercel previews and do not change the RP ID after
enrollment; passkeys are cryptographically bound to it. Passkey authentication
does not grant CareerOS administration. Every restored session still calls
`learning_admin_is_authorized()` and must match the immutable membership.

Magic Link remains the recovery method with `shouldCreateUser: false` and a
neutral response for authorized and unauthorized addresses. The exact callback
remains `https://www.jasonstroup.website/admin/login`. A validated destination
is preserved in same-origin session storage, not added to the callback URL.
Only `/admin`, the private Bug Log, the Learning board and timeline, and public
Learning ticket routes are accepted. Protocol-relative, external, malformed,
and unapproved destinations fall back to `/admin`.

Supabase session persistence means a healthy browser session should survive a
reload and a new tab without another email. Project-level JWT/session timeout
settings remain a production-dashboard verification item. Local sign-out uses
`scope: "local"` intentionally.

### Production passkey verification

1. Recover through the existing email link on the canonical `www` origin.
2. Confirm immutable administrator authorization succeeds.
3. Register the first passkey in Admin security.
4. Confirm the credential appears only after registration succeeds.
5. Sign out locally and return to `/admin`.
6. Sign in with the passkey and verify an approved `returnTo` destination.
7. Sign out again and confirm Magic Link recovery still works.

Until these steps pass, PRODUCT-243 remains In Review and no production
passkey enrollment claim is made.

## Migration

Apply migrations in repository order to the approved project:

1. `supabase/migrations/20260808000100_learning_admin.sql`
2. `supabase/migrations/20260808000200_delivery_intelligence_operations.sql`

Both migrations are transactional and idempotent. The existing confirmed Auth
user is already mapped to exactly one active `private.admin_memberships` row.
Preserve that user and immutable mapping; do not put its UUID or email in a
migration.

Each authorized load invokes the idempotent seed path. The historical
`22-ticket` value is an explicit baseline-key subset, while the pre-Delivery
Intelligence public projection contained 39 keys and the reviewed source
projection now contains 51. Stable-key inserts use `ON CONFLICT DO NOTHING`, so
new records can be added without overwriting durable edits or forcing a stale
total. The operations seed derives three sanitized incident/RCA records from
their canonical Bug tickets after those ticket keys exist.

The unadvertised `/admin/operations/bugs` route reads only the membership-
protected operations snapshot. Canonical board Bugs retain status and priority;
the private tables add classification, incident context, diagnostic notes, and
timestamped observations. Raw provider logs are not copied into public data.

## Rollback and recovery

1. Keep the Vercel Supabase environment variables unset or remove them to make
   public pages use the checked-in static snapshot.
2. Preserve a database backup before destructive rollback.
3. Roll back the operations layer first with
   `supabase/rollback/20260808000200_delivery_intelligence_operations.down.sql`.
4. Run `supabase/rollback/20260808000100_learning_admin.down.sql` only when the
   durable authoring records have been exported and losing them is intentional.
5. Redeploy the last verified Git commit if the frontend also needs rollback.

## Provider integrations

LinkedIn Learning and Coursera values are timestamped human-verified snapshots.
Continuous scraping is not used. Provider API integration remains deferred
because supported enterprise administrator access has not been configured.
