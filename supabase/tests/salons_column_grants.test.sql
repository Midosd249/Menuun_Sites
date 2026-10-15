begin;
select plan(11);
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
select ok(has_column_privilege('authenticated','public.salons','name_ar','UPDATE'),'owner-editable name column remains updateable');
select ok(has_column_privilege('authenticated','public.salons','logo_url','UPDATE'),'owner-editable logo column remains updateable');
select ok(not has_column_privilege('authenticated','public.salons','id','UPDATE'),'id cannot be updated by authenticated');
select ok(not has_column_privilege('authenticated','public.salons','slug','UPDATE'),'slug cannot be updated by authenticated');
select ok(not has_column_privilege('authenticated','public.salons','is_active','UPDATE'),'active flag cannot be updated by authenticated');
select ok(not has_column_privilege('authenticated','public.salons','is_published','UPDATE'),'publication flag cannot be updated by authenticated');
select ok(not has_column_privilege('authenticated','public.salons','created_at','UPDATE'),'creation timestamp cannot be updated by authenticated');
select ok(not has_column_privilege('authenticated','public.salons','created_by','UPDATE'),'creator cannot be changed by authenticated');
set local role authenticated;
set local request.jwt.claim.sub='10000000-0000-4000-8000-000000000001';
select results_eq($$update public.salons set name_ar='بعد' where id='20000000-0000-4000-8000-000000000001' returning name_ar$$,$$values ('بعد'::text)$$,'member can update allowed column and use RETURNING');
select throws_ok($$update public.salons set slug='changed-slug' where id='20000000-0000-4000-8000-000000000001'$$,'42501',null,'member cannot update sensitive slug column');
reset role;
set local role authenticated;
set local request.jwt.claim.sub='10000000-0000-4000-8000-000000000005';
select is_empty($$update public.salons set name_ar='cross tenant' where id='20000000-0000-4000-8000-000000000001' returning id$$,'non-member cannot update another salon');
select * from finish();
rollback;
