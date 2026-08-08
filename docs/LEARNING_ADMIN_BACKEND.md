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

Apply `supabase/migrations/20260808000100_learning_admin.sql` to the approved
project. The migration is transactional and idempotent. After the auth user is
created, add its UUID to `private.admin_memberships` through a one-time trusted
dashboard operation. Do not put the UUID or email in the migration.

The first authorized load invokes `learning_admin_seed`. Inserts use
`ON CONFLICT DO NOTHING`, so later deployments verify the 22-ticket baseline
without overwriting durable edits.

## Rollback and recovery

1. Keep the Vercel Supabase environment variables unset or remove them to make
   public pages use the checked-in static snapshot.
2. Preserve a database backup before destructive rollback.
3. Run `supabase/rollback/20260808000100_learning_admin.down.sql` only when the
   durable authoring records have been exported and losing them is intentional.
4. Redeploy the last verified Git commit if the frontend also needs rollback.

## Provider integrations

LinkedIn Learning and Coursera values are timestamped human-verified snapshots.
Continuous scraping is not used. Provider API integration remains deferred
because supported enterprise administrator access has not been configured.
