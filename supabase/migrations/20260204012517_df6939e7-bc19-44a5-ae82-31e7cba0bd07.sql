-- Create profile type enum
CREATE TYPE public.profile_type AS ENUM ('productor', 'tecnico', 'proveedor');

-- Add profile fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS profile_type profile_type,
ADD COLUMN IF NOT EXISTS department text,
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS description text;

-- Add privacy settings to listings table
ALTER TABLE public.listings 
ADD COLUMN IF NOT EXISTS allow_whatsapp_contact boolean NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS show_whatsapp_public boolean NOT NULL DEFAULT false;

-- Create transactions table for completed operations tracking
CREATE TABLE public.transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid REFERENCES public.listings(id) ON DELETE SET NULL,
  buyer_id uuid NOT NULL,
  seller_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'buyer_confirmed', 'seller_confirmed', 'completed', 'disputed', 'cancelled')),
  buyer_confirmed boolean DEFAULT false,
  seller_confirmed boolean DEFAULT false,
  admin_validated boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  notes text
);

-- Create reviews table for ratings
CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id uuid REFERENCES public.transactions(id) ON DELETE CASCADE NOT NULL,
  reviewer_id uuid NOT NULL,
  reviewed_id uuid NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(transaction_id, reviewer_id)
);

-- Enable RLS on new tables
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- RLS policies for transactions
CREATE POLICY "Users can view their own transactions"
ON public.transactions FOR SELECT
USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY "Users can create transactions as buyers"
ON public.transactions FOR INSERT
WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Participants can update their transactions"
ON public.transactions FOR UPDATE
USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY "Admins can view all transactions"
ON public.transactions FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update transactions"
ON public.transactions FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- RLS policies for reviews
CREATE POLICY "Anyone can view reviews"
ON public.reviews FOR SELECT
USING (true);

CREATE POLICY "Transaction participants can create reviews"
ON public.reviews FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.transactions t 
    WHERE t.id = transaction_id 
    AND t.status = 'completed'
    AND (t.buyer_id = auth.uid() OR t.seller_id = auth.uid())
    AND auth.uid() = reviewer_id
  )
);

-- Enable realtime for transactions
ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions;