BEGIN;
SELECT plan(3);
INSERT INTO auth.users (id,aud,role,email,encrypted_password,email_confirmed_at,raw_app_meta_data,raw_user_meta_data,created_at,updated_at)
VALUES ('90000000-0000-4000-8000-000000000001','authenticated','authenticated','notification-payload@example.test','',now(),'{}','{}',now(),now())
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.salons (id,slug,name_ar,name_en,is_active,is_published,created_by)
VALUES ('90000000-0000-4000-8000-000000000001','notification-payload-test','صالون إشعارات','Notification Test',true,false,'90000000-0000-4000-8000-000000000001')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.notifications (salon_id,user_id,kind,title,body)
VALUES ('90000000-0000-4000-8000-000000000001','90000000-0000-4000-8000-000000000001','appointment_created','حجز جديد','تم استلام حجز جديد')
RETURNING id;
SELECT results_eq(
  $$SELECT title,body,payload FROM public.notifications WHERE salon_id='90000000-0000-4000-8000-000000000001' ORDER BY created_at DESC LIMIT 1$$,
  $$VALUES ('appointment_created'::text,'appointment_created'::text,'{}'::jsonb)$$,
  'new appointment notifications store kind codes instead of Arabic copy'
);
SELECT ok((SELECT count(*)=1 FROM pg_trigger WHERE tgname='notifications_structured_payload' AND NOT tgisinternal),'structured payload trigger is installed');
SELECT ok((SELECT pg_get_functiondef('private.notify_appointment_lifecycle()'::regprocedure) LIKE '%TG_OP=''INSERT'' THEN RETURN NEW%'),'appointment insert trigger avoids duplicate notification');
SELECT * FROM finish();
ROLLBACK;
