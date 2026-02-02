-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  phone_whatsapp TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles RLS policies
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- Create category enum
CREATE TYPE public.listing_category AS ENUM (
  'granos',
  'frutas-verduras',
  'ganaderia',
  'maquinaria',
  'insumos',
  'servicios'
);

-- Create listings table
CREATE TABLE public.listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC,
  currency TEXT NOT NULL DEFAULT 'PYG' CHECK (currency IN ('PYG', 'USD')),
  category listing_category NOT NULL,
  department TEXT NOT NULL,
  city TEXT NOT NULL,
  phone_whatsapp TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  featured BOOLEAN NOT NULL DEFAULT false,
  lat DOUBLE PRECISION,
  lon DOUBLE PRECISION,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on listings
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

-- Listings RLS policies
CREATE POLICY "Anyone can view listings" 
ON public.listings FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create listings" 
ON public.listings FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own listings" 
ON public.listings FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own listings" 
ON public.listings FOR DELETE 
USING (auth.uid() = user_id);

-- Create storage bucket for listing images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('listing-images', 'listing-images', true);

-- Storage policies for listing images
CREATE POLICY "Anyone can view listing images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'listing-images');

CREATE POLICY "Authenticated users can upload listing images" 
ON storage.objects FOR INSERT 
TO authenticated
WITH CHECK (bucket_id = 'listing-images');

CREATE POLICY "Users can delete own listing images" 
ON storage.objects FOR DELETE 
TO authenticated
USING (bucket_id = 'listing-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_listings_updated_at
BEFORE UPDATE ON public.listings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for auto profile creation
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();