BEGIN;
SELECT plan(4);
INSERT INTO auth.users (id,aud,role,email,encrypted_password,email_confirmed_at,raw_app_meta_data,raw_user_meta_data,created_at,updated_at)
VALUES
 ('30000000-0000-4000-8000-000000000001','authenticated','authenticated','analytics-owner@example.test','',now(),'{}','{}',now(),now()),
 ('30000000-0000-4000-8000-000000000002','authenticated','authenticated','analytics-outsider@example.test','',now(),'{}','{}',now(),now())
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.salons (id,slug,name_ar,name_en,is_active,is_published,created_by)
VALUES ('40000000-0000-4000-8000-000000000001','analytics-test-salon','صالون التحليلات','Analytics Test Salon',true,false,'30000000-0000-4000-8000-000000000001')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.salon_members (salon_id,user_id,role,is_active)
VALUES ('40000000-0000-4000-8000-000000000001','30000000-0000-4000-8000-000000000001','owner',true)
ON CONFLICT (salon_id,user_id) DO NOTHING;
SET LOCAL ROLE authenticated;
SET LOCAL request.jwt.claim.sub='30000000-0000-4000-8000-000000000001';
SELECT ok((public.get_salon_revenue_stats('40000000-0000-4000-8000-000000000001','2026-10-01','2026-10-31') ? 'completed_jobs'),'existing stats key remains');
SELECT ok((public.get_salon_revenue_stats('40000000-0000-4000-8000-000000000001','2026-10-01','2026-10-31') ? 'daily_trend'),'daily trend key is present');
SELECT ok((public.get_salon_revenue_stats('40000000-0000-4000-8000-000000000001','2026-10-01','2026-10-31') ? 'by_barber_detail'),'per-barber detail key is present');
RESET ROLE;
SET LOCAL ROLE authenticated;
SET LOCAL request.jwt.claim.sub='30000000-0000-4000-8000-000000000002';
SELECT throws_ok($$SELECT public.get_salon_analytics_details('40000000-0000-4000-8000-000000000001','2026-10-01','2026-10-31')$$,'42501',NULL,'non-member cannot read analytics');
SELECT * FROM finish();
ROLLBACK;
