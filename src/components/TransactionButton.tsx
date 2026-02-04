import { useState } from 'react';
import { HandshakeIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useCreateTransaction } from '@/hooks/useReputation';
import { useAuth } from '@/hooks/useAuth';

interface TransactionButtonProps {
  listingId: string;
  listingTitle: string;
  sellerId: string;
}

const TransactionButton = ({ listingId, listingTitle, sellerId }: TransactionButtonProps) => {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const createTransaction = useCreateTransaction();

  const handleCreate = async () => {
    try {
      await createTransaction.mutateAsync({ listingId, sellerId });
      toast({
        title: 'Operación registrada',
        description: 'Se notificará al vendedor para confirmar la operación.',
      });
      setOpen(false);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo registrar la operación',
      });
    }
  };

  if (!user || user.id === sellerId) {
    return null;
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="gap-2"
      >
        <HandshakeIcon className="h-4 w-4" />
        Marcar como operación concretada
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Operación</DialogTitle>
            <DialogDescription>
              ¿Concretaste una operación por "{listingTitle}"?
            </DialogDescription>
          </DialogHeader>

          <p className="text-sm text-muted-foreground">
            Al marcar esta operación como concretada, se notificará al vendedor 
            para que confirme. Una vez que ambas partes confirmen, podrán 
            calificarse mutuamente.
          </p>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleCreate}
              disabled={createTransaction.isPending}
            >
              {createTransaction.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registrando...
                </>
              ) : (
                'Confirmar Operación'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TransactionButton;
