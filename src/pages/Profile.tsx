import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { useProfile, useUpdateProfile, ProfileType, PROFILE_TYPES } from '@/hooks/useProfile';
import { useUserTransactions, useConfirmTransaction, useCreateReview } from '@/hooks/useReputation';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { DEPARTMENTS } from '@/types/listing';
import { ArrowLeft, Loader2, Star, Check, HandshakeIcon } from 'lucide-react';
import AvatarUpload from '@/components/AvatarUpload';

const profileSchema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres').max(100, 'Máximo 100 caracteres'),
  profile_type: z.enum(['productor', 'tecnico', 'proveedor']),
  department: z.string().min(1, 'Selecciona un departamento'),
  city: z.string().min(2, 'Mínimo 2 caracteres').max(50, 'Máximo 50 caracteres'),
  phone_whatsapp: z.string().regex(/^595\d{9}$/, 'Formato: 595XXXXXXXXX'),
  description: z.string().max(500, 'Máximo 500 caracteres').optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const Profile = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: transactions } = useUserTransactions();
  const updateProfile = useUpdateProfile();
  const confirmTransaction = useConfirmTransaction();
  const createReview = useCreateReview();
  const { toast } = useToast();

  const [reviewDialog, setReviewDialog] = useState<{
    transactionId: string;
    reviewedId: string;
  } | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // Sync avatar URL when profile loads
  useEffect(() => {
    if (profile?.avatar_url) {
      setAvatarUrl(profile.avatar_url);
    }
  }, [profile?.avatar_url]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name || '',
        profile_type: profile.profile_type || undefined,
        department: profile.department || '',
        city: profile.city || '',
        phone_whatsapp: profile.phone_whatsapp || '',
        description: profile.description || '',
      });
    }
  }, [profile, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await updateProfile.mutateAsync(data);
      toast({
        title: 'Perfil actualizado',
        description: 'Tus datos han sido guardados correctamente.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo actualizar el perfil',
      });
    }
  };

  const handleConfirmTransaction = async (transactionId: string) => {
    try {
      await confirmTransaction.mutateAsync(transactionId);
      toast({
        title: 'Operación confirmada',
        description: 'La operación ha sido confirmada.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo confirmar la operación',
      });
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewDialog) return;
    
    try {
      await createReview.mutateAsync({
        transactionId: reviewDialog.transactionId,
        reviewedId: reviewDialog.reviewedId,
        rating,
        comment: comment || undefined,
      });
      toast({
        title: 'Reseña enviada',
        description: 'Gracias por tu calificación.',
      });
      setReviewDialog(null);
      setRating(5);
      setComment('');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo enviar la reseña',
      });
    }
  };

  if (loading || profileLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const getOtherPartyId = (tx: typeof transactions extends (infer T)[] ? T : never) => {
    return tx.buyer_id === user?.id ? tx.seller_id : tx.buyer_id;
  };

  const canConfirm = (tx: typeof transactions extends (infer T)[] ? T : never) => {
    if (tx.status === 'completed' || tx.status === 'cancelled') return false;
    const isBuyer = tx.buyer_id === user?.id;
    return isBuyer ? !tx.buyer_confirmed : !tx.seller_confirmed;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
        </div>

        <div className="mx-auto max-w-2xl space-y-8">
          {/* Profile Form */}
          <div className="rounded-lg border bg-card p-6">
            <h1 className="mb-6 text-2xl font-bold text-foreground">Mi Perfil</h1>

            <div className="mb-6">
              <AvatarUpload
                currentAvatarUrl={avatarUrl}
                userName={watch('name') || profile?.name}
                onAvatarChange={setAvatarUrl}
              />
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre o Razón Social *</Label>
                <Input
                  id="name"
                  placeholder="Ej: Juan Pérez o Agrícola ABC S.A."
                  {...register('name')}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Tipo de Perfil *</Label>
                <Select
                  value={watch('profile_type')}
                  onValueChange={(value) => setValue('profile_type', value as ProfileType)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(PROFILE_TYPES).map(([key, { label, emoji }]) => (
                      <SelectItem key={key} value={key}>
                        {emoji} {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.profile_type && (
                  <p className="text-sm text-destructive">{errors.profile_type.message}</p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Departamento *</Label>
                  <Select
                    value={watch('department')}
                    onValueChange={(value) => setValue('department', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona departamento" />
                    </SelectTrigger>
                    <SelectContent>
                      {DEPARTMENTS.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.department && (
                    <p className="text-sm text-destructive">{errors.department.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">Ciudad/Distrito *</Label>
                  <Input
                    id="city"
                    placeholder="Ej: Santa Rita"
                    {...register('city')}
                  />
                  {errors.city && (
                    <p className="text-sm text-destructive">{errors.city.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone_whatsapp">Teléfono WhatsApp (privado) *</Label>
                <Input
                  id="phone_whatsapp"
                  placeholder="595981234567"
                  {...register('phone_whatsapp')}
                />
                <p className="text-xs text-muted-foreground">
                  Este número no se muestra públicamente. Solo se usa para contacto desde el chat.
                </p>
                {errors.phone_whatsapp && (
                  <p className="text-sm text-destructive">{errors.phone_whatsapp.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción breve (opcional)</Label>
                <Textarea
                  id="description"
                  placeholder="Cuéntanos sobre tu actividad..."
                  rows={3}
                  {...register('description')}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description.message}</p>
                )}
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  'Guardar Perfil'
                )}
              </Button>
            </form>
          </div>

          {/* Transactions */}
          {transactions && transactions.length > 0 && (
            <div className="rounded-lg border bg-card p-6">
              <h2 className="mb-4 text-xl font-bold text-foreground">
                <HandshakeIcon className="mr-2 inline h-5 w-5" />
                Mis Operaciones
              </h2>

              <div className="space-y-4">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div>
                      <p className="font-medium">
                        {tx.listing?.title || 'Anuncio eliminado'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {tx.buyer_id === user?.id ? 'Compra' : 'Venta'} •{' '}
                        {new Date(tx.created_at).toLocaleDateString('es-PY')}
                      </p>
                      <div className="mt-1 flex gap-2">
                        {tx.buyer_confirmed && (
                          <span className="text-xs text-green-600">✓ Comprador confirmó</span>
                        )}
                        {tx.seller_confirmed && (
                          <span className="text-xs text-green-600">✓ Vendedor confirmó</span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {canConfirm(tx) && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleConfirmTransaction(tx.id)}
                          disabled={confirmTransaction.isPending}
                        >
                          <Check className="mr-1 h-4 w-4" />
                          Confirmar
                        </Button>
                      )}
                      
                      {tx.status === 'completed' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setReviewDialog({
                            transactionId: tx.id,
                            reviewedId: getOtherPartyId(tx),
                          })}
                        >
                          <Star className="mr-1 h-4 w-4" />
                          Calificar
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Review Dialog */}
      <Dialog open={!!reviewDialog} onOpenChange={() => setReviewDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Calificar Operación</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Calificación</Label>
              <div className="mt-2 flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="review-comment">Comentario (opcional)</Label>
              <Textarea
                id="review-comment"
                placeholder="Cuéntanos cómo fue tu experiencia..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewDialog(null)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmitReview} disabled={createReview.isPending}>
              {createReview.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                'Enviar Reseña'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
