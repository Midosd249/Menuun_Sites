-- Additive owner, video, payments, notifications and statistics hardening.
-- Rollback: drop the trigger/function, stats function, new storage policies/bucket,
-- new constraints/columns, revoke salon UPDATE grant, and remove notifications from realtime.
GRANT UPDATE ON TABLE public.salons TO authenticated;
ALTER TABLE public.salons ADD COLUMN IF NOT EXISTS hero_mode text NOT NULL DEFAULT 'image';
DO $$ BEGIN
 IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conrelid='public.salons'::regclass AND conname='salons_hero_mode_check') THEN
  ALTER TABLE public.salons ADD CONSTRAINT salons_hero_mode_check CHECK (hero_mode IN ('image','video'));
 END IF;
END $$;
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS is_paid boolean NOT NULL DEFAULT false,
 ADD COLUMN IF NOT EXISTS paid_at timestamptz,
 ADD COLUMN IF NOT EXISTS paid_amount_sar numeric(12,2),
 ADD COLUMN IF NOT EXISTS payment_method text;
DO $$ BEGIN
 IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conrelid='public.appointments'::regclass AND conname='appointments_payment_method_check') THEN
  ALTER TABLE public.appointments ADD CONSTRAINT appointments_payment_method_check CHECK (payment_method IS NULL OR payment_method IN ('cash','card','transfer'));
 END IF;
 IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conrelid='public.appointments'::regclass AND conname='appointments_paid_amount_nonnegative_check') THEN
  ALTER TABLE public.appointments ADD CONSTRAINT appointments_paid_amount_nonnegative_check CHECK (paid_amount_sar IS NULL OR paid_amount_sar >= 0);
 END IF;
END $$;
CREATE INDEX IF NOT EXISTS appointments_paid_revenue_idx ON public.appointments (salon_id, paid_at) WHERE status='completed' AND is_paid=true;
INSERT INTO storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
VALUES ('salon-public-video','salon-public-video',true,104857600,ARRAY['video/mp4','video/webm','video/quicktime','image/jpeg','image/png','image/webp'])
ON CONFLICT (id) DO NOTHING;
DO $$ BEGIN
 IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='salon_public_video_read') THEN
  CREATE POLICY salon_public_video_read ON storage.objects FOR SELECT TO anon,authenticated USING (bucket_id='salon-public-video');
 END IF;
 IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='salon_public_video_manager_insert') THEN
  CREATE POLICY salon_public_video_manager_insert ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id='salon-public-video' AND (storage.foldername(name))[1] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' AND private.is_salon_manager(((storage.foldername(name))[1])::uuid));
 END IF;
 IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='salon_public_video_manager_update') THEN
  CREATE POLICY salon_public_video_manager_update ON storage.objects FOR UPDATE TO authenticated USING (bucket_id='salon-public-video' AND (storage.foldername(name))[1] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' AND private.is_salon_manager(((storage.foldername(name))[1])::uuid)) WITH CHECK (bucket_id='salon-public-video' AND (storage.foldername(name))[1] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' AND private.is_salon_manager(((storage.foldername(name))[1])::uuid));
 END IF;
 IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='salon_public_video_manager_delete') THEN
  CREATE POLICY salon_public_video_manager_delete ON storage.objects FOR DELETE TO authenticated USING (bucket_id='salon-public-video' AND (storage.foldername(name))[1] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' AND private.is_salon_manager(((storage.foldername(name))[1])::uuid));
 END IF;
 IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='notifications' AND policyname='notifications_read_salon_members') THEN
  CREATE POLICY notifications_read_salon_members ON public.notifications FOR SELECT TO authenticated USING (private.is_salon_member(salon_id));
 END IF;
 IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='notifications' AND policyname='notifications_update_salon_members') THEN
  CREATE POLICY notifications_update_salon_members ON public.notifications FOR UPDATE TO authenticated USING (private.is_salon_member(salon_id)) WITH CHECK (private.is_salon_member(salon_id));
 END IF;
END $$;
CREATE OR REPLACE FUNCTION private.notify_appointment_lifecycle() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE v_kind text; v_title text; v_body text;
BEGIN
 IF TG_OP='INSERT' THEN v_kind:='appointment_created'; v_title:='حجز جديد'; v_body:='تم استلام حجز جديد من '||NEW.customer_name;
 ELSIF NEW.status IS DISTINCT FROM OLD.status THEN
  v_kind:='appointment_'||NEW.status;
  v_title:=CASE NEW.status WHEN 'confirmed' THEN 'تم تأكيد الموعد' WHEN 'completed' THEN 'اكتمل الموعد' WHEN 'cancelled' THEN 'تم إلغاء الموعد' WHEN 'no_show' THEN 'لم يحضر العميل' ELSE 'تحديث حالة الموعد' END;
  v_body:='تم تحديث حالة موعد '||NEW.customer_name||' إلى '||NEW.status;
 ELSE RETURN NEW; END IF;
 INSERT INTO public.notifications(salon_id,user_id,kind,title,body,appointment_id)
 SELECT NEW.salon_id,sm.user_id,v_kind,v_title,v_body,NEW.id FROM public.salon_members sm
 WHERE sm.salon_id=NEW.salon_id AND sm.is_active AND sm.role IN ('owner','manager','receptionist');
 RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS appointments_notify_lifecycle ON public.appointments;
CREATE TRIGGER appointments_notify_lifecycle AFTER INSERT OR UPDATE OF status ON public.appointments FOR EACH ROW EXECUTE FUNCTION private.notify_appointment_lifecycle();
CREATE OR REPLACE FUNCTION public.get_salon_revenue_stats(p_salon_id uuid,p_from date DEFAULT ((now() AT TIME ZONE 'Asia/Riyadh')::date-30),p_to date DEFAULT (now() AT TIME ZONE 'Asia/Riyadh')::date)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE result jsonb;
BEGIN
 IF auth.uid() IS NULL OR NOT private.is_salon_member(p_salon_id) THEN RAISE EXCEPTION 'not authorized' USING ERRCODE='42501'; END IF;
 IF p_from IS NULL OR p_to IS NULL OR p_to<p_from OR p_to-p_from>366 THEN RAISE EXCEPTION 'invalid date range' USING ERRCODE='22023'; END IF;
 SELECT jsonb_build_object(
 'currency','SAR','timezone','Asia/Riyadh','from',p_from,'to',p_to,
 'total_revenue_sar',COALESCE((SELECT sum(a.paid_amount_sar) FROM public.appointments a WHERE a.salon_id=p_salon_id AND a.status='completed' AND a.is_paid AND (a.paid_at AT TIME ZONE 'Asia/Riyadh')::date BETWEEN p_from AND p_to),0),
 'by_barber',COALESCE((SELECT jsonb_agg(jsonb_build_object('barber_id',x.barber_id,'barber_name',x.barber_name,'revenue_sar',x.revenue_sar) ORDER BY x.barber_name) FROM (SELECT b.id barber_id,b.display_name barber_name,COALESCE(sum(a.paid_amount_sar),0) revenue_sar FROM public.appointments a JOIN public.barbers b ON b.id=a.barber_id WHERE a.salon_id=p_salon_id AND a.status='completed' AND a.is_paid AND (a.paid_at AT TIME ZONE 'Asia/Riyadh')::date BETWEEN p_from AND p_to GROUP BY b.id,b.display_name) x),'[]'::jsonb),
 'by_payment_method',COALESCE((SELECT jsonb_agg(jsonb_build_object('payment_method',x.payment_method,'revenue_sar',x.revenue_sar) ORDER BY x.payment_method) FROM (SELECT a.payment_method,COALESCE(sum(a.paid_amount_sar),0) revenue_sar FROM public.appointments a WHERE a.salon_id=p_salon_id AND a.status='completed' AND a.is_paid AND (a.paid_at AT TIME ZONE 'Asia/Riyadh')::date BETWEEN p_from AND p_to GROUP BY a.payment_method) x),'[]'::jsonb)) INTO result;
 RETURN result;
END $$;
REVOKE ALL ON FUNCTION public.get_salon_revenue_stats(uuid,date,date) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.get_salon_revenue_stats(uuid,date,date) TO authenticated;
DO $$ BEGIN
 IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname='supabase_realtime') AND NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname='supabase_realtime' AND schemaname='public' AND tablename='notifications') THEN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
 END IF;
END $$;
