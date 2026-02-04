import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Star, Calendar, ExternalLink, MessageCircle, Lock, ArrowLeft, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import Header from '@/components/Header';
import ImageGallery from '@/components/ImageGallery';
import ChatDialog from '@/components/ChatDialog';
import SellerInfo from '@/components/SellerInfo';
import TransactionButton from '@/components/TransactionButton';
import { useListings } from '@/hooks/useListings';
import { useAuth } from '@/hooks/useAuth';
import { CATEGORIES, PriceUnit, Listing } from '@/types/listing';
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
  
  const { data: dbListings, isLoading } = useListings();

  const listing: Listing | null = useMemo(() => {
    if (!dbListings || !id) return null;
    const found = dbListings.find((l) => l.id === id);
    if (!found) return null;
    
    return {
      id: found.id,
      title: found.title,
      description: found.description,
      price: found.price,
      priceUnit: found.price_unit as PriceUnit | null,
      currency: found.currency as 'PYG' | 'USD',
      category: found.category,
      department: found.department,
      city: found.city,
      phone: found.phone_whatsapp,
      imageUrl: found.images?.[0] || `https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?w=800&q=80`,
      images: found.images || [],
      featured: found.featured,
      featuredUntil: found.featured_until,
      createdAt: found.created_at,
      userId: found.user_id,
      lat: found.lat ?? undefined,
      lon: found.lon ?? undefined,
      allowWhatsappContact: found.allow_whatsapp_contact ?? true,
      showWhatsappPublic: found.show_whatsapp_public ?? false,
    };
  }, [dbListings, id]);

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
        {/* Back button */}
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>

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
              {listing.featured && (
                <Badge className="gap-1 bg-featured text-featured-foreground">
                  <Star className="h-3 w-3 fill-current" />
                  Destacado
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
    </div>
  );
};

export default ListingPage;
