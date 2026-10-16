-- Local-only deterministic browser-test fixtures. Never run against production.
INSERT INTO auth.users
  (id,aud,role,email,encrypted_password,email_confirmed_at,raw_app_meta_data,raw_user_meta_data,created_at,updated_at)
VALUES
  ('50000000-0000-4000-8000-000000000001','authenticated','authenticated','fixture-owner@menuun.test',extensions.crypt('FixturePass123!',extensions.gen_salt('bf')),now(),'{"provider":"email","providers":["email"]}','{"full_name":"Fixture Owner"}',now(),now())
ON CONFLICT (id) DO UPDATE SET encrypted_password=EXCLUDED.encrypted_password,email_confirmed_at=EXCLUDED.email_confirmed_at;

INSERT INTO auth.identities
  (id,user_id,identity_data,provider,provider_id,last_sign_in_at,created_at,updated_at)
VALUES
  ('50000000-0000-4000-8000-000000000001','50000000-0000-4000-8000-000000000001',
   '{"sub":"50000000-0000-4000-8000-000000000001","email":"fixture-owner@menuun.test"}'::jsonb,
   'email','fixture-owner@menuun.test',now(),now(),now())
ON CONFLICT (provider_id,provider) DO UPDATE SET
  user_id=EXCLUDED.user_id,identity_data=EXCLUDED.identity_data,updated_at=now();

INSERT INTO public.salons
  (id,slug,name_ar,name_en,phone,whatsapp,timezone,currency_code,primary_color,accent_color,template_key,logo_url,is_active,is_published,created_by)
VALUES
 ('60000000-0000-4000-8000-000000000001','atelier-09','أتيليه 09','Atelier 09','+966551234567','+966551234567','Asia/Riyadh','SAR','#183d31','#d3f36b','atelier','/assets/brand/menuun/final/menuun-logo-ar.svg',true,true,'50000000-0000-4000-8000-000000000001'),
 ('60000000-0000-4000-8000-000000000002','fixture-atelier','صالون الاختبار','Test Salon','+966551234567','+966551234567','Asia/Riyadh','SAR','#183d31','#d3f36b','atelier','/assets/brand/menuun/final/menuun-logo-ar.svg',true,true,'50000000-0000-4000-8000-000000000001'),
 ('60000000-0000-4000-8000-000000000003','fixture-oasis','صالون الاختبار','Test Salon','+966551234567','+966551234567','Asia/Riyadh','SAR','#183d31','#d3f36b','oasis','/assets/brand/menuun/final/menuun-logo-ar.svg',true,true,'50000000-0000-4000-8000-000000000001'),
 ('60000000-0000-4000-8000-000000000004','fixture-rose','صالون الاختبار','Test Salon','+966551234567','+966551234567','Asia/Riyadh','SAR','#183d31','#d3f36b','rose','/assets/brand/menuun/final/menuun-logo-ar.svg',true,true,'50000000-0000-4000-8000-000000000001')
ON CONFLICT (id) DO UPDATE SET name_ar=EXCLUDED.name_ar,name_en=EXCLUDED.name_en,template_key=EXCLUDED.template_key,is_active=true,is_published=true;

INSERT INTO public.salon_members (salon_id,user_id,role,is_active)
VALUES
 ('60000000-0000-4000-8000-000000000001','50000000-0000-4000-8000-000000000001','owner',true),
 ('60000000-0000-4000-8000-000000000002','50000000-0000-4000-8000-000000000001','owner',true),
 ('60000000-0000-4000-8000-000000000003','50000000-0000-4000-8000-000000000001','owner',true),
 ('60000000-0000-4000-8000-000000000004','50000000-0000-4000-8000-000000000001','owner',true)
ON CONFLICT (salon_id,user_id) DO UPDATE SET role='owner',is_active=true;

INSERT INTO public.services (id,salon_id,name_ar,name_en,description_ar,description_en,price_sar,duration_minutes,is_active,sort_order)
VALUES ('70000000-0000-4000-8000-000000000001','60000000-0000-4000-8000-000000000001','قص شعر','Haircut','قص شعر كلاسيكي','Classic haircut',90,30,true,0)
ON CONFLICT (id) DO UPDATE SET name_ar=EXCLUDED.name_ar,name_en=EXCLUDED.name_en,price_sar=EXCLUDED.price_sar,duration_minutes=EXCLUDED.duration_minutes,is_active=true;

INSERT INTO public.services (id,salon_id,name_ar,name_en,description_ar,description_en,price_sar,duration_minutes,is_active,sort_order)
VALUES ('70000000-0000-4000-8000-000000000002','60000000-0000-4000-8000-000000000002','قص شعر','Haircut','قص شعر كلاسيكي','Classic haircut',90,30,true,0)
ON CONFLICT (id) DO UPDATE SET name_ar=EXCLUDED.name_ar,name_en=EXCLUDED.name_en,price_sar=EXCLUDED.price_sar,duration_minutes=EXCLUDED.duration_minutes,is_active=true;

INSERT INTO public.barbers (id,salon_id,display_name,display_name_en,bio_ar,bio_en,is_active,sort_order)
VALUES ('80000000-0000-4000-8000-000000000001','60000000-0000-4000-8000-000000000001','حلاق الاختبار','Fixture Barber','فريق الاختبار','Fixture team',true,0)
ON CONFLICT (id) DO UPDATE SET display_name=EXCLUDED.display_name,display_name_en=EXCLUDED.display_name_en,is_active=true;

INSERT INTO public.barbers (id,salon_id,display_name,display_name_en,bio_ar,bio_en,is_active,sort_order)
VALUES ('80000000-0000-4000-8000-000000000002','60000000-0000-4000-8000-000000000002','حلاق الاختبار','Fixture Barber','فريق الاختبار','Fixture team',true,0)
ON CONFLICT (id) DO UPDATE SET display_name=EXCLUDED.display_name,display_name_en=EXCLUDED.display_name_en,is_active=true;

INSERT INTO public.business_hours (salon_id,weekday,opens_at,closes_at,is_closed)
SELECT '60000000-0000-4000-8000-000000000001',d,'09:00'::time,'18:00'::time,false FROM generate_series(0,6) d
ON CONFLICT (salon_id,weekday) DO UPDATE SET opens_at=EXCLUDED.opens_at,closes_at=EXCLUDED.closes_at,is_closed=false;

INSERT INTO public.business_hours (salon_id,weekday,opens_at,closes_at,is_closed)
SELECT '60000000-0000-4000-8000-000000000002',d,'09:00'::time,'18:00'::time,false FROM generate_series(0,6) d
ON CONFLICT (salon_id,weekday) DO UPDATE SET opens_at=EXCLUDED.opens_at,closes_at=EXCLUDED.closes_at,is_closed=false;
