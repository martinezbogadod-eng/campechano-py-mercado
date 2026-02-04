-- Allow users to view other profiles (for SellerInfo component)
CREATE POLICY "Anyone can view profiles"
ON public.profiles FOR SELECT
USING (true);

-- Drop the restrictive policy that only allows users to view their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;