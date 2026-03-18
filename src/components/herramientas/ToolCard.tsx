import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToolCardProps {
  image: string;
  title: string;
  description: string;
  children: React.ReactNode;
}

const ToolCard = ({ image, title, description, children }: ToolCardProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={cn(
        'rounded-xl border bg-card overflow-hidden transition-all duration-300',
        expanded
          ? 'border-primary shadow-lg'
          : 'hover:border-primary hover:shadow-md cursor-pointer'
      )}
    >
      {/* Image header */}
      <div
        className="relative"
        onClick={() => setExpanded(!expanded)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setExpanded(!expanded)}
      >
        <div className="h-36 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-bold text-primary mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed pr-8">{description}</p>
        </div>
        <div
          className={cn(
            'absolute bottom-4 right-4 h-8 w-8 rounded-full flex items-center justify-center transition-all duration-300',
            expanded
              ? 'bg-accent text-accent-foreground rotate-180'
              : 'bg-accent/10 text-accent'
          )}
        >
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>

      <div
        className={cn(
          'border-t border-border overflow-hidden transition-all duration-400',
          expanded ? 'max-h-[1200px] p-5' : 'max-h-0 p-0 border-t-0'
        )}
      >
        {expanded && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default ToolCard;
