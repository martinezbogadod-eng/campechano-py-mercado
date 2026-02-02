import { Package } from 'lucide-react';
import ListingCard from '@/components/ListingCard';
import { Listing } from '@/types/listing';

interface ListingGridProps {
  listings: Listing[];
  onListingClick: (listing: Listing) => void;
}

const ListingGrid = ({ listings, onListingClick }: ListingGridProps) => {
  if (listings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <Package className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="mb-2 text-xl font-semibold text-foreground">
          No se encontraron anuncios
        </h3>
        <p className="max-w-md text-muted-foreground">
          Intenta ajustar los filtros o buscar con otros términos para encontrar
          lo que necesitas.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {listings.map((listing) => (
        <ListingCard
          key={listing.id}
          listing={listing}
          onClick={() => onListingClick(listing)}
        />
      ))}
    </div>
  );
};

export default ListingGrid;
