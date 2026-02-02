import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import type { Category } from '@/types/listing';

export interface DbListing {
  id: string;
  user_id: string;
  title: string;
  description: string;
  price: number | null;
  currency: string;
  category: Category;
  department: string;
  city: string;
  phone_whatsapp: string;
  images: string[];
  featured: boolean;
  lat: number | null;
  lon: number | null;
  created_at: string;
  updated_at: string;
}

export interface ListingInsert {
  title: string;
  description: string;
  price: number | null;
  currency: string;
  category: Category;
  department: string;
  city: string;
  phone_whatsapp: string;
  images: string[];
  featured: boolean;
  lat?: number | null;
  lon?: number | null;
}

export function useListings() {
  return useQuery({
    queryKey: ['listings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as DbListing[];
    },
  });
}

export function useMyListings() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['my-listings', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as DbListing[];
    },
    enabled: !!user,
  });
}

export function useCreateListing() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (listing: ListingInsert) => {
      if (!user) throw new Error('Must be logged in');

      const { data, error } = await supabase
        .from('listings')
        .insert({
          ...listing,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data as DbListing;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['my-listings'] });
    },
  });
}

export function useUpdateListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...listing }: Partial<ListingInsert> & { id: string }) => {
      const { data, error } = await supabase
        .from('listings')
        .update(listing)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as DbListing;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['my-listings'] });
    },
  });
}

export function useDeleteListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['my-listings'] });
    },
  });
}

export async function uploadListingImage(file: File, userId: string): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${crypto.randomUUID()}.${fileExt}`;

  const { error } = await supabase.storage
    .from('listing-images')
    .upload(fileName, file);

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from('listing-images')
    .getPublicUrl(fileName);

  return publicUrl;
}
