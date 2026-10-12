-- Menuun Site / Migration 002
-- Harden internal authorization helpers and cover foreign-key indexes.
-- This migration is intended only for project kphypflbkbcvgcaupxxm.

begin;

create schema if not exists private;
revoke all on schema private from public;
revoke all on schema private from anon, authenticated;
grant usage on schema private to anon, authenticated;

create or replace function private.is_salon_member(p_salon_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $function$
  select (select auth.uid()) is not null and exists (
    select 1 from public.salon_members sm
    where sm.salon_id = p_salon_id
      and sm.user_id = (select auth.uid())
      and sm.is_active
  );
$function$;

create or replace function private.is_salon_manager(p_salon_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $function$
  select (select auth.uid()) is not null and exists (
    select 1 from public.salon_members sm
    where sm.salon_id = p_salon_id
      and sm.user_id = (select auth.uid())
      and sm.is_active
      and sm.role in ('owner','manager')
  );
$function$;

revoke all on function private.is_salon_member(uuid) from public, anon;
revoke all on function private.is_salon_manager(uuid) from public, anon;
grant execute on function private.is_salon_member(uuid) to authenticated;
grant execute on function private.is_salon_manager(uuid) to authenticated;

-- Public content policies for signed-out users never invoke privileged helpers.
drop policy salons_read_published_or_member on public.salons;
create policy salons_read_published_anon on public.salons for select to anon
using (is_active and is_published);
create policy salons_read_published_or_member on public.salons for select to authenticated
using ((is_active and is_published) or private.is_salon_member(id));

drop policy services_read_public_or_member on public.services;
create policy services_read_published_anon on public.services for select to anon
using (is_active and exists (
  select 1 from public.salons s where s.id = salon_id and s.is_active and s.is_published
));
create policy services_read_published_or_member on public.services for select to authenticated
using (
  (is_active and exists (select 1 from public.salons s where s.id = salon_id and s.is_active and s.is_published))
  or private.is_salon_member(salon_id)
);

drop policy barbers_read_public_or_member on public.barbers;
create policy barbers_read_published_anon on public.barbers for select to anon
using (is_active and exists (
  select 1 from public.salons s where s.id = salon_id and s.is_active and s.is_published
));
create policy barbers_read_published_or_member on public.barbers for select to authenticated
using (
  (is_active and exists (select 1 from public.salons s where s.id = salon_id and s.is_active and s.is_published))
  or private.is_salon_member(salon_id)
);

drop policy barber_services_read_public_or_member on public.barber_services;
create policy barber_services_read_published_anon on public.barber_services for select to anon
using (exists (select 1 from public.salons s where s.id = salon_id and s.is_active and s.is_published));
create policy barber_services_read_published_or_member on public.barber_services for select to authenticated
using (
  exists (select 1 from public.salons s where s.id = salon_id and s.is_active and s.is_published)
  or private.is_salon_member(salon_id)
);

drop policy business_hours_read_public_or_member on public.business_hours;
create policy business_hours_read_published_anon on public.business_hours for select to anon
using (exists (select 1 from public.salons s where s.id = salon_id and s.is_active and s.is_published));
create policy business_hours_read_published_or_member on public.business_hours for select to authenticated
using (
  exists (select 1 from public.salons s where s.id = salon_id and s.is_active and s.is_published)
  or private.is_salon_member(salon_id)
);

drop policy salon_members_read_self_or_manager on public.salon_members;
create policy salon_members_read_self_or_manager on public.salon_members for select to authenticated
using (user_id = (select auth.uid()) or private.is_salon_manager(salon_id));
drop policy salon_members_insert_manager on public.salon_members;
create policy salon_members_insert_manager on public.salon_members for insert to authenticated
with check (private.is_salon_manager(salon_id));
drop policy salon_members_update_manager on public.salon_members;
create policy salon_members_update_manager on public.salon_members for update to authenticated
using (private.is_salon_manager(salon_id)) with check (private.is_salon_manager(salon_id));
drop policy salon_members_delete_manager on public.salon_members;
create policy salon_members_delete_manager on public.salon_members for delete to authenticated
using (private.is_salon_manager(salon_id));

drop policy appointments_read_member on public.appointments;
create policy appointments_read_member on public.appointments for select to authenticated
using (private.is_salon_member(salon_id));
drop policy appointments_update_manager_or_receptionist on public.appointments;
create policy appointments_update_manager_or_receptionist on public.appointments for update to authenticated
using (
  exists (select 1 from public.salon_members sm where sm.salon_id = appointments.salon_id and sm.user_id = (select auth.uid()) and sm.is_active and sm.role in ('owner','manager','receptionist'))
)
with check (
  exists (select 1 from public.salon_members sm where sm.salon_id = appointments.salon_id and sm.user_id = (select auth.uid()) and sm.is_active and sm.role in ('owner','manager','receptionist'))
);

drop policy appointment_events_read_member on public.appointment_events;
create policy appointment_events_read_member on public.appointment_events for select to authenticated
using (private.is_salon_member(salon_id));

drop policy media_assets_read_public_or_member on public.media_assets;
create policy media_assets_read_published_anon on public.media_assets for select to anon
using (is_public and is_active and exists (
  select 1 from public.salons s where s.id = salon_id and s.is_active and s.is_published
));
create policy media_assets_read_published_or_member on public.media_assets for select to authenticated
using (
  (is_public and is_active and exists (select 1 from public.salons s where s.id = salon_id and s.is_active and s.is_published))
  or private.is_salon_member(salon_id)
);

drop policy site_settings_read_published_or_member on public.site_settings;
create policy site_settings_read_published_anon on public.site_settings for select to anon
using (exists (
  select 1 from public.salons s where s.id = salon_id and s.is_active and s.is_published
));
create policy site_settings_read_published_or_member on public.site_settings for select to authenticated
using (
  exists (select 1 from public.salons s where s.id = salon_id and s.is_active and s.is_published)
  or private.is_salon_member(salon_id)
);

drop policy site_revisions_read_member on public.site_revisions;
create policy site_revisions_read_member on public.site_revisions for select to authenticated
using (private.is_salon_member(salon_id));

drop policy notifications_read_recipient_or_manager on public.notifications;
create policy notifications_read_recipient_or_manager on public.notifications for select to authenticated
using ((user_id = (select auth.uid())) or private.is_salon_manager(salon_id));
drop policy notifications_update_recipient on public.notifications;
create policy notifications_update_recipient on public.notifications for update to authenticated
using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

-- Rebind all remaining manager policies before removing public helpers.
drop policy salons_update_manager on public.salons;
create policy salons_update_manager on public.salons for update to authenticated
using (private.is_salon_manager(id)) with check (private.is_salon_manager(id));

drop policy services_manage_manager on public.services;
create policy services_manage_manager on public.services for all to authenticated
using (private.is_salon_manager(salon_id)) with check (private.is_salon_manager(salon_id));

drop policy barbers_manage_manager on public.barbers;
create policy barbers_manage_manager on public.barbers for all to authenticated
using (private.is_salon_manager(salon_id)) with check (private.is_salon_manager(salon_id));

drop policy barber_services_manage_manager on public.barber_services;
create policy barber_services_manage_manager on public.barber_services for all to authenticated
using (private.is_salon_manager(salon_id)) with check (private.is_salon_manager(salon_id));

drop policy business_hours_manage_manager on public.business_hours;
create policy business_hours_manage_manager on public.business_hours for all to authenticated
using (private.is_salon_manager(salon_id)) with check (private.is_salon_manager(salon_id));

drop policy media_assets_manage_manager on public.media_assets;
create policy media_assets_manage_manager on public.media_assets for all to authenticated
using (private.is_salon_manager(salon_id)) with check (private.is_salon_manager(salon_id));

drop policy site_settings_update_manager on public.site_settings;
create policy site_settings_update_manager on public.site_settings for update to authenticated
using (private.is_salon_manager(salon_id)) with check (private.is_salon_manager(salon_id));

-- Move privileged routines out of the exposed public schema.
alter function public.guard_appointment_update() set schema private;
alter function public.record_appointment_event() set schema private;
drop function public.is_salon_member(uuid);
drop function public.is_salon_manager(uuid);

create or replace function private.create_salon_with_owner(
  p_slug text,
  p_name_ar text,
  p_name_en text default ''
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_user_id uuid := (select auth.uid());
  v_salon_id uuid;
  v_slug text := lower(trim(p_slug));
begin
  if v_user_id is null then
    raise exception 'AUTH_REQUIRED' using errcode = '28000';
  end if;
  if v_slug is null or v_slug !~ '^[a-z0-9][a-z0-9-]{0,62}$' then
    raise exception 'INVALID_SALON_SLUG' using errcode = '22023';
  end if;
  if p_name_ar is null or length(trim(p_name_ar)) not between 2 and 120 then
    raise exception 'INVALID_SALON_NAME' using errcode = '22023';
  end if;

  insert into public.salons (slug, name_ar, name_en, created_by)
  values (v_slug, trim(p_name_ar), coalesce(trim(p_name_en), ''), v_user_id)
  returning id into v_salon_id;

  insert into public.salon_members (salon_id, user_id, role)
  values (v_salon_id, v_user_id, 'owner');

  insert into public.site_settings (salon_id)
  values (v_salon_id);

  return v_salon_id;
end;
$function$;

create or replace function public.create_salon_with_owner(
  p_slug text,
  p_name_ar text,
  p_name_en text default ''
)
returns uuid
language sql
security invoker
set search_path = ''
as $wrapper$
  select private.create_salon_with_owner(p_slug, p_name_ar, p_name_en);
$wrapper$;

create or replace function private.publish_salon_site(p_salon_id uuid)
returns uuid
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_revision_id uuid;
  v_draft jsonb;
begin
  if (select auth.uid()) is null or not private.is_salon_manager(p_salon_id) then
    raise exception 'SALON_MANAGER_REQUIRED' using errcode = '42501';
  end if;

  select ss.draft_content into v_draft
  from public.site_settings ss
  where ss.salon_id = p_salon_id
  for update;

  if v_draft is null then
    raise exception 'SITE_SETTINGS_NOT_FOUND' using errcode = 'P0002';
  end if;

  insert into public.site_revisions (salon_id, created_by, revision_kind, content_snapshot)
  select p_salon_id, (select auth.uid()), 'publish', ss.published_content
  from public.site_settings ss
  where ss.salon_id = p_salon_id
  returning id into v_revision_id;

  update public.site_settings
  set published_content = v_draft, updated_at = now()
  where salon_id = p_salon_id;

  update public.salons
  set is_published = true, updated_at = now()
  where id = p_salon_id;

  return v_revision_id;
end;
$function$;

create or replace function public.publish_salon_site(p_salon_id uuid)
returns uuid
language sql
security invoker
set search_path = ''
as $wrapper$
  select private.publish_salon_site(p_salon_id);
$wrapper$;

revoke all on function private.create_salon_with_owner(text, text, text) from public, anon;
revoke all on function private.publish_salon_site(uuid) from public, anon;
grant execute on function private.create_salon_with_owner(text, text, text) to authenticated;
grant execute on function private.publish_salon_site(uuid) to authenticated;
revoke all on function public.create_salon_with_owner(text, text, text) from public, anon;
revoke all on function public.publish_salon_site(uuid) from public, anon;
grant execute on function public.create_salon_with_owner(text, text, text) to authenticated;
grant execute on function public.publish_salon_site(uuid) to authenticated;

-- Cover all FK columns reported by the first advisor pass.
create index if not exists salons_created_by_idx on public.salons(created_by);
create index if not exists appointments_salon_service_idx on public.appointments(salon_id, service_id);
create index if not exists barber_services_salon_barber_idx on public.barber_services(salon_id, barber_id);
create index if not exists appointment_events_actor_idx on public.appointment_events(actor_user_id);
create index if not exists media_assets_created_by_idx on public.media_assets(created_by);
create index if not exists notifications_salon_appointment_idx on public.notifications(salon_id, appointment_id);
create index if not exists site_revisions_created_by_idx on public.site_revisions(created_by);

commit;
