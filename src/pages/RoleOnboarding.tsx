import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import { useUserRoles, useSetUserRoles, SelectableRole, ROLE_INFO } from '@/hooks/useUserRoles';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ShoppingCart, Sprout, Wheat, Wrench, ArrowLeft } from 'lucide-react';

const ROLES: { role: SelectableRole; icon: typeof ShoppingCart }[] = [
  { role: 'consumidor', icon: ShoppingCart },
  { role: 'productor_minorista', icon: Sprout },
  { role: 'productor_mayorista', icon: Wheat },
  { role: 'prestador', icon: Wrench },
];

export default function RoleOnboarding() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const { data: existingRoles, isLoading: rolesLoading } = useUserRoles();
  const setUserRoles = useSetUserRoles();
  const [selectedRole, setSelectedRole] = useState<SelectableRole | null>(null);

  // This page is ONLY for first-time onboarding (no roles yet)
  // Users with existing roles cannot change them here
  const isEditing = existingRoles && existingRoles.length > 0;

  // Redirect to auth if not logged in
  if (!authLoading && !user) {
    navigate('/auth');
    return null;
  }

  // If user already has roles, redirect to home
  if (!rolesLoading && isEditing) {
    navigate('/');
    return null;
  }

  const handleSubmit = async () => {
    if (!selectedRole) {
      toast({
        variant: 'destructive',
        title: t('common.error'),
        description: t('onboarding.selectOne'),
      });
      return;
    }

    try {
      await setUserRoles.mutateAsync([selectedRole]);
      toast({
        title: t('common.success'),
        description: 'Bienvenido a Kamps Py',
      });
      navigate('/');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : t('common.error');
      toast({
        variant: 'destructive',
        title: t('common.error'),
        description: message,
      });
    }
  };

  if (authLoading || rolesLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-3xl">
            🌱
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            {t('onboarding.title')}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {t('onboarding.subtitle')}
          </p>
        </div>

        <div className="space-y-3">
          {ROLES.map(({ role, icon: Icon }) => {
            const isSelected = selectedRole === role;
            const info = ROLE_INFO[role];
            return (
              <Card
                key={role}
                className={`cursor-pointer transition-all ${
                  isSelected
                    ? 'border-primary ring-2 ring-primary/20'
                    : 'hover:border-primary/50'
                }`}
                onClick={() => setSelectedRole(role)}
              >
                <CardContent className="flex items-center gap-4 p-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${info.color}`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">
                      {t(`role.${role}`)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t(`onboarding.${role}.desc`)}
                    </p>
                  </div>
                  <div className={`h-5 w-5 rounded-full border-2 ${isSelected ? 'border-primary bg-primary' : 'border-muted-foreground'}`}>
                    {isSelected && (
                      <div className="flex h-full w-full items-center justify-center">
                        <div className="h-2 w-2 rounded-full bg-primary-foreground" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Button
          onClick={handleSubmit}
          disabled={setUserRoles.isPending || !selectedRole}
          className="w-full"
          size="lg"
        >
          {setUserRoles.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('common.loading')}
            </>
          ) : (
            t('onboarding.continue')
          )}
        </Button>
      </div>
    </div>
  );
}
