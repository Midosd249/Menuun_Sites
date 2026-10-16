-- Additive analytics payload; the existing revenue RPC keys remain intact.
-- Rollback: DROP FUNCTION public.get_salon_revenue_stats(uuid,date,date);
-- ALTER FUNCTION public.get_salon_revenue_stats_base(uuid,date,date) RENAME TO get_salon_revenue_stats;
-- DROP FUNCTION public.get_salon_analytics_details(uuid,date,date).
ALTER FUNCTION public.get_salon_revenue_stats(uuid,date,date)
  RENAME TO get_salon_revenue_stats_base;
REVOKE ALL ON FUNCTION public.get_salon_revenue_stats_base(uuid,date,date) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_salon_revenue_stats_base(uuid,date,date) TO authenticated;

CREATE OR REPLACE FUNCTION public.get_salon_analytics_details(
  p_salon_id uuid,
  p_from date,
  p_to date
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path=''
AS $$
DECLARE
  v_days integer;
  v_total bigint;
  v_completed bigint;
  v_cancelled bigint;
  v_no_show bigint;
  v_awaiting bigint;
  v_new bigint;
  v_returning bigint;
  v_expected numeric;
  v_collected numeric;
  v_prev_expected numeric;
  v_prev_collected numeric;
  v_prev_from date;
  v_prev_to date;
  v_result jsonb;
BEGIN
  IF auth.uid() IS NULL OR NOT private.is_salon_member(p_salon_id) THEN
    RAISE EXCEPTION 'not authorized' USING ERRCODE='42501';
  END IF;
  IF p_from IS NULL OR p_to IS NULL OR p_to < p_from OR p_to - p_from > 366 THEN
    RAISE EXCEPTION 'invalid date range' USING ERRCODE='22023';
  END IF;

  v_days := p_to - p_from + 1;
  v_prev_from := p_from - v_days;
  v_prev_to := p_from - 1;

  SELECT count(*),
    count(*) FILTER (WHERE a.status='completed'),
    count(*) FILTER (WHERE a.status='cancelled'),
    count(*) FILTER (WHERE a.status='no_show'),
    count(*) FILTER (WHERE a.status='completed' AND NOT a.is_paid),
    COALESCE(sum(a.price_sar_snapshot) FILTER (WHERE a.status='completed'),0)
  INTO v_total,v_completed,v_cancelled,v_no_show,v_awaiting,v_expected
  FROM public.appointments a
  WHERE a.salon_id=p_salon_id
    AND (a.starts_at AT TIME ZONE 'Asia/Riyadh')::date BETWEEN p_from AND p_to;

  SELECT COALESCE(sum(a.paid_amount_sar),0)
  INTO v_collected
  FROM public.appointments a
  WHERE a.salon_id=p_salon_id AND a.status='completed' AND a.is_paid
    AND a.paid_at IS NOT NULL
    AND (a.paid_at AT TIME ZONE 'Asia/Riyadh')::date BETWEEN p_from AND p_to;

  SELECT COALESCE(sum(a.price_sar_snapshot),0)
  INTO v_prev_expected
  FROM public.appointments a
  WHERE a.salon_id=p_salon_id AND a.status='completed'
    AND (a.starts_at AT TIME ZONE 'Asia/Riyadh')::date BETWEEN v_prev_from AND v_prev_to;

  SELECT COALESCE(sum(a.paid_amount_sar),0)
  INTO v_prev_collected
  FROM public.appointments a
  WHERE a.salon_id=p_salon_id AND a.status='completed' AND a.is_paid
    AND a.paid_at IS NOT NULL
    AND (a.paid_at AT TIME ZONE 'Asia/Riyadh')::date BETWEEN v_prev_from AND v_prev_to;

  WITH period_phones AS (
    SELECT DISTINCT
      CASE
        WHEN digits LIKE '00%' THEN substring(digits FROM 3)
        WHEN digits LIKE '0%' THEN '966'||substring(digits FROM 2)
        WHEN digits ~ '^5[0-9]{8}$' THEN '966'||digits
        ELSE digits
      END AS phone
    FROM (
      SELECT regexp_replace(COALESCE(a.customer_phone,''),'[^0-9]','','g') AS digits
      FROM public.appointments a
      WHERE a.salon_id=p_salon_id
        AND (a.starts_at AT TIME ZONE 'Asia/Riyadh')::date BETWEEN p_from AND p_to
    ) d
    WHERE digits <> ''
  ),
  first_visits AS (
    SELECT
      CASE
        WHEN digits LIKE '00%' THEN substring(digits FROM 3)
        WHEN digits LIKE '0%' THEN '966'||substring(digits FROM 2)
        WHEN digits ~ '^5[0-9]{8}$' THEN '966'||digits
        ELSE digits
      END AS phone,
      min((a.starts_at AT TIME ZONE 'Asia/Riyadh')::date) AS first_date
    FROM public.appointments a
    CROSS JOIN LATERAL (SELECT regexp_replace(COALESCE(a.customer_phone,''),'[^0-9]','','g') AS digits) n
    WHERE a.salon_id=p_salon_id AND n.digits <> ''
      AND (a.starts_at AT TIME ZONE 'Asia/Riyadh')::date <= p_to
    GROUP BY 1
  )
  SELECT count(*) FILTER (WHERE f.first_date BETWEEN p_from AND p_to),
         count(*) FILTER (WHERE f.first_date < p_from)
  INTO v_new,v_returning
  FROM period_phones p JOIN first_visits f USING(phone);

  SELECT jsonb_build_object(
    'booking_status', COALESCE((
      SELECT jsonb_object_agg(s.status,s.count)
      FROM (SELECT a.status,count(*) AS count FROM public.appointments a
        WHERE a.salon_id=p_salon_id
          AND (a.starts_at AT TIME ZONE 'Asia/Riyadh')::date BETWEEN p_from AND p_to
        GROUP BY a.status) s
    ),'{}'::jsonb),
    'completion_rate_pct', CASE WHEN v_total=0 THEN NULL ELSE round(100.0*v_completed/v_total,2) END,
    'cancellation_rate_pct', CASE WHEN v_total=0 THEN NULL ELSE round(100.0*v_cancelled/v_total,2) END,
    'no_show_rate_pct', CASE WHEN v_total=0 THEN NULL ELSE round(100.0*v_no_show/v_total,2) END,
    'average_ticket_sar', (SELECT round(avg(a.price_sar_snapshot),2) FROM public.appointments a
      WHERE a.salon_id=p_salon_id AND a.status='completed'
        AND (a.starts_at AT TIME ZONE 'Asia/Riyadh')::date BETWEEN p_from AND p_to),
    'top_services', COALESCE((
      SELECT jsonb_agg(jsonb_build_object('service_name',s.service_name,'completed_jobs',s.completed_jobs,'expected_sar',s.expected_sar)
        ORDER BY s.completed_jobs DESC,s.service_name)
      FROM (
        SELECT COALESCE(NULLIF(a.service_name_ar_snapshot,''),NULLIF(a.service_name_en_snapshot,''),'Unknown service') AS service_name,
          count(*) AS completed_jobs,COALESCE(sum(a.price_sar_snapshot),0) AS expected_sar
        FROM public.appointments a WHERE a.salon_id=p_salon_id AND a.status='completed'
          AND (a.starts_at AT TIME ZONE 'Asia/Riyadh')::date BETWEEN p_from AND p_to
        GROUP BY 1 ORDER BY count(*) DESC LIMIT 5
      ) s
    ),'[]'::jsonb),
    'busiest_days', COALESCE((
      SELECT jsonb_agg(jsonb_build_object('weekday',d.weekday,'bookings',d.bookings) ORDER BY d.bookings DESC,d.weekday)
      FROM (SELECT extract(dow FROM a.starts_at AT TIME ZONE 'Asia/Riyadh')::integer AS weekday,count(*) AS bookings
        FROM public.appointments a WHERE a.salon_id=p_salon_id
          AND (a.starts_at AT TIME ZONE 'Asia/Riyadh')::date BETWEEN p_from AND p_to
        GROUP BY 1 ORDER BY count(*) DESC LIMIT 3) d
    ),'[]'::jsonb),
    'busiest_hours', COALESCE((
      SELECT jsonb_agg(jsonb_build_object('hour',h.hour,'bookings',h.bookings) ORDER BY h.bookings DESC,h.hour)
      FROM (SELECT extract(hour FROM a.starts_at AT TIME ZONE 'Asia/Riyadh')::integer AS hour,count(*) AS bookings
        FROM public.appointments a WHERE a.salon_id=p_salon_id
          AND (a.starts_at AT TIME ZONE 'Asia/Riyadh')::date BETWEEN p_from AND p_to
        GROUP BY 1 ORDER BY count(*) DESC LIMIT 3) h
    ),'[]'::jsonb),
    'daily_trend', COALESCE((
      SELECT jsonb_agg(jsonb_build_object('date',d.day,'bookings',d.bookings,'expected_sar',d.expected_sar,'collected_sar',d.collected_sar) ORDER BY d.day)
      FROM (
        SELECT day::date AS day,
          (SELECT count(*) FROM public.appointments a WHERE a.salon_id=p_salon_id
            AND (a.starts_at AT TIME ZONE 'Asia/Riyadh')::date=day::date) AS bookings,
          (SELECT COALESCE(sum(a.price_sar_snapshot),0) FROM public.appointments a WHERE a.salon_id=p_salon_id
            AND a.status='completed' AND (a.starts_at AT TIME ZONE 'Asia/Riyadh')::date=day::date) AS expected_sar,
          (SELECT COALESCE(sum(a.paid_amount_sar),0) FROM public.appointments a WHERE a.salon_id=p_salon_id
            AND a.status='completed' AND a.is_paid AND a.paid_at IS NOT NULL
            AND (a.paid_at AT TIME ZONE 'Asia/Riyadh')::date=day::date) AS collected_sar
        FROM generate_series(p_from::timestamp,p_to::timestamp,interval '1 day') day
      ) d
    ),'[]'::jsonb),
    'new_vs_returning', jsonb_build_object('new_customers',v_new,'returning_customers',v_returning),
    'expected_vs_collected', jsonb_build_object('expected_sar',v_expected,'collected_sar',v_collected,'awaiting_collection_sar',GREATEST(v_expected-v_collected,0)),
    'previous_period', jsonb_build_object(
      'from',v_prev_from,'to',v_prev_to,
      'expected_sar',v_prev_expected,'collected_sar',v_prev_collected,
      'expected_change_pct',CASE WHEN v_prev_expected=0 THEN NULL ELSE round(100.0*(v_expected-v_prev_expected)/v_prev_expected,2) END,
      'collected_change_pct',CASE WHEN v_prev_collected=0 THEN NULL ELSE round(100.0*(v_collected-v_prev_collected)/v_prev_collected,2) END
    ),
    'by_barber_detail', COALESCE((
      WITH days AS (
        SELECT extract(dow FROM d)::integer AS weekday
        FROM generate_series(p_from::timestamp,p_to::timestamp,interval '1 day') d
      ),
      available AS (
        SELECT COALESCE(sum(extract(epoch FROM (bh.closes_at-bh.opens_at))/60),0) AS minutes
        FROM days d JOIN public.business_hours bh ON bh.salon_id=p_salon_id AND bh.weekday=d.weekday
        WHERE NOT bh.is_closed AND bh.opens_at IS NOT NULL AND bh.closes_at IS NOT NULL AND bh.closes_at>bh.opens_at
      ),
      barbers AS (
        SELECT b.id AS barber_id,COALESCE(b.display_name_en,b.display_name,'Barber') AS barber_name,
          count(a.id) FILTER (WHERE a.status='completed') AS completed_jobs,
          count(a.id) FILTER (WHERE a.status='completed' AND NOT a.is_paid) AS awaiting_collection_count,
          COALESCE(sum(a.price_sar_snapshot) FILTER (WHERE a.status='completed' AND NOT a.is_paid),0) AS awaiting_collection_sar,
          COALESCE(sum(a.duration_minutes_snapshot) FILTER (WHERE a.status NOT IN ('cancelled','no_show')),0) AS booked_minutes
        FROM public.barbers b LEFT JOIN public.appointments a ON a.barber_id=b.id AND a.salon_id=p_salon_id
          AND (a.starts_at AT TIME ZONE 'Asia/Riyadh')::date BETWEEN p_from AND p_to
        WHERE b.salon_id=p_salon_id
        GROUP BY b.id,b.display_name,b.display_name_en
      ),
      collected AS (
        SELECT a.barber_id,COALESCE(sum(a.paid_amount_sar),0) AS collected_sar
        FROM public.appointments a WHERE a.salon_id=p_salon_id AND a.status='completed' AND a.is_paid
          AND a.paid_at IS NOT NULL AND (a.paid_at AT TIME ZONE 'Asia/Riyadh')::date BETWEEN p_from AND p_to
        GROUP BY a.barber_id
      )
      SELECT jsonb_agg(jsonb_build_object(
        'barber_id',b.barber_id,'barber_name',b.barber_name,'completed_jobs',b.completed_jobs,
        'collected_sar',COALESCE(c.collected_sar,0),'awaiting_collection_count',b.awaiting_collection_count,
        'awaiting_collection_sar',b.awaiting_collection_sar,
        'utilization_pct',CASE WHEN (SELECT minutes FROM available)>0 THEN round(100.0*b.booked_minutes/(SELECT minutes FROM available),2) ELSE NULL END
      ) ORDER BY b.barber_name)
      FROM barbers b LEFT JOIN collected c ON c.barber_id=b.barber_id
    ),'[]'::jsonb),
    'unassigned_detail',jsonb_build_object(
      'barber_id',NULL,'barber_name','Unassigned',
      'completed_jobs',(SELECT count(*) FROM public.appointments a WHERE a.salon_id=p_salon_id AND a.barber_id IS NULL AND a.status='completed'
        AND (a.starts_at AT TIME ZONE 'Asia/Riyadh')::date BETWEEN p_from AND p_to),
      'collected_sar',(SELECT COALESCE(sum(a.paid_amount_sar),0) FROM public.appointments a WHERE a.salon_id=p_salon_id AND a.barber_id IS NULL AND a.status='completed' AND a.is_paid
        AND a.paid_at IS NOT NULL AND (a.paid_at AT TIME ZONE 'Asia/Riyadh')::date BETWEEN p_from AND p_to),
      'awaiting_collection_count',(SELECT count(*) FROM public.appointments a WHERE a.salon_id=p_salon_id AND a.barber_id IS NULL AND a.status='completed' AND NOT a.is_paid
        AND (a.starts_at AT TIME ZONE 'Asia/Riyadh')::date BETWEEN p_from AND p_to),
      'awaiting_collection_sar',(SELECT COALESCE(sum(a.price_sar_snapshot),0) FROM public.appointments a WHERE a.salon_id=p_salon_id AND a.barber_id IS NULL AND a.status='completed' AND NOT a.is_paid
        AND (a.starts_at AT TIME ZONE 'Asia/Riyadh')::date BETWEEN p_from AND p_to),
      'utilization_pct',NULL
    ))
  ) INTO v_result;
  v_result := v_result || jsonb_build_object('insights',CASE WHEN v_total < 10 THEN '[]'::jsonb ELSE COALESCE((
    SELECT jsonb_agg(jsonb_build_object('code',i.code,'value',i.value))
    FROM (
      SELECT 'high_no_show_rate' AS code,round(100.0*v_no_show/NULLIF(v_total,0),2) AS value WHERE v_no_show::numeric/NULLIF(v_total,0)>=0.10
      UNION ALL SELECT 'awaiting_collection',v_awaiting::numeric WHERE v_awaiting>0
      UNION ALL SELECT 'unassigned_completed_jobs',count(*)::numeric FROM public.appointments a
        WHERE a.salon_id=p_salon_id AND a.status='completed' AND a.barber_id IS NULL
          AND (a.starts_at AT TIME ZONE 'Asia/Riyadh')::date BETWEEN p_from AND p_to
        HAVING count(*)>0
      UNION ALL SELECT 'repeat_customers',v_returning::numeric WHERE v_returning>0
    ) i
  ),'[]'::jsonb) END);
  RETURN v_result;
END;
$$;

REVOKE ALL ON FUNCTION public.get_salon_analytics_details(uuid,date,date) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.get_salon_analytics_details(uuid,date,date) TO authenticated;

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
DECLARE base_result jsonb; detail_result jsonb;
BEGIN
  IF auth.uid() IS NULL OR NOT private.is_salon_member(p_salon_id) THEN
    RAISE EXCEPTION 'not authorized' USING ERRCODE='42501';
  END IF;
  base_result := public.get_salon_revenue_stats_base(p_salon_id,p_from,p_to);
  detail_result := public.get_salon_analytics_details(p_salon_id,p_from,p_to);
  RETURN base_result || detail_result;
END;
$$;
REVOKE ALL ON FUNCTION public.get_salon_revenue_stats(uuid,date,date) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.get_salon_revenue_stats(uuid,date,date) TO authenticated;
