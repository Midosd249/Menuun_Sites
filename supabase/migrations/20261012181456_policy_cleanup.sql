-- Menuun Site / Migration 003
-- Separate write policies from read policies to avoid permissive SELECT overlap.

begin;

drop policy services_manage_manager on public.services;
create policy services_insert_manager on public.services for insert to authenticated
with check (private.is_salon_manager(salon_id));
create policy services_update_manager on public.services for update to authenticated
using (private.is_salon_manager(salon_id)) with check (private.is_salon_manager(salon_id));
create policy services_delete_manager on public.services for delete to authenticated
using (private.is_salon_manager(salon_id));

drop policy barbers_manage_manager on public.barbers;
create policy barbers_insert_manager on public.barbers for insert to authenticated
with check (private.is_salon_manager(salon_id));
create policy barbers_update_manager on public.barbers for update to authenticated
using (private.is_salon_manager(salon_id)) with check (private.is_salon_manager(salon_id));
create policy barbers_delete_manager on public.barbers for delete to authenticated
using (private.is_salon_manager(salon_id));

drop policy barber_services_manage_manager on public.barber_services;
create policy barber_services_insert_manager on public.barber_services for insert to authenticated
with check (private.is_salon_manager(salon_id));
create policy barber_services_update_manager on public.barber_services for update to authenticated
using (private.is_salon_manager(salon_id)) with check (private.is_salon_manager(salon_id));
create policy barber_services_delete_manager on public.barber_services for delete to authenticated
using (private.is_salon_manager(salon_id));

drop policy business_hours_manage_manager on public.business_hours;
create policy business_hours_insert_manager on public.business_hours for insert to authenticated
with check (private.is_salon_manager(salon_id));
create policy business_hours_update_manager on public.business_hours for update to authenticated
using (private.is_salon_manager(salon_id)) with check (private.is_salon_manager(salon_id));
create policy business_hours_delete_manager on public.business_hours for delete to authenticated
using (private.is_salon_manager(salon_id));

drop policy media_assets_manage_manager on public.media_assets;
create policy media_assets_insert_manager on public.media_assets for insert to authenticated
with check (private.is_salon_manager(salon_id));
create policy media_assets_update_manager on public.media_assets for update to authenticated
using (private.is_salon_manager(salon_id)) with check (private.is_salon_manager(salon_id));
create policy media_assets_delete_manager on public.media_assets for delete to authenticated
using (private.is_salon_manager(salon_id));

commit;
