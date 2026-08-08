begin;

drop function if exists public.learning_admin_add_bug_observation(text, jsonb, uuid);
drop function if exists public.learning_admin_update_bug_record(text, jsonb, integer, uuid);
drop function if exists public.learning_admin_operations_snapshot();
drop function if exists public.learning_admin_seed_operations(uuid);

drop table if exists private.bug_observations;
drop table if exists private.bug_records;
drop table if exists private.operational_incidents;

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

select private.refresh_learning_public_projection();

commit;
