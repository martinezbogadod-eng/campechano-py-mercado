import { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ImageGalleryProps {
  images: string[];
  alt: string;
}

export default function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const validImages = images.filter(Boolean);
  
  if (validImages.length === 0) {
    return (
      <div className="aspect-video w-full bg-muted flex items-center justify-center">
        <span className="text-muted-foreground">Sin imágenes</span>
      </div>
    );
  }

  const goToPrevious = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
  };

  const goToNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'ArrowRight') goToNext();
    if (e.key === 'Escape') setLightboxOpen(false);
  };

  return (
    <>
      {/* Main Gallery */}
      <div className="relative">
        <div
          className="aspect-video w-full cursor-pointer overflow-hidden rounded-t-xl"
          onClick={() => setLightboxOpen(true)}
        >
          <img
            src={validImages[currentIndex]}
            alt={`${alt} - Imagen ${currentIndex + 1}`}
            className="h-full w-full object-cover transition-transform hover:scale-105"
          />
        </div>

        {/* Navigation arrows */}
        {validImages.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 opacity-80 hover:opacity-100"
              onClick={(e) => goToPrevious(e)}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 opacity-80 hover:opacity-100"
              onClick={(e) => goToNext(e)}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        )}

        {/* Dots indicator */}
        {validImages.length > 1 && (
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
            {validImages.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(index);
                }}
                className={cn(
                  'h-2 w-2 rounded-full transition-all',
                  index === currentIndex
                    ? 'bg-white w-4'
                    : 'bg-white/50 hover:bg-white/75'
                )}
              />
            ))}
          </div>
        )}

        {/* Image count badge */}
        <div className="absolute right-2 top-2 rounded-full bg-foreground/50 px-2 py-1 text-xs text-background">
          {currentIndex + 1} / {validImages.length}
        </div>
      </div>

      {/* Thumbnail strip */}
      {validImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto p-2 bg-muted">
          {validImages.map((img, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                'h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border-2 transition-all',
                index === currentIndex
                  ? 'border-primary ring-2 ring-primary/30'
                  : 'border-transparent opacity-70 hover:opacity-100'
              )}
            >
              <img
                src={img}
                alt={`Miniatura ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/90"
          onClick={() => setLightboxOpen(false)}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 text-background hover:bg-background/20"
            onClick={() => setLightboxOpen(false)}
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Navigation */}
          {validImages.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-background hover:bg-background/20"
                onClick={goToPrevious}
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-background hover:bg-background/20"
                onClick={goToNext}
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            </>
          )}

          {/* Main image */}
          <img
            src={validImages[currentIndex]}
            alt={`${alt} - Imagen ${currentIndex + 1}`}
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-foreground/50 px-4 py-2 text-background">
            {currentIndex + 1} / {validImages.length}
          </div>
        </div>
      )}
    </>
  );
}
