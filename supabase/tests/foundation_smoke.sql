-- Smoke test for Menuun Site database foundation.
-- Run only in a disposable transaction against project Menuun_Site.
-- All inserted rows, including the temporary auth user, are rolled back.

begin;

do $test$
declare
  v_user_id uuid := gen_random_uuid();
  v_salon_id uuid;
  v_service_id uuid;
  v_barber_id uuid;
  v_appointment_id uuid;
  v_event_count integer;
  v_start timestamptz := now() + interval '1 day';
begin
  insert into auth.users (
    id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) values (
    v_user_id, 'authenticated', 'authenticated',
    'menuun-smoke-' || replace(v_user_id::text, '-', '') || '@example.invalid',
    '', now(), '{}'::jsonb, '{}'::jsonb, now(), now()
  );

  perform set_config('request.jwt.claim.sub', v_user_id::text, true);
  perform set_config('request.jwt.claims',
    jsonb_build_object('sub', v_user_id, 'role', 'authenticated', 'aud', 'authenticated')::text,
    true
  );

  v_salon_id := public.create_salon_with_owner(
    'qa-' || replace(v_user_id::text, '-', ''),
    'صالون اختبار',
    'QA Salon'
  );

  insert into public.services (salon_id, name_ar, name_en, price_sar, duration_minutes)
  values (v_salon_id, 'قصّة اختبار', 'Test Cut', 80, 45)
  returning id into v_service_id;

  insert into public.barbers (salon_id, display_name)
  values (v_salon_id, 'حلاق اختبار')
  returning id into v_barber_id;

  insert into public.appointments (
    salon_id, service_id, barber_id, customer_name, customer_phone,
    starts_at, ends_at, service_name_ar_snapshot, service_name_en_snapshot,
    price_sar_snapshot, duration_minutes_snapshot
  ) values (
    v_salon_id, v_service_id, v_barber_id, 'عميل اختبار', '0501234567',
    v_start, v_start + interval '45 minutes', 'قصّة اختبار', 'Test Cut', 80, 45
  ) returning id into v_appointment_id;

  -- A second active appointment for the same barber/time must be rejected.
  begin
    insert into public.appointments (
      salon_id, service_id, barber_id, customer_name, customer_phone,
      starts_at, ends_at, service_name_ar_snapshot, service_name_en_snapshot,
      price_sar_snapshot, duration_minutes_snapshot
    ) values (
      v_salon_id, v_service_id, v_barber_id, 'عميل ثانٍ', '0509876543',
      v_start + interval '15 minutes', v_start + interval '60 minutes',
      'قصّة اختبار', 'Test Cut', 80, 45
    );
    raise exception 'SMOKE_TEST_FAILED: overlapping appointment was accepted';
  exception
    when exclusion_violation then null;
  end;

  update public.appointments set status = 'confirmed' where id = v_appointment_id;
  update public.appointments set status = 'completed' where id = v_appointment_id;

  select count(*) into v_event_count
  from public.appointment_events
  where salon_id = v_salon_id and appointment_id = v_appointment_id;

  if v_event_count <> 3 then
    raise exception 'SMOKE_TEST_FAILED: expected 3 appointment events, got %', v_event_count;
  end if;

  -- Terminal states must not transition back to confirmed.
  begin
    update public.appointments set status = 'confirmed' where id = v_appointment_id;
    raise exception 'SMOKE_TEST_FAILED: invalid terminal transition was accepted';
  exception
    when sqlstate '22023' then null;
  end;
end;
$test$;

rollback;
