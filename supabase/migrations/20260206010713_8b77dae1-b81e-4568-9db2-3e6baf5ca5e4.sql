-- Remove the restrictive admin-only policy that blocks user self-service
DROP POLICY IF EXISTS "Only admins can manage roles" ON public.user_roles;