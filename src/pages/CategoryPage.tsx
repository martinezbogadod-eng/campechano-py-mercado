import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import ListingGrid from '@/components/ListingGrid';
import { useListings } from '@/hooks/useListings';
import { Category, Listing, CATEGORIES, PriceUnit } from '@/types/listing';
import { Search, Star, ChevronRight, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

/* ── Slug ↔ Category mapping ── */
const SLUG_TO_CATEGORY: Record<string, Category> = {
  'granos-cereales': 'granos',
  granos: 'granos',
  'frutas-verduras': 'frutas-verduras',
  ganaderia: 'ganaderia',
  maquinaria: 'maquinaria',
  'insumos-agricolas': 'insumos',
  insumos: 'insumos',
  servicios: 'servicios',
  forestal: 'forestal',
  viveros: 'viveros',
};

/* ── Hero images per category (random pool) ── */
const CATEGORY_HERO_IMAGES: Record<Category, string[]> = {
  granos: [
    'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=1600&q=80',
    'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1600&q=80',
    'https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?w=1600&q=80',
  ],
  'frutas-verduras': [
    'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1600&q=80',
    'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600&q=80',
    'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=1600&q=80',
  ],
  ganaderia: [
    'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=1600&q=80',
    'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=1600&q=80',
    'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=1600&q=80',
  ],
  maquinaria: [
    'https://images.unsplash.com/photo-1530267981375-f0de937f5f13?w=1600&q=80',
    'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=1600&q=80',
  ],
  insumos: [
    'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1600&q=80',
    'https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?w=1600&q=80',
  ],
  servicios: [
    'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=1600&q=80',
    'https://images.unsplash.com/photo-1473773508845-188df298d2d1?w=1600&q=80',
  ],
  forestal: [
    'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=1600&q=80',
    'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1600&q=80',
  ],
  viveros: [
    'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1600&q=80',
    'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=1600&q=80',
  ],
};

const CATEGORY_DESCRIPTIONS: Record<Category, string> = {
  granos: 'Explorá ofertas y demandas de soja, maíz, trigo, girasol, arroz y más cereales del campo paraguayo.',
  'frutas-verduras': 'Productos frescos directo del productor: hortalizas, frutas tropicales y verduras de estación.',
  ganaderia: 'Ganado vacuno, porcino, avícola, equino y todo lo relacionado al sector pecuario.',
  maquinaria: 'Tractores, cosechadoras, implementos agrícolas, repuestos y equipos para el campo.',
  insumos: 'Fertilizantes, agroquímicos, semillas certificadas y todo para tu producción.',
  servicios: 'Pulverización aérea y terrestre, siembra, cosecha, asesoría técnica y más.',
  forestal: 'Madera, postes, leña, rollos, plantines forestales y productos del sector.',
  viveros: 'Plantas ornamentales, frutales, forestales e insumos de vivero.',
};

/* ── Paraguay departments & cities ── */
const PARAGUAY_DATA: Record<string, string[]> = {
  'Alto Paraguay': ['Fuerte Olimpo', 'Puerto Casado'],
  'Alto Paraná': ['Ciudad del Este', 'Hernandarias', 'Presidente Franco', 'Minga Guazú', 'Santa Rita'],
  Amambay: ['Pedro Juan Caballero', 'Bella Vista', 'Capitán Bado'],
  Boquerón: ['Filadelfia', 'Loma Plata', 'Mariscal Estigarribia'],
  Caaguazú: ['Coronel Oviedo', 'Caaguazú', 'J. Eulogio Estigarribia', 'Repatriación'],
  Caazapá: ['Caazapá', 'San Juan Nepomuceno', 'Yuty', 'Abaí'],
  Canindeyú: ['Salto del Guairá', 'Curuguaty', 'Katueté', 'La Paloma'],
  Central: ['Luque', 'Fernando de la Mora', 'Lambaré', 'San Lorenzo', 'Capiatá'],
  Concepción: ['Concepción', 'Horqueta', 'Belén'],
  Cordillera: ['Caacupé', 'Eusebio Ayala', 'Tobatí'],
  Guairá: ['Villarrica', 'Independencia', 'Mbocayaty'],
  Itapúa: ['Encarnación', 'Capitán Miranda', 'Bella Vista', 'Fram', 'Obligado'],
  Misiones: ['San Juan Bautista', 'Santiago', 'San Ignacio'],
  Ñeembucú: ['Pilar', 'Villa Franca', 'Guazú Cuá', 'Isla Umbú'],
  Paraguarí: ['Paraguarí', 'Pirayú', 'Yaguarón'],
  'Presidente Hayes': ['Villa Hayes', 'Benjamín Aceval', 'Puerto Pinasco'],
  'San Pedro': ['San Pedro', 'Santa Rosa del Aguaray', 'Lima'],
};

type SortOption = 'recent' | 'price-asc' | 'price-desc';

const ITEMS_PER_PAGE = 12;

const pickRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const category = slug ? SLUG_TO_CATEGORY[slug] : undefined;
  const categoryInfo = category ? CATEGORIES[category] : undefined;

  // State from URL params
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedDepartment, setSelectedDepartment] = useState(searchParams.get('dept') || 'all');
  const [selectedCity, setSelectedCity] = useState(searchParams.get('ciudad') || 'all');
  const [sortBy, setSortBy] = useState<SortOption>((searchParams.get('orden') as SortOption) || 'recent');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [page, setPage] = useState(1);

  // Random hero image (stable per mount)
  const [heroImage] = useState(() =>
    category ? pickRandom(CATEGORY_HERO_IMAGES[category]) : '',
  );

  const cities = selectedDepartment !== 'all' ? PARAGUAY_DATA[selectedDepartment] || [] : [];

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
      if (selectedCity !== 'all' && l.city !== selectedCity) return false;
      if (showFeaturedOnly && !l.featured) return false;
      return true;
    });
  }, [listings, searchQuery, selectedDepartment, selectedCity, showFeaturedOnly]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    // Featured always first
    arr.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
    // Then by sort option
    arr.sort((a, b) => {
      // Keep featured order
      if (a.featured !== b.featured) return 0;
      switch (sortBy) {
        case 'price-asc':
          return (a.price ?? Infinity) - (b.price ?? Infinity);
        case 'price-desc':
          return (b.price ?? 0) - (a.price ?? 0);
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
    return arr;
  }, [filtered, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / ITEMS_PER_PAGE));
  const paginatedListings = sorted.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // Handler helpers
  const handleDepartmentChange = (value: string) => {
    setSelectedDepartment(value);
    setSelectedCity('all');
    setPage(1);
  };

  const handleCityChange = (value: string) => {
    setSelectedCity(value);
    setPage(1);
  };

  // Not found
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

      {/* Hero */}
      <div className="relative h-[200px] sm:h-[300px] overflow-hidden">
        <img
          src={heroImage}
          alt={categoryInfo.label}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/50" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <span className="text-4xl mb-2">{categoryInfo.emoji}</span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
            {categoryInfo.label}
          </h1>
          <p className="mt-2 max-w-2xl text-sm sm:text-base text-white/90 drop-shadow">
            {CATEGORY_DESCRIPTIONS[category]}
          </p>
        </div>
      </div>

      <main className="container py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary transition-colors">Inicio</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-muted-foreground">Categorías</span>
          <ChevronRight className="h-3 w-3" />
          <span className="font-medium text-foreground">{categoryInfo.label}</span>
        </nav>

        {/* Filters */}
        <div className="rounded-lg border bg-card p-4 mb-6 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder={`Buscar en ${categoryInfo.label}...`}
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              className="h-12 pl-10 text-base"
            />
          </div>

          {/* Filter row */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Department */}
            <Select value={selectedDepartment} onValueChange={handleDepartmentChange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Departamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">📍 Todos los departamentos</SelectItem>
                {Object.keys(PARAGUAY_DATA).sort().map((dept) => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* City (cascading) */}
            <Select
              value={selectedCity}
              onValueChange={handleCityChange}
              disabled={selectedDepartment === 'all'}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Ciudad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">🏘️ Todas las ciudades</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={(v) => { setSortBy(v as SortOption); setPage(1); }}>
              <SelectTrigger className="w-[220px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Más recientes</SelectItem>
                <SelectItem value="price-asc">Precio: menor a mayor</SelectItem>
                <SelectItem value="price-desc">Precio: mayor a menor</SelectItem>
              </SelectContent>
            </Select>

            {/* Featured toggle */}
            <Button
              variant={showFeaturedOnly ? 'default' : 'outline'}
              onClick={() => { setShowFeaturedOnly(!showFeaturedOnly); setPage(1); }}
              className="gap-2"
            >
              <Star className={`h-4 w-4 ${showFeaturedOnly ? 'fill-current' : ''}`} />
              Destacados
            </Button>
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground mb-4">
          {isLoading
            ? 'Cargando...'
            : `${sorted.length} anuncio${sorted.length !== 1 ? 's' : ''} encontrado${sorted.length !== 1 ? 's' : ''} en ${categoryInfo.label}`}
        </p>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : sorted.length === 0 ? (
          /* Empty state */
          <div className="rounded-lg border bg-card p-12 text-center">
            <div className="text-5xl mb-4">
              <Package className="h-12 w-12 mx-auto text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Todavía no hay publicaciones en esta categoría
            </h3>
            <p className="text-muted-foreground mb-6">
              Sé el primero en publicar en {categoryInfo.label}
            </p>
            <Button onClick={() => navigate('/publicar')} className="bg-accent hover:bg-accent/90 text-accent-foreground">
              Publicar ahora
            </Button>
          </div>
        ) : (
          <>
            <ListingGrid listings={paginatedListings} />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                >
                  Anterior
                </Button>
                <span className="text-sm text-muted-foreground px-3">
                  Página {page} de {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  Siguiente
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default CategoryPage;
