-- Menuun Site / Migration 004
-- Private salon media storage and an atomic public appointment-request RPC.
-- Apply only to Supabase project kphypflbkbcvgcaupxxm after reviewing the diff.

begin;

-- Private bucket: public-facing pages must use signed URLs until a deliberate
-- publish/media delivery strategy is implemented. Unpublished uploads stay private.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'salon-media',
  'salon-media',
  false,
  104857600,
  array['image/jpeg','image/png','image/webp','image/avif','video/mp4','video/webm']
)
on conflict (id) do update
set public = false,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists salon_media_manager_insert on storage.objects;
create policy salon_media_manager_insert
on storage.objects for insert to authenticated
with check (
  bucket_id = 'salon-media'
  and array_length(storage.foldername(name), 1) >= 2
  and exists (
    select 1
    from public.salons s
    where s.id::text = (storage.foldername(name))[1]
      and private.is_salon_manager(s.id)
  )
);

drop policy if exists salon_media_manager_select on storage.objects;
create policy salon_media_manager_select
on storage.objects for select to authenticated
using (
  bucket_id = 'salon-media'
  and array_length(storage.foldername(name), 1) >= 2
  and exists (
    select 1
    from public.salons s
    where s.id::text = (storage.foldername(name))[1]
      and private.is_salon_member(s.id)
  )
);

drop policy if exists salon_media_manager_update on storage.objects;
create policy salon_media_manager_update
on storage.objects for update to authenticated
using (
  bucket_id = 'salon-media'
  and array_length(storage.foldername(name), 1) >= 2
  and exists (
    select 1
    from public.salons s
    where s.id::text = (storage.foldername(name))[1]
      and private.is_salon_manager(s.id)
  )
)
with check (
  bucket_id = 'salon-media'
  and array_length(storage.foldername(name), 1) >= 2
  and exists (
    select 1
    from public.salons s
    where s.id::text = (storage.foldername(name))[1]
      and private.is_salon_manager(s.id)
  )
);

drop policy if exists salon_media_manager_delete on storage.objects;
create policy salon_media_manager_delete
on storage.objects for delete to authenticated
using (
  bucket_id = 'salon-media'
  and array_length(storage.foldername(name), 1) >= 2
  and exists (
    select 1
    from public.salons s
    where s.id::text = (storage.foldername(name))[1]
      and private.is_salon_manager(s.id)
  )
);

create or replace function public.request_salon_appointment(
  p_salon_slug text,
  p_service_id uuid,
  p_barber_id uuid,
  p_customer_name text,
  p_customer_phone text,
  p_starts_at timestamptz,
  p_customer_note text default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_salon public.salons%rowtype;
  v_service public.services%rowtype;
  v_barber public.barbers%rowtype;
  v_ends_at timestamptz;
  v_start_local timestamp;
  v_end_local timestamp;
  v_appointment_id uuid;
  v_has_service_mapping boolean;
begin
  if p_salon_slug is null or length(trim(p_salon_slug)) = 0 then
    raise exception 'INVALID_SALON' using errcode = '22023';
  end if;

  if p_customer_name is null or length(trim(p_customer_name)) not between 2 and 120 then
    raise exception 'INVALID_CUSTOMER_NAME' using errcode = '22023';
  end if;

  if p_customer_phone is null
    or length(regexp_replace(p_customer_phone, '[^0-9+]', '', 'g')) not between 8 and 16 then
    raise exception 'INVALID_CUSTOMER_PHONE' using errcode = '22023';
  end if;

  if p_customer_note is not null and length(p_customer_note) > 1000 then
    raise exception 'CUSTOMER_NOTE_TOO_LONG' using errcode = '22023';
  end if;

  select * into v_salon
  from public.salons s
  where s.slug = lower(trim(p_salon_slug))
    and s.is_active
    and s.is_published;

  if not found then
    raise exception 'SALON_NOT_AVAILABLE' using errcode = 'P0002';
  end if;

  select * into v_service
  from public.services s
  where s.id = p_service_id
    and s.salon_id = v_salon.id
    and s.is_active;

  if not found then
    raise exception 'SERVICE_NOT_AVAILABLE' using errcode = 'P0002';
  end if;

  select * into v_barber
  from public.barbers b
  where b.id = p_barber_id
    and b.salon_id = v_salon.id
    and b.is_active;

  if not found then
    raise exception 'BARBER_NOT_AVAILABLE' using errcode = 'P0002';
  end if;

  select exists (
    select 1 from public.barber_services bs where bs.salon_id = v_salon.id
  ) into v_has_service_mapping;

  if v_has_service_mapping and not exists (
    select 1 from public.barber_services bs
    where bs.salon_id = v_salon.id
      and bs.barber_id = v_barber.id
      and bs.service_id = v_service.id
  ) then
    raise exception 'BARBER_DOES_NOT_OFFER_SERVICE' using errcode = '22023';
  end if;

  if p_starts_at is null or p_starts_at <= now()
    or p_starts_at > now() + interval '90 days' then
    raise exception 'INVALID_APPOINTMENT_TIME' using errcode = '22023';
  end if;

  v_ends_at := p_starts_at + make_interval(mins => v_service.duration_minutes);
  v_start_local := p_starts_at at time zone v_salon.timezone;
  v_end_local := v_ends_at at time zone v_salon.timezone;

  if v_start_local::date <> v_end_local::date then
    raise exception 'APPOINTMENT_CROSSES_BUSINESS_DAY' using errcode = '22023';
  end if;

  if not exists (
    select 1 from public.business_hours h
    where h.salon_id = v_salon.id
      and h.weekday = extract(dow from v_start_local)::smallint
      and not h.is_closed
      and h.opens_at is not null
      and h.closes_at is not null
      and v_start_local::time >= h.opens_at
      and v_end_local::time <= h.closes_at
  ) then
    raise exception 'OUTSIDE_BUSINESS_HOURS' using errcode = '22023';
  end if;

  -- The exclusion constraint remains the final concurrency guard if two clients
  -- request the same barber/time simultaneously.
  insert into public.appointments (
    salon_id, service_id, barber_id, customer_name, customer_phone,
    customer_note, starts_at, ends_at, status,
    service_name_ar_snapshot, service_name_en_snapshot,
    price_sar_snapshot, duration_minutes_snapshot, source
  ) values (
    v_salon.id, v_service.id, v_barber.id, trim(p_customer_name),
    regexp_replace(p_customer_phone, '[^0-9+]', '', 'g'),
    nullif(trim(p_customer_note), ''), p_starts_at, v_ends_at, 'pending',
    v_service.name_ar, v_service.name_en,
    v_service.price_sar, v_service.duration_minutes, 'public_web'
  )
  returning id into v_appointment_id;

  insert into public.notifications (salon_id, user_id, kind, title, body, appointment_id)
  select v_salon.id, sm.user_id, 'appointment_created',
         'طلب حجز جديد', 'يوجد طلب حجز جديد بانتظار المراجعة.',
         v_appointment_id
  from public.salon_members sm
  where sm.salon_id = v_salon.id
    and sm.is_active
    and sm.role in ('owner','manager','receptionist');

  return v_appointment_id;
end;
$function$;

revoke all on function public.request_salon_appointment(text, uuid, uuid, text, text, timestamptz, text) from public;
grant execute on function public.request_salon_appointment(text, uuid, uuid, text, text, timestamptz, text) to anon, authenticated;

commit;
