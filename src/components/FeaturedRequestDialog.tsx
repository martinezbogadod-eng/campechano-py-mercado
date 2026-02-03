import { useState } from 'react';
import { Star, Upload, Loader2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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
import { useCreateFeaturedRequest } from '@/hooks/useFeaturedRequest';
import { uploadPaymentReceipt } from '@/hooks/useListings';

interface FeaturedRequestDialogProps {
  open: boolean;
  onClose: () => void;
  listingId: string;
  listingTitle: string;
}

export default function FeaturedRequestDialog({
  open,
  onClose,
  listingId,
  listingTitle,
}: FeaturedRequestDialogProps) {
  const [duration, setDuration] = useState<'7' | '30'>('7');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const createRequest = useCreateFeaturedRequest();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        toast({
          variant: 'destructive',
          title: 'Formato no válido',
          description: 'Solo se aceptan imágenes (JPG, PNG) o PDF',
        });
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: 'destructive',
          title: 'Archivo muy grande',
          description: 'El archivo no puede superar los 5MB',
        });
        return;
      }
      
      setReceiptFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!user || !receiptFile) return;

    setIsUploading(true);
    try {
      // Upload receipt
      const receiptUrl = await uploadPaymentReceipt(receiptFile, user.id);

      // Create request
      await createRequest.mutateAsync({
        listing_id: listingId,
        duration_days: parseInt(duration),
        receipt_url: receiptUrl,
      });

      toast({
        title: '¡Solicitud enviada!',
        description: 'Tu solicitud será revisada por un administrador.',
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
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-featured" />
            Destacar Anuncio
          </DialogTitle>
          <DialogDescription>
            Tu anuncio aparecerá primero en los resultados de búsqueda
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Listing info */}
          <div className="rounded-lg bg-muted p-3">
            <p className="text-sm font-medium">{listingTitle}</p>
          </div>

          {/* Duration selection */}
          <div className="space-y-3">
            <Label>Duración del destacado</Label>
            <RadioGroup value={duration} onValueChange={(v) => setDuration(v as '7' | '30')}>
              <div className="flex items-center space-x-3 rounded-lg border p-3 cursor-pointer hover:bg-muted/50">
                <RadioGroupItem value="7" id="7days" />
                <Label htmlFor="7days" className="flex-1 cursor-pointer">
                  <span className="font-medium">7 días</span>
                  <p className="text-sm text-muted-foreground">Ideal para ventas rápidas</p>
                </Label>
              </div>
              <div className="flex items-center space-x-3 rounded-lg border p-3 cursor-pointer hover:bg-muted/50">
                <RadioGroupItem value="30" id="30days" />
                <Label htmlFor="30days" className="flex-1 cursor-pointer">
                  <span className="font-medium">30 días</span>
                  <p className="text-sm text-muted-foreground">Mayor exposición y alcance</p>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Payment info */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Formas de pago disponibles: transferencia bancaria, billeteras electrónicas o QR. No se requiere tarjeta.
            </AlertDescription>
          </Alert>

          {/* Receipt upload */}
          <div className="space-y-3">
            <Label>Comprobante de pago</Label>
            <p className="text-sm text-muted-foreground">
              Subí una imagen o PDF del comprobante de tu pago. Tu anuncio será destacado una vez verificado.
            </p>
            <div className="flex items-center gap-3">
              <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/50 p-4 hover:border-primary hover:bg-muted/50">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Upload className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {receiptFile ? receiptFile.name : 'Seleccionar archivo'}
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!receiptFile || isUploading}
            className="flex-1 gap-2 bg-featured text-featured-foreground hover:bg-featured/90"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Star className="h-4 w-4" />
                Enviar Solicitud
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
