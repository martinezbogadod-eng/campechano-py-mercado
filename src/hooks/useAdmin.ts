import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useHasRole } from './useUserRoles';

export interface FeaturedRequest {
  id: string;
  listing_id: string;
  user_id: string;
  duration_days: number;
  receipt_url: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_notes: string | null;
  created_at: string;
  reviewed_at: string | null;
  listing?: {
    title: string;
    user_id: string;
  };
}

export function useIsAdmin() {
  const isAdmin = useHasRole('admin');
  
  return {
    data: isAdmin,
    isLoading: false,
  };
}

export function useAllListings() {
  const { data: isAdmin } = useIsAdmin();

  return useQuery({
    queryKey: ['admin-listings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: isAdmin === true,
  });
}

export function useFeaturedRequests() {
  const { data: isAdmin } = useIsAdmin();

  return useQuery({
    queryKey: ['featured-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('featured_requests')
        .select(`
          *,
          listing:listings(title, user_id)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as FeaturedRequest[];
    },
    enabled: isAdmin === true,
  });
}

export function useApproveFeaturedRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ requestId, listingId, durationDays }: { requestId: string; listingId: string; durationDays: number }) => {
      // Calculate featured_until date
      const featuredUntil = new Date();
      featuredUntil.setDate(featuredUntil.getDate() + durationDays);

      // Update the request status
      const { error: requestError } = await supabase
        .from('featured_requests')
        .update({
          status: 'approved',
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', requestId);

      if (requestError) throw requestError;

      // Update the listing to be featured
      const { error: listingError } = await supabase
        .from('listings')
        .update({
          featured: true,
          featured_until: featuredUntil.toISOString(),
        })
        .eq('id', listingId);

      if (listingError) throw listingError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['featured-requests'] });
      queryClient.invalidateQueries({ queryKey: ['admin-listings'] });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    },
  });
}

export function useRejectFeaturedRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ requestId, notes }: { requestId: string; notes?: string }) => {
      const { error } = await supabase
        .from('featured_requests')
        .update({
          status: 'rejected',
          admin_notes: notes || null,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', requestId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['featured-requests'] });
    },
  });
}

export function useToggleListingFeatured() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ listingId, featured }: { listingId: string; featured: boolean }) => {
      const updateData: { featured: boolean; featured_until?: string | null } = { featured };
      
      if (!featured) {
        updateData.featured_until = null;
      }

      const { error } = await supabase
        .from('listings')
        .update(updateData)
        .eq('id', listingId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-listings'] });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    },
  });
}

export function useAdminDeleteListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (listingId: string) => {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', listingId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-listings'] });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    },
  });
}
