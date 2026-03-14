import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import SearchFilters from '@/components/SearchFilters';
import CategoryBar from '@/components/CategoryBar';
import ListingGrid from '@/components/ListingGrid';
import { useListings, DbListing } from '@/hooks/useListings';
import { Category, Listing, CATEGORIES, PriceUnit } from '@/types/listing';
import heroBg from '@/assets/hero-categories-bg.jpg';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  const { data: dbListings, isLoading } = useListings();

  // Convert DB listings to the Listing type expected by components
  const listings: Listing[] = useMemo(() => {
    if (!dbListings) return [];
    return dbListings.map((l) => ({
      id: l.id,
      title: l.title,
      description: l.description,
      price: l.price,
      priceUnit: l.price_unit as PriceUnit | null,
      currency: l.currency as 'PYG' | 'USD',
      category: l.category,
      department: l.department,
      city: l.city,
      phone: l.phone_whatsapp,
      imageUrl: l.images?.[0] || `https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?w=800&q=80`,
      images: l.images || [],
      featured: l.featured,
      featuredUntil: l.featured_until,
      createdAt: l.created_at,
      userId: l.user_id,
      lat: l.lat ?? undefined,
      lon: l.lon ?? undefined,
      allowWhatsappContact: l.allow_whatsapp_contact ?? true,
      showWhatsappPublic: l.show_whatsapp_public ?? false,
      isWholesale: l.is_wholesale ?? false,
      minVolume: l.min_volume ?? null,
      productionCapacity: l.production_capacity ?? null,
      listingType: l.listing_type || 'oferta',
      quantity: l.quantity ?? null,
      quantityUnit: l.quantity_unit ?? null,
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
        <div className="relative mb-8 overflow-hidden rounded-2xl">
          <img
            src={heroBg}
            alt="Categorías agrícolas del Paraguay"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-foreground/60" />
          <div className="relative px-6 py-12 text-center sm:py-16">
            <h1 className="text-3xl font-extrabold text-white sm:text-4xl drop-shadow-lg">
              Mercado Agrícola de Paraguay
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-lg text-white/90 drop-shadow">
              Compra y vende productos, insumos y servicios agrícolas.
              Conectamos al campo paraguayo.
            </p>
          </div>
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
          <ListingGrid listings={sortedListings} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-card py-6">
        <div className="container text-center text-sm text-muted-foreground space-y-2">
          <p>
            © 2026 KAMPS PY. Conectando al campo paraguayo 🇵🇾
          </p>
          <p className="text-xs">
            KAMPS PY es una plataforma de interconexión. Las transacciones son responsabilidad exclusiva de los usuarios.
          </p>
          <Link to="/terminos" className="text-xs text-primary hover:underline">
            Términos y Condiciones
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default Index;
