
CREATE TABLE public.role_change_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  from_role text NOT NULL,
  to_role text NOT NULL,
  reason text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  admin_notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  reviewed_at timestamp with time zone
);

ALTER TABLE public.role_change_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own role requests"
ON public.role_change_requests
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create role requests"
ON public.role_change_requests
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all role requests"
ON public.role_change_requests
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update role requests"
ON public.role_change_requests
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'::app_role));
