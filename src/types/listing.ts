export type Category = 
  | 'granos'
  | 'frutas-verduras'
  | 'ganaderia'
  | 'maquinaria'
  | 'insumos'
  | 'servicios';

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: 'PYG' | 'USD';
  category: Category;
  department: string;
  city: string;
  phone: string;
  imageUrl: string;
  featured: boolean;
  createdAt: string;
  lat?: number;
  lon?: number;
}

export const CATEGORIES: Record<Category, { label: string; emoji: string }> = {
  'granos': { label: 'Granos y Cereales', emoji: '🌾' },
  'frutas-verduras': { label: 'Frutas y Verduras', emoji: '🥬' },
  'ganaderia': { label: 'Ganadería', emoji: '🐄' },
  'maquinaria': { label: 'Maquinaria', emoji: '🚜' },
  'insumos': { label: 'Insumos Agrícolas', emoji: '🌱' },
  'servicios': { label: 'Servicios', emoji: '🔧' },
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
