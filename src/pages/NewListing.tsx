import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import ListingForm from '@/components/ListingForm';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NewListing = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
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

          <div className="rounded-lg border bg-card p-6">
            <ListingForm onSuccess={() => navigate('/mis-anuncios')} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default NewListing;
