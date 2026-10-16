-- Permit the owner settings form to update only the six public link columns.
-- Do not grant table-wide UPDATE; sensitive identity/publication columns remain blocked.
GRANT UPDATE (
  instagram_url, tiktok_url, snapchat_url, facebook_url, google_maps_url, website_url
) ON TABLE public.salons TO authenticated;

-- The owner sound listener needs the INSERT event itself; notifications remain
-- subscribed as well and share appointment_id for deduplication.
ALTER PUBLICATION supabase_realtime ADD TABLE public.appointments;

-- Rollback:
-- REVOKE UPDATE (instagram_url, tiktok_url, snapchat_url, facebook_url,
--   google_maps_url, website_url) ON TABLE public.salons FROM authenticated;
-- ALTER PUBLICATION supabase_realtime DROP TABLE public.appointments;
