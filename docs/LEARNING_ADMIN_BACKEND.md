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

## Authentication

The unadvertised route is `/admin/login`. It requests a Supabase email magic
link with `shouldCreateUser: false` and returns the same neutral response for
authorized and unauthorized addresses. Public self-sign-up must also remain
disabled in the Supabase dashboard. The production Auth Site URL is the exact
callback `https://www.jasonstroup.website/admin/login`. Preview callbacks stay
disabled unless they are deliberately added to Supabase's redirect allowlist.

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
