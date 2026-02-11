import { useState } from 'react';
import { X, MapPin, Star, Calendar, ExternalLink, MessageCircle, Lock, Package } from 'lucide-react';
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
import SellerInfo from './SellerInfo';
import TransactionButton from './TransactionButton';
import ReportButton from './ReportButton';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  if (!listing) return null;

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
      onClose();
      return;
    }
    setChatOpen(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto p-0 bg-card border border-border shadow-lg rounded-xl">
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

          <div className="p-6 text-foreground">
            <DialogHeader className="mb-4 text-left">
              <div className="mb-2">
                <Badge variant="secondary" className="text-sm">
                  {category.emoji} {category.label}
                </Badge>
              </div>
              <DialogTitle className="text-2xl font-bold leading-tight text-foreground">
                {listing.title}
              </DialogTitle>
            </DialogHeader>

            <p className="mb-4 text-3xl font-bold text-primary">
              {formatPrice(listing.price, listing.currency, listing.priceUnit)}
            </p>

            <div className="mb-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
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

            {/* Seller Info */}
            <div className="mb-6">
              <SellerInfo sellerId={listing.userId} />
            </div>

            <Separator className="my-4" />

            <div className="mb-6">
              <h4 className="mb-2 text-lg font-semibold text-foreground">Descripción</h4>
              <p className="whitespace-pre-line text-muted-foreground">
                {listing.description}
              </p>
            </div>

            {/* Wholesale Info */}
            {listing.isWholesale && (listing.minVolume || listing.productionCapacity) && (
              <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-950/30">
                <h3 className="mb-2 flex items-center gap-2 font-semibold text-emerald-800 dark:text-emerald-300">
                  <Package className="h-4 w-4" />
                  Información Mayorista
                </h3>
                <div className="space-y-1 text-sm text-emerald-700 dark:text-emerald-400">
                  {listing.minVolume && <p>📦 <strong>Volumen mínimo:</strong> {listing.minVolume}</p>}
                  {listing.productionCapacity && <p>🏭 <strong>Capacidad productiva:</strong> {listing.productionCapacity}</p>}
                </div>
              </div>
            )}

            <Separator className="my-4" />

            {/* Contact Actions */}
            <div className="flex flex-col gap-3">
              {!isOwnListing && (
                <Button
                  onClick={handleContactClick}
                  className="w-full gap-2"
                >
                  <MessageCircle className="h-5 w-5" />
                  {user ? 'Contactar al vendedor' : 'Iniciar sesión para contactar'}
                </Button>
              )}

              {/* Only show public WhatsApp if enabled */}
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
                <Button
                  variant="outline"
                  onClick={handleGoogleMaps}
                  className="flex-1 gap-2"
                >
                  <ExternalLink className="h-5 w-5" />
                  Ver en Mapa
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
          sellerPhone={listing.allowWhatsappContact ? listing.phone : undefined}
        />
      )}
    </>
  );
};

export default ListingDetail;
