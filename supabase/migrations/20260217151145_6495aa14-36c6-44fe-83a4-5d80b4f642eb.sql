
-- Create listing_type enum
CREATE TYPE public.listing_type AS ENUM ('oferta', 'demanda', 'servicio');

-- Add listing_type, quantity, quantity_unit columns to listings
ALTER TABLE public.listings 
  ADD COLUMN listing_type public.listing_type NOT NULL DEFAULT 'oferta',
  ADD COLUMN quantity numeric NULL,
  ADD COLUMN quantity_unit text NULL;

-- Create user_capabilities table
CREATE TABLE public.user_capabilities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  capability text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  admin_notes text NULL,
  requested_at timestamp with time zone NOT NULL DEFAULT now(),
  reviewed_at timestamp with time zone NULL,
  UNIQUE (user_id, capability)
);

ALTER TABLE public.user_capabilities ENABLE ROW LEVEL SECURITY;

-- RLS: Users can view their own capabilities
CREATE POLICY "Users can view own capabilities"
ON public.user_capabilities FOR SELECT
USING (auth.uid() = user_id);

-- RLS: Users can request capabilities (insert pending)
CREATE POLICY "Users can request capabilities"
ON public.user_capabilities FOR INSERT
WITH CHECK (auth.uid() = user_id AND status = 'pending');

-- RLS: Admins can view all capabilities
CREATE POLICY "Admins can view all capabilities"
ON public.user_capabilities FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- RLS: Admins can update capabilities
CREATE POLICY "Admins can update capabilities"
ON public.user_capabilities FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- RLS: Admins can delete capabilities  
CREATE POLICY "Admins can delete capabilities"
ON public.user_capabilities FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));
