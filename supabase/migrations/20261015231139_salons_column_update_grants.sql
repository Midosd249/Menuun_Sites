-- Restrict authenticated salon updates to columns used by owner workspace actions.
-- Allowed write union: name_ar, name_en, phone, whatsapp, address_ar, city,
-- timezone, template_key, hero_mode, and logo_url.
-- Rollback: REVOKE UPDATE on the allowed columns, then GRANT UPDATE ON TABLE
-- public.salons TO authenticated (restores the previous broad table-level grant).
REVOKE UPDATE ON TABLE public.salons FROM authenticated;
REVOKE UPDATE (
  id, slug, name_ar, name_en, tagline_ar, tagline_en, description_ar,
  description_en, logo_url, phone, whatsapp, address_ar, address_en, city,
  country_code, timezone, currency_code, primary_color, accent_color,
  is_active, is_published, created_by, created_at, updated_at, template_key,
  instagram_url, tiktok_url, snapchat_url, facebook_url, google_maps_url,
  website_url, hero_mode
) ON TABLE public.salons FROM authenticated;
GRANT UPDATE (
  name_ar, name_en, phone, whatsapp, address_ar, city, timezone,
  template_key, hero_mode, logo_url
) ON TABLE public.salons TO authenticated;
