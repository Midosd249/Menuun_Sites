begin;

select plan(3);

-- Isolated local-test fixtures. The transaction rolls back, so no live records persist.
insert into auth.users (
  id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data
) values
  ('11111111-1111-4111-8111-111111111111', 'authenticated', 'authenticated',
   'rls-owner-fixture@menuun.invalid', '', now(), '{}'::jsonb, '{}'::jsonb),
  ('22222222-2222-4222-8222-222222222222', 'authenticated', 'authenticated',
   'rls-nonmember-fixture@menuun.invalid', '', now(), '{}'::jsonb, '{}'::jsonb)
on conflict (id) do nothing;

insert into public.salons (id, slug, name_ar, name_en, created_by, is_active, is_published)
values (
  '33333333-3333-4333-8333-333333333333',
  'rls-nonmember-isolation-fixture',
  'صالون اختبار العزل',
  'RLS isolation fixture',
  '11111111-1111-4111-8111-111111111111',
  true,
  false
)
on conflict (id) do nothing;

insert into public.salon_members (salon_id, user_id, role, is_active)
values (
  '33333333-3333-4333-8333-333333333333',
  '11111111-1111-4111-8111-111111111111',
  'owner',
  true
)
on conflict (salon_id, user_id) do nothing;

set local role authenticated;
select set_config('request.jwt.claim.sub', '22222222-2222-4222-8222-222222222222', true);
select set_config('request.jwt.claims', '{"sub":"22222222-2222-4222-8222-222222222222","role":"authenticated","aud":"authenticated"}', true);

select is(
  (select count(*)::integer from public.salons where id = '33333333-3333-4333-8333-333333333333'),
  0,
  'an authenticated non-member cannot read an unpublished salon'
);

select is(
  (with changed as (
    update public.salons
       set name_ar = 'تعديل غير مصرح'
     where id = '33333333-3333-4333-8333-333333333333'
     returning id
  ) select count(*)::integer from changed),
  0,
  'an authenticated non-member cannot update another salon'
);

reset role;

select is(
  (select name_ar from public.salons where id = '33333333-3333-4333-8333-333333333333'),
  'صالون اختبار العزل',
  'the salon row remains unchanged after the non-member update attempt'
);

select * from finish();
rollback;
