begin;

select plan(6);

insert into auth.users (
  id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) values
  ('11000000-0000-4000-8000-000000000001', 'authenticated', 'authenticated', 'appt-owner-a@example.test', '', now(), '{}'::jsonb, '{}'::jsonb, now(), now()),
  ('11000000-0000-4000-8000-000000000002', 'authenticated', 'authenticated', 'appt-reception-a@example.test', '', now(), '{}'::jsonb, '{}'::jsonb, now(), now()),
  ('11000000-0000-4000-8000-000000000003', 'authenticated', 'authenticated', 'appt-owner-b@example.test', '', now(), '{}'::jsonb, '{}'::jsonb, now(), now())
on conflict (id) do nothing;

insert into public.salons (id, slug, name_ar, name_en, is_active, is_published, created_by)
values
  ('21000000-0000-4000-8000-000000000001', 'appt-salon-a', 'اختبار مواعيد أ', 'Appointment Salon A', true, false, '11000000-0000-4000-8000-000000000001'),
  ('21000000-0000-4000-8000-000000000002', 'appt-salon-b', 'اختبار مواعيد ب', 'Appointment Salon B', true, false, '11000000-0000-4000-8000-000000000003')
on conflict (id) do nothing;

insert into public.salon_members (salon_id, user_id, role, is_active)
values
  ('21000000-0000-4000-8000-000000000001', '11000000-0000-4000-8000-000000000001', 'owner', true),
  ('21000000-0000-4000-8000-000000000001', '11000000-0000-4000-8000-000000000002', 'receptionist', true),
  ('21000000-0000-4000-8000-000000000002', '11000000-0000-4000-8000-000000000003', 'owner', true)
on conflict (salon_id, user_id) do nothing;

insert into public.services (id, salon_id, name_ar, name_en, price_sar, duration_minutes)
values
  ('31000000-0000-4000-8000-000000000001', '21000000-0000-4000-8000-000000000001', 'قص شعر', 'Haircut', 50, 30),
  ('31000000-0000-4000-8000-000000000002', '21000000-0000-4000-8000-000000000002', 'قص شعر ب', 'Haircut B', 55, 30)
on conflict (id) do nothing;

insert into public.barbers (id, salon_id, display_name)
values
  ('41000000-0000-4000-8000-000000000001', '21000000-0000-4000-8000-000000000001', 'Barber A'),
  ('41000000-0000-4000-8000-000000000002', '21000000-0000-4000-8000-000000000002', 'Barber B')
on conflict (id) do nothing;

insert into public.appointments (
  id, salon_id, service_id, barber_id, customer_name, customer_phone,
  starts_at, ends_at, status, service_name_ar_snapshot, service_name_en_snapshot,
  price_sar_snapshot, duration_minutes_snapshot
) values (
  '51000000-0000-4000-8000-000000000001',
  '21000000-0000-4000-8000-000000000001',
  '31000000-0000-4000-8000-000000000001',
  '41000000-0000-4000-8000-000000000001',
  'Test Customer', '+966500000001',
  now() + interval '2 days', now() + interval '2 days 30 minutes',
  'pending', 'قص شعر', 'Haircut', 50, 30
)
on conflict (id) do nothing;

set local role authenticated;
set local request.jwt.claim.sub = '11000000-0000-4000-8000-000000000001';
select results_eq(
  $$select id from public.appointments where id = '51000000-0000-4000-8000-000000000001'$$,
  $$values ('51000000-0000-4000-8000-000000000001'::uuid)$$,
  'salon A owner can read their appointment'
);

set local request.jwt.claim.sub = '11000000-0000-4000-8000-000000000003';
select is_empty(
  $$select id from public.appointments where id = '51000000-0000-4000-8000-000000000001'$$,
  'salon B owner cannot read salon A appointment'
);
select is_empty(
  $$update public.appointments set status = 'cancelled'
    where id = '51000000-0000-4000-8000-000000000001' returning id$$,
  'salon B owner cannot mutate salon A appointment'
);

set local request.jwt.claim.sub = '11000000-0000-4000-8000-000000000002';
select lives_ok(
  $$update public.appointments set status = 'confirmed'
    where id = '51000000-0000-4000-8000-000000000001'$$,
  'same-salon receptionist can confirm a pending appointment'
);

reset role;
select is(
  (select status from public.appointments where id = '51000000-0000-4000-8000-000000000001'),
  'confirmed',
  'receptionist status update is persisted'
);
select results_eq(
  $$select from_status, to_status
    from public.appointment_events
    where appointment_id = '51000000-0000-4000-8000-000000000001'
      and to_status = 'confirmed'$$,
  $$values ('pending'::text, 'confirmed'::text)$$,
  'appointment status change creates an audit event'
);

select * from finish();
rollback;
