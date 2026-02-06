import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import { useUserRoles, useSetUserRoles, SelectableRole, ROLE_INFO } from '@/hooks/useUserRoles';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
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
  const [selectedRoles, setSelectedRoles] = useState<SelectableRole[]>([]);

  // Initialize selected roles from existing roles
  useEffect(() => {
    if (existingRoles && existingRoles.length > 0) {
      // Filter to only selectable roles (exclude 'admin' and 'productor')
      const selectableRoles = existingRoles.filter(
        (r): r is SelectableRole => r !== 'admin' && r !== 'productor'
      );
      setSelectedRoles(selectableRoles);
    }
  }, [existingRoles]);

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const isEditing = existingRoles && existingRoles.length > 0;

  const toggleRole = (role: SelectableRole) => {
    setSelectedRoles(prev =>
      prev.includes(role)
        ? prev.filter(r => r !== role)
        : [...prev, role]
    );
  };

  const handleSubmit = async () => {
    if (selectedRoles.length === 0) {
      toast({
        variant: 'destructive',
        title: t('common.error'),
        description: t('onboarding.selectOne'),
      });
      return;
    }

    try {
      await setUserRoles.mutateAsync(selectedRoles);
      toast({
        title: t('common.success'),
        description: isEditing ? 'Perfil actualizado correctamente' : 'Bienvenido a Kamps Py',
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
        {/* Back button for users editing their roles */}
        {isEditing && (
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('common.back')}
          </Button>
        )}

        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-3xl">
            🌱
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            {isEditing ? t('header.changeRole') : t('onboarding.title')}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {t('onboarding.subtitle')}
          </p>
        </div>

        <div className="space-y-3">
          {ROLES.map(({ role, icon: Icon }) => {
            const isSelected = selectedRoles.includes(role);
            const info = ROLE_INFO[role];
            return (
              <Card
                key={role}
                className={`cursor-pointer transition-all ${
                  isSelected
                    ? 'border-primary ring-2 ring-primary/20'
                    : 'hover:border-primary/50'
                }`}
                onClick={() => toggleRole(role)}
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
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggleRole(role)}
                  />
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Button
          onClick={handleSubmit}
          disabled={setUserRoles.isPending || selectedRoles.length === 0}
          className="w-full"
          size="lg"
        >
          {setUserRoles.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('common.loading')}
            </>
          ) : isEditing ? (
            t('profile.save')
          ) : (
            t('onboarding.continue')
          )}
        </Button>
      </div>
    </div>
  );
}
