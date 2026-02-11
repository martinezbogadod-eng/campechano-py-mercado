
-- Add suspended column to profiles for user management
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS suspended boolean NOT NULL DEFAULT false;

-- Admin can update any profile (for suspending users)
CREATE POLICY "Admins can update any profile"
ON public.profiles
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admin can view all user roles
CREATE POLICY "Admins can view all user roles"
ON public.user_roles
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admin can delete any listing (for moderation)
CREATE POLICY "Admins can delete any listing"
ON public.listings
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admin can update any listing (for featuring)
CREATE POLICY "Admins can update any listing"
ON public.listings
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));
