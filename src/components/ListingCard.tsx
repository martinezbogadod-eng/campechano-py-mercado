import { MapPin, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Listing, CATEGORIES } from '@/types/listing';

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

  return (
    <Card
      className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-fade-in"
      onClick={onClick}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={listing.imageUrl}
          alt={listing.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {listing.featured && (
          <div className="absolute left-2 top-2">
            <Badge className="gap-1 bg-featured text-featured-foreground">
              <Star className="h-3 w-3 fill-current" />
              Destacado
            </Badge>
          </div>
        )}
        <div className="absolute right-2 top-2">
          <Badge variant="secondary" className="text-sm">
            {category.emoji} {category.label}
          </Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="mb-2 line-clamp-2 text-base font-semibold leading-tight text-foreground group-hover:text-primary">
          {listing.title}
        </h3>
        <p className="mb-3 text-xl font-bold text-primary">
          {formatPrice(listing.price, listing.currency, listing.priceUnit)}
        </p>
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
