-- Permit an appointment to remain unassigned when no barber is selected.
-- Rollback: first assign a barber to every row where barber_id IS NULL, then
-- run ALTER TABLE public.appointments ALTER COLUMN barber_id SET NOT NULL.
ALTER TABLE public.appointments ALTER COLUMN barber_id DROP NOT NULL;
