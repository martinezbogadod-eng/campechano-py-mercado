import { Category, CATEGORIES } from '@/types/listing';
import { cn } from '@/lib/utils';

interface CategoryBarProps {
  selectedCategory: Category | 'all';
  onCategoryChange: (category: Category | 'all') => void;
}

const CategoryBar = ({ selectedCategory, onCategoryChange }: CategoryBarProps) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <button
        onClick={() => onCategoryChange('all')}
        className={cn(
          'flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all',
          selectedCategory === 'all'
            ? 'bg-primary text-primary-foreground shadow-md'
            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
        )}
      >
        <span>📦</span>
        <span>Todos</span>
      </button>
      {Object.entries(CATEGORIES).map(([key, { label, emoji }]) => (
        <button
          key={key}
          onClick={() => onCategoryChange(key as Category)}
          className={cn(
            'flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all',
            selectedCategory === key
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          )}
        >
          <span>{emoji}</span>
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
};

export default CategoryBar;
