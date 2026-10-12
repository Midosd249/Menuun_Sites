-- Booking + media migration smoke test.
-- Runs inside a transaction and rolls back all temporary auth, salon, and booking data.
-- Run only against the dedicated Menuun_Site project after applying migrations.

begin;

do $test$
declare
  v_user_id uuid := gen_random_uuid();
  v_salon_id uuid;
  v_service_id uuid;
  v_barber_id uuid;
  v_appointment_id uuid;
  v_start timestamptz := ((date_trunc('day', now() at time zone 'Asia/Riyadh') + interval '2 days' + interval '10 hours') at time zone 'Asia/Riyadh');
  v_event_count integer;
  v_notification_count integer;
  v_bucket_public boolean;
  v_bucket_limit bigint;
begin
  select b.public, b.file_size_limit
    into v_bucket_public, v_bucket_limit
  from storage.buckets b where b.id = 'salon-media';

  if not found or v_bucket_public is distinct from false or v_bucket_limit <> 104857600 then
    raise exception 'SMOKE_TEST_FAILED: private salon-media bucket config is incorrect';
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'storage'
      and tablename = 'objects' and policyname = 'salon_media_manager_insert'
  ) then
    raise exception 'SMOKE_TEST_FAILED: salon media upload policy missing';
  end if;

  if not exists (
    select 1 from pg_constraint where conrelid = 'public.appointments'::regclass
      and conname = 'appointments_no_active_overlap'
  ) then
    raise exception 'SMOKE_TEST_FAILED: appointment overlap constraint missing';
  end if;

  insert into auth.users (
    id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) values (
    v_user_id, 'authenticated', 'authenticated',
    'menuun-booking-smoke-' || replace(v_user_id::text, '-', '') || '@example.invalid',
    '', now(), '{}'::jsonb, '{}'::jsonb, now(), now()
  );

  perform set_config('request.jwt.claim.sub', v_user_id::text, true);
  perform set_config('request.jwt.claims',
    jsonb_build_object('sub', v_user_id, 'role', 'authenticated', 'aud', 'authenticated')::text,
    true
  );

  v_salon_id := public.create_salon_with_owner(
    'book-' || replace(v_user_id::text, '-', ''),
    'صالون اختبار الحجز',
    'Booking QA Salon'
  );
  update public.salons set is_published = true where id = v_salon_id;

  insert into public.business_hours (salon_id, weekday, opens_at, closes_at)
  select v_salon_id, d, '00:00'::time, '23:59'::time from generate_series(0,6) d;

  insert into public.services (salon_id, name_ar, name_en, price_sar, duration_minutes)
  values (v_salon_id, 'قصّة اختبار', 'Test Cut', 80, 45)
  returning id into v_service_id;

  insert into public.barbers (salon_id, display_name)
  values (v_salon_id, 'حلاق اختبار')
  returning id into v_barber_id;

  v_appointment_id := public.request_salon_appointment(
    (select slug from public.salons where id = v_salon_id),
    v_service_id, v_barber_id, 'عميل اختبار', '+966501234567', v_start, 'اختبار مؤقت'
  );

  if not exists (
    select 1 from public.appointments
    where id = v_appointment_id and status = 'pending'
      and ends_at = starts_at + interval '45 minutes'
      and price_sar_snapshot = 80
  ) then
    raise exception 'SMOKE_TEST_FAILED: booking record/snapshots are incorrect';
  end if;

  select count(*) into v_event_count from public.appointment_events
  where salon_id = v_salon_id and appointment_id = v_appointment_id;
  if v_event_count <> 1 then
    raise exception 'SMOKE_TEST_FAILED: appointment creation event missing';
  end if;

  select count(*) into v_notification_count from public.notifications
  where salon_id = v_salon_id and appointment_id = v_appointment_id;
  if v_notification_count <> 1 then
    raise exception 'SMOKE_TEST_FAILED: owner notification missing';
  end if;

  begin
    perform public.request_salon_appointment(
      (select slug from public.salons where id = v_salon_id),
      v_service_id, v_barber_id, 'عميل ثانٍ', '+966509876543',
      v_start + interval '15 minutes', null
    );
    raise exception 'SMOKE_TEST_FAILED: overlapping public booking was accepted';
  exception when exclusion_violation then null;
  end;

  begin
    perform public.request_salon_appointment(
      (select slug from public.salons where id = v_salon_id),
      gen_random_uuid(), v_barber_id, 'عميل ثالث', '+966509876543',
      v_start + interval '2 hours', null
    );
    raise exception 'SMOKE_TEST_FAILED: invalid service was accepted';
  exception when sqlstate 'P0002' then null;
  end;
end;
$test$;

rollback;
