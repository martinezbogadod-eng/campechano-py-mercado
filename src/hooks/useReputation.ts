import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Transaction {
  id: string;
  listing_id: string | null;
  buyer_id: string;
  seller_id: string;
  status: 'pending' | 'buyer_confirmed' | 'seller_confirmed' | 'completed' | 'disputed' | 'cancelled';
  buyer_confirmed: boolean;
  seller_confirmed: boolean;
  admin_validated: boolean;
  created_at: string;
  completed_at: string | null;
  notes: string | null;
  listing?: {
    title: string;
  };
}

export interface Review {
  id: string;
  transaction_id: string;
  reviewer_id: string;
  reviewed_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

export function useUserTransactions() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['transactions', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          listing:listings(title)
        `)
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Transaction[];
    },
    enabled: !!user,
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ listingId, sellerId }: { listingId: string; sellerId: string }) => {
      if (!user) throw new Error('Must be logged in');

      const { data, error } = await supabase
        .from('transactions')
        .insert({
          listing_id: listingId,
          buyer_id: user.id,
          seller_id: sellerId,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}

export function useConfirmTransaction() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (transactionId: string) => {
      if (!user) throw new Error('Must be logged in');

      // Get current transaction
      const { data: tx, error: fetchError } = await supabase
        .from('transactions')
        .select('*')
        .eq('id', transactionId)
        .single();

      if (fetchError) throw fetchError;

      const isBuyer = tx.buyer_id === user.id;
      const isSeller = tx.seller_id === user.id;

      if (!isBuyer && !isSeller) {
        throw new Error('Not authorized');
      }

      const updateData: Partial<Transaction> = {};

      if (isBuyer) {
        updateData.buyer_confirmed = true;
        updateData.status = tx.seller_confirmed ? 'completed' : 'buyer_confirmed';
      } else {
        updateData.seller_confirmed = true;
        updateData.status = tx.buyer_confirmed ? 'completed' : 'seller_confirmed';
      }

      if (updateData.status === 'completed') {
        updateData.completed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('transactions')
        .update(updateData)
        .eq('id', transactionId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ 
      transactionId, 
      reviewedId, 
      rating, 
      comment 
    }: { 
      transactionId: string; 
      reviewedId: string; 
      rating: number; 
      comment?: string;
    }) => {
      if (!user) throw new Error('Must be logged in');

      const { data, error } = await supabase
        .from('reviews')
        .insert({
          transaction_id: transactionId,
          reviewer_id: user.id,
          reviewed_id: reviewedId,
          rating,
          comment: comment || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}

export function useUserReviews(userId: string | undefined) {
  return useQuery({
    queryKey: ['reviews', userId],
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('reviewed_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Review[];
    },
    enabled: !!userId,
  });
}
