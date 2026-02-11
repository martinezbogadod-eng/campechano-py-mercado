import { useState } from 'react';
import { Flag, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useCreateReport } from '@/hooks/useReports';
import { useAuth } from '@/hooks/useAuth';

const REPORT_REASONS = [
  { value: 'off_topic', label: 'No relacionado con agricultura/servicios rurales' },
  { value: 'inappropriate', label: 'Contenido inapropiado u ofensivo' },
  { value: 'scam', label: 'Posible estafa o engaño' },
  { value: 'duplicate', label: 'Publicación duplicada' },
  { value: 'other', label: 'Otro motivo' },
];

interface ReportButtonProps {
  listingId: string;
  variant?: 'ghost' | 'outline';
  size?: 'sm' | 'default' | 'icon';
}

export default function ReportButton({ listingId, variant = 'ghost', size = 'sm' }: ReportButtonProps) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();
  const createReport = useCreateReport();

  if (!user) return null;

  const handleSubmit = async () => {
    if (!reason) {
      toast({ variant: 'destructive', title: 'Seleccioná un motivo' });
      return;
    }

    const label = REPORT_REASONS.find(r => r.value === reason)?.label || reason;
    const fullReason = details ? `${label}: ${details}` : label;

    try {
      await createReport.mutateAsync({ listingId, reason: fullReason });
      toast({
        title: 'Reporte enviado',
        description: 'Gracias por ayudar a mantener la comunidad. Un administrador revisará tu reporte.',
      });
      setOpen(false);
      setReason('');
      setDetails('');
    } catch {
      toast({ variant: 'destructive', title: 'Error', description: 'No se pudo enviar el reporte' });
    }
  };

  return (
    <>
      <Button variant={variant} size={size} onClick={() => setOpen(true)} className="gap-1 text-muted-foreground">
        <Flag className="h-4 w-4" />
        <span className="hidden sm:inline">Reportar</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reportar publicación</DialogTitle>
            <DialogDescription>
              Si esta publicación no cumple con los objetivos de Kamps Py (agricultura, producción, logística o servicios rurales), podés reportarla.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Motivo del reporte *</Label>
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccioná un motivo" />
                </SelectTrigger>
                <SelectContent>
                  {REPORT_REASONS.map(r => (
                    <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Detalles adicionales (opcional)</Label>
              <Textarea
                placeholder="Explicá brevemente por qué reportás esta publicación..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={3}
                maxLength={500}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={handleSubmit} disabled={createReport.isPending}>
              {createReport.isPending ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Enviando...</>
              ) : 'Enviar Reporte'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
