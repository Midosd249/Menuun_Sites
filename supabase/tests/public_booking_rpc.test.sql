begin;

select plan(4);

-- Public RPC regression coverage: anon can book only against a published salon,
-- and can discover availability without receiving customer/appointment records.
insert into auth.users (
  id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) values (
  '93000000-0000-4000-8000-000000000001',
  'authenticated', 'authenticated', 'public-rpc-owner@example.test', '',
  now(), '{}'::jsonb, '{}'::jsonb, now(), now()
)
on conflict (id) do nothing;

insert into public.salons (
  id, slug, name_ar, name_en, is_active, is_published, created_by, timezone
) values
  ('94000000-0000-4000-8000-000000000001', 'public-rpc-salon-a',
   'صالون الحجز أ', 'Public RPC Salon A', true, true,
   '93000000-0000-4000-8000-000000000001', 'Asia/Riyadh'),
  ('94000000-0000-4000-8000-000000000002', 'public-rpc-salon-b',
   'صالون الحجز ب', 'Public RPC Salon B', true, true,
   '93000000-0000-4000-8000-000000000001', 'Asia/Riyadh')
on conflict (id) do nothing;

insert into public.salon_members (salon_id, user_id, role, is_active)
values (
  '94000000-0000-4000-8000-000000000001',
  '93000000-0000-4000-8000-000000000001', 'owner', true
)
on conflict (salon_id, user_id) do nothing;

insert into public.services (id, salon_id, name_ar, name_en, price_sar, duration_minutes)
values
  ('95000000-0000-4000-8000-000000000001', '94000000-0000-4000-8000-000000000001',
   'خدمة أ', 'RPC Service A', 50, 30),
  ('95000000-0000-4000-8000-000000000002', '94000000-0000-4000-8000-000000000002',
   'خدمة ب', 'RPC Service B', 60, 30)
on conflict (id) do nothing;

insert into public.barbers (id, salon_id, display_name)
values
  ('96000000-0000-4000-8000-000000000001', '94000000-0000-4000-8000-000000000001', 'RPC Barber A'),
  ('96000000-0000-4000-8000-000000000002', '94000000-0000-4000-8000-000000000002', 'RPC Barber B')
on conflict (id) do nothing;

-- Open the target weekday for the next two days in the salon's local timezone.
insert into public.business_hours (salon_id, weekday, opens_at, closes_at, is_closed)
values (
  '94000000-0000-4000-8000-000000000001',
  extract(dow from ((now() at time zone 'Asia/Riyadh')::date + 2))::smallint,
  '00:00', '23:59', false
)
on conflict (salon_id, weekday) do update
set opens_at = excluded.opens_at, closes_at = excluded.closes_at, is_closed = false;

set local role anon;

select lives_ok(
  $$select public.request_salon_appointment(
    'public-rpc-salon-a',
    '95000000-0000-4000-8000-000000000001',
    '96000000-0000-4000-8000-000000000001',
    'RPC Test Customer',
    '+966500000123',
    ((((now() at time zone 'Asia/Riyadh')::date + 2)::timestamp + time '12:00')
      at time zone 'Asia/Riyadh'),
    'public rpc test'
  )$$,
  'anonymous visitor can request an appointment at a published salon'
);

select ok(
  exists (
    select 1
    from public.get_public_booking_slots(
      'public-rpc-salon-a',
      '95000000-0000-4000-8000-000000000001',
      (now() at time zone 'Asia/Riyadh')::date + 2,
      null
    )
  ),
  'public availability RPC returns slots without exposing appointment details'
);

select throws_ok(
  $$select public.request_salon_appointment(
    'public-rpc-salon-a',
    '95000000-0000-4000-8000-000000000002',
    '96000000-0000-4000-8000-000000000001',
    'Cross Tenant Customer',
    '+966500000124',
    ((((now() at time zone 'Asia/Riyadh')::date + 2)::timestamp + time '13:00')
      at time zone 'Asia/Riyadh'),
    null
  )$$,
  'P0002',
  null,
  'public booking RPC rejects a service belonging to a different salon'
);

select throws_ok(
  $$select public.request_salon_appointment(
    'missing-public-rpc-salon',
    '95000000-0000-4000-8000-000000000001',
    '96000000-0000-4000-8000-000000000001',
    'RPC Test Customer',
    '+966500000125',
    ((((now() at time zone 'Asia/Riyadh')::date + 2)::timestamp + time '14:00')
      at time zone 'Asia/Riyadh'),
    null
  )$$,
  'P0002',
  null,
  'public booking RPC does not allow booking against an unknown salon'
);

reset role;

select is(
  (select count(*)::integer
   from public.appointments
   where salon_id = '94000000-0000-4000-8000-000000000001'
     and customer_phone = '+966500000123'),
  1,
  'valid anonymous booking persists exactly one appointment'
);

select * from finish();
rollback;
