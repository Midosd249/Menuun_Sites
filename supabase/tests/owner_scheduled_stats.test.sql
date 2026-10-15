BEGIN;
SELECT plan(7);
INSERT INTO auth.users (id,aud,role,email,encrypted_password,email_confirmed_at,raw_app_meta_data,raw_user_meta_data,created_at,updated_at)
VALUES ('10000000-0000-4000-8000-000000000009','authenticated','authenticated','owner-stats@example.test','',now(),'{}','{}',now(),now())
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.salons (id,slug,name_ar,name_en,is_active,is_published,created_by)
VALUES ('20000000-0000-4000-8000-000000000009','owner-stats-salon','صالون الإحصاءات','Owner Stats Salon',true,false,'10000000-0000-4000-8000-000000000009')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.salon_members (salon_id,user_id,role,is_active)
VALUES ('20000000-0000-4000-8000-000000000009','10000000-0000-4000-8000-000000000009','owner',true)
ON CONFLICT (salon_id,user_id) DO NOTHING;
INSERT INTO public.services (id,salon_id,name_ar,name_en,price_sar,duration_minutes)
VALUES ('30000000-0000-4000-8000-000000000009','20000000-0000-4000-8000-000000000009','خدمة اختبار','Test service',450,60)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.appointments (id,salon_id,service_id,barber_id,customer_name,customer_phone,starts_at,ends_at,status,service_name_ar_snapshot,service_name_en_snapshot,price_sar_snapshot,duration_minutes_snapshot)
VALUES ('40000000-0000-4000-8000-000000000009','20000000-0000-4000-8000-000000000009','30000000-0000-4000-8000-000000000009',NULL,'Test Customer','+966500000009','2026-10-24 07:00:00+00','2026-10-24 08:00:00+00','confirmed','خدمة اختبار','Test service',450,60)
ON CONFLICT (id) DO NOTHING;
SET LOCAL ROLE authenticated;
SET LOCAL request.jwt.claim.sub='10000000-0000-4000-8000-000000000009';
SELECT results_eq($$UPDATE public.appointments SET status='completed' WHERE id='40000000-0000-4000-8000-000000000009' RETURNING id$$,$$VALUES ('40000000-0000-4000-8000-000000000009'::uuid)$$,'appointment can transition to completed with RETURNING');
SELECT results_eq($$SELECT (public.get_salon_revenue_stats('20000000-0000-4000-8000-000000000009','2026-10-01','2026-10-31')->>'completed_jobs')::int$$,$$VALUES (1)$$,'completed job is counted regardless of payment');
SELECT results_eq($$SELECT (public.get_salon_revenue_stats('20000000-0000-4000-8000-000000000009','2026-10-01','2026-10-31')->>'awaiting_collection_sar')::numeric$$,$$VALUES (450::numeric)$$,'unpaid completed job contributes its price snapshot');
SELECT results_eq($$SELECT (public.get_salon_revenue_stats('20000000-0000-4000-8000-000000000009','2026-10-01','2026-10-31')->>'unassigned_completed_jobs')::int$$,$$VALUES (1)$$,'null barber is counted as unassigned');
SELECT lives_ok($$UPDATE public.appointments SET is_paid=true,paid_at='2026-10-24 08:00:00+00',paid_amount_sar=450,payment_method='cash' WHERE id='40000000-0000-4000-8000-000000000009' AND status='completed'$$,'completed appointment can be marked paid');
SELECT results_eq($$SELECT (public.get_salon_revenue_stats('20000000-0000-4000-8000-000000000009','2026-10-01','2026-10-31')->>'total_revenue_sar')::numeric$$,$$VALUES (450::numeric)$$,'collected revenue is counted by paid_at');
SELECT ok((public.get_salon_revenue_stats('20000000-0000-4000-8000-000000000009','2026-10-01','2026-10-31')->'by_barber') @> '[{"barber_id":null,"barber_name":"Unassigned","revenue_sar":450}]'::jsonb,'left-joined barber breakdown labels null barber Unassigned');
SELECT * FROM finish();
ROLLBACK;
