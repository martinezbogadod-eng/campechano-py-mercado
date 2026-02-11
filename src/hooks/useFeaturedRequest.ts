import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface FeaturedRequestInsert {
  listing_id: string;
  duration_days: number;
  receipt_url: string;
}

export function useMyFeaturedRequests() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['my-featured-requests', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('featured_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

/**
 * Check if the current user already has an active featured listing
 * (featured=true and featured_until > now)
 */
export function useHasActiveFeatured() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['has-active-featured', user?.id],
    queryFn: async () => {
      if (!user) return false;

      const { data, error } = await supabase
        .from('listings')
        .select('id')
        .eq('user_id', user.id)
        .eq('featured', true)
        .gt('featured_until', new Date().toISOString())
        .limit(1);

      if (error) throw error;
      return (data?.length || 0) > 0;
    },
    enabled: !!user,
  });
}

export function useCreateFeaturedRequest() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (request: FeaturedRequestInsert) => {
      if (!user) throw new Error('Must be logged in');

      const { data, error } = await supabase
        .from('featured_requests')
        .insert({
          ...request,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-featured-requests'] });
    },
  });
}
