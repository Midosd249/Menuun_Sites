begin;
select plan(18);
insert into auth.users (id,aud,role,email,encrypted_password,email_confirmed_at,raw_app_meta_data,raw_user_meta_data,created_at,updated_at)
values
 ('10000000-0000-4000-8000-000000000001','authenticated','authenticated','column-owner@example.test','',now(),'{}','{}',now(),now()),
 ('10000000-0000-4000-8000-000000000005','authenticated','authenticated','column-outsider@example.test','',now(),'{}','{}',now(),now())
on conflict (id) do nothing;
insert into public.salons (id,slug,name_ar,name_en,is_active,is_published,created_by)
values ('20000000-0000-4000-8000-000000000001','column-grant-salon','قبل','Before',true,false,'10000000-0000-4000-8000-000000000001')
on conflict (id) do nothing;
insert into public.salon_members (salon_id,user_id,role,is_active)
values ('20000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000001','owner',true)
on conflict (salon_id,user_id) do nothing;
select ok(has_column_privilege('authenticated','public.salons','instagram_url','UPDATE'),'Instagram link is updateable');
select ok(has_column_privilege('authenticated','public.salons','tiktok_url','UPDATE'),'TikTok link is updateable');
select ok(has_column_privilege('authenticated','public.salons','snapchat_url','UPDATE'),'Snapchat link is updateable');
select ok(has_column_privilege('authenticated','public.salons','facebook_url','UPDATE'),'Facebook link is updateable');
select ok(has_column_privilege('authenticated','public.salons','google_maps_url','UPDATE'),'Google Maps link is updateable');
select ok(has_column_privilege('authenticated','public.salons','website_url','UPDATE'),'Website link is updateable');
select ok(not has_column_privilege('authenticated','public.salons','id','UPDATE'),'id remains blocked');
select ok(not has_column_privilege('authenticated','public.salons','slug','UPDATE'),'slug remains blocked');
select ok(not has_column_privilege('authenticated','public.salons','created_at','UPDATE'),'created_at remains blocked');
select ok(not has_column_privilege('authenticated','public.salons','created_by','UPDATE'),'created_by remains blocked');
select ok(not has_column_privilege('authenticated','public.salons','is_active','UPDATE'),'is_active remains blocked');
select ok(not has_column_privilege('authenticated','public.salons','is_published','UPDATE'),'is_published remains blocked');
select ok(not has_column_privilege('authenticated','public.salons','primary_color','UPDATE'),'brand color remains blocked until a specific UI is authorized');
select ok(not has_column_privilege('authenticated','public.salons','currency_code','UPDATE'),'currency remains blocked');
select ok((select count(*)=1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='appointments'),'appointments are in Realtime publication');
set local role authenticated;
set local request.jwt.claim.sub='10000000-0000-4000-8000-000000000001';
select results_eq($$update public.salons set instagram_url='https://instagram.com/test' where id='20000000-0000-4000-8000-000000000001' returning instagram_url$$,$$values ('https://instagram.com/test'::text)$$,'member can save social link');
select throws_ok($$update public.salons set slug='changed-slug' where id='20000000-0000-4000-8000-000000000001'$$,'42501',null,'member cannot update sensitive slug');
reset role;
set local role authenticated;
set local request.jwt.claim.sub='10000000-0000-4000-8000-000000000005';
select is_empty($$update public.salons set instagram_url='https://instagram.com/cross' where id='20000000-0000-4000-8000-000000000001' returning id$$,'non-member cannot update another salon');
select * from finish();
rollback;
