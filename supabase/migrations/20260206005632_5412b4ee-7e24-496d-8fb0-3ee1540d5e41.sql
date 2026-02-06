-- Drop all policies that depend on has_role function first (in correct order)
DROP POLICY IF EXISTS "Only admins can manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all requests" ON public.featured_requests;
DROP POLICY IF EXISTS "Admins can update requests" ON public.featured_requests;
DROP POLICY IF EXISTS "Admins can view all transactions" ON public.transactions;
DROP POLICY IF EXISTS "Admins can update transactions" ON public.transactions;
DROP POLICY IF EXISTS "Admins can view all receipts" ON storage.objects;

-- Now drop the function with CASCADE to handle any remaining dependencies
DROP FUNCTION IF EXISTS public.has_role(uuid, app_role) CASCADE;

-- Add preferred_language column to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS preferred_language TEXT DEFAULT 'es';

-- Create new enum with all roles
CREATE TYPE public.app_role_v2 AS ENUM ('consumidor', 'productor', 'prestador', 'admin');

-- Add new column, migrate data, switch
ALTER TABLE public.user_roles ADD COLUMN role_v2 public.app_role_v2;

UPDATE public.user_roles 
SET role_v2 = CASE 
  WHEN role::text = 'admin' THEN 'admin'::public.app_role_v2
  ELSE 'consumidor'::public.app_role_v2
END;

ALTER TABLE public.user_roles ALTER COLUMN role_v2 SET NOT NULL;
ALTER TABLE public.user_roles DROP COLUMN role;
ALTER TABLE public.user_roles RENAME COLUMN role_v2 TO role;

-- Drop old enum and rename new
DROP TYPE public.app_role;
ALTER TYPE public.app_role_v2 RENAME TO app_role;

-- Recreate unique constraint
ALTER TABLE public.user_roles DROP CONSTRAINT IF EXISTS user_roles_user_id_role_key;
ALTER TABLE public.user_roles ADD CONSTRAINT user_roles_user_id_role_key UNIQUE (user_id, role);

-- Recreate has_role function
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create get_user_roles function
CREATE OR REPLACE FUNCTION public.get_user_roles(_user_id uuid)
RETURNS app_role[]
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(ARRAY_AGG(role), ARRAY[]::app_role[])
  FROM public.user_roles
  WHERE user_id = _user_id
$$;

-- Recreate RLS policies on public tables
CREATE POLICY "Only admins can manage roles" 
ON public.user_roles 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can view all requests" 
ON public.featured_requests 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update requests" 
ON public.featured_requests 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can view all transactions" 
ON public.transactions 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update transactions" 
ON public.transactions 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Recreate storage policy for admin access to receipts
CREATE POLICY "Admins can view all receipts" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'payment-receipts' AND has_role(auth.uid(), 'admin'::app_role));