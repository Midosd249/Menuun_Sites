-- This migration is reviewed and committed with the feature; do not apply to production without explicit approval.
alter table public.salons
  add column if not exists template_key text not null default 'atelier';

alter table public.salons
  drop constraint if exists salons_template_key_check;

alter table public.salons
  add constraint salons_template_key_check
  check (template_key in ('atelier', 'oasis', 'rose'));

-- This dedicated bucket is for intentionally public salon logos and gallery images only.
-- Keep the existing salon-media bucket private.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'salon-public-media',
  'salon-public-media',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']::text[]
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists salon_public_media_manager_select on storage.objects;
create policy salon_public_media_manager_select
on storage.objects for select to authenticated
using (
  bucket_id = 'salon-public-media'
  and array_length(storage.foldername(name), 1) >= 2
  and exists (
    select 1 from public.salons s
    where s.id::text = (storage.foldername(objects.name))[1]
      and private.is_salon_member(s.id)
  )
);

drop policy if exists salon_public_media_manager_insert on storage.objects;
create policy salon_public_media_manager_insert
on storage.objects for insert to authenticated
with check (
  bucket_id = 'salon-public-media'
  and array_length(storage.foldername(name), 1) >= 2
  and exists (
    select 1 from public.salons s
    where s.id::text = (storage.foldername(objects.name))[1]
      and private.is_salon_manager(s.id)
  )
);

drop policy if exists salon_public_media_manager_update on storage.objects;
create policy salon_public_media_manager_update
on storage.objects for update to authenticated
using (
  bucket_id = 'salon-public-media'
  and array_length(storage.foldername(name), 1) >= 2
  and exists (
    select 1 from public.salons s
    where s.id::text = (storage.foldername(objects.name))[1]
      and private.is_salon_manager(s.id)
  )
)
with check (
  bucket_id = 'salon-public-media'
  and array_length(storage.foldername(name), 1) >= 2
  and exists (
    select 1 from public.salons s
    where s.id::text = (storage.foldername(objects.name))[1]
      and private.is_salon_manager(s.id)
  )
);

drop policy if exists salon_public_media_manager_delete on storage.objects;
create policy salon_public_media_manager_delete
on storage.objects for delete to authenticated
using (
  bucket_id = 'salon-public-media'
  and array_length(storage.foldername(name), 1) >= 2
  and exists (
    select 1 from public.salons s
    where s.id::text = (storage.foldername(objects.name))[1]
      and private.is_salon_manager(s.id)
  )
);

-- Public profile enrichment: service photos and direct business/social destinations.
alter table public.services
  add column if not exists image_url text;

alter table public.salons
  add column if not exists instagram_url text,
  add column if not exists tiktok_url text,
  add column if not exists snapchat_url text,
  add column if not exists facebook_url text,
  add column if not exists google_maps_url text,
  add column if not exists website_url text;


-- Allow an owner-managed location image in addition to the existing gallery and hero media.
alter table public.media_assets
  drop constraint if exists media_assets_kind_check;
alter table public.media_assets
  add constraint media_assets_kind_check
  check (kind in ('logo', 'hero_video', 'hero_poster', 'location_image', 'gallery', 'barber_portrait', 'service_image'));
