import { useState } from 'react';
import { X, MapPin, Star, Phone, Calendar, ExternalLink, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Listing, CATEGORIES } from '@/types/listing';
import { useAuth } from '@/hooks/useAuth';
import ImageGallery from './ImageGallery';
import ChatDialog from './ChatDialog';

interface ListingDetailProps {
  listing: Listing | null;
  open: boolean;
  onClose: () => void;
}

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

const ListingDetail = ({ listing, open, onClose }: ListingDetailProps) => {
  const [chatOpen, setChatOpen] = useState(false);
  const { user } = useAuth();

  if (!listing) return null;

  const category = CATEGORIES[listing.category];
  const isOwnListing = user?.id === listing.userId;

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Hola! Vi tu anuncio "${listing.title}" en Campechano Py y me interesa. ¿Podrías darme más información?`
    );
    window.open(`https://wa.me/${listing.phone}?text=${message}`, '_blank');
  };

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

  return (
    <>
      <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto p-0 bg-white border border-slate-200 shadow-lg rounded-xl">
          <div className="relative">
            {/* Image Gallery */}
            <ImageGallery 
              images={listing.images.length > 0 ? listing.images : [listing.imageUrl]} 
              alt={listing.title} 
            />
            
            {listing.featured && (
              <div className="absolute left-4 top-4 z-10">
                <Badge className="gap-1 bg-featured text-featured-foreground">
                  <Star className="h-3 w-3 fill-current" />
                  Destacado
                </Badge>
              </div>
            )}
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-4 top-4 z-10"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="p-6 text-slate-900">
            <DialogHeader className="mb-4 text-left">
              <div className="mb-2">
                <Badge variant="secondary" className="text-sm">
                  {category.emoji} {category.label}
                </Badge>
              </div>
              <DialogTitle className="text-2xl font-bold leading-tight text-slate-900">
                {listing.title}
              </DialogTitle>
            </DialogHeader>

            <p className="mb-4 text-3xl font-bold text-primary">
              {formatPrice(listing.price, listing.currency, listing.priceUnit)}
            </p>

            <div className="mb-6 flex flex-wrap gap-4 text-sm text-slate-600">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>
                  {listing.city}, {listing.department}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Publicado: {formatDate(listing.createdAt)}</span>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="mb-6">
              <h4 className="mb-2 text-lg font-semibold text-slate-900">Descripción</h4>
              <p className="whitespace-pre-line text-slate-600">
                {listing.description}
              </p>
            </div>

            <Separator className="my-4" />

            <div className="flex flex-col gap-3 sm:flex-row">
              {!isOwnListing && user && (
                <Button
                  onClick={() => setChatOpen(true)}
                  variant="outline"
                  className="flex-1 gap-2"
                >
                  <MessageCircle className="h-5 w-5" />
                  Enviar Mensaje
                </Button>
              )}
              <Button
                onClick={handleWhatsApp}
                className="flex-1 gap-2 bg-whatsapp text-whatsapp-foreground hover:bg-whatsapp/90"
              >
                <Phone className="h-5 w-5" />
                Contactar por WhatsApp
              </Button>
              <Button
                variant="outline"
                onClick={handleGoogleMaps}
                className="flex-1 gap-2"
              >
                <ExternalLink className="h-5 w-5" />
                Ver en Google Maps
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Chat Dialog */}
      {user && !isOwnListing && (
        <ChatDialog
          open={chatOpen}
          onClose={() => setChatOpen(false)}
          listingId={listing.id}
          listingTitle={listing.title}
          sellerId={listing.userId}
          sellerPhone={listing.phone}
        />
      )}
    </>
  );
};

export default ListingDetail;
