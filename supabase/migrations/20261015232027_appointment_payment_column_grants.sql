-- Allow the owner appointment UI to record payment fields without broad table UPDATE.
-- Existing status/schedule grants and RLS policies remain unchanged.
-- Rollback: REVOKE UPDATE (is_paid, paid_at, paid_amount_sar, payment_method)
-- ON TABLE public.appointments FROM authenticated.
GRANT UPDATE (is_paid, paid_at, paid_amount_sar, payment_method)
ON TABLE public.appointments TO authenticated;
