begin;

create table if not exists private.operational_incidents (
  incident_key text primary key check (incident_key ~ '^OPS-INC-[0-9]{3,}$'),
  title text not null check (length(trim(title)) between 8 and 180),
  status text not null check (status in ('Open', 'Monitoring', 'Resolved')),
  severity text not null check (severity in ('Critical', 'High', 'Moderate', 'Low')),
  detected_on date not null,
  resolved_on date,
  affected_service text not null check (length(trim(affected_service)) between 3 and 120),
  public_symptom text not null default '',
  public_impact text not null default '',
  public_root_cause text not null default '',
  public_resolution text not null default '',
  public_prevention text not null default '',
  private_evidence_reference text,
  related_ticket_key text not null references private.learning_tickets(key),
  related_project_slug text not null,
  capability_slugs text[] not null default '{}',
  publication_approved boolean not null default false,
  revision integer not null default 1 check (revision > 0),
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (resolved_on is null or resolved_on >= detected_on)
);

create table if not exists private.bug_records (
  bug_key text primary key references private.learning_tickets(key),
  category text not null check (category in ('Authentication', 'Authorization', 'Data', 'Integration', 'UI', 'Accessibility', 'Performance', 'Security/Privacy', 'Deployment', 'Observability', 'Content')),
  severity text not null check (severity in ('Critical', 'High', 'Moderate', 'Low')),
  incident_key text not null references private.operational_incidents(incident_key),
  affected_feature_keys text[] not null default '{}',
  reporter_source text not null default 'Operational investigation',
  verification_state text not null default 'Verified' check (verification_state in ('Candidate', 'Confirmed', 'Resolved', 'Verified', 'Duplicate')),
  private_diagnostic_notes text,
  public_derivative jsonb not null default '{}'::jsonb check (jsonb_typeof(public_derivative) = 'object'),
  public_derivative_approved boolean not null default true,
  revision integer not null default 1 check (revision > 0),
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists private.bug_observations (
  id uuid primary key default gen_random_uuid(),
  bug_key text not null references private.bug_records(bug_key),
  observed_at timestamptz not null,
  observation_type text not null check (observation_type in ('Symptom', 'Diagnostic', 'Hypothesis', 'Root cause', 'Fix', 'Verification', 'Reopen', 'Duplicate review')),
  private_note text not null check (length(trim(private_note)) between 1 and 4000),
  public_summary text,
  public_approved boolean not null default false,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  check (not public_approved or length(trim(coalesce(public_summary, ''))) > 0)
);

alter table private.operational_incidents enable row level security;
alter table private.bug_records enable row level security;
alter table private.bug_observations enable row level security;

drop policy if exists learning_admin_all on private.operational_incidents;
create policy learning_admin_all on private.operational_incidents
for all to authenticated
using ((select private.is_learning_admin()))
with check ((select private.is_learning_admin()));

drop policy if exists learning_admin_all on private.bug_records;
create policy learning_admin_all on private.bug_records
for all to authenticated
using ((select private.is_learning_admin()))
with check ((select private.is_learning_admin()));

drop policy if exists learning_admin_all on private.bug_observations;
create policy learning_admin_all on private.bug_observations
for all to authenticated
using ((select private.is_learning_admin()))
with check ((select private.is_learning_admin()));

revoke all on private.operational_incidents, private.bug_records, private.bug_observations from public, anon, authenticated;

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
    'notClaimed', ticket.public_data->>'notClaimed',
    'bugClassification', ticket.public_data->'bugClassification'
  ));
$$;

create or replace function public.learning_admin_seed_operations(p_correlation_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  ticket private.learning_tickets;
  classification jsonb;
  incident_status text;
begin
  if not (select private.is_learning_admin()) then
    raise exception 'Not authorized' using errcode = '42501';
  end if;

  for ticket in
    select item.*
    from private.learning_tickets item
    where item.public_data->>'issueType' = 'Bug'
      and jsonb_typeof(item.public_data->'bugClassification') = 'object'
  loop
    classification := ticket.public_data->'bugClassification';
    incident_status := case when ticket.delivery_status = 'Done' then 'Resolved' else 'Open' end;

    insert into private.operational_incidents (
      incident_key, title, status, severity, detected_on, resolved_on,
      affected_service, public_symptom, public_impact, public_root_cause,
      public_resolution, public_prevention, related_ticket_key,
      related_project_slug, capability_slugs, publication_approved, created_by
    ) values (
      classification->>'relatedIncidentKey',
      ticket.public_data->>'title',
      incident_status,
      classification->>'severity',
      (classification->>'detectedOn')::date,
      nullif(classification->>'resolvedOn', '')::date,
      classification->>'affectedService',
      classification->>'publicSymptom',
      ticket.public_data->>'publicSummary',
      classification->>'publicRootCause',
      classification->>'publicFix',
      classification->>'prevention',
      ticket.key,
      ticket.public_data->>'relatedProjectSlug',
      array(select jsonb_array_elements_text(coalesce(ticket.public_data->'capabilitySlugs', '[]'::jsonb))),
      true,
      (select auth.uid())
    ) on conflict (incident_key) do nothing;

    insert into private.bug_records (
      bug_key, category, severity, incident_key, affected_feature_keys,
      verification_state, public_derivative, public_derivative_approved, created_by
    ) values (
      ticket.key,
      classification->>'category',
      classification->>'severity',
      classification->>'relatedIncidentKey',
      array(select jsonb_array_elements_text(coalesce(classification->'affectedFeatureKeys', '[]'::jsonb))),
      case when ticket.delivery_status = 'Done' then 'Verified' else 'Confirmed' end,
      classification,
      true,
      (select auth.uid())
    ) on conflict (bug_key) do nothing;
  end loop;

  insert into private.audit_events (
    actor_id, entity_type, entity_key, action, after_summary, correlation_id
  ) values (
    (select auth.uid()), 'system', 'operations-seed', 'operations_seed_verified',
    jsonb_build_object(
      'bugCount', (select count(*) from private.bug_records),
      'incidentCount', (select count(*) from private.operational_incidents)
    ),
    p_correlation_id
  ) on conflict (correlation_id, action, entity_key) do nothing;

  return jsonb_build_object(
    'bugCount', (select count(*) from private.bug_records),
    'incidentCount', (select count(*) from private.operational_incidents)
  );
end;
$$;

revoke all on function public.learning_admin_seed_operations(uuid) from public, anon;
grant execute on function public.learning_admin_seed_operations(uuid) to authenticated;

create or replace function public.learning_admin_operations_snapshot()
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
    'bugRecords', coalesce((
      select jsonb_agg(jsonb_strip_nulls(jsonb_build_object(
        'bugKey', bug.bug_key,
        'category', bug.category,
        'severity', bug.severity,
        'incidentKey', bug.incident_key,
        'affectedFeatureKeys', to_jsonb(bug.affected_feature_keys),
        'reporterSource', bug.reporter_source,
        'verificationState', bug.verification_state,
        'privateDiagnosticNotes', bug.private_diagnostic_notes,
        'publicDerivative', bug.public_derivative,
        'publicDerivativeApproved', bug.public_derivative_approved,
        'revision', bug.revision,
        'updatedAt', bug.updated_at
      )) order by bug.updated_at desc, bug.bug_key)
      from private.bug_records bug
    ), '[]'::jsonb),
    'incidents', coalesce((
      select jsonb_agg(jsonb_strip_nulls(jsonb_build_object(
        'incidentKey', incident.incident_key,
        'title', incident.title,
        'status', incident.status,
        'severity', incident.severity,
        'detectedOn', incident.detected_on,
        'resolvedOn', incident.resolved_on,
        'affectedService', incident.affected_service,
        'publicSymptom', incident.public_symptom,
        'publicImpact', incident.public_impact,
        'publicRootCause', incident.public_root_cause,
        'publicResolution', incident.public_resolution,
        'publicPrevention', incident.public_prevention,
        'privateEvidenceReference', incident.private_evidence_reference,
        'relatedTicketKey', incident.related_ticket_key,
        'relatedProjectSlug', incident.related_project_slug,
        'capabilitySlugs', to_jsonb(incident.capability_slugs),
        'publicationApproved', incident.publication_approved,
        'revision', incident.revision,
        'updatedAt', incident.updated_at
      )) order by incident.detected_on desc, incident.incident_key)
      from private.operational_incidents incident
    ), '[]'::jsonb),
    'observations', coalesce((
      select jsonb_agg(jsonb_strip_nulls(jsonb_build_object(
        'id', observation.id,
        'bugKey', observation.bug_key,
        'observedAt', observation.observed_at,
        'observationType', observation.observation_type,
        'privateNote', observation.private_note,
        'publicSummary', observation.public_summary,
        'publicApproved', observation.public_approved,
        'createdAt', observation.created_at
      )) order by observation.observed_at desc, observation.id)
      from private.bug_observations observation
    ), '[]'::jsonb)
  );
end;
$$;

revoke all on function public.learning_admin_operations_snapshot() from public, anon;
grant execute on function public.learning_admin_operations_snapshot() to authenticated;

create or replace function public.learning_admin_update_bug_record(
  p_bug_key text,
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
  before_record private.bug_records;
  after_record private.bug_records;
  next_features text[];
begin
  if not (select private.is_learning_admin()) then
    raise exception 'Not authorized' using errcode = '42501';
  end if;
  if jsonb_typeof(p_patch) <> 'object' then
    raise exception 'Bug patch must be an object' using errcode = '22023';
  end if;

  select * into before_record from private.bug_records where bug_key = upper(p_bug_key) for update;
  if not found then raise exception 'Bug record not found' using errcode = 'P0002'; end if;
  if before_record.revision <> p_expected_revision then raise exception 'Stale bug revision' using errcode = '40001'; end if;

  next_features := case when p_patch ? 'affectedFeatureKeys'
    then array(select jsonb_array_elements_text(p_patch->'affectedFeatureKeys'))
    else before_record.affected_feature_keys
  end;
  if exists (select 1 from unnest(next_features) key where not exists (select 1 from private.learning_tickets ticket where ticket.key = key)) then
    raise exception 'Affected feature key does not exist' using errcode = '23503';
  end if;

  update private.bug_records
  set category = case when p_patch ? 'category' then p_patch->>'category' else category end,
      severity = case when p_patch ? 'severity' then p_patch->>'severity' else severity end,
      affected_feature_keys = next_features,
      verification_state = case when p_patch ? 'verificationState' then p_patch->>'verificationState' else verification_state end,
      private_diagnostic_notes = case when p_patch ? 'privateDiagnosticNotes' then nullif(p_patch->>'privateDiagnosticNotes', '') else private_diagnostic_notes end,
      public_derivative_approved = case when p_patch ? 'publicDerivativeApproved' then (p_patch->>'publicDerivativeApproved')::boolean else public_derivative_approved end,
      public_derivative = public_derivative
        || jsonb_strip_nulls(jsonb_build_object(
          'category', case when p_patch ? 'category' then p_patch->>'category' else null end,
          'severity', case when p_patch ? 'severity' then p_patch->>'severity' else null end,
          'affectedFeatureKeys', case when p_patch ? 'affectedFeatureKeys' then to_jsonb(next_features) else null end
        )),
      revision = revision + 1,
      updated_at = now()
  where bug_key = before_record.bug_key
  returning * into after_record;

  update private.learning_tickets
  set public_data = case
        when after_record.public_derivative_approved
          then jsonb_set(public_data, '{bugClassification}', after_record.public_derivative, true)
        else public_data - 'bugClassification'
      end,
      revision = revision + 1,
      updated_at = now()
  where key = before_record.bug_key;

  insert into private.audit_events (
    actor_id, entity_type, entity_key, action, before_summary, after_summary, correlation_id
  ) values (
    (select auth.uid()), 'bug', before_record.bug_key, 'bug_classification_updated',
    jsonb_build_object('category', before_record.category, 'severity', before_record.severity, 'verificationState', before_record.verification_state),
    jsonb_build_object('category', after_record.category, 'severity', after_record.severity, 'verificationState', after_record.verification_state),
    p_correlation_id
  );

  perform private.refresh_learning_public_projection();
  return jsonb_build_object('bugKey', after_record.bug_key, 'revision', after_record.revision);
end;
$$;

revoke all on function public.learning_admin_update_bug_record(text, jsonb, integer, uuid) from public, anon;
grant execute on function public.learning_admin_update_bug_record(text, jsonb, integer, uuid) to authenticated;

create or replace function public.learning_admin_add_bug_observation(
  p_bug_key text,
  p_observation jsonb,
  p_correlation_id uuid
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  observation_id uuid;
begin
  if not (select private.is_learning_admin()) then
    raise exception 'Not authorized' using errcode = '42501';
  end if;
  if jsonb_typeof(p_observation) <> 'object' then
    raise exception 'Observation must be an object' using errcode = '22023';
  end if;

  insert into private.bug_observations (
    bug_key, observed_at, observation_type, private_note,
    public_summary, public_approved, created_by
  ) values (
    upper(p_bug_key),
    coalesce(nullif(p_observation->>'observedAt', '')::timestamptz, now()),
    p_observation->>'observationType',
    p_observation->>'privateNote',
    nullif(p_observation->>'publicSummary', ''),
    coalesce((p_observation->>'publicApproved')::boolean, false),
    (select auth.uid())
  ) returning id into observation_id;

  insert into private.audit_events (
    actor_id, entity_type, entity_key, action, after_summary, correlation_id
  ) values (
    (select auth.uid()), 'bug', upper(p_bug_key), 'bug_observation_added',
    jsonb_build_object('observationId', observation_id, 'observationType', p_observation->>'observationType'),
    p_correlation_id
  );

  return observation_id;
end;
$$;

revoke all on function public.learning_admin_add_bug_observation(text, jsonb, uuid) from public, anon;
grant execute on function public.learning_admin_add_bug_observation(text, jsonb, uuid) to authenticated;

commit;
