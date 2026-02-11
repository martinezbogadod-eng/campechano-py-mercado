import { useState } from 'react';
import { Star, Loader2, Info, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useCreateFeaturedRequest, useHasActiveFeatured } from '@/hooks/useFeaturedRequest';
import { useListingHasReports } from '@/hooks/useReports';

interface FeaturedRequestDialogProps {
  open: boolean;
  onClose: () => void;
  listingId: string;
  listingTitle: string;
}

const FEATURED_DURATION_DAYS = 7;

export default function FeaturedRequestDialog({
  open,
  onClose,
  listingId,
  listingTitle,
}: FeaturedRequestDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useAuth();
  const { toast } = useToast();
  const createRequest = useCreateFeaturedRequest();
  const { data: hasActiveFeatured, isLoading: checkingFeatured } = useHasActiveFeatured();
  const { data: hasReports, isLoading: checkingReports } = useListingHasReports(listingId);

  const canRequest = !hasActiveFeatured && !hasReports;

  const handleSubmit = async () => {
    if (!user || !canRequest) return;

    setIsSubmitting(true);
    try {
      await createRequest.mutateAsync({
        listing_id: listingId,
        duration_days: FEATURED_DURATION_DAYS,
        receipt_url: '',
      });

      toast({
        title: '¡Solicitud enviada!',
        description: 'Tu solicitud será revisada por un administrador. Duración: 7 días.',
      });
      onClose();
    } catch (error) {
      console.error('Error submitting request:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo enviar la solicitud',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = checkingFeatured || checkingReports;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-featured" />
            Destacar Anuncio
          </DialogTitle>
          <DialogDescription>
            Tu anuncio aparecerá primero en los resultados durante 7 días
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Listing info */}
          <div className="rounded-lg bg-muted p-3">
            <p className="text-sm font-medium">{listingTitle}</p>
          </div>

          {/* Duration info */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              El anuncio será destacado por <strong>7 días</strong>. No se renueva automáticamente. Solo podés tener un anuncio destacado activo a la vez.
            </AlertDescription>
          </Alert>

          {/* Validation warnings */}
          {!isLoading && hasActiveFeatured && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Ya tenés un anuncio destacado activo. Esperá a que expire para destacar otro.
              </AlertDescription>
            </Alert>
          )}

          {!isLoading && hasReports && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Este anuncio tiene reportes pendientes y no puede ser destacado.
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!canRequest || isSubmitting || isLoading}
            className="flex-1 gap-2 bg-featured text-featured-foreground hover:bg-featured/90"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Star className="h-4 w-4" />
                Solicitar Destacado
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
