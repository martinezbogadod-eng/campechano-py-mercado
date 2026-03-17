import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import SearchFilters from '@/components/SearchFilters';
import ListingGrid from '@/components/ListingGrid';
import { useListings } from '@/hooks/useListings';
import { Category, Listing, CATEGORIES, PriceUnit } from '@/types/listing';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SLUG_TO_CATEGORY: Record<string, Category> = {
  granos: 'granos',
  'frutas-verduras': 'frutas-verduras',
  ganaderia: 'ganaderia',
  maquinaria: 'maquinaria',
  insumos: 'insumos',
  servicios: 'servicios',
  forestal: 'forestal',
  viveros: 'viveros',
};

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const category = slug ? SLUG_TO_CATEGORY[slug] : undefined;
  const categoryInfo = category ? CATEGORIES[category] : undefined;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  const { data: dbListings, isLoading } = useListings();

  const listings: Listing[] = useMemo(() => {
    if (!dbListings) return [];
    return dbListings
      .filter((l) => l.category === category)
      .map((l) => ({
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
        imageUrl: l.images?.[0] || 'https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?w=800&q=80',
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
  }, [dbListings, category]);

  const filtered = useMemo(() => {
    return listings.filter((l) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (
          !l.title.toLowerCase().includes(q) &&
          !l.description.toLowerCase().includes(q) &&
          !l.city.toLowerCase().includes(q)
        )
          return false;
      }
      if (selectedDepartment !== 'all' && l.department !== selectedDepartment) return false;
      if (showFeaturedOnly && !l.featured) return false;
      return true;
    });
  }, [listings, searchQuery, selectedDepartment, showFeaturedOnly]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [filtered]);

  if (!category || !categoryInfo) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-12 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Categoría no encontrada</h1>
          <Link to="/">
            <Button variant="outline">Volver al inicio</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6">
        {/* Breadcrumb */}
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
          <ArrowLeft className="h-4 w-4" />
          Volver al inicio
        </Link>

        {/* Category header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            {categoryInfo.emoji} {categoryInfo.label}
          </h1>
          <p className="text-muted-foreground mt-1">
            {sorted.length} anuncio{sorted.length !== 1 ? 's' : ''} disponible{sorted.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <SearchFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={category}
            onCategoryChange={() => {}}
            selectedDepartment={selectedDepartment}
            onDepartmentChange={setSelectedDepartment}
            showFeaturedOnly={showFeaturedOnly}
            onFeaturedToggle={() => setShowFeaturedOnly(!showFeaturedOnly)}
          />
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : sorted.length === 0 ? (
          <div className="rounded-lg border bg-card p-12 text-center">
            <p className="text-lg text-muted-foreground">No hay anuncios en esta categoría</p>
            <p className="text-sm text-muted-foreground mt-2">¡Sé el primero en publicar!</p>
          </div>
        ) : (
          <ListingGrid listings={sorted} />
        )}
      </main>
    </div>
  );
};

export default CategoryPage;
