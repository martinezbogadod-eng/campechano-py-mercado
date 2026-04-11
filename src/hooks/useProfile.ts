import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { Language } from '@/i18n/translations';

export type ProfileType = 'productor' | 'tecnico' | 'proveedor';

export interface Profile {
  id: string;
  name: string | null;
  phone_whatsapp: string | null;
  profile_type: ProfileType | null;
  department: string | null;
  city: string | null;
  description: string | null;
  avatar_url: string | null;
  preferred_language: Language | null;
  created_at: string;
  updated_at: string;
}

export interface ProfileWithStats extends Profile {
  avgRating: number;
  reviewCount: number;
  completedOperations: number;
  avatar_url: string | null;
}

export const PROFILE_TYPES: Record<ProfileType, { label: string; emoji: string }> = {
  'productor': { label: 'Productor', emoji: '🌾' },
  'tecnico': { label: 'Técnico / Servicio', emoji: '🔧' },
  'proveedor': { label: 'Proveedor / Comercio', emoji: '🏪' },
};

export function useProfile() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data as Profile;
    },
    enabled: !!user,
  });
}

export function useProfileById(userId: string | undefined) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      if (!userId) return null;

      // Get profile - exclude phone_whatsapp for privacy (only owner sees it)
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, name, description, city, department, profile_type, updated_at, created_at, suspended, preferred_language, avatar_url')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      // Get reviews stats
      const { data: reviews } = await supabase
        .from('reviews')
        .select('rating')
        .eq('reviewed_id', userId);

      // Get completed transactions count
      const { count: completedOps } = await supabase
        .from('transactions')
        .select('*', { count: 'exact', head: true })
        .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
        .eq('status', 'completed');

      const avgRating = reviews?.length 
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
        : 0;

      return {
        ...profile,
        phone_whatsapp: null,
        avgRating,
        reviewCount: reviews?.length || 0,
        completedOperations: completedOps || 0,
      } as ProfileWithStats;
    },
    enabled: !!userId,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>) => {
      if (!user) throw new Error('Must be logged in');

      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}

export function useIsProfileComplete() {
  const { data: profile } = useProfile();
  
  return !!(
    profile?.name &&
    profile?.profile_type &&
    profile?.department &&
    profile?.city &&
    profile?.phone_whatsapp
  );
}
