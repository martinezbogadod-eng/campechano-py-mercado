import { useState, useCallback, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const HERO_SLIDES = [
  {
    category: 'Granos y Cereales',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=1600&q=80',
  },
  {
    category: 'Frutas y Verduras',
    image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1600&q=80',
  },
  {
    category: 'Ganadería',
    image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=1600&q=80',
  },
  {
    category: 'Maquinaria',
    image: 'https://images.unsplash.com/photo-1530267981375-f0de937f5f13?w=1600&q=80',
  },
  {
    category: 'Insumos Agrícolas',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1600&q=80',
  },
  {
    category: 'Servicios',
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=1600&q=80',
  },
  {
    category: 'Forestal',
    image: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=1600&q=80',
  },
  {
    category: 'Viveros',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1600&q=80',
  },
];

const HeroCarousel = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi],
  );

  return (
    <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] overflow-hidden rounded-xl">
      {/* Carousel viewport */}
      <div ref={emblaRef} className="h-full">
        <div className="flex h-full">
          {HERO_SLIDES.map((slide, i) => (
            <div key={i} className="relative min-w-0 shrink-0 grow-0 basis-full h-full">
              <img
                src={slide.image}
                alt={slide.category}
                className="absolute inset-0 h-full w-full object-cover"
                loading={i === 0 ? 'eager' : 'lazy'}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Navy overlay + text */}
      <div className="absolute inset-0 bg-primary/40 flex flex-col items-center justify-center text-center px-6 pointer-events-none">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white drop-shadow-lg leading-tight">
          Mercado Agrícola Digital de Paraguay
        </h1>
        <p className="mt-3 max-w-2xl text-base sm:text-lg text-white/90 drop-shadow">
          Compra y vende productos, insumos y servicios agrícolas.
        </p>
      </div>

      {/* Arrows */}
      <button
        onClick={scrollPrev}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-background/70 backdrop-blur flex items-center justify-center text-foreground hover:bg-background transition-colors"
        aria-label="Anterior"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-background/70 backdrop-blur flex items-center justify-center text-foreground hover:bg-background transition-colors"
        aria-label="Siguiente"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            aria-label={`Ir a slide ${i + 1}`}
            className={cn(
              'h-2 rounded-full transition-all duration-300',
              i === selectedIndex
                ? 'w-6 bg-white'
                : 'w-2 bg-white/50 hover:bg-white/80',
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
