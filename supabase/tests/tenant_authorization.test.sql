begin;

select plan(11);

-- Deterministic users and two isolated salons. All fixture writes run as the
-- local database owner before switching into the application roles.
insert into auth.users (
  id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) values
  ('10000000-0000-4000-8000-000000000001', 'authenticated', 'authenticated', 'owner-a@example.test', '', now(), '{}'::jsonb, '{}'::jsonb, now(), now()),
  ('10000000-0000-4000-8000-000000000002', 'authenticated', 'authenticated', 'manager-a@example.test', '', now(), '{}'::jsonb, '{}'::jsonb, now(), now()),
  ('10000000-0000-4000-8000-000000000003', 'authenticated', 'authenticated', 'reception-a@example.test', '', now(), '{}'::jsonb, '{}'::jsonb, now(), now()),
  ('10000000-0000-4000-8000-000000000004', 'authenticated', 'authenticated', 'inactive-a@example.test', '', now(), '{}'::jsonb, '{}'::jsonb, now(), now()),
  ('10000000-0000-4000-8000-000000000005', 'authenticated', 'authenticated', 'outsider@example.test', '', now(), '{}'::jsonb, '{}'::jsonb, now(), now())
on conflict (id) do nothing;

insert into public.salons (id, slug, name_ar, name_en, is_active, is_published, created_by)
values
  ('20000000-0000-4000-8000-000000000001', 'rls-salon-a', 'اختبار أ', 'RLS Salon A', true, false, '10000000-0000-4000-8000-000000000001'),
  ('20000000-0000-4000-8000-000000000002', 'rls-salon-b', 'اختبار ب', 'RLS Salon B', true, false, '10000000-0000-4000-8000-000000000002')
on conflict (id) do nothing;

insert into public.salon_members (salon_id, user_id, role, is_active)
values
  ('20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', 'owner', true),
  ('20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000002', 'manager', true),
  ('20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000003', 'receptionist', true),
  ('20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000004', 'manager', false),
  ('20000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000002', 'owner', true)
on conflict (salon_id, user_id) do nothing;

insert into public.services (id, salon_id, name_ar, name_en, price_sar, duration_minutes)
values
  ('30000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', 'خدمة أ', 'Service A', 50, 30),
  ('30000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000002', 'خدمة ب', 'Service B', 60, 30)
on conflict (id) do nothing;

select has_table('public', 'salons', 'salons table exists');
select has_table('public', 'salon_members', 'membership table exists');
select has_table('public', 'services', 'services table exists');

set local role authenticated;
set local request.jwt.claim.sub = '10000000-0000-4000-8000-000000000001';
select results_eq(
  $$select id from public.salons where id = '20000000-0000-4000-8000-000000000001'$$,
  $$values ('20000000-0000-4000-8000-000000000001'::uuid)$$,
  'owner can read their own unpublished salon'
);

set local request.jwt.claim.sub = '10000000-0000-4000-8000-000000000005';
select is_empty(
  $$select id from public.salons where id = '20000000-0000-4000-8000-000000000001'$$,
  'authenticated non-member cannot read an unpublished salon'
);

set local request.jwt.claim.sub = '10000000-0000-4000-8000-000000000004';
select is_empty(
  $$select id from public.salons where id = '20000000-0000-4000-8000-000000000001'$$,
  'inactive membership does not grant access'
);

set local request.jwt.claim.sub = '10000000-0000-4000-8000-000000000002';
select lives_ok(
  $$insert into public.services (salon_id, name_ar, name_en, price_sar, duration_minutes)
    values ('20000000-0000-4000-8000-000000000001', 'خدمة جديدة', 'New Service', 25, 15)$$,
  'active manager can create a service for their salon'
);

set local request.jwt.claim.sub = '10000000-0000-4000-8000-000000000003';
select throws_ok(
  $$insert into public.services (salon_id, name_ar, name_en, price_sar, duration_minutes)
    values ('20000000-0000-4000-8000-000000000001', 'ممنوع', 'Forbidden', 25, 15)$$,
  '42501',
  null,
  'receptionist cannot create or manage services'
);

set local request.jwt.claim.sub = '10000000-0000-4000-8000-000000000002';
select is_empty(
  $$update public.services
       set name_en = 'cross-tenant mutation'
     where id = '30000000-0000-4000-8000-000000000001'
     returning id$$,
  'manager of salon B cannot mutate a salon A service'
);

reset role;
select is(
  (select name_en from public.services where id = '30000000-0000-4000-8000-000000000001'),
  'Service A',
  'cross-tenant update leaves the target row unchanged'
);

set local role anon;
select throws_ok(
  $$select public.create_salon_with_owner('anonymous-attempt', 'اختبار', '')$$,
  '42501',
  null,
  'anonymous caller cannot execute the salon provisioning RPC'
);

select * from finish();
rollback;
