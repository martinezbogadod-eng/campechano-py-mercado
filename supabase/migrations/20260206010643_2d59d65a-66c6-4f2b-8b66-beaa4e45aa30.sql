-- Enable RLS (idempotent)
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own roles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'user_roles' AND policyname = 'Users can view their own roles'
  ) THEN
    CREATE POLICY "Users can view their own roles"
    ON public.user_roles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);
  END IF;
END$$;

-- Allow users to insert their own non-admin roles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'user_roles' AND policyname = 'Users can add their own non-admin roles'
  ) THEN
    CREATE POLICY "Users can add their own non-admin roles"
    ON public.user_roles
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id AND role <> 'admin');
  END IF;
END$$;

-- Allow users to delete their own non-admin roles (needed by onboarding reset)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'user_roles' AND policyname = 'Users can delete their own non-admin roles'
  ) THEN
    CREATE POLICY "Users can delete their own non-admin roles"
    ON public.user_roles
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id AND role <> 'admin');
  END IF;
END$$;

-- (Optional hardening) No UPDATE policy; roles should be changed via delete+insert.