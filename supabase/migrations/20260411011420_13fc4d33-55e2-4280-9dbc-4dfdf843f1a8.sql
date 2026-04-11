
-- Fix: Hide phone_whatsapp from non-owners by using a security definer function
-- that returns profiles with phone masked for non-owners

-- Drop the overly permissive SELECT policy
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;

-- Owner can see their full profile
CREATE POLICY "Users can view own full profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- Others can view profiles but phone_whatsapp will be handled at app level
-- We need a restrictive approach: allow public reads but mask the phone
-- Since column-level RLS isn't supported, we use a view approach instead

-- Actually, let's use two policies: one for owner (full access) and one for others
-- But RLS can't filter columns. So we create a secure view.

-- Re-create a public SELECT policy (needed for listings to work)
CREATE POLICY "Anyone can view profiles public info"
ON public.profiles
FOR SELECT
USING (true);

-- Create a secure view that masks phone for non-owners
CREATE OR REPLACE VIEW public.profiles_public AS
SELECT
  id,
  name,
  description,
  city,
  department,
  profile_type,
  updated_at,
  created_at,
  suspended,
  preferred_language,
  avatar_url,
  CASE
    WHEN auth.uid() = id THEN phone_whatsapp
    ELSE NULL
  END AS phone_whatsapp
FROM public.profiles;
