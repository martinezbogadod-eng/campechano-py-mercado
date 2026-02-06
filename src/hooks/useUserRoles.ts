import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export type AppRole = 'consumidor' | 'productor' | 'prestador' | 'admin';

export const ROLE_INFO: Record<Exclude<AppRole, 'admin'>, { emoji: string; color: string }> = {
  consumidor: { emoji: '🛒', color: 'bg-blue-100 text-blue-800' },
  productor: { emoji: '🌾', color: 'bg-green-100 text-green-800' },
  prestador: { emoji: '🔧', color: 'bg-orange-100 text-orange-800' },
};

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
    mutationFn: async (roles: Exclude<AppRole, 'admin'>[]) => {
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
