import { MapPin, Star, Package } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Listing, CATEGORIES, LISTING_TYPE_INFO } from '@/types/listing';
import { getOptimizedImageUrl } from '@/lib/imageUtils';
import { useLanguage } from '@/hooks/useLanguage';

interface ListingCardProps {
  listing: Listing;
  onClick: () => void;
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

const ListingCard = ({ listing, onClick }: ListingCardProps) => {
  const category = CATEGORIES[listing.category];
  const typeInfo = LISTING_TYPE_INFO[listing.listingType];
  const { t } = useLanguage();

  return (
    <Card
      className="group cursor-pointer overflow-hidden card-hover animate-fade-in"
      onClick={onClick}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={getOptimizedImageUrl(listing.imageUrl, 400)}
          alt={listing.title}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {/* Listing Type Badge */}
          <Badge className={`gap-1 ${typeInfo.color}`}>
            {typeInfo.emoji} {typeInfo.label}
          </Badge>
          {listing.featured && (
            <Badge className="gap-1 bg-featured text-featured-foreground">
              <Star className="h-3 w-3 fill-current" />
              {t('listing.featured')}
            </Badge>
          )}
          {listing.isWholesale && (
            <Badge className="gap-1 bg-emerald-600 text-white">
              <Package className="h-3 w-3" />
              {t('listing.wholesale')}
            </Badge>
          )}
        </div>
        <div className="absolute right-2 top-2">
          <Badge variant="secondary" className="text-sm">
            {category.emoji} {category.label}
          </Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="mb-2 line-clamp-2 text-base font-heading font-semibold leading-tight text-foreground group-hover:text-primary">
          {listing.title}
        </h3>
        <p className="mb-2 text-xl font-bold text-accent">
          {formatPrice(listing.price, listing.currency, listing.priceUnit)}
        </p>
        {listing.quantity && listing.quantityUnit && (
          <p className="mb-2 text-sm text-muted-foreground">
            📏 {listing.quantity} {listing.quantityUnit}
          </p>
        )}
        {listing.isWholesale && listing.minVolume && (
          <p className="mb-2 text-xs text-muted-foreground">
            📦 {t('listing.minVolume')}: {listing.minVolume}
          </p>
        )}
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>
            {listing.city}, {listing.department}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ListingCard;
