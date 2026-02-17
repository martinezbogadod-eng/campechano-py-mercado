import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Star, Calendar, ExternalLink, MessageCircle, Lock, ArrowLeft, Share2, Pencil, Trash2, Package, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
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
import Header from '@/components/Header';
import ImageGallery from '@/components/ImageGallery';
import ChatDialog from '@/components/ChatDialog';
import SellerInfo from '@/components/SellerInfo';
import TransactionButton from '@/components/TransactionButton';
import ListingForm from '@/components/ListingForm';
import ReportButton from '@/components/ReportButton';
import { useListings, useDeleteListing, DbListing } from '@/hooks/useListings';
import { useAuth } from '@/hooks/useAuth';
import { CATEGORIES, PriceUnit, Listing, LISTING_TYPE_INFO } from '@/types/listing';
import { toast } from 'sonner';

const formatPrice = (price: number | null, currency: 'PYG' | 'USD', priceUnit: string | null) => {
  if (price === null) {
    return 'A convenir';
  }
  
  const formattedPrice = currency === 'USD' 
    ? `US$ ${price.toLocaleString('es-PY')}`
    : `Gs. ${price.toLocaleString('es-PY')}`;
  
  if (priceUnit) {
    return `${formattedPrice} / ${priceUnit}`;
  }
  
  return formattedPrice;
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-PY', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const ListingPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [chatOpen, setChatOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  
  const { data: dbListings, isLoading } = useListings();
  const deleteListing = useDeleteListing();

  const dbListing: DbListing | null = useMemo(() => {
    if (!dbListings || !id) return null;
    return dbListings.find((l) => l.id === id) || null;
  }, [dbListings, id]);

  const listing: Listing | null = useMemo(() => {
    if (!dbListing) return null;
    
    return {
      id: dbListing.id,
      title: dbListing.title,
      description: dbListing.description,
      price: dbListing.price,
      priceUnit: dbListing.price_unit as PriceUnit | null,
      currency: dbListing.currency as 'PYG' | 'USD',
      category: dbListing.category,
      department: dbListing.department,
      city: dbListing.city,
      phone: dbListing.phone_whatsapp,
      imageUrl: dbListing.images?.[0] || `https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?w=800&q=80`,
      images: dbListing.images || [],
      featured: dbListing.featured,
      featuredUntil: dbListing.featured_until,
      createdAt: dbListing.created_at,
      userId: dbListing.user_id,
      lat: dbListing.lat ?? undefined,
      lon: dbListing.lon ?? undefined,
      allowWhatsappContact: dbListing.allow_whatsapp_contact ?? true,
      showWhatsappPublic: dbListing.show_whatsapp_public ?? false,
      isWholesale: dbListing.is_wholesale ?? false,
      minVolume: dbListing.min_volume ?? null,
      productionCapacity: dbListing.production_capacity ?? null,
      listingType: dbListing.listing_type || 'oferta',
      quantity: dbListing.quantity ?? null,
      quantityUnit: dbListing.quantity_unit ?? null,
    };
  }, [dbListing]);

  const handleDelete = async () => {
    if (!listing) return;
    
    try {
      await deleteListing.mutateAsync(listing.id);
      toast.success('Anuncio eliminado correctamente');
      navigate('/');
    } catch (error) {
      toast.error('No se pudo eliminar el anuncio');
    }
    setDeleteOpen(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-6">
          <Skeleton className="h-8 w-32 mb-6" />
          <div className="max-w-4xl mx-auto">
            <Skeleton className="aspect-video w-full rounded-xl mb-6" />
            <Skeleton className="h-8 w-3/4 mb-4" />
            <Skeleton className="h-12 w-1/3 mb-4" />
            <Skeleton className="h-20 w-full" />
          </div>
        </main>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-12 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Anuncio no encontrado</h1>
          <p className="text-muted-foreground mb-6">El anuncio que buscás no existe o fue eliminado.</p>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al inicio
          </Button>
        </main>
      </div>
    );
  }

  const category = CATEGORIES[listing.category];
  const isOwnListing = user?.id === listing.userId;
  const showWhatsappPublic = listing.showWhatsappPublic && listing.allowWhatsappContact;

  const handleGoogleMaps = () => {
    let url: string;
    if (listing.lat && listing.lon) {
      url = `https://www.google.com/maps?q=${listing.lat},${listing.lon}`;
    } else {
      const query = encodeURIComponent(`${listing.city}, ${listing.department}, Paraguay`);
      url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    }
    window.open(url, '_blank');
  };

  const handleContactClick = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    setChatOpen(true);
  };

  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: listing.title,
          text: `${listing.title} - ${formatPrice(listing.price, listing.currency, listing.priceUnit)}`,
          url,
        });
      } catch (err) {
        // User cancelled share
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success('Enlace copiado al portapapeles');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-6">
        {/* Back button and owner actions */}
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          
          {isOwnListing && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
                <Pencil className="h-4 w-4 mr-1" />
                Editar
              </Button>
              <Button variant="outline" size="sm" onClick={() => setDeleteOpen(true)} className="text-destructive hover:text-destructive">
                <Trash2 className="h-4 w-4 mr-1" />
                Eliminar
              </Button>
            </div>
          )}
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Image Gallery */}
          <div className="rounded-xl overflow-hidden mb-6">
            <ImageGallery 
              images={listing.images.length > 0 ? listing.images : [listing.imageUrl]} 
              alt={listing.title} 
            />
          </div>

          <div className="bg-card rounded-xl border p-6">
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {/* Listing Type Badge */}
              <Badge className={`gap-1 ${LISTING_TYPE_INFO[listing.listingType].color}`}>
                {LISTING_TYPE_INFO[listing.listingType].emoji} {LISTING_TYPE_INFO[listing.listingType].label}
              </Badge>
              {listing.featured && (
                <Badge className="gap-1 bg-featured text-featured-foreground">
                  <Star className="h-3 w-3 fill-current" />
                  Destacado
                </Badge>
              )}
              {listing.isWholesale && (
                <Badge className="gap-1 bg-emerald-600 text-white">
                  <Package className="h-3 w-3" />
                  Mayorista
                </Badge>
              )}
              <Badge variant="secondary" className="text-sm">
                {category.emoji} {category.label}
              </Badge>
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              {listing.title}
            </h1>

            {/* Price */}
            <p className="text-3xl font-bold text-primary mb-4">
              {formatPrice(listing.price, listing.currency, listing.priceUnit)}
            </p>

            {/* Wholesale Info */}
            {listing.isWholesale && (listing.minVolume || listing.productionCapacity) && (
              <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-950/30">
                <h3 className="mb-2 flex items-center gap-2 font-semibold text-emerald-800 dark:text-emerald-300">
                  <Package className="h-4 w-4" />
                  Información Mayorista
                </h3>
                <div className="space-y-1 text-sm text-emerald-700 dark:text-emerald-400">
                  {listing.minVolume && (
                    <p>📦 <strong>Volumen mínimo:</strong> {listing.minVolume}</p>
                  )}
                  {listing.productionCapacity && (
                    <p>🏭 <strong>Capacidad productiva:</strong> {listing.productionCapacity}</p>
                  )}
                </div>
              </div>
            )}

            {/* Location & Date */}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{listing.city}, {listing.department}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Publicado: {formatDate(listing.createdAt)}</span>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Seller Info */}
            <div className="mb-6">
              <SellerInfo sellerId={listing.userId} />
            </div>

            <Separator className="my-4" />

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-foreground mb-2">Descripción</h2>
              <p className="whitespace-pre-line text-muted-foreground">
                {listing.description}
              </p>
            </div>

            <Separator className="my-4" />

            {/* Quantity info */}
            {listing.quantity && listing.quantityUnit && (
              <div className="mb-4 rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
                📏 <strong>Cantidad:</strong> {listing.quantity} {listing.quantityUnit}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-3">
              {!isOwnListing && (
                <Button onClick={handleContactClick} className="w-full gap-2">
                  <MessageCircle className="h-5 w-5" />
                  {user ? 'Contactar al vendedor' : 'Iniciar sesión para contactar'}
                </Button>
              )}

              {showWhatsappPublic && !isOwnListing && (
                <p className="text-center text-xs text-muted-foreground">
                  El vendedor permite contacto directo por WhatsApp desde el chat.
                </p>
              )}

              {!showWhatsappPublic && !isOwnListing && (
                <div className="flex items-center justify-center gap-2 rounded-lg bg-muted p-3 text-sm text-muted-foreground">
                  <Lock className="h-4 w-4" />
                  <span>
                    Por seguridad, contactá primero por chat. 
                    {listing.allowWhatsappContact && ' Podrás continuar por WhatsApp desde ahí.'}
                  </span>
                </div>
              )}

              <div className="flex gap-3">
                <Button variant="outline" onClick={handleGoogleMaps} className="flex-1 gap-2">
                  <ExternalLink className="h-5 w-5" />
                  Ver en Mapa
                </Button>

                <Button variant="outline" onClick={handleShare} className="gap-2">
                  <Share2 className="h-5 w-5" />
                  Compartir
                </Button>

                {user && !isOwnListing && (
                  <TransactionButton
                    listingId={listing.id}
                    listingTitle={listing.title}
                    sellerId={listing.userId}
                  />
                )}

                {!isOwnListing && (
                  <ReportButton listingId={listing.id} />
                )}
              </div>
              {/* Platform Disclaimer */}
              <div className="mt-4 rounded-lg border border-border bg-muted/30 p-3 text-center text-xs text-muted-foreground">
                ⚠️ KAMPS PY es una plataforma de interconexión. Las transacciones y documentaciones son responsabilidad exclusiva de los usuarios.
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card py-6 mt-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2024 Campechano Py Local. Conectando al campo paraguayo 🇵🇾</p>
        </div>
      </footer>

      {/* Chat Dialog */}
      {user && !isOwnListing && (
        <ChatDialog
          open={chatOpen}
          onClose={() => setChatOpen(false)}
          listingId={listing.id}
          listingTitle={listing.title}
          sellerId={listing.userId}
          sellerPhone={listing.allowWhatsappContact ? listing.phone : undefined}
        />
      )}

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Anuncio</DialogTitle>
          </DialogHeader>
          {dbListing && (
            <ListingForm
              listing={dbListing}
              onSuccess={() => setEditOpen(false)}
              onCancel={() => setEditOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
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
    </div>
  );
};

export default ListingPage;
