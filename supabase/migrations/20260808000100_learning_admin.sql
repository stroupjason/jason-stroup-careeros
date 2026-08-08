begin;

create extension if not exists pgcrypto;
create schema if not exists private;

create table if not exists private.admin_memberships (
  user_id uuid primary key references auth.users(id) on delete restrict,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists private.learning_initiatives (
  slug text primary key,
  public_data jsonb not null check (jsonb_typeof(public_data) = 'object'),
  private_notes text,
  revision integer not null default 1 check (revision > 0),
  archived_at timestamptz,
  updated_at timestamptz not null default now()
);

create table if not exists private.learning_tickets (
  key text primary key check (key ~ '^[A-Z][A-Z0-9-]{2,31}$'),
  public_data jsonb not null check (jsonb_typeof(public_data) = 'object'),
  private_notes text,
  delivery_status text not null check (delivery_status in ('Backlog', 'Ready', 'In Progress', 'Blocked', 'In Review', 'Done')),
  rank numeric(20, 8) not null check (rank > 0),
  revision integer not null default 1 check (revision > 0),
  planned_start_date date,
  actual_start_at timestamptz,
  target_date date,
  completed_at timestamptz,
  user_estimate smallint check (user_estimate in (1, 2, 3, 5, 8, 13)),
  coach_factors jsonb,
  public_approved boolean not null default false,
  archived_at timestamptz,
  status_changed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists learning_tickets_status_rank_idx
  on private.learning_tickets (delivery_status, rank)
  where archived_at is null;

create table if not exists private.acceptance_items (
  id uuid primary key default gen_random_uuid(),
  ticket_key text not null references private.learning_tickets(key) on delete restrict,
  item_index integer not null check (item_index >= 0),
  label text not null check (length(trim(label)) between 1 and 1000),
  mandatory boolean not null default true,
  completed_at timestamptz,
  completed_by uuid references auth.users(id) on delete restrict,
  unique (ticket_key, item_index)
);

create table if not exists private.learning_courses (
  id text primary key,
  public_data jsonb not null check (jsonb_typeof(public_data) = 'object'),
  private_notes text,
  revision integer not null default 1 check (revision > 0),
  archived_at timestamptz,
  updated_at timestamptz not null default now()
);

create table if not exists private.learning_evidence (
  id text primary key,
  public_data jsonb not null check (jsonb_typeof(public_data) = 'object'),
  private_location text,
  private_notes text,
  public_approved boolean not null default false,
  revision integer not null default 1 check (revision > 0),
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table private.learning_evidence
  add column if not exists created_at timestamptz not null default now();

create table if not exists private.progress_snapshots (
  id text primary key,
  course_id text not null references private.learning_courses(id) on delete restrict,
  ticket_key text not null references private.learning_tickets(key) on delete restrict,
  scope text not null check (scope in ('Course progress', 'Specialization progress', 'Program progress')),
  percentage numeric(5, 2) check (percentage between 0 and 100),
  total_duration_seconds integer check (total_duration_seconds >= 0),
  completed_duration_seconds integer check (completed_duration_seconds >= 0),
  remaining_duration_seconds integer check (remaining_duration_seconds >= 0),
  observed_at timestamptz not null,
  source_type text not null check (source_type in ('manual_user_entry', 'user_provided_screenshot', 'browser_assisted_verification', 'provider_api')),
  source_provider text not null check (length(trim(source_provider)) between 1 and 120),
  value_basis text not null check (value_basis in ('Provider reported', 'Derived')),
  verification_state text not null check (verification_state in ('Candidate', 'Verified', 'Rejected')),
  verification_label text not null,
  private_evidence_reference text,
  admin_confirmed_at timestamptz,
  current_module text,
  public_safe_note text,
  public_approved boolean not null default false,
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  check (completed_duration_seconds is null or total_duration_seconds is not null),
  check (remaining_duration_seconds is null or total_duration_seconds is not null),
  check (completed_duration_seconds is null or completed_duration_seconds <= total_duration_seconds),
  check (remaining_duration_seconds is null or remaining_duration_seconds <= total_duration_seconds),
  check (value_basis <> 'Provider reported' or percentage is not null)
);

create index if not exists progress_snapshots_current_idx
  on private.progress_snapshots (course_id, scope, observed_at desc)
  where verification_state = 'Verified';

create table if not exists private.work_sessions (
  id text primary key default gen_random_uuid()::text,
  ticket_key text not null references private.learning_tickets(key) on delete restrict,
  actor_id uuid not null references auth.users(id) on delete restrict,
  started_at timestamptz not null,
  ended_at timestamptz,
  private_note text,
  public_summary text,
  public_approved boolean not null default false,
  corrected_from text references private.work_sessions(id) on delete restrict,
  superseded_at timestamptz,
  created_at timestamptz not null default now(),
  check (ended_at is null or ended_at >= started_at),
  check (superseded_at is null or ended_at is not null)
);

create unique index if not exists one_running_learning_session_per_admin_idx
  on private.work_sessions (actor_id)
  where ended_at is null;

create table if not exists private.learning_blockers (
  id uuid primary key default gen_random_uuid(),
  ticket_key text not null references private.learning_tickets(key) on delete restrict,
  private_reason text not null check (length(trim(private_reason)) between 1 and 4000),
  next_check text not null check (length(trim(next_check)) between 1 and 2000),
  public_summary text,
  public_approved boolean not null default false,
  blocked_at timestamptz not null default now(),
  resolved_at timestamptz,
  created_by uuid not null references auth.users(id) on delete restrict,
  check (resolved_at is null or resolved_at >= blocked_at)
);

create table if not exists private.audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid not null references auth.users(id) on delete restrict,
  occurred_at timestamptz not null default now(),
  entity_type text not null,
  entity_key text not null,
  action text not null,
  before_summary jsonb,
  after_summary jsonb,
  correlation_id uuid not null,
  reversible boolean not null default false,
  request_context jsonb not null default '{}'::jsonb,
  check (jsonb_typeof(request_context) = 'object')
);

create index if not exists audit_events_entity_idx
  on private.audit_events (entity_type, entity_key, occurred_at desc);
create unique index if not exists audit_events_correlation_action_idx
  on private.audit_events (correlation_id, action, entity_key);

create table if not exists public.learning_public_tickets (
  key text primary key,
  data jsonb not null check (jsonb_typeof(data) = 'object'),
  rank numeric(20, 8) not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.learning_public_courses (
  id text primary key,
  data jsonb not null check (jsonb_typeof(data) = 'object'),
  updated_at timestamptz not null default now()
);

create table if not exists public.learning_public_initiatives (
  slug text primary key,
  data jsonb not null check (jsonb_typeof(data) = 'object'),
  updated_at timestamptz not null default now()
);

create table if not exists public.learning_public_evidence (
  id text primary key,
  data jsonb not null check (jsonb_typeof(data) = 'object'),
  updated_at timestamptz not null default now()
);

create table if not exists public.learning_public_sessions (
  id text primary key,
  data jsonb not null check (jsonb_typeof(data) = 'object'),
  updated_at timestamptz not null default now()
);

alter table private.admin_memberships enable row level security;
alter table private.learning_initiatives enable row level security;
alter table private.learning_tickets enable row level security;
alter table private.acceptance_items enable row level security;
alter table private.learning_courses enable row level security;
alter table private.learning_evidence enable row level security;
alter table private.progress_snapshots enable row level security;
alter table private.work_sessions enable row level security;
alter table private.learning_blockers enable row level security;
alter table private.audit_events enable row level security;
alter table public.learning_public_tickets enable row level security;
alter table public.learning_public_courses enable row level security;
alter table public.learning_public_initiatives enable row level security;
alter table public.learning_public_evidence enable row level security;
alter table public.learning_public_sessions enable row level security;

create or replace function private.is_learning_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from private.admin_memberships membership
    where membership.user_id = (select auth.uid())
      and membership.active
  );
$$;

revoke all on function private.is_learning_admin() from public, anon, authenticated;

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'learning_initiatives', 'learning_tickets', 'acceptance_items', 'learning_courses',
    'learning_evidence', 'progress_snapshots', 'work_sessions', 'learning_blockers'
  ] loop
    execute format('drop policy if exists learning_admin_all on private.%I', table_name);
    execute format(
      'create policy learning_admin_all on private.%I for all to authenticated using ((select private.is_learning_admin())) with check ((select private.is_learning_admin()))',
      table_name
    );
  end loop;
end $$;

drop policy if exists learning_admin_audit_select on private.audit_events;
create policy learning_admin_audit_select
on private.audit_events for select to authenticated
using ((select private.is_learning_admin()));

drop policy if exists learning_admin_audit_insert on private.audit_events;
create policy learning_admin_audit_insert
on private.audit_events for insert to authenticated
with check ((select private.is_learning_admin()) and actor_id = (select auth.uid()));

create or replace function private.reject_audit_mutation()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  raise exception 'Audit events are append-only' using errcode = '42501';
end;
$$;

drop trigger if exists audit_events_append_only on private.audit_events;
create trigger audit_events_append_only
before update or delete on private.audit_events
for each row execute function private.reject_audit_mutation();

revoke all on function private.reject_audit_mutation() from public, anon, authenticated;

drop policy if exists learning_admin_membership_self on private.admin_memberships;
create policy learning_admin_membership_self
on private.admin_memberships for select to authenticated
using (user_id = (select auth.uid()) and active);

drop policy if exists public_read_learning_tickets on public.learning_public_tickets;
create policy public_read_learning_tickets
on public.learning_public_tickets for select to anon, authenticated
using (true);

drop policy if exists public_read_learning_courses on public.learning_public_courses;
create policy public_read_learning_courses
on public.learning_public_courses for select to anon, authenticated
using (true);

drop policy if exists public_read_learning_initiatives on public.learning_public_initiatives;
create policy public_read_learning_initiatives
on public.learning_public_initiatives for select to anon, authenticated
using (true);

drop policy if exists public_read_learning_evidence on public.learning_public_evidence;
create policy public_read_learning_evidence
on public.learning_public_evidence for select to anon, authenticated
using (true);

drop policy if exists public_read_learning_sessions on public.learning_public_sessions;
create policy public_read_learning_sessions
on public.learning_public_sessions for select to anon, authenticated
using (true);

revoke all on schema private from public, anon, authenticated;
revoke all on all tables in schema private from public, anon, authenticated;
revoke all on public.learning_public_tickets, public.learning_public_courses, public.learning_public_initiatives, public.learning_public_evidence, public.learning_public_sessions from public;
grant select on public.learning_public_tickets, public.learning_public_courses, public.learning_public_initiatives, public.learning_public_evidence, public.learning_public_sessions to anon, authenticated;

create or replace function private.public_ticket_dto(ticket private.learning_tickets)
returns jsonb
language sql
stable
set search_path = ''
as $$
  select jsonb_strip_nulls(jsonb_build_object(
    'key', ticket.key,
    'issueType', ticket.public_data->>'issueType',
    'title', ticket.public_data->>'title',
    'publicSummary', ticket.public_data->>'publicSummary',
    'deliveryStatus', ticket.delivery_status,
    'evidenceState', ticket.public_data->>'evidenceState',
    'priority', ticket.public_data->>'priority',
    'initiativeSlug', ticket.public_data->>'initiativeSlug',
    'parentKey', ticket.public_data->>'parentKey',
    'dependencies', coalesce(ticket.public_data->'dependencies', '[]'::jsonb),
    'blockers', coalesce(ticket.public_data->'blockers', '[]'::jsonb),
    'createdAt', ticket.public_data->>'createdAt',
    'plannedStart', ticket.planned_start_date,
    'targetDate', ticket.target_date,
    'actualStart', ticket.actual_start_at,
    'completionDate', ticket.completed_at,
    'userEstimate', ticket.user_estimate,
    'definitionOfDone', ticket.public_data->>'definitionOfDone',
    'acceptanceCriteria', coalesce(ticket.public_data->'acceptanceCriteria', '[]'::jsonb),
    'capabilitySlugs', coalesce(ticket.public_data->'capabilitySlugs', '[]'::jsonb),
    'roleLensSlugs', coalesce(ticket.public_data->'roleLensSlugs', '[]'::jsonb),
    'evidenceIds', coalesce(ticket.public_data->'evidenceIds', '[]'::jsonb),
    'reflection', ticket.public_data->>'reflection',
    'nextAction', ticket.public_data->>'nextAction',
    'relatedProjectSlug', ticket.public_data->>'relatedProjectSlug',
    'visibility', 'Public',
    'publicApproved', true,
    'notClaimed', ticket.public_data->>'notClaimed'
  ));
$$;

create or replace function private.refresh_learning_public_projection()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.learning_public_tickets (key, data, rank, updated_at)
  select ticket.key, private.public_ticket_dto(ticket), ticket.rank, now()
  from private.learning_tickets ticket
  where ticket.archived_at is null and ticket.public_approved
  on conflict (key) do update
    set data = excluded.data, rank = excluded.rank, updated_at = excluded.updated_at;

  delete from public.learning_public_tickets projection
  where not exists (
    select 1 from private.learning_tickets ticket
    where ticket.key = projection.key and ticket.archived_at is null and ticket.public_approved
  );

  insert into public.learning_public_courses (id, data, updated_at)
  select course.id, course.public_data, now()
  from private.learning_courses course
  where course.archived_at is null
  on conflict (id) do update set data = excluded.data, updated_at = excluded.updated_at;

  delete from public.learning_public_courses projection
  where not exists (
    select 1 from private.learning_courses course
    where course.id = projection.id and course.archived_at is null
  );

  insert into public.learning_public_initiatives (slug, data, updated_at)
  select initiative.slug, initiative.public_data, now()
  from private.learning_initiatives initiative
  where initiative.archived_at is null
  on conflict (slug) do update set data = excluded.data, updated_at = excluded.updated_at;

  delete from public.learning_public_initiatives projection
  where not exists (
    select 1 from private.learning_initiatives initiative
    where initiative.slug = projection.slug and initiative.archived_at is null
  );

  insert into public.learning_public_evidence (id, data, updated_at)
  select evidence.id, evidence.public_data, now()
  from private.learning_evidence evidence
  where evidence.archived_at is null and evidence.public_approved
  on conflict (id) do update set data = excluded.data, updated_at = excluded.updated_at;

  delete from public.learning_public_evidence projection
  where not exists (
    select 1 from private.learning_evidence evidence
    where evidence.id = projection.id and evidence.archived_at is null and evidence.public_approved
  );

  insert into public.learning_public_sessions (id, data, updated_at)
  select session.id, jsonb_strip_nulls(jsonb_build_object(
    'id', session.id,
    'ticketKey', session.ticket_key,
    'startedAt', session.started_at,
    'endedAt', session.ended_at,
    'durationMinutes', round(extract(epoch from session.ended_at - session.started_at) / 60),
    'publicSummary', session.public_summary,
    'publicApproved', true
  )), now()
  from private.work_sessions session
  where session.ended_at is not null
    and session.superseded_at is null
    and session.public_approved
    and length(trim(coalesce(session.public_summary, ''))) > 0
  on conflict (id) do update set data = excluded.data, updated_at = excluded.updated_at;

  delete from public.learning_public_sessions projection
  where not exists (
    select 1 from private.work_sessions session
    where session.id = projection.id
      and session.ended_at is not null
      and session.superseded_at is null
      and session.public_approved
      and length(trim(coalesce(session.public_summary, ''))) > 0
  );
end;
$$;

revoke all on function private.refresh_learning_public_projection() from public, anon, authenticated;

create or replace function public.learning_public_snapshot()
returns jsonb
language sql
stable
security invoker
set search_path = ''
as $$
  select jsonb_build_object(
    'projectionReady', (select count(*) from public.learning_public_tickets) >= 22,
    'tickets', coalesce((select jsonb_agg(data order by rank, key) from public.learning_public_tickets), '[]'::jsonb),
    'courses', coalesce((select jsonb_agg(data order by id) from public.learning_public_courses), '[]'::jsonb),
    'initiatives', coalesce((select jsonb_agg(data order by slug) from public.learning_public_initiatives), '[]'::jsonb),
    'evidence', coalesce((select jsonb_agg(data order by id) from public.learning_public_evidence), '[]'::jsonb),
    'sessions', coalesce((select jsonb_agg(data order by (data->>'startedAt') desc, id) from public.learning_public_sessions), '[]'::jsonb)
  );
$$;

revoke all on function public.learning_public_snapshot() from public;
grant execute on function public.learning_public_snapshot() to anon, authenticated;

create or replace function public.learning_admin_is_authorized()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select (select private.is_learning_admin());
$$;

revoke all on function public.learning_admin_is_authorized() from public, anon;
grant execute on function public.learning_admin_is_authorized() to authenticated;

create or replace function public.learning_admin_seed(
  p_snapshot jsonb,
  p_expected_baseline_count integer,
  p_correlation_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  item jsonb;
  snapshot jsonb;
  acceptance_index integer;
  next_rank numeric(20, 8) := 1000;
  baseline_count integer;
begin
  if not (select private.is_learning_admin()) then
    raise exception 'Not authorized' using errcode = '42501';
  end if;
  if jsonb_typeof(p_snapshot) <> 'object' then
    raise exception 'Seed snapshot must be an object' using errcode = '22023';
  end if;

  for item in select value from jsonb_array_elements(coalesce(p_snapshot->'initiatives', '[]'::jsonb)) loop
    insert into private.learning_initiatives (slug, public_data)
    values (item->>'slug', item)
    on conflict (slug) do nothing;
  end loop;

  for item in select value from jsonb_array_elements(coalesce(p_snapshot->'tickets', '[]'::jsonb)) loop
    insert into private.learning_tickets (
      key, public_data, delivery_status, rank, planned_start_date, actual_start_at, target_date, completed_at, user_estimate, public_approved, created_at
    ) values (
      item->>'key', item, item->>'deliveryStatus', next_rank,
      nullif(item->>'plannedStart', '')::date,
      nullif(item->>'actualStart', '')::timestamptz,
      nullif(item->>'targetDate', '')::date,
      nullif(item->>'completionDate', '')::timestamptz,
      nullif(item->>'userEstimate', '')::smallint,
      true,
      coalesce(nullif(item->>'createdAt', '')::timestamptz, now())
    ) on conflict (key) do nothing;
    next_rank := next_rank + 1000;

    acceptance_index := 0;
    for snapshot in select value from jsonb_array_elements(coalesce(item->'acceptanceCriteria', '[]'::jsonb)) loop
      insert into private.acceptance_items (ticket_key, item_index, label, mandatory)
      values (item->>'key', acceptance_index, trim(both '"' from snapshot::text), true)
      on conflict (ticket_key, item_index) do nothing;
      acceptance_index := acceptance_index + 1;
    end loop;
  end loop;

  for item in select value from jsonb_array_elements(coalesce(p_snapshot->'courses', '[]'::jsonb)) loop
    insert into private.learning_courses (id, public_data)
    values (item->>'id', item)
    on conflict (id) do nothing;

    for snapshot in select value from jsonb_array_elements(coalesce(item->'progressSnapshots', '[]'::jsonb)) loop
      insert into private.progress_snapshots (
        id, course_id, ticket_key, scope, percentage, total_duration_seconds,
        completed_duration_seconds, remaining_duration_seconds, observed_at,
        source_type, source_provider, value_basis, verification_state,
        verification_label, admin_confirmed_at, current_module, public_approved, created_by
      ) values (
        snapshot->>'id', item->>'id', item->>'relatedTicketKey', coalesce(snapshot->>'scope', 'Course progress'),
        nullif(snapshot->>'percentage', '')::numeric,
        nullif(snapshot->>'totalDurationSeconds', '')::integer,
        nullif(snapshot->>'completedDurationSeconds', '')::integer,
        nullif(snapshot->>'remainingDurationSeconds', '')::integer,
        (snapshot->>'observedAt')::timestamptz,
        case snapshot->>'source'
          when 'Manual' then 'manual_user_entry'
          when 'User-provided screenshot' then 'user_provided_screenshot'
          when 'Browser-assisted verification' then 'browser_assisted_verification'
          else 'manual_user_entry'
        end,
        coalesce(snapshot->>'sourceProvider', item->>'provider'),
        snapshot->>'valueKind', snapshot->>'verificationState',
        coalesce(snapshot->>'verificationLabel', 'Verified by the CareerOS administrator'),
        case when snapshot->>'verificationState' = 'Verified' then now() else null end,
        snapshot->>'currentModule', true, (select auth.uid())
      ) on conflict (id) do nothing;
    end loop;
  end loop;

  for item in select value from jsonb_array_elements(coalesce(p_snapshot->'evidence', '[]'::jsonb)) loop
    insert into private.learning_evidence (id, public_data, public_approved)
    values (item->>'id', item, true)
    on conflict (id) do nothing;
  end loop;

  for item in select value from jsonb_array_elements(coalesce(p_snapshot->'sessions', '[]'::jsonb)) loop
    insert into private.work_sessions (
      id, ticket_key, actor_id, started_at, ended_at, public_summary, public_approved
    ) values (
      item->>'id', item->>'ticketKey', (select auth.uid()),
      (item->>'startedAt')::timestamptz, nullif(item->>'endedAt', '')::timestamptz,
      item->>'outcome', true
    ) on conflict (id) do nothing;
  end loop;

  select count(*) into baseline_count
  from private.learning_tickets ticket
  where ticket.key in (
    select trim(both '"' from value::text)
    from jsonb_array_elements(coalesce(p_snapshot->'baselineTicketKeys', '[]'::jsonb))
  );
  if baseline_count <> p_expected_baseline_count then
    raise exception 'Baseline parity failed: expected %, found %', p_expected_baseline_count, baseline_count using errcode = '23514';
  end if;

  perform private.refresh_learning_public_projection();
  insert into private.audit_events (
    actor_id, entity_type, entity_key, action, after_summary, correlation_id
  ) values (
    (select auth.uid()), 'system', 'learning-seed', 'seed_verified',
    jsonb_build_object('baselineCount', baseline_count, 'totalTicketCount', (select count(*) from private.learning_tickets)),
    p_correlation_id
  ) on conflict (correlation_id, action, entity_key) do nothing;

  return jsonb_build_object(
    'baselineCount', baseline_count,
    'totalTicketCount', (select count(*) from private.learning_tickets),
    'courseCount', (select count(*) from private.learning_courses)
  );
end;
$$;

revoke all on function public.learning_admin_seed(jsonb, integer, uuid) from public, anon;
grant execute on function public.learning_admin_seed(jsonb, integer, uuid) to authenticated;

create or replace function public.learning_admin_snapshot()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not (select private.is_learning_admin()) then
    raise exception 'Not authorized' using errcode = '42501';
  end if;
  return jsonb_build_object(
    'projectionReady', (select count(*) from public.learning_public_tickets) >= 22,
    'tickets', coalesce((select jsonb_agg(data order by rank, key) from public.learning_public_tickets), '[]'::jsonb),
    'courses', coalesce((select jsonb_agg(data order by id) from public.learning_public_courses), '[]'::jsonb),
    'initiatives', coalesce((select jsonb_agg(data order by slug) from public.learning_public_initiatives), '[]'::jsonb),
    'evidence', coalesce((select jsonb_agg(data order by id) from public.learning_public_evidence), '[]'::jsonb),
    'sessions', coalesce((select jsonb_agg(data order by (data->>'startedAt') desc, id) from public.learning_public_sessions), '[]'::jsonb),
    'adminTickets', coalesce((
      select jsonb_agg(
        private.public_ticket_dto(ticket) || jsonb_strip_nulls(jsonb_build_object(
          'revision', ticket.revision,
          'rank', ticket.rank,
          'privateNotes', ticket.private_notes,
          'archivedAt', ticket.archived_at,
          'taskCoachFactors', ticket.coach_factors,
          'publicationApproved', ticket.public_approved,
          'acceptanceItems', coalesce((
            select jsonb_agg(jsonb_strip_nulls(jsonb_build_object(
              'index', item.item_index,
              'label', item.label,
              'mandatory', item.mandatory,
              'completedAt', item.completed_at
            )) order by item.item_index)
            from private.acceptance_items item
            where item.ticket_key = ticket.key
          ), '[]'::jsonb)
        )) order by ticket.rank, ticket.key
      ) from private.learning_tickets ticket
    ), '[]'::jsonb),
    'adminSessions', coalesce((
      select jsonb_agg(jsonb_strip_nulls(jsonb_build_object(
        'id', session.id,
        'ticketKey', session.ticket_key,
        'startedAt', session.started_at,
        'endedAt', session.ended_at,
        'durationMinutes', case when session.ended_at is null then null else round(extract(epoch from session.ended_at - session.started_at) / 60) end,
        'privateNote', session.private_note,
        'publicSummary', session.public_summary,
        'publicApproved', session.public_approved,
        'correctedFrom', session.corrected_from,
        'supersededAt', session.superseded_at
      )) order by session.started_at desc) from private.work_sessions session
    ), '[]'::jsonb),
    'adminEvidence', coalesce((
      select jsonb_agg(evidence.public_data || jsonb_strip_nulls(jsonb_build_object(
        'revision', evidence.revision,
        'privateLocation', evidence.private_location,
        'privateNotes', evidence.private_notes,
        'publicationApproved', evidence.public_approved,
        'archivedAt', evidence.archived_at
      )) order by evidence.created_at, evidence.id)
      from private.learning_evidence evidence
    ), '[]'::jsonb),
    'auditEvents', coalesce((
      select jsonb_agg(jsonb_strip_nulls(jsonb_build_object(
        'id', audit.id,
        'occurredAt', audit.occurred_at,
        'entityType', audit.entity_type,
        'entityKey', audit.entity_key,
        'action', audit.action,
        'beforeSummary', audit.before_summary,
        'afterSummary', audit.after_summary,
        'correlationId', audit.correlation_id,
        'reversible', audit.reversible
      )) order by audit.occurred_at desc) from private.audit_events audit
    ), '[]'::jsonb)
  );
end;
$$;

revoke all on function public.learning_admin_snapshot() from public, anon;
grant execute on function public.learning_admin_snapshot() to authenticated;

create or replace function private.assert_ticket_revision(p_key text, p_expected_revision integer)
returns private.learning_tickets
language plpgsql
security definer
set search_path = ''
as $$
declare
  ticket private.learning_tickets;
begin
  select * into ticket from private.learning_tickets where key = p_key for update;
  if not found then raise exception 'Unknown ticket' using errcode = 'P0002'; end if;
  if ticket.revision <> p_expected_revision then
    raise exception 'Stale ticket revision' using errcode = '40001';
  end if;
  return ticket;
end;
$$;

revoke all on function private.assert_ticket_revision(text, integer) from public, anon, authenticated;

create or replace function public.learning_admin_create_ticket(
  p_ticket jsonb,
  p_correlation_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  new_key text := upper(trim(p_ticket->>'key'));
  new_status text := coalesce(p_ticket->>'deliveryStatus', 'Backlog');
  new_rank numeric(20, 8);
  public_record jsonb;
  acceptance jsonb;
  acceptance_index integer := 0;
begin
  if not (select private.is_learning_admin()) then raise exception 'Not authorized' using errcode = '42501'; end if;
  if new_key !~ '^[A-Z][A-Z0-9-]{2,31}$' then raise exception 'Ticket key format is invalid' using errcode = '22023'; end if;
  if length(trim(coalesce(p_ticket->>'title', ''))) = 0 then raise exception 'Ticket title is required' using errcode = '22023'; end if;
  if length(trim(coalesce(p_ticket->>'publicSummary', ''))) = 0 then raise exception 'Public-safe summary is required' using errcode = '22023'; end if;
  if length(trim(coalesce(p_ticket->>'notClaimed', ''))) = 0 then raise exception 'Truth boundary is required' using errcode = '22023'; end if;
  if p_ticket->>'issueType' not in ('Epic', 'Story', 'Task', 'Bug', 'Spike') then raise exception 'Invalid issue type' using errcode = '22023'; end if;
  if new_status not in ('Backlog', 'Ready', 'In Progress', 'Blocked', 'In Review', 'Done') then raise exception 'Invalid delivery status' using errcode = '22023'; end if;
  if p_ticket->>'priority' not in ('Highest', 'High', 'Medium', 'Low') then raise exception 'Invalid priority' using errcode = '22023'; end if;
  if not exists (select 1 from private.learning_initiatives where slug = p_ticket->>'initiativeSlug') then raise exception 'Unknown initiative' using errcode = 'P0002'; end if;
  if nullif(p_ticket->>'parentKey', '') is not null and not exists (select 1 from private.learning_tickets where key = upper(p_ticket->>'parentKey')) then raise exception 'Unknown parent ticket' using errcode = 'P0002'; end if;
  if new_status = 'Done' then raise exception 'New tickets cannot begin in Done' using errcode = '23514'; end if;

  select coalesce(max(rank), 0) + 1000 into new_rank from private.learning_tickets where delivery_status = new_status;
  public_record := jsonb_strip_nulls(jsonb_build_object(
    'key', new_key,
    'issueType', p_ticket->>'issueType',
    'title', trim(p_ticket->>'title'),
    'publicSummary', trim(p_ticket->>'publicSummary'),
    'deliveryStatus', new_status,
    'evidenceState', coalesce(p_ticket->>'evidenceState', 'Planned'),
    'priority', p_ticket->>'priority',
    'initiativeSlug', p_ticket->>'initiativeSlug',
    'parentKey', nullif(upper(p_ticket->>'parentKey'), ''),
    'dependencies', coalesce(p_ticket->'dependencies', '[]'::jsonb),
    'blockers', '[]'::jsonb,
    'createdAt', now(),
    'plannedStart', nullif(p_ticket->>'plannedStart', '')::date,
    'definitionOfDone', trim(coalesce(p_ticket->>'definitionOfDone', '')),
    'acceptanceCriteria', coalesce(p_ticket->'acceptanceCriteria', '[]'::jsonb),
    'capabilitySlugs', coalesce(p_ticket->'capabilitySlugs', '[]'::jsonb),
    'roleLensSlugs', coalesce(p_ticket->'roleLensSlugs', '[]'::jsonb),
    'evidenceIds', '[]'::jsonb,
    'nextAction', trim(coalesce(p_ticket->>'nextAction', '')),
    'relatedProjectSlug', coalesce(nullif(p_ticket->>'relatedProjectSlug', ''), 'careeros-learning-delivery'),
    'visibility', 'Public',
    'publicApproved', true,
    'notClaimed', trim(p_ticket->>'notClaimed')
  ));

  insert into private.learning_tickets (
    key, public_data, private_notes, delivery_status, rank,
    planned_start_date, public_approved, created_at
  ) values (
    new_key, public_record, nullif(p_ticket->>'privateNotes', ''), new_status, new_rank,
    nullif(p_ticket->>'plannedStart', '')::date,
    coalesce((p_ticket->>'publicationApproved')::boolean, false), now()
  );

  for acceptance in select value from jsonb_array_elements(coalesce(p_ticket->'acceptanceCriteria', '[]'::jsonb)) loop
    insert into private.acceptance_items (ticket_key, item_index, label, mandatory)
    values (new_key, acceptance_index, trim(both '"' from acceptance::text), true);
    acceptance_index := acceptance_index + 1;
  end loop;

  insert into private.audit_events (actor_id, entity_type, entity_key, action, after_summary, correlation_id)
  values ((select auth.uid()), 'ticket', new_key, 'create', jsonb_build_object('deliveryStatus', new_status, 'rank', new_rank, 'publicationApproved', coalesce((p_ticket->>'publicationApproved')::boolean, false)), p_correlation_id);
  perform private.refresh_learning_public_projection();
  return jsonb_build_object('key', new_key, 'revision', 1, 'rank', new_rank);
end;
$$;

revoke all on function public.learning_admin_create_ticket(jsonb, uuid) from public, anon;
grant execute on function public.learning_admin_create_ticket(jsonb, uuid) to authenticated;

create or replace function public.learning_admin_move_ticket(
  p_key text,
  p_status text,
  p_rank numeric,
  p_expected_revision integer,
  p_context jsonb,
  p_correlation_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  ticket private.learning_tickets;
  next_actual_start timestamptz;
  next_completed_at timestamptz;
  remaining_mandatory integer;
begin
  if not (select private.is_learning_admin()) then raise exception 'Not authorized' using errcode = '42501'; end if;
  if p_status not in ('Backlog', 'Ready', 'In Progress', 'Blocked', 'In Review', 'Done') then raise exception 'Invalid delivery status' using errcode = '22023'; end if;
  if p_rank is null or p_rank <= 0 then raise exception 'Rank must be positive' using errcode = '22023'; end if;
  ticket := private.assert_ticket_revision(upper(p_key), p_expected_revision);
  next_actual_start := ticket.actual_start_at;
  next_completed_at := ticket.completed_at;

  if ticket.delivery_status = 'Done' and p_status <> 'Done' then
    next_completed_at := null;
  end if;

  if p_status = 'In Progress' and ticket.actual_start_at is null then
    if coalesce(p_context->>'actualStartMode', 'keep_unknown') = 'now' then
      next_actual_start := now();
    elsif p_context->>'actualStartMode' = 'verified_date' then
      next_actual_start := nullif(p_context->>'actualStartAt', '')::timestamptz;
      if next_actual_start is null or next_actual_start > now() then raise exception 'A verified actual start is required' using errcode = '22023'; end if;
    elsif coalesce(p_context->>'actualStartMode', 'keep_unknown') <> 'keep_unknown' then
      raise exception 'Invalid actual-start mode' using errcode = '22023';
    end if;
  end if;

  if p_status = 'Blocked' then
    if length(trim(coalesce(p_context->>'blockerReason', ''))) = 0 or length(trim(coalesce(p_context->>'blockerNextCheck', ''))) = 0 then
      raise exception 'Blocked requires a private reason and next check' using errcode = '23514';
    end if;
    insert into private.learning_blockers (ticket_key, private_reason, next_check, created_by)
    values (ticket.key, p_context->>'blockerReason', p_context->>'blockerNextCheck', (select auth.uid()));
  elsif ticket.delivery_status = 'Blocked' and p_status <> 'Blocked' then
    update private.learning_blockers
    set resolved_at = now()
    where ticket_key = ticket.key and resolved_at is null;
  end if;

  if p_status = 'Done' then
    select count(*) into remaining_mandatory
    from private.acceptance_items
    where ticket_key = ticket.key and mandatory and completed_at is null;
    if remaining_mandatory > 0 then raise exception 'Mandatory completion items remain' using errcode = '23514'; end if;
    if jsonb_array_length(coalesce(ticket.public_data->'evidenceIds', '[]'::jsonb)) = 0 then raise exception 'Done requires linked evidence' using errcode = '23514'; end if;
    next_completed_at := nullif(p_context->>'completedAt', '')::timestamptz;
    if next_completed_at is null or next_completed_at > now() then raise exception 'Done requires a real completion timestamp' using errcode = '23514'; end if;
  end if;

  update private.learning_tickets
  set delivery_status = p_status,
      rank = p_rank,
      actual_start_at = next_actual_start,
      completed_at = next_completed_at,
      public_data = jsonb_strip_nulls(public_data || jsonb_build_object(
        'deliveryStatus', p_status,
        'actualStart', next_actual_start,
        'completionDate', next_completed_at
      )),
      revision = revision + 1,
      status_changed_at = case when delivery_status is distinct from p_status then now() else status_changed_at end,
      updated_at = now()
  where key = ticket.key;

  insert into private.audit_events (
    actor_id, entity_type, entity_key, action, before_summary, after_summary,
    correlation_id, reversible, request_context
  ) values (
    (select auth.uid()), 'ticket', ticket.key, 'move',
    jsonb_build_object('deliveryStatus', ticket.delivery_status, 'rank', ticket.rank, 'revision', ticket.revision, 'actualStart', ticket.actual_start_at, 'completedAt', ticket.completed_at),
    jsonb_build_object('deliveryStatus', p_status, 'rank', p_rank, 'revision', ticket.revision + 1, 'actualStart', next_actual_start, 'completedAt', next_completed_at),
    p_correlation_id, ticket.delivery_status not in ('Blocked', 'Done') and p_status not in ('Blocked', 'Done'),
    jsonb_strip_nulls(jsonb_build_object('overrideReason', p_context->>'overrideReason'))
  );
  perform private.refresh_learning_public_projection();
  return jsonb_build_object('key', ticket.key, 'revision', ticket.revision + 1);
end;
$$;

revoke all on function public.learning_admin_move_ticket(text, text, numeric, integer, jsonb, uuid) from public, anon;
grant execute on function public.learning_admin_move_ticket(text, text, numeric, integer, jsonb, uuid) to authenticated;

create or replace function public.learning_admin_update_ticket(
  p_key text,
  p_patch jsonb,
  p_expected_revision integer,
  p_correlation_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  ticket private.learning_tickets;
  field_name text;
  next_public jsonb;
  next_private_notes text;
  next_planned date;
  next_actual timestamptz;
  next_target date;
  next_completed timestamptz;
  next_estimate smallint;
  next_factors jsonb;
begin
  if not (select private.is_learning_admin()) then raise exception 'Not authorized' using errcode = '42501'; end if;
  if jsonb_typeof(p_patch) <> 'object' then raise exception 'Patch must be an object' using errcode = '22023'; end if;
  for field_name in select jsonb_object_keys(p_patch) loop
    if field_name not in ('title', 'publicSummary', 'nextAction', 'priority', 'initiativeSlug', 'dependencies', 'capabilitySlugs', 'roleLensSlugs', 'plannedStart', 'actualStart', 'targetDate', 'completionDate', 'userEstimate', 'taskCoachFactors', 'privateNotes', 'publicationApproved') then
      raise exception 'Unsupported ticket field: %', field_name using errcode = '22023';
    end if;
  end loop;
  ticket := private.assert_ticket_revision(upper(p_key), p_expected_revision);
  next_public := ticket.public_data;
  if p_patch ? 'title' then
    if length(trim(coalesce(p_patch->>'title', ''))) = 0 then raise exception 'Title is required' using errcode = '22023'; end if;
    next_public := jsonb_set(next_public, '{title}', to_jsonb(trim(p_patch->>'title')));
  end if;
  if p_patch ? 'publicSummary' then
    if length(trim(coalesce(p_patch->>'publicSummary', ''))) = 0 then raise exception 'Public summary is required' using errcode = '22023'; end if;
    next_public := jsonb_set(next_public, '{publicSummary}', to_jsonb(trim(p_patch->>'publicSummary')));
  end if;
  if p_patch ? 'nextAction' then
    if length(trim(coalesce(p_patch->>'nextAction', ''))) = 0 then raise exception 'Next action is required' using errcode = '22023'; end if;
    next_public := jsonb_set(next_public, '{nextAction}', to_jsonb(trim(p_patch->>'nextAction')));
  end if;
  if p_patch ? 'priority' then
    if p_patch->>'priority' not in ('Highest', 'High', 'Medium', 'Low') then raise exception 'Invalid priority' using errcode = '22023'; end if;
    next_public := jsonb_set(next_public, '{priority}', p_patch->'priority');
  end if;
  if p_patch ? 'initiativeSlug' then
    if not exists (select 1 from private.learning_initiatives where slug = p_patch->>'initiativeSlug' and archived_at is null) then raise exception 'Unknown initiative' using errcode = 'P0002'; end if;
    next_public := jsonb_set(next_public, '{initiativeSlug}', p_patch->'initiativeSlug');
  end if;
  if p_patch ? 'dependencies' then
    if jsonb_typeof(p_patch->'dependencies') <> 'array' then raise exception 'Dependencies must be an array' using errcode = '22023'; end if;
    if exists (
      select 1 from jsonb_array_elements_text(p_patch->'dependencies') as dependency(value)
      where upper(dependency.value) = ticket.key
         or not exists (select 1 from private.learning_tickets candidate where candidate.key = upper(dependency.value) and candidate.archived_at is null)
    ) then raise exception 'Dependencies must reference active tickets other than the current ticket' using errcode = '23514'; end if;
    next_public := jsonb_set(next_public, '{dependencies}', p_patch->'dependencies');
  end if;
  if p_patch ? 'capabilitySlugs' then
    if jsonb_typeof(p_patch->'capabilitySlugs') <> 'array' then raise exception 'Capabilities must be an array' using errcode = '22023'; end if;
    next_public := jsonb_set(next_public, '{capabilitySlugs}', p_patch->'capabilitySlugs');
  end if;
  if p_patch ? 'roleLensSlugs' then
    if jsonb_typeof(p_patch->'roleLensSlugs') <> 'array' then raise exception 'Role lenses must be an array' using errcode = '22023'; end if;
    next_public := jsonb_set(next_public, '{roleLensSlugs}', p_patch->'roleLensSlugs');
  end if;
  next_private_notes := case when p_patch ? 'privateNotes' then nullif(p_patch->>'privateNotes', '') else ticket.private_notes end;
  next_planned := case when p_patch ? 'plannedStart' then nullif(p_patch->>'plannedStart', '')::date else ticket.planned_start_date end;
  next_actual := case when p_patch ? 'actualStart' then nullif(p_patch->>'actualStart', '')::timestamptz else ticket.actual_start_at end;
  next_target := case when p_patch ? 'targetDate' then nullif(p_patch->>'targetDate', '')::date else ticket.target_date end;
  next_completed := case when p_patch ? 'completionDate' then nullif(p_patch->>'completionDate', '')::timestamptz else ticket.completed_at end;
  next_estimate := case when p_patch ? 'userEstimate' then nullif(p_patch->>'userEstimate', '')::smallint else ticket.user_estimate end;
  next_factors := case when p_patch ? 'taskCoachFactors' then p_patch->'taskCoachFactors' else ticket.coach_factors end;
  if next_estimate is not null and next_estimate not in (1, 2, 3, 5, 8, 13) then raise exception 'User estimate must use the supported Fibonacci values' using errcode = '22023'; end if;
  if next_completed is not null and ticket.delivery_status <> 'Done' then raise exception 'Completion timestamp requires Done status' using errcode = '23514'; end if;
  if next_actual is not null and next_actual > now() then raise exception 'Actual start cannot be in the future' using errcode = '22023'; end if;
  if next_factors is not null and exists (
    select 1 from jsonb_each_text(next_factors) factor
    where factor.key not in ('scope', 'uncertainty', 'dependencies', 'environment', 'reviewEvidence', 'contextSwitching')
       or factor.value::integer not between 0 and 3
  ) then raise exception 'Task-coach factors must use the six supported 0-3 scores' using errcode = '22023'; end if;

  update private.learning_tickets
  set public_data = jsonb_strip_nulls(next_public || jsonb_build_object(
        'plannedStart', next_planned, 'actualStart', next_actual,
        'targetDate', next_target, 'completionDate', next_completed,
        'userEstimate', next_estimate
      )),
      private_notes = next_private_notes,
      planned_start_date = next_planned,
      actual_start_at = next_actual,
      target_date = next_target,
      completed_at = next_completed,
      user_estimate = next_estimate,
      coach_factors = next_factors,
      public_approved = case when p_patch ? 'publicationApproved' then (p_patch->>'publicationApproved')::boolean else ticket.public_approved end,
      revision = revision + 1,
      updated_at = now()
  where key = ticket.key;

  insert into private.audit_events (actor_id, entity_type, entity_key, action, before_summary, after_summary, correlation_id)
  values (
    (select auth.uid()), 'ticket', ticket.key, 'update_fields',
    jsonb_strip_nulls(jsonb_build_object(
      'revision', ticket.revision,
      'changedFields', (select jsonb_agg(key) from jsonb_object_keys(p_patch) key),
      'priority', ticket.public_data->>'priority',
      'initiativeSlug', ticket.public_data->>'initiativeSlug',
      'plannedStart', ticket.planned_start_date,
      'actualStart', ticket.actual_start_at,
      'targetDate', ticket.target_date,
      'completedAt', ticket.completed_at,
      'userEstimate', ticket.user_estimate,
      'publicationApproved', ticket.public_approved
    )),
    jsonb_strip_nulls(jsonb_build_object(
      'revision', ticket.revision + 1,
      'changedFields', (select jsonb_agg(key) from jsonb_object_keys(p_patch) key),
      'priority', next_public->>'priority',
      'initiativeSlug', next_public->>'initiativeSlug',
      'plannedStart', next_planned,
      'actualStart', next_actual,
      'targetDate', next_target,
      'completedAt', next_completed,
      'userEstimate', next_estimate,
      'publicationApproved', case when p_patch ? 'publicationApproved' then (p_patch->>'publicationApproved')::boolean else ticket.public_approved end
    )),
    p_correlation_id
  );
  perform private.refresh_learning_public_projection();
  return jsonb_build_object('key', ticket.key, 'revision', ticket.revision + 1);
end;
$$;

revoke all on function public.learning_admin_update_ticket(text, jsonb, integer, uuid) from public, anon;
grant execute on function public.learning_admin_update_ticket(text, jsonb, integer, uuid) to authenticated;

create or replace function public.learning_admin_toggle_acceptance(
  p_key text,
  p_item_index integer,
  p_completed boolean,
  p_expected_revision integer,
  p_correlation_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare ticket private.learning_tickets;
begin
  if not (select private.is_learning_admin()) then raise exception 'Not authorized' using errcode = '42501'; end if;
  ticket := private.assert_ticket_revision(upper(p_key), p_expected_revision);
  update private.acceptance_items
  set completed_at = case when p_completed then now() else null end,
      completed_by = case when p_completed then (select auth.uid()) else null end
  where ticket_key = ticket.key and item_index = p_item_index;
  if not found then raise exception 'Unknown acceptance item' using errcode = 'P0002'; end if;
  update private.learning_tickets set revision = revision + 1, updated_at = now() where key = ticket.key;
  insert into private.audit_events (actor_id, entity_type, entity_key, action, before_summary, after_summary, correlation_id)
  values ((select auth.uid()), 'ticket', ticket.key, 'acceptance_item', jsonb_build_object('itemIndex', p_item_index, 'completed', not p_completed), jsonb_build_object('itemIndex', p_item_index, 'completed', p_completed), p_correlation_id);
  return jsonb_build_object('key', ticket.key, 'revision', ticket.revision + 1);
end;
$$;

revoke all on function public.learning_admin_toggle_acceptance(text, integer, boolean, integer, uuid) from public, anon;
grant execute on function public.learning_admin_toggle_acceptance(text, integer, boolean, integer, uuid) to authenticated;

create or replace function public.learning_admin_start_session(
  p_key text,
  p_expected_revision integer,
  p_correlation_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare ticket private.learning_tickets; new_id text;
begin
  if not (select private.is_learning_admin()) then raise exception 'Not authorized' using errcode = '42501'; end if;
  ticket := private.assert_ticket_revision(upper(p_key), p_expected_revision);
  insert into private.work_sessions (ticket_key, actor_id, started_at)
  values (ticket.key, (select auth.uid()), now()) returning id into new_id;
  insert into private.audit_events (actor_id, entity_type, entity_key, action, after_summary, correlation_id)
  values ((select auth.uid()), 'work_session', new_id::text, 'session_started', jsonb_build_object('ticketKey', ticket.key, 'startedAt', now()), p_correlation_id);
  return jsonb_build_object('sessionId', new_id);
exception when unique_violation then
  raise exception 'A work session is already running' using errcode = '23505';
end;
$$;

revoke all on function public.learning_admin_start_session(text, integer, uuid) from public, anon;
grant execute on function public.learning_admin_start_session(text, integer, uuid) to authenticated;

create or replace function public.learning_admin_stop_session(
  p_session_id text,
  p_capture jsonb,
  p_correlation_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare session private.work_sessions; stopped_at timestamptz := now();
begin
  if not (select private.is_learning_admin()) then raise exception 'Not authorized' using errcode = '42501'; end if;
  select * into session from private.work_sessions where id = p_session_id and actor_id = (select auth.uid()) for update;
  if not found then raise exception 'Unknown work session' using errcode = 'P0002'; end if;
  if session.ended_at is not null then raise exception 'Work session is already stopped' using errcode = '23514'; end if;
  if stopped_at - session.started_at > interval '16 hours' and length(trim(coalesce(p_capture->>'privateNote', ''))) = 0 then
    raise exception 'Long sessions require a correction note' using errcode = '23514';
  end if;
  if coalesce((p_capture->>'publicApproved')::boolean, false) and length(trim(coalesce(p_capture->>'publicSummary', ''))) = 0 then
    raise exception 'Published sessions require a public-safe outcome' using errcode = '23514';
  end if;
  update private.work_sessions
  set ended_at = stopped_at,
      private_note = nullif(p_capture->>'privateNote', ''),
      public_summary = nullif(p_capture->>'publicSummary', ''),
      public_approved = coalesce((p_capture->>'publicApproved')::boolean, false)
  where id = session.id;
  if length(trim(coalesce(p_capture->>'nextAction', ''))) > 0 then
    update private.learning_tickets
    set public_data = jsonb_set(public_data, '{nextAction}', to_jsonb(trim(p_capture->>'nextAction'))),
        revision = revision + 1, updated_at = now()
    where key = session.ticket_key;
    perform private.refresh_learning_public_projection();
  end if;
  insert into private.audit_events (actor_id, entity_type, entity_key, action, before_summary, after_summary, correlation_id)
  values ((select auth.uid()), 'work_session', session.id::text, 'session_stopped', jsonb_build_object('endedAt', null), jsonb_build_object('endedAt', stopped_at, 'ticketKey', session.ticket_key, 'publicApproved', coalesce((p_capture->>'publicApproved')::boolean, false)), p_correlation_id);
  return jsonb_build_object('sessionId', session.id, 'endedAt', stopped_at);
end;
$$;

revoke all on function public.learning_admin_stop_session(text, jsonb, uuid) from public, anon;
grant execute on function public.learning_admin_stop_session(text, jsonb, uuid) to authenticated;

create or replace function public.learning_admin_add_manual_session(
  p_key text,
  p_started_at timestamptz,
  p_ended_at timestamptz,
  p_capture jsonb,
  p_corrected_from text,
  p_correlation_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  ticket private.learning_tickets;
  prior_session private.work_sessions;
  new_id text;
begin
  if not (select private.is_learning_admin()) then raise exception 'Not authorized' using errcode = '42501'; end if;
  select * into ticket from private.learning_tickets where key = upper(p_key);
  if not found then raise exception 'Unknown ticket' using errcode = 'P0002'; end if;
  if p_started_at is null or p_ended_at is null or p_ended_at < p_started_at then
    raise exception 'A valid start and end are required' using errcode = '22023';
  end if;
  if p_ended_at > now() then raise exception 'A work session cannot end in the future' using errcode = '22023'; end if;
  if p_ended_at - p_started_at > interval '16 hours' and length(trim(coalesce(p_capture->>'privateNote', ''))) = 0 then
    raise exception 'Sessions longer than 16 hours require a correction note' using errcode = '23514';
  end if;
  if coalesce((p_capture->>'publicApproved')::boolean, false) and length(trim(coalesce(p_capture->>'publicSummary', ''))) = 0 then
    raise exception 'Published sessions require a public-safe outcome' using errcode = '23514';
  end if;

  if nullif(p_corrected_from, '') is not null then
    select * into prior_session
    from private.work_sessions
    where id = p_corrected_from and actor_id = (select auth.uid()) and ended_at is not null and superseded_at is null
    for update;
    if not found then raise exception 'The original session is not available for correction' using errcode = 'P0002'; end if;
    if prior_session.ticket_key <> ticket.key then raise exception 'A correction must remain on the same ticket' using errcode = '23514'; end if;
    update private.work_sessions set superseded_at = now() where id = prior_session.id;
  end if;

  insert into private.work_sessions (
    ticket_key, actor_id, started_at, ended_at, private_note,
    public_summary, public_approved, corrected_from
  ) values (
    ticket.key, (select auth.uid()), p_started_at, p_ended_at,
    nullif(p_capture->>'privateNote', ''), nullif(p_capture->>'publicSummary', ''),
    coalesce((p_capture->>'publicApproved')::boolean, false), nullif(p_corrected_from, '')
  ) returning id into new_id;

  if length(trim(coalesce(p_capture->>'nextAction', ''))) > 0 then
    update private.learning_tickets
    set public_data = jsonb_set(public_data, '{nextAction}', to_jsonb(trim(p_capture->>'nextAction'))),
        revision = revision + 1,
        updated_at = now()
    where key = ticket.key;
    perform private.refresh_learning_public_projection();
  end if;

  insert into private.audit_events (
    actor_id, entity_type, entity_key, action, before_summary, after_summary, correlation_id
  ) values (
    (select auth.uid()), 'work_session', new_id,
    case when nullif(p_corrected_from, '') is null then 'manual_session_added' else 'session_corrected' end,
    case when nullif(p_corrected_from, '') is null then null else jsonb_build_object('supersededSessionId', p_corrected_from) end,
    jsonb_build_object('ticketKey', ticket.key, 'startedAt', p_started_at, 'endedAt', p_ended_at, 'publicApproved', coalesce((p_capture->>'publicApproved')::boolean, false)),
    p_correlation_id
  );
  return jsonb_build_object('sessionId', new_id);
end;
$$;

revoke all on function public.learning_admin_add_manual_session(text, timestamptz, timestamptz, jsonb, text, uuid) from public, anon;
grant execute on function public.learning_admin_add_manual_session(text, timestamptz, timestamptz, jsonb, text, uuid) to authenticated;

create or replace function public.learning_admin_add_progress_snapshot(
  p_course_id text,
  p_ticket_key text,
  p_snapshot jsonb,
  p_public_approved boolean,
  p_private_evidence_reference text,
  p_correlation_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  source_type text;
  new_public_snapshot jsonb;
begin
  if not (select private.is_learning_admin()) then raise exception 'Not authorized' using errcode = '42501'; end if;
  if not exists (select 1 from private.learning_courses where id = p_course_id) then raise exception 'Unknown course' using errcode = 'P0002'; end if;
  if not exists (select 1 from private.learning_tickets where key = upper(p_ticket_key)) then raise exception 'Unknown ticket' using errcode = 'P0002'; end if;
  if p_snapshot->>'scope' <> 'Course progress' then raise exception 'This workflow accepts course-scoped progress only' using errcode = '22023'; end if;
  source_type := case p_snapshot->>'source'
    when 'Manual' then 'manual_user_entry'
    when 'User-provided screenshot' then 'user_provided_screenshot'
    when 'Browser-assisted verification' then 'browser_assisted_verification'
    else null
  end;
  if source_type is null then raise exception 'Unsupported progress source' using errcode = '22023'; end if;
  if p_snapshot->>'verificationState' not in ('Candidate', 'Verified') then raise exception 'Invalid verification state' using errcode = '22023'; end if;
  if p_public_approved and p_snapshot->>'verificationState' <> 'Verified' then raise exception 'Only verified progress can enter the public projection' using errcode = '23514'; end if;

  insert into private.progress_snapshots (
    id, course_id, ticket_key, scope, percentage, total_duration_seconds,
    completed_duration_seconds, remaining_duration_seconds, observed_at,
    source_type, source_provider, value_basis, verification_state,
    verification_label, private_evidence_reference, admin_confirmed_at,
    current_module, public_safe_note, public_approved, created_by
  ) values (
    p_snapshot->>'id', p_course_id, upper(p_ticket_key), p_snapshot->>'scope',
    nullif(p_snapshot->>'percentage', '')::numeric,
    nullif(p_snapshot->>'totalDurationSeconds', '')::integer,
    nullif(p_snapshot->>'completedDurationSeconds', '')::integer,
    nullif(p_snapshot->>'remainingDurationSeconds', '')::integer,
    (p_snapshot->>'observedAt')::timestamptz,
    source_type, p_snapshot->>'sourceProvider', p_snapshot->>'valueKind',
    p_snapshot->>'verificationState', p_snapshot->>'verificationLabel',
    nullif(p_private_evidence_reference, ''),
    case when p_snapshot->>'verificationState' = 'Verified' then now() else null end,
    p_snapshot->>'currentModule', p_snapshot->>'publicSafeNote', p_public_approved,
    (select auth.uid())
  );

  if p_public_approved then
    new_public_snapshot := jsonb_strip_nulls(jsonb_build_object(
      'id', p_snapshot->>'id', 'scope', p_snapshot->>'scope',
      'observedAt', p_snapshot->>'observedAt', 'source', p_snapshot->>'source',
      'sourceProvider', p_snapshot->>'sourceProvider',
      'verificationState', p_snapshot->>'verificationState',
      'verificationLabel', p_snapshot->>'verificationLabel',
      'valueKind', p_snapshot->>'valueKind',
      'percentage', nullif(p_snapshot->>'percentage', '')::numeric,
      'totalDurationSeconds', nullif(p_snapshot->>'totalDurationSeconds', '')::integer,
      'completedDurationSeconds', nullif(p_snapshot->>'completedDurationSeconds', '')::integer,
      'remainingDurationSeconds', nullif(p_snapshot->>'remainingDurationSeconds', '')::integer,
      'currentModule', p_snapshot->>'currentModule', 'relatedEvidenceIds', '[]'::jsonb
    ));
    update private.learning_courses
    set public_data = jsonb_set(public_data, '{progressSnapshots}', coalesce(public_data->'progressSnapshots', '[]'::jsonb) || jsonb_build_array(new_public_snapshot)),
        revision = revision + 1, updated_at = now()
    where id = p_course_id;
    perform private.refresh_learning_public_projection();
  end if;

  insert into private.audit_events (actor_id, entity_type, entity_key, action, after_summary, correlation_id)
  values ((select auth.uid()), 'progress_snapshot', p_snapshot->>'id', case when p_public_approved then 'progress_verified_and_published' else 'progress_candidate' end,
    jsonb_build_object('courseId', p_course_id, 'scope', p_snapshot->>'scope', 'verificationState', p_snapshot->>'verificationState', 'publicApproved', p_public_approved), p_correlation_id);
  return jsonb_build_object('snapshotId', p_snapshot->>'id');
end;
$$;

revoke all on function public.learning_admin_add_progress_snapshot(text, text, jsonb, boolean, text, uuid) from public, anon;
grant execute on function public.learning_admin_add_progress_snapshot(text, text, jsonb, boolean, text, uuid) to authenticated;

create or replace function public.learning_admin_create_evidence(
  p_ticket_key text,
  p_evidence jsonb,
  p_correlation_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  ticket private.learning_tickets;
  evidence_id text := upper(trim(p_evidence->>'id'));
  publish_now boolean := coalesce((p_evidence->>'publicationApproved')::boolean, false);
  public_record jsonb;
begin
  if not (select private.is_learning_admin()) then raise exception 'Not authorized' using errcode = '42501'; end if;
  select * into ticket from private.learning_tickets where key = upper(p_ticket_key) for update;
  if not found then raise exception 'Unknown ticket' using errcode = 'P0002'; end if;
  if evidence_id !~ '^EVD-[A-Z0-9-]{3,60}$' then raise exception 'Evidence ID format is invalid' using errcode = '22023'; end if;
  if p_evidence->>'type' not in ('Course certificate', 'Notes', 'SQL script', 'Query result', 'Test', 'README', 'Diagram', 'Case study', 'Presentation', 'Demo', 'Reflection', 'Pull request', 'Source code', 'Documentation') then raise exception 'Invalid evidence type' using errcode = '22023'; end if;
  if p_evidence->>'verificationState' not in ('Verified', 'Pending Review', 'Not Yet Created') then raise exception 'Invalid verification state' using errcode = '22023'; end if;
  if p_evidence->>'evidenceStateSupported' not in ('Demonstrated', 'Practicing', 'Learning', 'Planned') then raise exception 'Invalid evidence state' using errcode = '22023'; end if;
  if publish_now and p_evidence->>'verificationState' <> 'Verified' then raise exception 'Only verified evidence can enter the public projection' using errcode = '23514'; end if;
  if length(trim(coalesce(p_evidence->>'title', ''))) = 0 then raise exception 'Evidence title is required' using errcode = '22023'; end if;
  if length(trim(coalesce(p_evidence->>'publicSummary', ''))) = 0 then raise exception 'Public summary is required' using errcode = '22023'; end if;
  if length(trim(coalesce(p_evidence->>'limitations', ''))) = 0 then raise exception 'Evidence limitations are required' using errcode = '22023'; end if;
  if length(trim(coalesce(p_evidence->>'notClaimed', ''))) = 0 then raise exception 'Evidence truth boundary is required' using errcode = '22023'; end if;
  if jsonb_typeof(coalesce(p_evidence->'capabilitySlugs', '[]'::jsonb)) <> 'array' or jsonb_typeof(coalesce(p_evidence->'roleLensSlugs', '[]'::jsonb)) <> 'array' then raise exception 'Evidence relationships must be arrays' using errcode = '22023'; end if;

  public_record := jsonb_strip_nulls(jsonb_build_object(
    'id', evidence_id,
    'type', p_evidence->>'type',
    'title', trim(p_evidence->>'title'),
    'dateCreated', coalesce(nullif(p_evidence->>'dateCreated', ''), current_date::text),
    'createdAt', coalesce(nullif(p_evidence->>'createdAt', '')::timestamptz, now()),
    'verificationState', p_evidence->>'verificationState',
    'evidenceStateSupported', p_evidence->>'evidenceStateSupported',
    'relatedTicketKeys', jsonb_build_array(ticket.key),
    'relatedProjectSlug', coalesce(nullif(p_evidence->>'relatedProjectSlug', ''), ticket.public_data->>'relatedProjectSlug'),
    'capabilitySlugs', coalesce(p_evidence->'capabilitySlugs', ticket.public_data->'capabilitySlugs', '[]'::jsonb),
    'roleLensSlugs', coalesce(p_evidence->'roleLensSlugs', ticket.public_data->'roleLensSlugs', '[]'::jsonb),
    'publicUrl', nullif(p_evidence->>'publicUrl', ''),
    'repositoryPath', nullif(p_evidence->>'repositoryPath', ''),
    'publicSummary', trim(p_evidence->>'publicSummary'),
    'limitations', trim(p_evidence->>'limitations'),
    'visibility', 'Public',
    'publicApproved', true,
    'approvedAt', case when publish_now then now() else null end,
    'notClaimed', trim(p_evidence->>'notClaimed')
  ));

  insert into private.learning_evidence (
    id, public_data, private_location, private_notes, public_approved
  ) values (
    evidence_id, public_record, nullif(p_evidence->>'privateLocation', ''),
    nullif(p_evidence->>'privateNotes', ''), publish_now
  );

  if publish_now then
    update private.learning_tickets
    set public_data = jsonb_set(
          public_data,
          '{evidenceIds}',
          case
            when coalesce(public_data->'evidenceIds', '[]'::jsonb) @> jsonb_build_array(evidence_id) then coalesce(public_data->'evidenceIds', '[]'::jsonb)
            else coalesce(public_data->'evidenceIds', '[]'::jsonb) || jsonb_build_array(evidence_id)
          end
        ),
        revision = revision + 1,
        updated_at = now()
    where key = ticket.key;
  end if;

  insert into private.audit_events (actor_id, entity_type, entity_key, action, after_summary, correlation_id)
  values ((select auth.uid()), 'evidence', evidence_id, case when publish_now then 'evidence_created_and_published' else 'evidence_created_private' end,
    jsonb_build_object('ticketKey', ticket.key, 'verificationState', p_evidence->>'verificationState', 'publicApproved', publish_now), p_correlation_id);
  perform private.refresh_learning_public_projection();
  return jsonb_build_object('evidenceId', evidence_id, 'revision', 1);
end;
$$;

revoke all on function public.learning_admin_create_evidence(text, jsonb, uuid) from public, anon;
grant execute on function public.learning_admin_create_evidence(text, jsonb, uuid) to authenticated;

create or replace function public.learning_admin_set_evidence_publication(
  p_id text,
  p_public_approved boolean,
  p_expected_revision integer,
  p_correlation_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  artifact private.learning_evidence;
  related_ticket_key text;
begin
  if not (select private.is_learning_admin()) then raise exception 'Not authorized' using errcode = '42501'; end if;
  select * into artifact from private.learning_evidence where id = upper(p_id) for update;
  if not found then raise exception 'Unknown evidence' using errcode = 'P0002'; end if;
  if artifact.revision <> p_expected_revision then raise exception 'Stale evidence revision' using errcode = '40001'; end if;
  if p_public_approved and artifact.archived_at is not null then raise exception 'Archived evidence cannot be published' using errcode = '23514'; end if;
  if p_public_approved and artifact.public_data->>'verificationState' <> 'Verified' then raise exception 'Only verified evidence can enter the public projection' using errcode = '23514'; end if;

  update private.learning_evidence
  set public_approved = p_public_approved,
      public_data = jsonb_set(public_data, '{approvedAt}', case when p_public_approved then to_jsonb(now()) else 'null'::jsonb end),
      revision = revision + 1,
      updated_at = now()
  where id = artifact.id;

  for related_ticket_key in select value from jsonb_array_elements_text(coalesce(artifact.public_data->'relatedTicketKeys', '[]'::jsonb)) as related_ticket(value) loop
    update private.learning_tickets
    set public_data = jsonb_set(
          public_data,
          '{evidenceIds}',
          case when p_public_approved then
            case
              when coalesce(public_data->'evidenceIds', '[]'::jsonb) @> jsonb_build_array(artifact.id) then coalesce(public_data->'evidenceIds', '[]'::jsonb)
              else coalesce(public_data->'evidenceIds', '[]'::jsonb) || jsonb_build_array(artifact.id)
            end
          else (
            select coalesce(jsonb_agg(evidence_id.value), '[]'::jsonb)
            from jsonb_array_elements_text(coalesce(public_data->'evidenceIds', '[]'::jsonb)) as evidence_id(value)
            where evidence_id.value <> artifact.id
          ) end
        ),
        revision = revision + 1,
        updated_at = now()
    where key = related_ticket_key;
  end loop;

  insert into private.audit_events (actor_id, entity_type, entity_key, action, before_summary, after_summary, correlation_id)
  values ((select auth.uid()), 'evidence', artifact.id, case when p_public_approved then 'evidence_published' else 'evidence_unpublished' end,
    jsonb_build_object('publicApproved', artifact.public_approved, 'revision', artifact.revision),
    jsonb_build_object('publicApproved', p_public_approved, 'revision', artifact.revision + 1), p_correlation_id);
  perform private.refresh_learning_public_projection();
  return jsonb_build_object('evidenceId', artifact.id, 'revision', artifact.revision + 1);
end;
$$;

revoke all on function public.learning_admin_set_evidence_publication(text, boolean, integer, uuid) from public, anon;
grant execute on function public.learning_admin_set_evidence_publication(text, boolean, integer, uuid) to authenticated;

create or replace function public.learning_admin_archive_ticket(
  p_key text,
  p_archive boolean,
  p_expected_revision integer,
  p_correlation_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare ticket private.learning_tickets;
begin
  if not (select private.is_learning_admin()) then raise exception 'Not authorized' using errcode = '42501'; end if;
  ticket := private.assert_ticket_revision(upper(p_key), p_expected_revision);
  update private.learning_tickets set archived_at = case when p_archive then now() else null end, revision = revision + 1, updated_at = now() where key = ticket.key;
  insert into private.audit_events (actor_id, entity_type, entity_key, action, before_summary, after_summary, correlation_id)
  values ((select auth.uid()), 'ticket', ticket.key, case when p_archive then 'archive' else 'restore' end,
    jsonb_build_object('archived', ticket.archived_at is not null), jsonb_build_object('archived', p_archive), p_correlation_id);
  perform private.refresh_learning_public_projection();
  return jsonb_build_object('key', ticket.key, 'revision', ticket.revision + 1);
end;
$$;

revoke all on function public.learning_admin_archive_ticket(text, boolean, integer, uuid) from public, anon;
grant execute on function public.learning_admin_archive_ticket(text, boolean, integer, uuid) to authenticated;

create or replace function public.learning_admin_undo_last_move(p_key text, p_correlation_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare ticket private.learning_tickets; move_event private.audit_events;
begin
  if not (select private.is_learning_admin()) then raise exception 'Not authorized' using errcode = '42501'; end if;
  select * into ticket from private.learning_tickets where key = upper(p_key) for update;
  select * into move_event
  from private.audit_events event
  where event.entity_type = 'ticket' and event.entity_key = ticket.key and event.action = 'move' and event.reversible
    and not exists (
      select 1 from private.audit_events undo
      where undo.entity_type = 'ticket' and undo.entity_key = ticket.key and undo.action = 'undo_move'
        and undo.after_summary->>'undoneAuditId' = event.id::text
    )
  order by event.occurred_at desc limit 1;
  if not found then raise exception 'No reversible move is available' using errcode = 'P0002'; end if;
  if ticket.delivery_status <> move_event.after_summary->>'deliveryStatus' or ticket.rank <> (move_event.after_summary->>'rank')::numeric then
    raise exception 'The ticket changed after this move and cannot be safely undone' using errcode = '40001';
  end if;
  update private.learning_tickets
  set delivery_status = move_event.before_summary->>'deliveryStatus',
      rank = (move_event.before_summary->>'rank')::numeric,
      actual_start_at = nullif(move_event.before_summary->>'actualStart', '')::timestamptz,
      completed_at = nullif(move_event.before_summary->>'completedAt', '')::timestamptz,
      public_data = jsonb_strip_nulls(public_data || jsonb_build_object(
        'deliveryStatus', move_event.before_summary->>'deliveryStatus',
        'actualStart', nullif(move_event.before_summary->>'actualStart', '')::timestamptz,
        'completionDate', nullif(move_event.before_summary->>'completedAt', '')::timestamptz
      )),
      revision = revision + 1, status_changed_at = now(), updated_at = now()
  where key = ticket.key;
  insert into private.audit_events (actor_id, entity_type, entity_key, action, before_summary, after_summary, correlation_id)
  values ((select auth.uid()), 'ticket', ticket.key, 'undo_move', move_event.after_summary,
    move_event.before_summary || jsonb_build_object('undoneAuditId', move_event.id), p_correlation_id);
  perform private.refresh_learning_public_projection();
  return jsonb_build_object('key', ticket.key, 'revision', ticket.revision + 1);
end;
$$;

revoke all on function public.learning_admin_undo_last_move(text, uuid) from public, anon;
grant execute on function public.learning_admin_undo_last_move(text, uuid) to authenticated;

commit;
