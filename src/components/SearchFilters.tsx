import { Search, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Category, CATEGORIES, DEPARTMENTS } from '@/types/listing';

interface SearchFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCategory: Category | 'all';
  onCategoryChange: (value: Category | 'all') => void;
  selectedDepartment: string;
  onDepartmentChange: (value: string) => void;
  showFeaturedOnly: boolean;
  onFeaturedToggle: () => void;
}

const SearchFilters = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedDepartment,
  onDepartmentChange,
  showFeaturedOnly,
  onFeaturedToggle,
}: SearchFiltersProps) => {
  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Buscar productos, servicios, maquinaria..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-12 pl-10 text-base"
        />
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Category filter */}
        <Select
          value={selectedCategory}
          onValueChange={(value) => onCategoryChange(value as Category | 'all')}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            {Object.entries(CATEGORIES).map(([key, { label }]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Department filter */}
        <Select
          value={selectedDepartment}
          onValueChange={onDepartmentChange}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Departamento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">📍 Todos los departamentos</SelectItem>
            {DEPARTMENTS.map((dept) => (
              <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Featured toggle */}
        <Button
          variant={showFeaturedOnly ? 'default' : 'outline'}
          onClick={onFeaturedToggle}
          className="gap-2"
        >
          <Star className={`h-4 w-4 ${showFeaturedOnly ? 'fill-current' : ''}`} />
          Destacados
        </Button>
      </div>
    </div>
  );
};

export default SearchFilters;
