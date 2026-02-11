
-- Make receipt_url nullable since payments are removed in this phase
ALTER TABLE public.featured_requests ALTER COLUMN receipt_url DROP NOT NULL;
ALTER TABLE public.featured_requests ALTER COLUMN receipt_url SET DEFAULT '';
