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
