-- Public, privacy-preserving availability for the Menuun Site booking wizard.
-- Only free start times and the selected/assigned barber are returned; customer data is never exposed.

begin;

create or replace function private.get_public_booking_slots_internal(
  p_salon_slug text,
  p_service_id uuid,
  p_date date,
  p_barber_id uuid default null
)
returns table (
  starts_at timestamptz,
  barber_id uuid,
  barber_name text
)
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_salon public.salons%rowtype;
  v_service public.services%rowtype;
  v_has_service_mapping boolean;
  v_local_today date;
begin
  if p_salon_slug is null or length(trim(p_salon_slug)) = 0
     or p_service_id is null or p_date is null then
    raise exception 'INVALID_AVAILABILITY_REQUEST' using errcode = '22023';
  end if;

  select s.* into v_salon
  from public.salons s
  where s.slug = lower(trim(p_salon_slug))
    and s.is_active
    and s.is_published;

  if not found then
    raise exception 'SALON_NOT_AVAILABLE' using errcode = 'P0002';
  end if;

  select s.* into v_service
  from public.services s
  where s.id = p_service_id
    and s.salon_id = v_salon.id
    and s.is_active;

  if not found then
    raise exception 'SERVICE_NOT_AVAILABLE' using errcode = 'P0002';
  end if;

  v_local_today := (now() at time zone v_salon.timezone)::date;
  if p_date < v_local_today or p_date > v_local_today + 90 then
    raise exception 'INVALID_AVAILABILITY_DATE' using errcode = '22023';
  end if;

  if p_barber_id is not null and not exists (
    select 1 from public.barbers b
    where b.id = p_barber_id
      and b.salon_id = v_salon.id
      and b.is_active
  ) then
    raise exception 'BARBER_NOT_AVAILABLE' using errcode = 'P0002';
  end if;

  select exists (
    select 1 from public.barber_services bs where bs.salon_id = v_salon.id
  ) into v_has_service_mapping;

  return query
  with candidates as (
    select
      (slot.local_start at time zone v_salon.timezone) as slot_start,
      b.id as candidate_barber_id,
      b.display_name as candidate_barber_name,
      b.sort_order as candidate_sort_order
    from public.business_hours h
    join lateral pg_catalog.generate_series(
      p_date::timestamp + h.opens_at,
      p_date::timestamp + h.closes_at - pg_catalog.make_interval(mins => v_service.duration_minutes),
      interval '30 minutes'
    ) as slot(local_start) on true
    join public.barbers b
      on b.salon_id = v_salon.id
     and b.is_active
     and (p_barber_id is null or b.id = p_barber_id)
    where h.salon_id = v_salon.id
      and h.weekday = extract(dow from p_date)::smallint
      and not h.is_closed
      and h.opens_at is not null
      and h.closes_at is not null
      and h.closes_at > h.opens_at
      and (slot.local_start at time zone v_salon.timezone) > now()
      and (slot.local_start at time zone v_salon.timezone) <= now() + interval '90 days'
      and (
        not v_has_service_mapping
        or exists (
          select 1 from public.barber_services bs
          where bs.salon_id = v_salon.id
            and bs.barber_id = b.id
            and bs.service_id = v_service.id
        )
      )
      and not exists (
        select 1
        from public.appointments a
        where a.salon_id = v_salon.id
          and a.barber_id = b.id
          and a.status in ('pending', 'confirmed', 'reschedule_requested')
          and pg_catalog.tstzrange(a.starts_at, a.ends_at, '[)')
              && pg_catalog.tstzrange(
                (slot.local_start at time zone v_salon.timezone),
                (slot.local_start at time zone v_salon.timezone)
                  + pg_catalog.make_interval(mins => v_service.duration_minutes),
                '[)'
              )
      )
  )
  select distinct on (c.slot_start)
    c.slot_start, c.candidate_barber_id, c.candidate_barber_name
  from candidates c
  order by c.slot_start, c.candidate_sort_order, c.candidate_barber_id;
end;
$function$;

revoke all on function private.get_public_booking_slots_internal(text, uuid, date, uuid) from public;
grant execute on function private.get_public_booking_slots_internal(text, uuid, date, uuid) to anon, authenticated;

create or replace function public.get_public_booking_slots(
  p_salon_slug text,
  p_service_id uuid,
  p_date date,
  p_barber_id uuid default null
)
returns table (
  starts_at timestamptz,
  barber_id uuid,
  barber_name text
)
language sql
security invoker
set search_path = ''
as $wrapper$
  select * from private.get_public_booking_slots_internal(
    p_salon_slug, p_service_id, p_date, p_barber_id
  );
$wrapper$;

revoke all on function public.get_public_booking_slots(text, uuid, date, uuid) from public;
grant execute on function public.get_public_booking_slots(text, uuid, date, uuid) to anon, authenticated;

commit;