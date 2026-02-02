import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import SearchFilters from '@/components/SearchFilters';
import CategoryBar from '@/components/CategoryBar';
import ListingGrid from '@/components/ListingGrid';
import ListingDetail from '@/components/ListingDetail';
import { useListings, DbListing } from '@/hooks/useListings';
import { Category, Listing, CATEGORIES } from '@/types/listing';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  const { data: dbListings, isLoading } = useListings();

  // Convert DB listings to the Listing type expected by components
  const listings: Listing[] = useMemo(() => {
    if (!dbListings) return [];
    return dbListings.map((l) => ({
      id: l.id,
      title: l.title,
      description: l.description,
      price: l.price ?? 0,
      currency: l.currency as 'PYG' | 'USD',
      category: l.category,
      department: l.department,
      city: l.city,
      phone: l.phone_whatsapp,
      imageUrl: l.images[0] || `https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?w=800&q=80`,
      featured: l.featured,
      createdAt: l.created_at,
      lat: l.lat ?? undefined,
      lon: l.lon ?? undefined,
    }));
  }, [dbListings]);

  const filteredListings = useMemo(() => {
    return listings.filter((listing) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          listing.title.toLowerCase().includes(query) ||
          listing.description.toLowerCase().includes(query) ||
          listing.city.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && listing.category !== selectedCategory) {
        return false;
      }

      // Department filter
      if (selectedDepartment !== 'all' && listing.department !== selectedDepartment) {
        return false;
      }

      // Featured filter
      if (showFeaturedOnly && !listing.featured) {
        return false;
      }

      return true;
    });
  }, [listings, searchQuery, selectedCategory, selectedDepartment, showFeaturedOnly]);

  // Sort: featured first, then by date
  const sortedListings = useMemo(() => {
    return [...filteredListings].sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [filteredListings]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-6">
        {/* Hero section */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-extrabold text-foreground sm:text-4xl">
            Mercado Agrícola de Paraguay 🌾
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Compra y vende productos, insumos y servicios agrícolas. 
            Conectamos al campo paraguayo.
          </p>
        </div>

        {/* Category quick filters */}
        <div className="mb-6">
          <CategoryBar
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {/* Search and filters */}
        <div className="mb-8">
          <SearchFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedDepartment={selectedDepartment}
            onDepartmentChange={setSelectedDepartment}
            showFeaturedOnly={showFeaturedOnly}
            onFeaturedToggle={() => setShowFeaturedOnly(!showFeaturedOnly)}
          />
        </div>

        {/* Results count */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            {isLoading ? 'Cargando...' : `${sortedListings.length} anuncio${sortedListings.length !== 1 ? 's' : ''} encontrado${sortedListings.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {/* Loading state */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : sortedListings.length === 0 ? (
          <div className="rounded-lg border bg-card p-12 text-center">
            <p className="text-lg text-muted-foreground">
              No hay anuncios disponibles
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              ¡Sé el primero en publicar!
            </p>
          </div>
        ) : (
          <ListingGrid
            listings={sortedListings}
            onListingClick={setSelectedListing}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-card py-6">
        <div className="container text-center text-sm text-muted-foreground">
          <p>
            © 2024 Campechano Py Local. Conectando al campo paraguayo 🇵🇾
          </p>
        </div>
      </footer>

      {/* Listing detail modal */}
      <ListingDetail
        listing={selectedListing}
        open={!!selectedListing}
        onClose={() => setSelectedListing(null)}
      />
    </div>
  );
};

export default Index;
