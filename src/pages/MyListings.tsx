import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useMyListings, useDeleteListing, DbListing } from '@/hooks/useListings';
import Header from '@/components/Header';
import ListingForm from '@/components/ListingForm';
import FeaturedRequestDialog from '@/components/FeaturedRequestDialog';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { CATEGORIES } from '@/types/listing';
import { ArrowLeft, Plus, Pencil, Trash2, Star } from 'lucide-react';
const MyListings = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { data: listings, isLoading } = useMyListings();
  const deleteListing = useDeleteListing();
  const { toast } = useToast();

  const [editListing, setEditListing] = useState<DbListing | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [featuredListing, setFeaturedListing] = useState<DbListing | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const handleDelete = async () => {
    if (!deleteId) return;
    
    try {
      await deleteListing.mutateAsync(deleteId);
      toast({
        title: 'Anuncio eliminado',
        description: 'El anuncio ha sido eliminado correctamente.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo eliminar el anuncio',
      });
    }
    setDeleteId(null);
  };

  const formatPrice = (listing: DbListing) => {
    if (listing.price === null) return 'A convenir';
    if (listing.currency === 'USD') {
      return `USD ${listing.price.toLocaleString()}`;
    }
    return `Gs. ${listing.price.toLocaleString()}`;
  };

  if (loading || isLoading) {
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
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Mis Anuncios</h1>
              <p className="text-muted-foreground">
                Gestiona tus publicaciones
              </p>
            </div>
          </div>
          <Button onClick={() => navigate('/publicar')}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Anuncio
          </Button>
        </div>

        {listings?.length === 0 ? (
          <div className="rounded-lg border bg-card p-12 text-center">
            <p className="text-lg text-muted-foreground">
              Aún no tienes anuncios publicados
            </p>
            <Button className="mt-4" onClick={() => navigate('/publicar')}>
              <Plus className="mr-2 h-4 w-4" />
              Publicar tu primer anuncio
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {listings?.map((listing) => (
              <div
                key={listing.id}
                className="flex gap-4 rounded-lg border bg-card p-4"
              >
                {listing.images[0] ? (
                  <img
                    src={listing.images[0]}
                    alt={listing.title}
                    className="h-24 w-24 rounded-md object-cover"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-md bg-muted text-4xl">
                    {CATEGORIES[listing.category]?.label || 'Sin categoría'}
                  </div>
                )}

                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">
                        {listing.title}
                      </h3>
                      {listing.featured && (
                      <span className="rounded-full bg-featured/10 px-2 py-0.5 text-xs font-medium text-featured">
                          Destacado
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {CATEGORIES[listing.category]?.emoji}{' '}
                      {CATEGORIES[listing.category]?.label} • {listing.city},{' '}
                      {listing.department}
                    </p>
                    <p className="font-semibold text-primary">
                      {formatPrice(listing)}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    {!listing.featured && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setFeaturedListing(listing)}
                      >
                        <Star className="mr-1 h-3 w-3" />
                        Destacar
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditListing(listing)}
                    >
                      <Pencil className="mr-1 h-3 w-3" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteId(listing.id)}
                    >
                      <Trash2 className="mr-1 h-3 w-3" />
                      Eliminar
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Edit Dialog */}
      <Dialog open={!!editListing} onOpenChange={() => setEditListing(null)}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Anuncio</DialogTitle>
          </DialogHeader>
          {editListing && (
            <ListingForm
              listing={editListing}
              onSuccess={() => setEditListing(null)}
              onCancel={() => setEditListing(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar anuncio?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El anuncio será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Featured Request Dialog */}
      {featuredListing && (
        <FeaturedRequestDialog
          open={!!featuredListing}
          onClose={() => setFeaturedListing(null)}
          listingId={featuredListing.id}
          listingTitle={featuredListing.title}
        />
      )}
    </div>
  );
};

export default MyListings;
