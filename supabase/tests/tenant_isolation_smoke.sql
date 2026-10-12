-- Transactional tenant-isolation smoke test.
-- Run only against Menuun_Site; all rows and temporary auth users are rolled back.

begin;

do $setup$
declare
  v_user_a uuid := '00000000-0000-4000-8000-000000000101';
  v_user_b uuid := '00000000-0000-4000-8000-000000000102';
  v_salon_a uuid;
  v_salon_b uuid;
begin
  insert into auth.users (id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
  values
    (v_user_a, 'authenticated', 'authenticated', 'tenant-a-smoke@example.invalid', '', now(), '{}'::jsonb, '{}'::jsonb, now(), now()),
    (v_user_b, 'authenticated', 'authenticated', 'tenant-b-smoke@example.invalid', '', now(), '{}'::jsonb, '{}'::jsonb, now(), now());

  perform set_config('request.jwt.claim.sub', v_user_a::text, true);
  perform set_config('request.jwt.claims', jsonb_build_object('sub',v_user_a,'role','authenticated','aud','authenticated')::text, true);
  v_salon_a := public.create_salon_with_owner('tenant-a-smoke', 'صالون ألف', 'Salon A');
  insert into public.services (salon_id, name_ar, name_en, price_sar, duration_minutes)
  values (v_salon_a, 'خدمة ألف', 'Service A', 50, 30);

  perform set_config('request.jwt.claim.sub', v_user_b::text, true);
  perform set_config('request.jwt.claims', jsonb_build_object('sub',v_user_b,'role','authenticated','aud','authenticated')::text, true);
  v_salon_b := public.create_salon_with_owner('tenant-b-smoke', 'صالون باء', 'Salon B');
  insert into public.services (salon_id, name_ar, name_en, price_sar, duration_minutes)
  values (v_salon_b, 'خدمة باء', 'Service B', 60, 30);

  perform set_config('test.salon_a_id', v_salon_a::text, true);
  perform set_config('test.salon_b_id', v_salon_b::text, true);
  perform set_config('test.user_a_id', v_user_a::text, true);
  perform set_config('test.user_b_id', v_user_b::text, true);
end;
$setup$;

select set_config('request.jwt.claim.sub', current_setting('test.user_a_id'), true);
select set_config('request.jwt.claims', jsonb_build_object('sub',current_setting('test.user_a_id'),'role','authenticated','aud','authenticated')::text, true);
set local role authenticated;

do $assert_a$
begin
  if (select count(*) from public.salons where id = current_setting('test.salon_a_id')::uuid) <> 1 then
    raise exception 'RLS_TEST_FAILED: tenant A cannot read its own salon';
  end if;
  if (select count(*) from public.salons where id = current_setting('test.salon_b_id')::uuid) <> 0 then
    raise exception 'RLS_TEST_FAILED: tenant A can read tenant B salon';
  end if;
  if (select count(*) from public.services where salon_id = current_setting('test.salon_b_id')::uuid) <> 0 then
    raise exception 'RLS_TEST_FAILED: tenant A can read tenant B services';
  end if;
end;
$assert_a$;

reset role;
select set_config('request.jwt.claim.sub', current_setting('test.user_b_id'), true);
select set_config('request.jwt.claims', jsonb_build_object('sub',current_setting('test.user_b_id'),'role','authenticated','aud','authenticated')::text, true);
set local role authenticated;

do $assert_b$
begin
  if (select count(*) from public.salons where id = current_setting('test.salon_b_id')::uuid) <> 1 then
    raise exception 'RLS_TEST_FAILED: tenant B cannot read its own salon';
  end if;
  if (select count(*) from public.salons where id = current_setting('test.salon_a_id')::uuid) <> 0 then
    raise exception 'RLS_TEST_FAILED: tenant B can read tenant A salon';
  end if;
  if (select count(*) from public.services where salon_id = current_setting('test.salon_a_id')::uuid) <> 0 then
    raise exception 'RLS_TEST_FAILED: tenant B can read tenant A services';
  end if;
end;
$assert_b$;

reset role;
rollback;
