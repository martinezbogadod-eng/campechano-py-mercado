import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export type AppRole = 'consumidor' | 'productor' | 'productor_minorista' | 'productor_mayorista' | 'prestador' | 'admin';

// Non-admin roles that users can select during onboarding
export type SelectableRole = Exclude<AppRole, 'admin' | 'productor'>;

export const ROLE_INFO: Record<SelectableRole, { emoji: string; color: string; label: string }> = {
  consumidor: { emoji: '🛒', color: 'bg-blue-100 text-blue-800', label: 'Consumidor' },
  productor_minorista: { emoji: '🌱', color: 'bg-green-100 text-green-800', label: 'Productor Minorista' },
  productor_mayorista: { emoji: '🌾', color: 'bg-emerald-100 text-emerald-800', label: 'Productor Mayorista' },
  prestador: { emoji: '🔧', color: 'bg-orange-100 text-orange-800', label: 'Prestador de Servicios' },
};

// Helper to check if user has any producer role
export function isProducerRole(role: AppRole): boolean {
  return role === 'productor' || role === 'productor_minorista' || role === 'productor_mayorista';
}

// Helper to check if user is a wholesale producer
export function isWholesaleProducer(roles: AppRole[]): boolean {
  return roles.includes('productor_mayorista');
}

export function useUserRoles() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-roles', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      if (error) throw error;
      return (data?.map(r => r.role) || []) as AppRole[];
    },
    enabled: !!user,
  });
}

export function useHasRole(role: AppRole) {
  const { data: roles } = useUserRoles();
  return roles?.includes(role) || false;
}

export function useIsAdmin() {
  return useHasRole('admin');
}

export function useIsProducer() {
  const { data: roles } = useUserRoles();
  return roles?.some(r => isProducerRole(r)) || false;
}

export function useIsWholesale() {
  const { data: roles } = useUserRoles();
  return roles?.includes('productor_mayorista') || false;
}

export function useCanPublish() {
  const { data: roles } = useUserRoles();
  if (!roles) return false;
  return roles.some(r => isProducerRole(r) || r === 'prestador' || r === 'admin');
}

export function useNeedsOnboarding() {
  const { user } = useAuth();
  const { data: roles, isLoading } = useUserRoles();
  
  // User needs onboarding if logged in but has no roles
  const needsOnboarding = !!user && !isLoading && (!roles || roles.length === 0);
  
  return { needsOnboarding, isLoading };
}

export function useSetUserRoles() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (roles: SelectableRole[]) => {
      if (!user) throw new Error('Must be logged in');
      if (roles.length === 0) throw new Error('Must select at least one role');

      // First, delete existing non-admin roles
      const { error: deleteError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', user.id)
        .neq('role', 'admin');

      if (deleteError) throw deleteError;

      // Insert new roles
      const { error: insertError } = await supabase
        .from('user_roles')
        .insert(roles.map(role => ({ user_id: user.id, role })));

      if (insertError) throw insertError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-roles'] });
    },
  });
}
