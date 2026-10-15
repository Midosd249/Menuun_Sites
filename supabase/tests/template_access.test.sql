begin;
select plan(6);
insert into auth.users (id,aud,role,email,encrypted_password,email_confirmed_at,raw_app_meta_data,raw_user_meta_data,created_at,updated_at)
values ('11000000-0000-4000-8000-000000000011','authenticated','authenticated','template-owner@example.test','',now(),'{}'::jsonb,'{}'::jsonb,now(),now()),
       ('11000000-0000-4000-8000-000000000012','authenticated','authenticated','template-nonmember@example.test','',now(),'{}'::jsonb,'{}'::jsonb,now(),now())
on conflict (id) do nothing;
insert into public.salons(id,slug,name_ar,name_en,is_active,is_published,created_by)
values ('21000000-0000-4000-8000-000000000011','template-access-test','صالون اختبار القالب','Template Test Salon',true,false,'11000000-0000-4000-8000-000000000011')
on conflict (id) do nothing;
insert into public.salon_members(salon_id,user_id,role,is_active)
values ('21000000-0000-4000-8000-000000000011','11000000-0000-4000-8000-000000000011','owner',true)
on conflict (salon_id,user_id) do nothing;
set local role authenticated;
set local request.jwt.claim.sub = '11000000-0000-4000-8000-000000000011';
select results_eq($$update public.salons set template_key='atelier' where id='21000000-0000-4000-8000-000000000011' returning template_key$$,$$values ('atelier'::text)$$,'owner can save atelier template');
select results_eq($$update public.salons set template_key='oasis' where id='21000000-0000-4000-8000-000000000011' returning template_key$$,$$values ('oasis'::text)$$,'owner can save oasis template');
select results_eq($$update public.salons set template_key='rose' where id='21000000-0000-4000-8000-000000000011' returning template_key$$,$$values ('rose'::text)$$,'owner can save rose template');
set local request.jwt.claim.sub = '11000000-0000-4000-8000-000000000012';
select is_empty($$update public.salons set template_key='atelier' where id='21000000-0000-4000-8000-000000000011' returning template_key$$,'non-member cannot save atelier template');
select is_empty($$update public.salons set template_key='oasis' where id='21000000-0000-4000-8000-000000000011' returning template_key$$,'non-member cannot save oasis template');
select is_empty($$update public.salons set template_key='rose' where id='21000000-0000-4000-8000-000000000011' returning template_key$$,'non-member cannot save rose template');
reset role;
select * from finish();
rollback;
