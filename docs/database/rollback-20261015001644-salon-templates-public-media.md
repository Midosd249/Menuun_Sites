# Rollback note — `20261015001644 salon_templates_public_media`

**Status: documentation only. No live database operation was performed.**

## Verified live state

- Supabase migration history already contains version `20261015001644`, name `salon_templates_public_media`.
- The SQL stored in `supabase_migrations.schema_migrations.statements` is byte-for-byte equal after newline normalization to the checked-in file `20261015001644_salon_templates_public_media.sql`.
- The repository filename version is therefore stale. Do not apply the migration again. Rename/version alignment is pending the explicit file-deletion approval requested in chat.

## What this migration changed

- Added/validated `salons.template_key` and its allowed-value constraint.
- Created/updated public bucket `salon-public-media` with a 10 MiB limit and JPEG/PNG/WebP/AVIF allowlist.
- Added four authenticated Storage policies for public media (member SELECT; manager INSERT/UPDATE/DELETE).
- Added `services.image_url` and social/map/website URL columns on salons.
- Expanded allowed `media_assets.kind` values and added bilingual barber profile fields.
- The existing `salon-media` bucket remains private.

## Rollback hazards

A reverse migration would remove columns and constraints, drop/recreate Storage policies, and potentially remove references to uploaded public media. Dropping `salons.template_key`, social URL columns, `services.image_url`, or barber fields loses owner-entered values. Deleting storage objects is not necessary for schema rollback and must not be included implicitly.

**Do not execute a rollback against the live project without a fresh backup, a reviewed reverse migration, an inventory/export of values in the added columns, and explicit approval.** The safest immediate action is to retain the applied schema and reconcile repository migration history rather than reverse production data.
