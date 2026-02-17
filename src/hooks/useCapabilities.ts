import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export type Capability = 'comprar' | 'publicar_oferta' | 'publicar_demanda' | 'ofrecer_servicio';

export const CAPABILITY_INFO: Record<Capability, { label: string; emoji: string; description: string }> = {
  comprar: { label: 'Comprar productos', emoji: '🛒', description: 'Permite contactar oferentes y realizar compras' },
  publicar_oferta: { label: 'Publicar ofertas', emoji: '📦', description: 'Permite publicar productos en venta' },
  publicar_demanda: { label: 'Publicar demandas', emoji: '🔍', description: 'Permite publicar lo que necesitás comprar' },
  ofrecer_servicio: { label: 'Ofrecer servicios', emoji: '🔧', description: 'Permite publicar servicios agrícolas' },
};

export const ALL_CAPABILITIES: Capability[] = ['comprar', 'publicar_oferta', 'publicar_demanda', 'ofrecer_servicio'];

export interface UserCapability {
  id: string;
  user_id: string;
  capability: string;
  status: string;
  admin_notes: string | null;
  requested_at: string;
  reviewed_at: string | null;
}

export function useMyCapabilities() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['capabilities', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('user_capabilities')
        .select('*')
        .eq('user_id', user.id);
      if (error) throw error;
      return data as UserCapability[];
    },
    enabled: !!user,
  });
}

export function useActiveCapabilities() {
  const { data } = useMyCapabilities();
  return data?.filter(c => c.status === 'approved').map(c => c.capability as Capability) || [];
}

export function useHasCapability(capability: Capability) {
  const active = useActiveCapabilities();
  return active.includes(capability);
}

export function useRequestCapability() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (capability: Capability) => {
      if (!user) throw new Error('Must be logged in');
      const { error } = await supabase
        .from('user_capabilities')
        .insert({ user_id: user.id, capability, status: 'pending' });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['capabilities'] });
    },
  });
}

// Admin hooks
export function useAllCapabilityRequests() {
  return useQuery({
    queryKey: ['admin-capabilities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_capabilities')
        .select('*')
        .order('requested_at', { ascending: false });
      if (error) throw error;
      return data as UserCapability[];
    },
  });
}

export function useUpdateCapabilityStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status, adminNotes }: { id: string; status: string; adminNotes?: string }) => {
      const { error } = await supabase
        .from('user_capabilities')
        .update({ status, admin_notes: adminNotes || null, reviewed_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-capabilities'] });
      queryClient.invalidateQueries({ queryKey: ['capabilities'] });
    },
  });
}
