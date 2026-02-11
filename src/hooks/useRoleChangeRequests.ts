import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { SelectableRole } from './useUserRoles';

interface RoleChangeRequest {
  id: string;
  user_id: string;
  from_role: string;
  to_role: string;
  reason: string;
  status: string;
  admin_notes: string | null;
  created_at: string;
  reviewed_at: string | null;
}

export function useMyRoleChangeRequests() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['role-change-requests', 'mine', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('role_change_requests')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as RoleChangeRequest[];
    },
    enabled: !!user,
  });
}

export function useCreateRoleChangeRequest() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async ({ fromRole, toRole, reason }: { fromRole: string; toRole: string; reason: string }) => {
      if (!user) throw new Error('Must be logged in');
      const { error } = await supabase
        .from('role_change_requests')
        .insert({ user_id: user.id, from_role: fromRole, to_role: toRole, reason });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['role-change-requests'] });
    },
  });
}

export function useAdminRoleChangeRequests() {
  return useQuery({
    queryKey: ['role-change-requests', 'admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('role_change_requests')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as RoleChangeRequest[];
    },
  });
}

export function useApproveRoleChange() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ requestId, userId, toRole }: { requestId: string; userId: string; toRole: string }) => {
      // Delete existing non-admin roles
      const { error: delErr } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .neq('role', 'admin');
      if (delErr) throw delErr;

      // Insert new role
      const { error: insErr } = await supabase
        .from('user_roles')
        .insert([{ user_id: userId, role: toRole as any }]);
      if (insErr) throw insErr;

      // Update request status
      const { error: updErr } = await supabase
        .from('role_change_requests')
        .update({ status: 'approved', reviewed_at: new Date().toISOString() })
        .eq('id', requestId);
      if (updErr) throw updErr;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['role-change-requests'] });
      queryClient.invalidateQueries({ queryKey: ['user-roles'] });
    },
  });
}

export function useRejectRoleChange() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ requestId, adminNotes }: { requestId: string; adminNotes?: string }) => {
      const { error } = await supabase
        .from('role_change_requests')
        .update({ status: 'rejected', reviewed_at: new Date().toISOString(), admin_notes: adminNotes || null })
        .eq('id', requestId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['role-change-requests'] });
    },
  });
}
