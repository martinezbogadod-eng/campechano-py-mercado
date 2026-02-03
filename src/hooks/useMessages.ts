import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Message {
  id: string;
  listing_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read: boolean;
  created_at: string;
}

export interface Conversation {
  listingId: string;
  listingTitle: string;
  otherUserId: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

export function useConversations() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['conversations', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data: messages, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get unique listing IDs
      const listingIds = [...new Set(messages?.map(m => m.listing_id) || [])];
      
      if (listingIds.length === 0) return [];

      // Fetch listing details
      const { data: listings } = await supabase
        .from('listings')
        .select('id, title, user_id')
        .in('id', listingIds);

      const listingsMap = new Map(listings?.map(l => [l.id, l]));

      // Group messages by listing and other user
      const conversationsMap = new Map<string, Conversation>();

      messages?.forEach(msg => {
        const otherUserId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
        const key = `${msg.listing_id}-${otherUserId}`;
        const listing = listingsMap.get(msg.listing_id);

        if (!conversationsMap.has(key)) {
          conversationsMap.set(key, {
            listingId: msg.listing_id,
            listingTitle: listing?.title || 'Anuncio eliminado',
            otherUserId,
            lastMessage: msg.content,
            lastMessageAt: msg.created_at,
            unreadCount: msg.receiver_id === user.id && !msg.read ? 1 : 0,
          });
        } else {
          const conv = conversationsMap.get(key)!;
          if (msg.receiver_id === user.id && !msg.read) {
            conv.unreadCount++;
          }
        }
      });

      return Array.from(conversationsMap.values());
    },
    enabled: !!user,
  });

  // Subscribe to realtime messages
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('messages-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${user.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['conversations'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  return query;
}

export function useConversationMessages(listingId: string, otherUserId: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['messages', listingId, otherUserId],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('listing_id', listingId)
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Mark messages as read
      const unreadIds = data
        ?.filter(m => m.receiver_id === user.id && !m.read)
        .map(m => m.id);

      if (unreadIds && unreadIds.length > 0) {
        await supabase
          .from('messages')
          .update({ read: true })
          .in('id', unreadIds);
      }

      return data as Message[];
    },
    enabled: !!user && !!listingId && !!otherUserId,
  });

  // Subscribe to realtime messages
  useEffect(() => {
    if (!user || !listingId) return;

    const channel = supabase
      .channel(`messages-${listingId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `listing_id=eq.${listingId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['messages', listingId, otherUserId] });
          queryClient.invalidateQueries({ queryKey: ['conversations'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, listingId, otherUserId, queryClient]);

  return query;
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ listingId, receiverId, content }: { listingId: string; receiverId: string; content: string }) => {
      if (!user) throw new Error('Must be logged in');

      const { data, error } = await supabase
        .from('messages')
        .insert({
          listing_id: listingId,
          sender_id: user.id,
          receiver_id: receiverId,
          content,
        })
        .select()
        .single();

      if (error) throw error;
      return data as Message;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messages', variables.listingId, variables.receiverId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}
