import { Category, CATEGORIES } from '@/types/listing';
import { cn } from '@/lib/utils';

interface CategoryBarProps {
  selectedCategory: Category | 'all';
  onCategoryChange: (category: Category | 'all') => void;
}

const CategoryBar = ({ selectedCategory, onCategoryChange }: CategoryBarProps) => {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
      <button
        onClick={() => onCategoryChange('all')}
        className={cn(
          'flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all border',
          selectedCategory === 'all'
            ? 'bg-accent text-accent-foreground border-accent shadow-md'
            : 'bg-background text-muted-foreground border-border hover:bg-action-light hover:text-accent hover:border-accent'
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
            'flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all border',
            selectedCategory === key
              ? 'bg-accent text-accent-foreground border-accent shadow-md'
              : 'bg-background text-muted-foreground border-border hover:bg-action-light hover:text-accent hover:border-accent'
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
