-- Smoke test for public booking availability. Run on Menuun_Site after migration 20261012190458.
-- Uses a rollback-only transaction; no test records are retained.
begin;
do $test$
declare
  v_user_id uuid := gen_random_uuid();
  v_salon_id uuid;
  v_service_id uuid;
  v_barber_id uuid;
  v_slug text := 'avail-' || replace(gen_random_uuid()::text, '-', '');
  v_date date := (now() at time zone 'Asia/Riyadh')::date + 2;
  v_start timestamptz;
begin
  if not has_function_privilege('anon', 'public.get_public_booking_slots(text,uuid,date,uuid)', 'EXECUTE') then
    raise exception 'anon execute grant missing';
  end if;
  insert into auth.users (id,aud,role,email,encrypted_password,email_confirmed_at,raw_app_meta_data,raw_user_meta_data,created_at,updated_at)
  values (v_user_id,'authenticated','authenticated',v_user_id::text || '@example.invalid','',now(),'{}','{}',now(),now());
  perform set_config('request.jwt.claim.sub',v_user_id::text,true);
  perform set_config('request.jwt.claims',jsonb_build_object('sub',v_user_id,'role','authenticated','aud','authenticated')::text,true);
  v_salon_id := public.create_salon_with_owner(v_slug,'صالون اختبار التوفر','Availability Test Salon');
  update public.salons set is_published=true where id=v_salon_id;
  insert into public.business_hours(salon_id,weekday,opens_at,closes_at)
  select v_salon_id,d,'00:00'::time,'23:59'::time from generate_series(0,6) d;
  insert into public.services(salon_id,name_ar,name_en,price_sar,duration_minutes)
  values(v_salon_id,'خدمة اختبار','Test Service',80,45) returning id into v_service_id;
  insert into public.barbers(salon_id,display_name) values(v_salon_id,'حلاق اختبار') returning id into v_barber_id;
  v_start := ((v_date::timestamp + time '10:00') at time zone 'Asia/Riyadh');
  perform public.request_salon_appointment(v_slug,v_service_id,v_barber_id,'عميل اختبار','+966501234567',v_start,null);
  if not exists (select 1 from public.get_public_booking_slots(v_slug,v_service_id,v_date,null) where starts_at=((v_date::timestamp + time '09:00') at time zone 'Asia/Riyadh')) then
    raise exception 'free slot missing';
  end if;
  if exists (select 1 from public.get_public_booking_slots(v_slug,v_service_id,v_date,null) x where x.starts_at < v_start + interval '45 minutes' and x.starts_at + interval '45 minutes' > v_start) then
    raise exception 'conflicting slot returned';
  end if;
  begin
    perform * from public.get_public_booking_slots(v_slug,gen_random_uuid(),v_date,null);
    raise exception 'invalid service accepted';
  exception when sqlstate 'P0002' then null;
  end;
end;
$test$;
rollback;
