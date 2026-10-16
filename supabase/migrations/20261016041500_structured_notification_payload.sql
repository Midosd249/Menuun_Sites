-- Store notification semantics as structured data. Existing title/body remain readable
-- as a fallback for old rows; newly created appointment notifications store kind codes.
ALTER TABLE public.notifications
  ADD COLUMN IF NOT EXISTS payload jsonb NOT NULL DEFAULT '{}'::jsonb;

CREATE OR REPLACE FUNCTION private.normalize_notification_payload()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path=''
AS $$
DECLARE v_customer_name text; v_status text;
BEGIN
  IF NEW.appointment_id IS NOT NULL THEN
    SELECT a.customer_name,a.status INTO v_customer_name,v_status
    FROM public.appointments a WHERE a.id=NEW.appointment_id AND a.salon_id=NEW.salon_id;
    IF FOUND THEN
      NEW.payload := COALESCE(NEW.payload,'{}'::jsonb) ||
        jsonb_build_object('appointment_id',NEW.appointment_id,'customer_name',v_customer_name,'status',v_status);
    END IF;
  END IF;
  IF NEW.kind IN ('appointment_created','appointment_updated') THEN
    NEW.title := NEW.kind;
    NEW.body := NEW.kind;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS notifications_structured_payload ON public.notifications;
CREATE TRIGGER notifications_structured_payload
BEFORE INSERT ON public.notifications
FOR EACH ROW EXECUTE FUNCTION private.normalize_notification_payload();

CREATE OR REPLACE FUNCTION private.notify_appointment_lifecycle()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path=''
AS $$
DECLARE v_kind text;
BEGIN
  -- The public booking RPC already creates the INSERT notification. Avoid a
  -- duplicate; the appointment Realtime INSERT is the sound source of truth.
  IF TG_OP='INSERT' THEN RETURN NEW; END IF;
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    v_kind := 'appointment_updated';
    INSERT INTO public.notifications(salon_id,user_id,kind,title,body,appointment_id,payload)
    SELECT NEW.salon_id,sm.user_id,v_kind,v_kind,v_kind,NEW.id,
      jsonb_build_object('appointment_id',NEW.id,'status',NEW.status,'customer_name',NEW.customer_name)
    FROM public.salon_members sm
    WHERE sm.salon_id=NEW.salon_id AND sm.is_active AND sm.role IN ('owner','manager','receptionist');
  END IF;
  RETURN NEW;
END;
$$;

-- Rollback: restore private.notify_appointment_lifecycle() from migration
-- 20261015062559_fix_notifications_policy_and_kinds.sql; drop trigger
-- notifications_structured_payload and private.normalize_notification_payload();
-- ALTER TABLE public.notifications DROP COLUMN payload (this discards structured
-- payloads written after this migration).
