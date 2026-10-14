begin;

select plan(28);

-- Every tenant-owned table must keep row-level security enabled.
select ok((select relrowsecurity from pg_class where oid = 'public.salons'::regclass), 'RLS enabled on salons');
select ok((select relrowsecurity from pg_class where oid = 'public.salon_members'::regclass), 'RLS enabled on salon_members');
select ok((select relrowsecurity from pg_class where oid = 'public.services'::regclass), 'RLS enabled on services');
select ok((select relrowsecurity from pg_class where oid = 'public.barbers'::regclass), 'RLS enabled on barbers');
select ok((select relrowsecurity from pg_class where oid = 'public.barber_services'::regclass), 'RLS enabled on barber_services');
select ok((select relrowsecurity from pg_class where oid = 'public.business_hours'::regclass), 'RLS enabled on business_hours');
select ok((select relrowsecurity from pg_class where oid = 'public.appointments'::regclass), 'RLS enabled on appointments');
select ok((select relrowsecurity from pg_class where oid = 'public.appointment_events'::regclass), 'RLS enabled on appointment_events');
select ok((select relrowsecurity from pg_class where oid = 'public.media_assets'::regclass), 'RLS enabled on media_assets');
select ok((select relrowsecurity from pg_class where oid = 'public.site_settings'::regclass), 'RLS enabled on site_settings');
select ok((select relrowsecurity from pg_class where oid = 'public.site_revisions'::regclass), 'RLS enabled on site_revisions');
select ok((select relrowsecurity from pg_class where oid = 'public.notifications'::regclass), 'RLS enabled on notifications');

select ok(
  (select relrowsecurity from pg_class where oid = 'storage.objects'::regclass),
  'RLS enabled on storage.objects'
);
select is(
  (select public from storage.buckets where id = 'salon-media'),
  false,
  'salon-media storage bucket remains private'
);

-- Privileged implementation functions must not be directly callable by anon.
select ok(
  not has_function_privilege('anon', 'private.is_salon_member(uuid)', 'EXECUTE'),
  'anon cannot execute private membership helper'
);
select ok(
  not has_function_privilege('anon', 'private.is_salon_manager(uuid)', 'EXECUTE'),
  'anon cannot execute private manager helper'
);
select ok(
  not has_function_privilege('anon', 'private.create_salon_with_owner(text,text,text)', 'EXECUTE'),
  'anon cannot execute private salon-provisioning implementation'
);
select ok(
  has_function_privilege('authenticated', 'private.create_salon_with_owner(text,text,text)', 'EXECUTE'),
  'authenticated can execute private salon-provisioning implementation through its wrapper'
);

-- Public booking APIs are intentionally callable without an account.
select ok(
  has_function_privilege('anon', 'public.request_salon_appointment(text,uuid,uuid,text,text,timestamptz,text)', 'EXECUTE'),
  'anon can execute the validated public booking RPC'
);
select ok(
  has_function_privilege('anon', 'public.get_public_booking_slots(text,uuid,date,uuid)', 'EXECUTE'),
  'anon can execute the privacy-preserving public availability RPC'
);

-- Table grants and column-level privileges are a second security boundary;
-- RLS policies cannot compensate for accidentally broad SQL grants.
select ok(
  not has_table_privilege('anon', 'public.appointments', 'SELECT'),
  'anonymous role cannot select appointment/customer records directly'
);
select ok(
  not has_table_privilege('anon', 'public.appointments', 'INSERT'),
  'anonymous role cannot insert appointments outside the validated RPC'
);
select ok(
  not has_column_privilege('anon', 'public.site_settings', 'draft_content', 'SELECT'),
  'anonymous role cannot read unpublished site draft content'
);
select ok(
  has_column_privilege('anon', 'public.site_settings', 'published_content', 'SELECT'),
  'anonymous role can read only the published site content column'
);
select ok(
  has_column_privilege('authenticated', 'public.site_settings', 'draft_content', 'UPDATE'),
  'authenticated clients can update draft content subject to manager RLS'
);
select ok(
  not has_column_privilege('authenticated', 'public.site_settings', 'published_content', 'UPDATE'),
  'authenticated clients cannot directly overwrite published site content'
);
select ok(
  not has_column_privilege('authenticated', 'public.appointments', 'customer_phone', 'UPDATE'),
  'authenticated clients cannot rewrite appointment customer identity fields'
);
select ok(
  has_column_privilege('authenticated', 'public.appointments', 'status', 'UPDATE'),
  'authenticated clients can update appointment status subject to role and transition checks'
);

select * from finish();
rollback;
