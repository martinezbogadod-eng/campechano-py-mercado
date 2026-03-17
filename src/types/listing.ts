export type Category = 
  | 'granos'
  | 'frutas-verduras'
  | 'ganaderia'
  | 'maquinaria'
  | 'insumos'
  | 'servicios'
  | 'forestal'
  | 'viveros';

export type ListingType = 'oferta' | 'demanda' | 'servicio';

export type PriceUnit = 'Kg' | 'Litros' | 'Unidad' | 'Docena' | 'Bolsa' | 'Tonelada';

export const PRICE_UNITS: PriceUnit[] = ['Kg', 'Litros', 'Unidad', 'Docena', 'Bolsa', 'Tonelada'];

export const QUANTITY_UNITS = ['Kg', 'Litros', 'Unidad', 'Docena', 'Bolsa', 'Tonelada', 'Hectárea', 'Metro', 'Caja'] as const;
export type QuantityUnit = typeof QUANTITY_UNITS[number];

export const LISTING_TYPE_INFO: Record<ListingType, { label: string; icon: string; color: string; bgClass: string }> = {
  oferta: { label: 'Oferta', icon: 'package', color: 'bg-emerald-600 text-white', bgClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' },
  demanda: { label: 'Demanda', icon: 'search', color: 'bg-blue-600 text-white', bgClass: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300' },
  servicio: { label: 'Servicio', icon: 'wrench', color: 'bg-orange-500 text-white', bgClass: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300' },
};

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number | null;
  priceUnit: PriceUnit | null;
  currency: 'PYG' | 'USD';
  category: Category;
  listingType: ListingType;
  department: string;
  city: string;
  phone: string;
  imageUrl: string;
  images: string[];
  featured: boolean;
  featuredUntil: string | null;
  createdAt: string;
  userId: string;
  lat?: number;
  lon?: number;
  allowWhatsappContact: boolean;
  showWhatsappPublic: boolean;
  // Wholesale producer fields
  isWholesale: boolean;
  minVolume: string | null;
  productionCapacity: string | null;
  // Quantity fields
  quantity: number | null;
  quantityUnit: string | null;
}

export const CATEGORIES: Record<Category, { label: string; icon: string }> = {
  'granos': { label: 'Granos y Cereales', icon: 'wheat' },
  'frutas-verduras': { label: 'Frutas y Verduras', icon: 'apple' },
  'ganaderia': { label: 'Ganadería', icon: 'beef' },
  'maquinaria': { label: 'Maquinaria', icon: 'tractor' },
  'insumos': { label: 'Insumos Agrícolas', icon: 'sprout' },
  'servicios': { label: 'Servicios', icon: 'wrench' },
  'forestal': { label: 'Forestal', icon: 'tree-pine' },
  'viveros': { label: 'Viveros', icon: 'flower-2' },
};

export const DEPARTMENTS = [
  'Alto Paraguay',
  'Alto Paraná',
  'Amambay',
  'Boquerón',
  'Caaguazú',
  'Caazapá',
  'Canindeyú',
  'Central',
  'Concepción',
  'Cordillera',
  'Guairá',
  'Itapúa',
  'Misiones',
  'Ñeembucú',
  'Paraguarí',
  'Presidente Hayes',
  'San Pedro',
];
