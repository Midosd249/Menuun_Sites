-- ONE-TIME TEST FIXTURE ONLY. Do not run until the project owner approves in chat.
-- Run manually in the Supabase SQL Editor against project kphypflbkbcvgcaupxxm.
-- This inserts membership rows only; it does not alter RLS, roles, functions, Auth settings, or salons.
-- Idempotent: existing (salon_id, user_id) memberships are left unchanged.

begin;

do $$
declare
  target_user_id uuid;
  inserted_memberships integer;
begin
  select u.id
    into target_user_id
  from auth.users u
  where lower(u.email) = lower('ahmed16060080@gmail.com')
  order by u.created_at
  limit 1;

  if target_user_id is null then
    raise exception 'No auth.users row found for the requested test account; no membership rows were inserted.';
  end if;

  insert into public.salon_members (salon_id, user_id, role, is_active)
  select s.id, target_user_id, 'owner', true
  from public.salons s
  on conflict (salon_id, user_id) do nothing;

  get diagnostics inserted_memberships = row_count;
  raise notice 'Inserted % new owner membership row(s).', inserted_memberships;
end
$$;

-- Review this result after running; it counts salons linked to this user.
select
  count(distinct sm.salon_id) as linked_salons,
  count(*) filter (where sm.role = 'owner' and sm.is_active) as active_owner_memberships
from public.salon_members sm
join auth.users u on u.id = sm.user_id
where lower(u.email) = lower('ahmed16060080@gmail.com');

commit;
