-- Step 1: Add new producer subtypes to the app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'productor_minorista';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'productor_mayorista';

-- Step 2: Add wholesale-specific fields to listings table
ALTER TABLE public.listings 
  ADD COLUMN IF NOT EXISTS is_wholesale boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS min_volume text,
  ADD COLUMN IF NOT EXISTS production_capacity text;

-- Step 3: Create an index for filtering wholesale listings
CREATE INDEX IF NOT EXISTS idx_listings_is_wholesale ON public.listings(is_wholesale) WHERE is_wholesale = true;