import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import Header from '@/components/Header';
import ListingForm from '@/components/ListingForm';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const NewListing = () => {
  const { user, loading } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const isProfileComplete = !!(
    profile?.name &&
    profile?.profile_type &&
    profile?.department &&
    profile?.city &&
    profile?.phone_whatsapp
  );

  if (loading || profileLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
        </div>

        <div className="mx-auto max-w-2xl">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">Publicar Anuncio</h1>
            <p className="text-muted-foreground">
              Completa los datos para publicar tu anuncio en el marketplace
            </p>
          </div>

          {!isProfileComplete && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Completá tu perfil</AlertTitle>
              <AlertDescription>
                Antes de publicar, necesitás completar tu perfil con nombre, tipo de perfil, 
                ubicación y teléfono.
                <Button
                  variant="link"
                  className="ml-2 h-auto p-0 text-destructive underline"
                  onClick={() => navigate('/perfil')}
                >
                  Ir a Mi Perfil
                </Button>
              </AlertDescription>
            </Alert>
          )}

          <div className="rounded-lg border bg-card p-6">
            <ListingForm onSuccess={() => navigate('/mis-anuncios')} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default NewListing;
