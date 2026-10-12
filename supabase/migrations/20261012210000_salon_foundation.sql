-- Menuun Site / Migration 001
-- Salon SaaS foundation. Target ONLY Supabase project kphypflbkbcvgcaupxxm.
-- No Menu V3 tables or schemas are referenced by this migration.

begin;

create extension if not exists btree_gist with schema extensions;

create table public.salons (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9][a-z0-9-]{0,62}$'),
  name_ar text not null check (length(trim(name_ar)) between 2 and 120),
  name_en text not null default '' check (length(name_en) <= 120),
  tagline_ar text,
  tagline_en text,
  description_ar text,
  description_en text,
  logo_url text,
  phone text,
  whatsapp text,
  address_ar text,
  address_en text,
  city text,
  country_code text not null default 'SA' check (country_code ~ '^[A-Z]{2}$'),
  timezone text not null default 'Asia/Riyadh',
  currency_code text not null default 'SAR' check (currency_code ~ '^[A-Z]{3}$'),
  primary_color text not null default '#171815' check (primary_color ~ '^#[0-9A-Fa-f]{6}$'),
  accent_color text not null default '#d3f36b' check (accent_color ~ '^#[0-9A-Fa-f]{6}$'),
  is_active boolean not null default true,
  is_published boolean not null default false,
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.salon_members (
  id uuid primary key default gen_random_uuid(),
  salon_id uuid not null references public.salons(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('owner','manager','receptionist')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (salon_id, user_id),
  unique (salon_id, id)
);

create index salon_members_user_active_idx on public.salon_members(user_id, is_active, salon_id);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  salon_id uuid not null references public.salons(id) on delete cascade,
  name_ar text not null check (length(trim(name_ar)) between 2 and 120),
  name_en text not null default '' check (length(name_en) <= 120),
  description_ar text,
  description_en text,
  price_sar numeric(10,2) not null check (price_sar >= 0),
  duration_minutes integer not null check (duration_minutes between 5 and 480),
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (salon_id, id)
);
create index services_public_list_idx on public.services(salon_id, is_active, sort_order);

create table public.barbers (
  id uuid primary key default gen_random_uuid(),
  salon_id uuid not null references public.salons(id) on delete cascade,
  display_name text not null check (length(trim(display_name)) between 2 and 120),
  bio_ar text,
  bio_en text,
  image_url text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (salon_id, id)
);
create index barbers_public_list_idx on public.barbers(salon_id, is_active, sort_order);

create table public.barber_services (
  salon_id uuid not null references public.salons(id) on delete cascade,
  barber_id uuid not null,
  service_id uuid not null,
  created_at timestamptz not null default now(),
  primary key (barber_id, service_id),
  foreign key (salon_id, barber_id) references public.barbers(salon_id, id) on delete cascade,
  foreign key (salon_id, service_id) references public.services(salon_id, id) on delete cascade
);
create index barber_services_salon_service_idx on public.barber_services(salon_id, service_id);

create table public.business_hours (
  id uuid primary key default gen_random_uuid(),
  salon_id uuid not null references public.salons(id) on delete cascade,
  weekday smallint not null check (weekday between 0 and 6),
  opens_at time,
  closes_at time,
  is_closed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (salon_id, weekday),
  check (
    (is_closed and opens_at is null and closes_at is null)
    or
    (not is_closed and opens_at is not null and closes_at is not null and closes_at > opens_at)
  )
);

create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  salon_id uuid not null references public.salons(id) on delete restrict,
  service_id uuid not null,
  barber_id uuid not null,
  customer_name text not null check (length(trim(customer_name)) between 2 and 120),
  customer_phone text not null check (length(regexp_replace(customer_phone, '[^0-9+]', '', 'g')) between 8 and 16),
  customer_note text check (length(customer_note) <= 1000),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status text not null default 'pending' check (status in ('pending','confirmed','reschedule_requested','completed','cancelled','no_show')),
  service_name_ar_snapshot text not null,
  service_name_en_snapshot text not null default '',
  price_sar_snapshot numeric(10,2) not null check (price_sar_snapshot >= 0),
  duration_minutes_snapshot integer not null check (duration_minutes_snapshot between 5 and 480),
  source text not null default 'public_web' check (source in ('public_web','owner_manual')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at > starts_at),
  foreign key (salon_id, service_id) references public.services(salon_id, id) on delete restrict,
  foreign key (salon_id, barber_id) references public.barbers(salon_id, id) on delete restrict,
  unique (salon_id, id)
);

-- A database exclusion constraint prevents overlapping active appointments for one barber.
-- "First available" bookings must be assigned to a concrete barber before insertion.
alter table public.appointments
  add constraint appointments_no_active_overlap
  exclude using gist (
    salon_id with =,
    barber_id with =,
    tstzrange(starts_at, ends_at, '[)') with &&
  )
  where (status in ('pending','confirmed','reschedule_requested'));

create index appointments_salon_start_idx on public.appointments(salon_id, starts_at desc);
create index appointments_salon_status_start_idx on public.appointments(salon_id, status, starts_at);
create index appointments_barber_start_idx on public.appointments(salon_id, barber_id, starts_at);

create table public.appointment_events (
  id uuid primary key default gen_random_uuid(),
  salon_id uuid not null references public.salons(id) on delete cascade,
  appointment_id uuid not null,
  actor_user_id uuid references auth.users(id) on delete set null,
  from_status text,
  to_status text not null check (to_status in ('pending','confirmed','reschedule_requested','completed','cancelled','no_show')),
  reason text,
  created_at timestamptz not null default now(),
  foreign key (salon_id, appointment_id) references public.appointments(salon_id, id) on delete cascade
);
create index appointment_events_appointment_time_idx on public.appointment_events(salon_id, appointment_id, created_at desc);

create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  salon_id uuid not null references public.salons(id) on delete cascade,
  kind text not null check (kind in ('logo','hero_video','hero_poster','gallery','barber_portrait','service_image')),
  storage_path text not null,
  public_url text,
  mime_type text not null,
  byte_size bigint not null check (byte_size between 1 and 104857600),
  alt_ar text,
  alt_en text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  is_public boolean not null default false,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (salon_id, storage_path)
);
create index media_assets_public_list_idx on public.media_assets(salon_id, is_public, is_active, sort_order);

create table public.site_settings (
  id uuid primary key default gen_random_uuid(),
  salon_id uuid not null unique references public.salons(id) on delete cascade,
  draft_content jsonb not null default '{}'::jsonb check (jsonb_typeof(draft_content) = 'object'),
  published_content jsonb not null default '{}'::jsonb check (jsonb_typeof(published_content) = 'object'),
  updated_at timestamptz not null default now()
);

create table public.site_revisions (
  id uuid primary key default gen_random_uuid(),
  salon_id uuid not null references public.salons(id) on delete cascade,
  created_by uuid references auth.users(id) on delete set null,
  revision_kind text not null check (revision_kind in ('publish','restore')),
  content_snapshot jsonb not null check (jsonb_typeof(content_snapshot) = 'object'),
  created_at timestamptz not null default now()
);
create index site_revisions_salon_time_idx on public.site_revisions(salon_id, created_at desc);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  salon_id uuid not null references public.salons(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  kind text not null check (kind in ('appointment_created','appointment_updated','site_published','system')),
  title text not null check (length(trim(title)) between 1 and 160),
  body text not null default '' check (length(body) <= 1000),
  appointment_id uuid,
  read_at timestamptz,
  created_at timestamptz not null default now(),
  foreign key (salon_id, appointment_id) references public.appointments(salon_id, id) on delete cascade
);
create index notifications_user_unread_idx on public.notifications(user_id, read_at, created_at desc);
create index notifications_salon_time_idx on public.notifications(salon_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger salons_set_updated_at before update on public.salons
for each row execute function public.set_updated_at();
create trigger services_set_updated_at before update on public.services
for each row execute function public.set_updated_at();
create trigger barbers_set_updated_at before update on public.barbers
for each row execute function public.set_updated_at();
create trigger business_hours_set_updated_at before update on public.business_hours
for each row execute function public.set_updated_at();
create trigger appointments_set_updated_at before update on public.appointments
for each row execute function public.set_updated_at();
create trigger site_settings_set_updated_at before update on public.site_settings
for each row execute function public.set_updated_at();

-- These helpers are intentionally narrow. SECURITY DEFINER is used only to
-- avoid recursive membership RLS evaluation; auth.uid() remains the authority.
create or replace function public.guard_appointment_update()
returns trigger
language plpgsql
set search_path = ''
as $
begin
  if new.salon_id is distinct from old.salon_id
    or new.service_id is distinct from old.service_id
    or new.customer_name is distinct from old.customer_name
    or new.customer_phone is distinct from old.customer_phone
    or new.service_name_ar_snapshot is distinct from old.service_name_ar_snapshot
    or new.service_name_en_snapshot is distinct from old.service_name_en_snapshot
    or new.price_sar_snapshot is distinct from old.price_sar_snapshot
    or new.duration_minutes_snapshot is distinct from old.duration_minutes_snapshot
    or new.source is distinct from old.source then
    raise exception 'APPOINTMENT_IDENTITY_FIELDS_IMMUTABLE' using errcode = '22023';
  end if;

  if new.status is distinct from old.status then
    if not (
      (old.status = 'pending' and new.status in ('confirmed','cancelled','reschedule_requested'))
      or (old.status = 'confirmed' and new.status in ('completed','cancelled','no_show','reschedule_requested'))
      or (old.status = 'reschedule_requested' and new.status in ('confirmed','cancelled'))
    ) then
      raise exception 'INVALID_APPOINTMENT_STATUS_TRANSITION' using errcode = '22023';
    end if;
  end if;

  if (new.starts_at is distinct from old.starts_at
      or new.ends_at is distinct from old.ends_at
      or new.barber_id is distinct from old.barber_id)
      and not (new.status = 'confirmed' and old.status in ('confirmed','reschedule_requested')) then
    raise exception 'RESCHEDULE_REQUIRES_CONFIRMED_STATUS' using errcode = '22023';
  end if;

  return new;
end;
$;

create or replace function public.record_appointment_event()
returns trigger
language plpgsql
security definer
set search_path = ''
as $
begin
  if tg_op = 'INSERT' then
    insert into public.appointment_events
      (salon_id, appointment_id, actor_user_id, from_status, to_status, reason)
    values
      (new.salon_id, new.id, auth.uid(), null, new.status, 'appointment_created');
    return new;
  end if;

  if new.status is distinct from old.status then
    insert into public.appointment_events
      (salon_id, appointment_id, actor_user_id, from_status, to_status, reason)
    values
      (new.salon_id, new.id, auth.uid(), old.status, new.status, null);
  end if;
  return new;
end;
$;

create trigger appointments_guard_update
before update on public.appointments
for each row execute function public.guard_appointment_update();

create trigger appointments_record_event
after insert or update on public.appointments
for each row execute function public.record_appointment_event();

create or replace function public.is_salon_member(p_salon_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select auth.uid() is not null and exists (
    select 1 from public.salon_members sm
    where sm.salon_id = p_salon_id
      and sm.user_id = auth.uid()
      and sm.is_active
  );
$$;

create or replace function public.is_salon_manager(p_salon_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select auth.uid() is not null and exists (
    select 1 from public.salon_members sm
    where sm.salon_id = p_salon_id
      and sm.user_id = auth.uid()
      and sm.is_active
      and sm.role in ('owner','manager')
  );
$$;

create or replace function public.create_salon_with_owner(
  p_slug text,
  p_name_ar text,
  p_name_en text default ''
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
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
$$;

create or replace function public.publish_salon_site(p_salon_id uuid)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_revision_id uuid;
  v_draft jsonb;
begin
  if auth.uid() is null or not public.is_salon_manager(p_salon_id) then
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
  select p_salon_id, auth.uid(), 'publish', ss.published_content
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
$$;

alter table public.salons enable row level security;
alter table public.salon_members enable row level security;
alter table public.services enable row level security;
alter table public.barbers enable row level security;
alter table public.barber_services enable row level security;
alter table public.business_hours enable row level security;
alter table public.appointments enable row level security;
alter table public.appointment_events enable row level security;
alter table public.media_assets enable row level security;
alter table public.site_settings enable row level security;
alter table public.site_revisions enable row level security;
alter table public.notifications enable row level security;

create policy salons_read_published_or_member on public.salons for select to anon, authenticated
using ((is_active and is_published) or public.is_salon_member(id));
create policy salons_update_manager on public.salons for update to authenticated
using (public.is_salon_manager(id)) with check (public.is_salon_manager(id));

create policy salon_members_read_self_or_manager on public.salon_members for select to authenticated
using (user_id = auth.uid() or public.is_salon_manager(salon_id));
create policy salon_members_insert_manager on public.salon_members for insert to authenticated
with check (public.is_salon_manager(salon_id));
create policy salon_members_update_manager on public.salon_members for update to authenticated
using (public.is_salon_manager(salon_id)) with check (public.is_salon_manager(salon_id));
create policy salon_members_delete_manager on public.salon_members for delete to authenticated
using (public.is_salon_manager(salon_id));

create policy services_read_public_or_member on public.services for select to anon, authenticated
using (
  (is_active and exists (select 1 from public.salons s where s.id = salon_id and s.is_active and s.is_published))
  or public.is_salon_member(salon_id)
);
create policy services_manage_manager on public.services for all to authenticated
using (public.is_salon_manager(salon_id)) with check (public.is_salon_manager(salon_id));

create policy barbers_read_public_or_member on public.barbers for select to anon, authenticated
using (
  (is_active and exists (select 1 from public.salons s where s.id = salon_id and s.is_active and s.is_published))
  or public.is_salon_member(salon_id)
);
create policy barbers_manage_manager on public.barbers for all to authenticated
using (public.is_salon_manager(salon_id)) with check (public.is_salon_manager(salon_id));

create policy barber_services_read_public_or_member on public.barber_services for select to anon, authenticated
using (
  exists (select 1 from public.salons s where s.id = salon_id and s.is_active and s.is_published)
  or public.is_salon_member(salon_id)
);
create policy barber_services_manage_manager on public.barber_services for all to authenticated
using (public.is_salon_manager(salon_id)) with check (public.is_salon_manager(salon_id));

create policy business_hours_read_public_or_member on public.business_hours for select to anon, authenticated
using (
  exists (select 1 from public.salons s where s.id = salon_id and s.is_active and s.is_published)
  or public.is_salon_member(salon_id)
);
create policy business_hours_manage_manager on public.business_hours for all to authenticated
using (public.is_salon_manager(salon_id)) with check (public.is_salon_manager(salon_id));

create policy appointments_read_member on public.appointments for select to authenticated
using (public.is_salon_member(salon_id));
create policy appointments_update_manager_or_receptionist on public.appointments for update to authenticated
using (
  exists (select 1 from public.salon_members sm where sm.salon_id = appointments.salon_id and sm.user_id = auth.uid() and sm.is_active and sm.role in ('owner','manager','receptionist'))
)
with check (
  exists (select 1 from public.salon_members sm where sm.salon_id = appointments.salon_id and sm.user_id = auth.uid() and sm.is_active and sm.role in ('owner','manager','receptionist'))
);

create policy appointment_events_read_member on public.appointment_events for select to authenticated
using (public.is_salon_member(salon_id));

create policy media_assets_read_public_or_member on public.media_assets for select to anon, authenticated
using (
  (is_public and is_active and exists (select 1 from public.salons s where s.id = salon_id and s.is_active and s.is_published))
  or public.is_salon_member(salon_id)
);
create policy media_assets_manage_manager on public.media_assets for all to authenticated
using (public.is_salon_manager(salon_id)) with check (public.is_salon_manager(salon_id));

create policy site_settings_read_published_or_member on public.site_settings for select to anon, authenticated
using (
  exists (select 1 from public.salons s where s.id = salon_id and s.is_active and s.is_published)
  or public.is_salon_member(salon_id)
);
create policy site_settings_update_manager on public.site_settings for update to authenticated
using (public.is_salon_manager(salon_id)) with check (public.is_salon_manager(salon_id));

create policy site_revisions_read_member on public.site_revisions for select to authenticated
using (public.is_salon_member(salon_id));

create policy notifications_read_recipient_or_manager on public.notifications for select to authenticated
using ((user_id = auth.uid()) or public.is_salon_manager(salon_id));
create policy notifications_update_recipient on public.notifications for update to authenticated
using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Remove implicit API access first, then grant only required operations.
revoke all on public.salons, public.salon_members, public.services, public.barbers,
  public.barber_services, public.business_hours, public.appointments,
  public.appointment_events, public.media_assets, public.site_settings,
  public.site_revisions, public.notifications from anon, authenticated;

grant select on public.salons, public.services, public.barbers, public.barber_services,
  public.business_hours, public.media_assets to anon, authenticated;

grant select (id, salon_id, published_content, updated_at) on public.site_settings to anon;
grant select (id, salon_id, draft_content, published_content, updated_at) on public.site_settings to authenticated;

grant update (name_ar, name_en, tagline_ar, tagline_en, description_ar, description_en,
  logo_url, phone, whatsapp, address_ar, address_en, city, country_code, timezone,
  currency_code, primary_color, accent_color) on public.salons to authenticated;

grant select on public.salon_members, public.appointments, public.appointment_events,
  public.site_revisions, public.notifications to authenticated;

grant insert, update, delete on public.services, public.barbers,
  public.barber_services, public.business_hours, public.media_assets to authenticated;
grant update (draft_content) on public.site_settings to authenticated;
grant update (read_at) on public.notifications to authenticated;
grant update (status, customer_note, starts_at, ends_at, barber_id) on public.appointments to authenticated;

revoke all on function public.set_updated_at() from public, anon, authenticated;
revoke all on function public.guard_appointment_update() from public, anon, authenticated;
revoke all on function public.record_appointment_event() from public, anon, authenticated;
revoke all on function public.is_salon_member(uuid) from public;
revoke all on function public.is_salon_manager(uuid) from public;
grant execute on function public.is_salon_member(uuid) to anon, authenticated;
grant execute on function public.is_salon_manager(uuid) to anon, authenticated;
revoke all on function public.create_salon_with_owner(text, text, text) from public, anon;
grant execute on function public.create_salon_with_owner(text, text, text) to authenticated;
revoke all on function public.publish_salon_site(uuid) from public, anon;
grant execute on function public.publish_salon_site(uuid) to authenticated;

commit;
