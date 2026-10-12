-- Migration 004 verification checks. Run after applying migrations to the Menuun_Site project.
-- Read-only assertions: this script does not create customer or salon data.

do $$
declare
  v_bucket_public boolean;
  v_bucket_limit bigint;
  v_function_exists boolean;
begin
  select b.public, b.file_size_limit
    into v_bucket_public, v_bucket_limit
  from storage.buckets b
  where b.id = 'salon-media';

  if not found then
    raise exception 'FAIL: salon-media bucket is missing';
  end if;
  if v_bucket_public is distinct from false then
    raise exception 'FAIL: salon-media bucket must remain private';
  end if;
  if v_bucket_limit <> 104857600 then
    raise exception 'FAIL: salon-media upload limit is not 100 MiB';
  end if;

  select exists (
    select 1 from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname = 'request_salon_appointment'
      and pg_get_function_identity_arguments(p.oid) =
        'p_salon_slug text, p_service_id uuid, p_barber_id uuid, p_customer_name text, p_customer_phone text, p_starts_at timestamp with time zone, p_customer_note text'
  ) into v_function_exists;

  if not v_function_exists then
    raise exception 'FAIL: request_salon_appointment RPC is missing';
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects'
      and policyname = 'salon_media_manager_insert'
  ) then
    raise exception 'FAIL: salon media upload policy is missing';
  end if;

  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.appointments'::regclass
      and conname = 'appointments_no_active_overlap'
  ) then
    raise exception 'FAIL: appointment overlap constraint is missing';
  end if;
end;
$$;
