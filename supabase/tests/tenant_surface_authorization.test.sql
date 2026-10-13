begin;

select plan(15);

insert into auth.users (
  id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) values
  ('12000000-0000-4000-8000-000000000001', 'authenticated', 'authenticated', 'surface-owner-a@example.test', '', now(), '{}'::jsonb, '{}'::jsonb, now(), now()),
  ('12000000-0000-4000-8000-000000000002', 'authenticated', 'authenticated', 'surface-reception-a@example.test', '', now(), '{}'::jsonb, '{}'::jsonb, now(), now()),
  ('12000000-0000-4000-8000-000000000003', 'authenticated', 'authenticated', 'surface-owner-b@example.test', '', now(), '{}'::jsonb, '{}'::jsonb, now(), now())
on conflict (id) do nothing;

insert into public.salons (id, slug, name_ar, name_en, is_active, is_published, created_by)
values
  ('22000000-0000-4000-8000-000000000001', 'surface-salon-a', 'سطح أ', 'Surface Salon A', true, false, '12000000-0000-4000-8000-000000000001'),
  ('22000000-0000-4000-8000-000000000002', 'surface-salon-b', 'سطح ب', 'Surface Salon B', true, false, '12000000-0000-4000-8000-000000000003')
on conflict (id) do nothing;

insert into public.salon_members (salon_id, user_id, role, is_active)
values
  ('22000000-0000-4000-8000-000000000001', '12000000-0000-4000-8000-000000000001', 'owner', true),
  ('22000000-0000-4000-8000-000000000001', '12000000-0000-4000-8000-000000000002', 'receptionist', true),
  ('22000000-0000-4000-8000-000000000002', '12000000-0000-4000-8000-000000000003', 'owner', true)
on conflict (salon_id, user_id) do nothing;

insert into public.services (id, salon_id, name_ar, name_en, price_sar, duration_minutes)
values
  ('32000000-0000-4000-8000-000000000001', '22000000-0000-4000-8000-000000000001', 'خدمة سطح أ', 'Surface Service A', 35, 30),
  ('32000000-0000-4000-8000-000000000002', '22000000-0000-4000-8000-000000000002', 'خدمة سطح ب', 'Surface Service B', 40, 30)
on conflict (id) do nothing;

insert into public.barbers (id, salon_id, display_name)
values
  ('42000000-0000-4000-8000-000000000001', '22000000-0000-4000-8000-000000000001', 'Surface Barber A'),
  ('42000000-0000-4000-8000-000000000002', '22000000-0000-4000-8000-000000000002', 'Surface Barber B')
on conflict (id) do nothing;

insert into public.business_hours (id, salon_id, weekday, opens_at, closes_at)
values
  ('62000000-0000-4000-8000-000000000001', '22000000-0000-4000-8000-000000000001', 1, '09:00', '17:00'),
  ('62000000-0000-4000-8000-000000000002', '22000000-0000-4000-8000-000000000002', 1, '10:00', '18:00')
on conflict (id) do nothing;

insert into public.site_settings (salon_id, draft_content, published_content)
values
  ('22000000-0000-4000-8000-000000000001', '{"headline":"Draft A"}'::jsonb, '{}'::jsonb),
  ('22000000-0000-4000-8000-000000000002', '{"headline":"Draft B"}'::jsonb, '{}'::jsonb)
on conflict (salon_id) do nothing;

insert into public.notifications (id, salon_id, user_id, kind, title, body)
values
  ('72000000-0000-4000-8000-000000000001', '22000000-0000-4000-8000-000000000001', '12000000-0000-4000-8000-000000000001', 'system', 'Owner A notice', ''),
  ('72000000-0000-4000-8000-000000000002', '22000000-0000-4000-8000-000000000001', '12000000-0000-4000-8000-000000000002', 'system', 'Reception notice', '')
on conflict (id) do nothing;

insert into public.media_assets (
  id, salon_id, kind, storage_path, mime_type, byte_size, is_active, is_public
) values (
  '82000000-0000-4000-8000-000000000001',
  '22000000-0000-4000-8000-000000000001',
  'gallery', '22000000-0000-4000-8000-000000000001/gallery/existing.webp',
  'image/webp', 1024, true, false
), (
  '82000000-0000-4000-8000-000000000002',
  '22000000-0000-4000-8000-000000000002',
  'gallery', '22000000-0000-4000-8000-000000000002/gallery/existing.webp',
  'image/webp', 1024, true, false
)
on conflict (id) do nothing;

set local role authenticated;
set local request.jwt.claim.sub = '12000000-0000-4000-8000-000000000001';

select lives_ok(
  $$insert into public.barbers (salon_id, display_name)
    values ('22000000-0000-4000-8000-000000000001', 'New Surface Barber')$$,
  'owner can create a barber for their own salon'
);
select lives_ok(
  $$update public.business_hours set closes_at = '18:00'
    where id = '62000000-0000-4000-8000-000000000001'$$,
  'owner can update their salon business hours'
);
select lives_ok(
  $$insert into public.barber_services (salon_id, barber_id, service_id)
    values ('22000000-0000-4000-8000-000000000001',
      '42000000-0000-4000-8000-000000000001',
      '32000000-0000-4000-8000-000000000001')$$,
  'owner can link a barber to a service within the same salon'
);
select lives_ok(
  $$update public.site_settings set draft_content = '{"headline":"Updated A"}'::jsonb
    where salon_id = '22000000-0000-4000-8000-000000000001'$$,
  'owner can update their own draft site settings'
);
select lives_ok(
  $$insert into public.media_assets
    (salon_id, kind, storage_path, mime_type, byte_size)
    values ('22000000-0000-4000-8000-000000000001', 'gallery',
      '22000000-0000-4000-8000-000000000001/gallery/new.webp', 'image/webp', 2048)$$,
  'owner can register media for their own salon'
);

select is_empty(
  $$select id from public.barbers where id = '42000000-0000-4000-8000-000000000002'$$,
  'owner A cannot read an unpublished barber belonging to salon B'
);
select is_empty(
  $$update public.media_assets set is_public = true
    where id = '82000000-0000-4000-8000-000000000002' returning id$,
  'owner A cannot mutate a media record in another tenant'
);

set local request.jwt.claim.sub = '12000000-0000-4000-8000-000000000002';
select throws_ok(
  $$insert into public.barbers (salon_id, display_name)
    values ('22000000-0000-4000-8000-000000000001', 'Forbidden Reception Barber')$$,
  '42501', null,
  'receptionist cannot create barbers'
);
select is_empty(
  $$update public.site_settings set draft_content = '{"headline":"forbidden"}'::jsonb
    where salon_id = '22000000-0000-4000-8000-000000000001' returning salon_id$$,
  'receptionist cannot change site settings'
);
select lives_ok(
  $$update public.notifications set read_at = now()
    where id = '72000000-0000-4000-8000-000000000002'$$,
  'notification recipient can mark their own notification as read'
);
select is_empty(
  $$update public.notifications set read_at = now()
    where id = '72000000-0000-4000-8000-000000000001' returning id$$,
  'recipient cannot mark another user notification as read'
);

-- Storage object paths are tenant-scoped by the first folder segment (salon UUID).
set local request.jwt.claim.sub = '12000000-0000-4000-8000-000000000001';
select lives_ok(
  $$insert into storage.objects (bucket_id, name)
    values ('salon-media', '22000000-0000-4000-8000-000000000001/gallery/rls-test.webp')$$,
  'owner can upload a storage object under their own salon path'
);

set local request.jwt.claim.sub = '12000000-0000-4000-8000-000000000003';
select is_empty(
  $$select id from storage.objects
    where bucket_id = 'salon-media'
      and name = '22000000-0000-4000-8000-000000000001/gallery/rls-test.webp'$$,
  'owner B cannot read a storage object belonging to salon A'
);
select throws_ok(
  $insert into storage.objects (bucket_id, name)
    values ('salon-media', '22000000-0000-4000-8000-000000000001/gallery/forbidden.webp')$,
  '42501', null,
  'owner B cannot upload into salon A storage path'
);

set local request.jwt.claim.sub = '12000000-0000-4000-8000-000000000001';
select results_eq(
  $$select name from storage.objects
    where bucket_id = 'salon-media'
      and name = '22000000-0000-4000-8000-000000000001/gallery/rls-test.webp'$$,
  $$values ('22000000-0000-4000-8000-000000000001/gallery/rls-test.webp'::text)$$,
  'owner can read the storage object in their own salon path'
);

reset role;
select * from finish();
rollback;
