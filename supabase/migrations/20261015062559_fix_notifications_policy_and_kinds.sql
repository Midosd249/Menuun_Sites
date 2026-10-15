-- Preserve recipient-only notification updates and use existing allowed notification kinds.
DROP POLICY IF EXISTS notifications_update_salon_members ON public.notifications;
CREATE OR REPLACE FUNCTION private.notify_appointment_lifecycle()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE v_kind text; v_title text; v_body text;
BEGIN
 IF TG_OP='INSERT' THEN
  v_kind:='appointment_created'; v_title:='حجز جديد'; v_body:='تم استلام حجز جديد من '||NEW.customer_name;
 ELSIF NEW.status IS DISTINCT FROM OLD.status THEN
  v_kind:='appointment_updated';
  v_title:=CASE NEW.status WHEN 'confirmed' THEN 'تم تأكيد الموعد' WHEN 'completed' THEN 'اكتمل الموعد' WHEN 'cancelled' THEN 'تم إلغاء الموعد' WHEN 'no_show' THEN 'لم يحضر العميل' ELSE 'تحديث حالة الموعد' END;
  v_body:='تم تحديث حالة موعد '||NEW.customer_name||' إلى '||NEW.status;
 ELSE RETURN NEW; END IF;
 INSERT INTO public.notifications(salon_id,user_id,kind,title,body,appointment_id)
 SELECT NEW.salon_id,sm.user_id,v_kind,v_title,v_body,NEW.id
 FROM public.salon_members sm
 WHERE sm.salon_id=NEW.salon_id AND sm.is_active AND sm.role IN ('owner','manager','receptionist');
 RETURN NEW;
END $$;
