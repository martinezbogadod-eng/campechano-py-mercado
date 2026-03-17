import {
  Wheat, Apple, Beef, Tractor, Sprout, Wrench, TreePine, Flower2,
  Package, Search, ShoppingCart, LayoutGrid, Shield,
  type LucideIcon,
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  wheat: Wheat,
  apple: Apple,
  beef: Beef,
  tractor: Tractor,
  sprout: Sprout,
  wrench: Wrench,
  'tree-pine': TreePine,
  'flower-2': Flower2,
  package: Package,
  search: Search,
  'shopping-cart': ShoppingCart,
  'layout-grid': LayoutGrid,
  shield: Shield,
};

interface CategoryIconProps {
  name: string;
  className?: string;
}

export const CategoryIcon = ({ name, className = 'h-4 w-4' }: CategoryIconProps) => {
  const Icon = ICON_MAP[name] || Package;
  return <Icon className={className} />;
};

export const getIcon = (name: string): LucideIcon => {
  return ICON_MAP[name] || Package;
};
