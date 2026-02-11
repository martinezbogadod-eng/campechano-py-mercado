import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface ListingReport {
  id: string;
  listing_id: string;
  reporter_id: string;
  reason: string;
  status: string;
  admin_notes: string | null;
  created_at: string;
  reviewed_at: string | null;
  listing?: {
    title: string;
    user_id: string;
  };
}

export function useCreateReport() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ listingId, reason }: { listingId: string; reason: string }) => {
      if (!user) throw new Error('Must be logged in');

      const { error } = await supabase
        .from('listing_reports')
        .insert({
          listing_id: listingId,
          reporter_id: user.id,
          reason,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listing-reports'] });
    },
  });
}

export function useAdminReports() {
  return useQuery({
    queryKey: ['listing-reports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('listing_reports')
        .select(`
          *,
          listing:listings(title, user_id)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ListingReport[];
    },
  });
}

export function useUpdateReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ reportId, status, adminNotes }: { reportId: string; status: string; adminNotes?: string }) => {
      const { error } = await supabase
        .from('listing_reports')
        .update({
          status,
          admin_notes: adminNotes || null,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', reportId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listing-reports'] });
    },
  });
}
