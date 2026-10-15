-- Report completed work by scheduled date and collected revenue by payment date.
-- Preserve the authenticated membership guard and bounded date-range validation.
-- Rollback: restore the prior get_salon_revenue_stats(uuid,date,date) definition
-- from migration 20261015061605_owner_video_payments_notifications_stats.sql.
CREATE OR REPLACE FUNCTION public.get_salon_revenue_stats(
  p_salon_id uuid,
  p_from date DEFAULT (date_trunc('month', now() AT TIME ZONE 'Asia/Riyadh')::date),
  p_to date DEFAULT ((date_trunc('month', now() AT TIME ZONE 'Asia/Riyadh') + interval '1 month - 1 day')::date)
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path=''
AS $$
DECLARE result jsonb;
BEGIN
  IF auth.uid() IS NULL OR NOT private.is_salon_member(p_salon_id) THEN
    RAISE EXCEPTION 'not authorized' USING ERRCODE='42501';
  END IF;
  IF p_from IS NULL OR p_to IS NULL OR p_to < p_from OR p_to - p_from > 366 THEN
    RAISE EXCEPTION 'invalid date range' USING ERRCODE='22023';
  END IF;
  SELECT jsonb_build_object(
    'currency','SAR',
    'timezone','Asia/Riyadh',
    'from',p_from,
    'to',p_to,
    'completed_jobs',(
      SELECT count(*) FROM public.appointments a
      WHERE a.salon_id=p_salon_id AND a.status='completed'
        AND (a.starts_at AT TIME ZONE 'Asia/Riyadh')::date BETWEEN p_from AND p_to
    ),
    'awaiting_collection_count',(
      SELECT count(*) FROM public.appointments a
      WHERE a.salon_id=p_salon_id AND a.status='completed' AND NOT a.is_paid
        AND (a.starts_at AT TIME ZONE 'Asia/Riyadh')::date BETWEEN p_from AND p_to
    ),
    'awaiting_collection_sar',COALESCE((
      SELECT sum(COALESCE(a.price_sar_snapshot,0)) FROM public.appointments a
      WHERE a.salon_id=p_salon_id AND a.status='completed' AND NOT a.is_paid
        AND (a.starts_at AT TIME ZONE 'Asia/Riyadh')::date BETWEEN p_from AND p_to
    ),0),
    'unassigned_completed_jobs',(
      SELECT count(*) FROM public.appointments a
      WHERE a.salon_id=p_salon_id AND a.status='completed' AND a.barber_id IS NULL
        AND (a.starts_at AT TIME ZONE 'Asia/Riyadh')::date BETWEEN p_from AND p_to
    ),
    'total_revenue_sar',COALESCE((
      SELECT sum(COALESCE(a.paid_amount_sar,0)) FROM public.appointments a
      WHERE a.salon_id=p_salon_id AND a.status='completed' AND a.is_paid
        AND a.paid_at IS NOT NULL
        AND (a.paid_at AT TIME ZONE 'Asia/Riyadh')::date BETWEEN p_from AND p_to
    ),0),
    'by_barber',COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'barber_id',x.barber_id,
        'barber_name',x.barber_name,
        'revenue_sar',x.revenue_sar
      ) ORDER BY x.barber_name)
      FROM (
        SELECT a.barber_id,COALESCE(b.display_name,'Unassigned') AS barber_name,
          COALESCE(sum(COALESCE(a.paid_amount_sar,0)),0) AS revenue_sar
        FROM public.appointments a
        LEFT JOIN public.barbers b ON b.id=a.barber_id
        WHERE a.salon_id=p_salon_id AND a.status='completed' AND a.is_paid
          AND a.paid_at IS NOT NULL
          AND (a.paid_at AT TIME ZONE 'Asia/Riyadh')::date BETWEEN p_from AND p_to
        GROUP BY a.barber_id,b.display_name
      ) x
    ),'[]'::jsonb),
    'by_payment_method',COALESCE((
      SELECT jsonb_agg(jsonb_build_object('payment_method',x.payment_method,'revenue_sar',x.revenue_sar) ORDER BY x.payment_method)
      FROM (
        SELECT a.payment_method,COALESCE(sum(COALESCE(a.paid_amount_sar,0)),0) AS revenue_sar
        FROM public.appointments a
        WHERE a.salon_id=p_salon_id AND a.status='completed' AND a.is_paid
          AND a.paid_at IS NOT NULL
          AND (a.paid_at AT TIME ZONE 'Asia/Riyadh')::date BETWEEN p_from AND p_to
        GROUP BY a.payment_method
      ) x
    ),'[]'::jsonb)
  ) INTO result;
  RETURN result;
END;
$$;
REVOKE ALL ON FUNCTION public.get_salon_revenue_stats(uuid,date,date) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.get_salon_revenue_stats(uuid,date,date) TO authenticated;
