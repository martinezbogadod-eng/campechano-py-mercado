import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { useProfile, useUpdateProfile, ProfileType, PROFILE_TYPES } from '@/hooks/useProfile';
import { useUserRoles, ROLE_INFO, SelectableRole } from '@/hooks/useUserRoles';
import { useUserTransactions, useConfirmTransaction, useCreateReview } from '@/hooks/useReputation';
import { useMyRoleChangeRequests, useCreateRoleChangeRequest } from '@/hooks/useRoleChangeRequests';
import { useMyCapabilities, useRequestCapability, ALL_CAPABILITIES, CAPABILITY_INFO, Capability } from '@/hooks/useCapabilities';
import { useListings } from '@/hooks/useListings';
import { useProfileById } from '@/hooks/useProfile';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
import { ArrowLeft, Loader2, Star, Check, HandshakeIcon, Send, ShieldCheck, FileText } from 'lucide-react';
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

const SELECTABLE_ROLES: SelectableRole[] = ['consumidor', 'productor_minorista', 'productor_mayorista', 'prestador'];

const Profile = () => {
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: profileWithStats } = useProfileById(user?.id);
  const { data: roles } = useUserRoles();
  const { data: transactions } = useUserTransactions();
  const { data: roleRequests } = useMyRoleChangeRequests();
  const { data: capabilities } = useMyCapabilities();
  const { data: allListings } = useListings();
  const updateProfile = useUpdateProfile();
  const confirmTransaction = useConfirmTransaction();
  const createReview = useCreateReview();
  const createRoleChangeRequest = useCreateRoleChangeRequest();
  const requestCapability = useRequestCapability();
  const { toast } = useToast();

  const [reviewDialog, setReviewDialog] = useState<{
    transactionId: string;
    reviewedId: string;
  } | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const [showRoleRequest, setShowRoleRequest] = useState(false);
  const [requestedRole, setRequestedRole] = useState<string>('');
  const [requestReason, setRequestReason] = useState('');

  const currentRole = roles?.find(r => r !== 'admin' && r !== 'productor') as SelectableRole | undefined;
  const pendingRequest = roleRequests?.find(r => r.status === 'pending');

  // Count user's listings
  const myListingsCount = allListings?.filter(l => l.user_id === user?.id).length || 0;

  // Active capabilities
  const activeCapabilities = capabilities?.filter(c => c.status === 'approved') || [];
  const pendingCapabilities = capabilities?.filter(c => c.status === 'pending') || [];

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
      toast({ title: t('profile.updated'), description: t('common.success') });
    } catch (error) {
      toast({ variant: 'destructive', title: t('common.error'), description: 'No se pudo actualizar el perfil' });
    }
  };

  const handleConfirmTransaction = async (transactionId: string) => {
    try {
      await confirmTransaction.mutateAsync(transactionId);
      toast({ title: 'Operación confirmada', description: 'La operación ha sido confirmada.' });
    } catch (error) {
      toast({ variant: 'destructive', title: t('common.error'), description: 'No se pudo confirmar la operación' });
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
      toast({ title: 'Reseña enviada', description: 'Gracias por tu calificación.' });
      setReviewDialog(null);
      setRating(5);
      setComment('');
    } catch (error) {
      toast({ variant: 'destructive', title: t('common.error'), description: 'No se pudo enviar la reseña' });
    }
  };

  const handleSubmitRoleRequest = async () => {
    if (!requestedRole || !requestReason.trim()) {
      toast({ variant: 'destructive', title: t('common.error'), description: t('profile.requestReason') });
      return;
    }
    try {
      await createRoleChangeRequest.mutateAsync({
        fromRole: currentRole || 'consumidor',
        toRole: requestedRole,
        reason: requestReason.trim(),
      });
      toast({ title: t('profile.requestSent'), description: t('profile.requestSentDesc') });
      setShowRoleRequest(false);
      setRequestedRole('');
      setRequestReason('');
    } catch (error) {
      toast({ variant: 'destructive', title: t('common.error'), description: 'No se pudo enviar la solicitud' });
    }
  };

  const handleRequestCapability = async (cap: Capability) => {
    try {
      await requestCapability.mutateAsync(cap);
      toast({ title: 'Solicitud enviada', description: 'Tu solicitud de capacidad será revisada por un administrador.' });
    } catch (error) {
      toast({ variant: 'destructive', title: t('common.error'), description: 'No se pudo solicitar la capacidad' });
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
            {t('common.back')}
          </Button>
        </div>

        <div className="mx-auto max-w-2xl space-y-8">
          {/* Profile Stats Summary */}
          <div className="rounded-lg border bg-card p-6">
            <h2 className="mb-4 text-lg font-bold text-foreground">📊 Resumen</h2>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">{myListingsCount}</p>
                <p className="text-xs text-muted-foreground">Publicaciones</p>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1">
                  <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                  <p className="text-2xl font-bold text-foreground">
                    {profileWithStats?.avgRating ? profileWithStats.avgRating.toFixed(1) : '—'}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  Calificación ({profileWithStats?.reviewCount || 0} reseñas)
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{profileWithStats?.completedOperations || 0}</p>
                <p className="text-xs text-muted-foreground">Operaciones</p>
              </div>
            </div>
          </div>

          {/* Capabilities Section */}
          <div className="rounded-lg border bg-card p-6">
            <h2 className="mb-4 text-lg font-bold text-foreground flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Capacidades Activas
            </h2>

            {activeCapabilities.length > 0 ? (
              <div className="flex flex-wrap gap-2 mb-4">
                {activeCapabilities.map(cap => {
                  const info = CAPABILITY_INFO[cap.capability as Capability];
                  return info ? (
                    <Badge key={cap.id} className="bg-primary/10 text-primary border border-primary/20 px-3 py-1">
                      {info.label}
                    </Badge>
                  ) : null;
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground mb-4">No tenés capacidades activas aún.</p>
            )}

            {pendingCapabilities.length > 0 && (
              <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950/30">
                <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Solicitudes pendientes:</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {pendingCapabilities.map(cap => {
                    const info = CAPABILITY_INFO[cap.capability as Capability];
                    return info ? (
                      <Badge key={cap.id} variant="outline" className="text-xs">
                        {info.label}
                      </Badge>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            {/* Request new capabilities */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Solicitar nuevas capacidades:</p>
              <div className="flex flex-wrap gap-2">
                {ALL_CAPABILITIES.filter(cap => 
                  !capabilities?.some(c => c.capability === cap)
                ).map(cap => {
                  const info = CAPABILITY_INFO[cap];
                  return (
                    <Button
                      key={cap}
                      variant="outline"
                      size="sm"
                      onClick={() => handleRequestCapability(cap)}
                      disabled={requestCapability.isPending}
                    >
                      {info.emoji} {info.label}
                    </Button>
                  );
                })}
                {ALL_CAPABILITIES.every(cap => capabilities?.some(c => c.capability === cap)) && (
                  <p className="text-sm text-muted-foreground">Ya tenés todas las capacidades solicitadas.</p>
                )}
              </div>
            </div>
          </div>

          {/* Current Role Section */}
          <div className="rounded-lg border bg-card p-6">
            <h2 className="mb-4 text-lg font-bold text-foreground">{t('profile.currentRole')}</h2>
            {currentRole && (
              <div className="flex items-center gap-3 mb-4">
                <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium ${ROLE_INFO[currentRole]?.color || 'bg-muted text-muted-foreground'}`}>
                  {ROLE_INFO[currentRole]?.emoji} {t(`role.${currentRole}`)}
                </span>
              </div>
            )}

            {pendingRequest && (
              <div className="rounded-md border border-yellow-200 bg-yellow-50 p-3 mb-4">
                <p className="text-sm font-medium text-yellow-800">{t('profile.requestPending')}</p>
                <p className="text-xs text-yellow-700 mt-1">
                  {t(`role.${pendingRequest.from_role}`)} → {t(`role.${pendingRequest.to_role}`)}
                </p>
              </div>
            )}

            {roleRequests && roleRequests.length > 0 && !pendingRequest && (
              <>
                {roleRequests[0].status === 'approved' && (
                  <div className="rounded-md border border-green-200 bg-green-50 p-3 mb-4">
                    <p className="text-sm font-medium text-green-800">{t('profile.requestApproved')}</p>
                  </div>
                )}
                {roleRequests[0].status === 'rejected' && (
                  <div className="rounded-md border border-red-200 bg-red-50 p-3 mb-4">
                    <p className="text-sm font-medium text-red-800">{t('profile.requestRejected')}</p>
                    {roleRequests[0].admin_notes && (
                      <p className="text-xs text-red-700 mt-1">{roleRequests[0].admin_notes}</p>
                    )}
                  </div>
                )}
              </>
            )}

            {!pendingRequest && (
              <Button variant="outline" size="sm" onClick={() => setShowRoleRequest(true)}>
                {t('profile.requestChange')}
              </Button>
            )}
          </div>

          {/* Profile Form */}
          <div className="rounded-lg border bg-card p-6">
            <h1 className="mb-6 text-2xl font-bold text-foreground">{t('profile.title')}</h1>

            <div className="mb-6">
              <AvatarUpload
                currentAvatarUrl={avatarUrl}
                userName={watch('name') || profile?.name}
                onAvatarChange={setAvatarUrl}
              />
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">{t('profile.name')} *</Label>
                <Input id="name" placeholder="Ej: Juan Pérez o Agrícola ABC S.A." {...register('name')} />
                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>{t('profile.type')} *</Label>
                <Select value={watch('profile_type')} onValueChange={(value) => setValue('profile_type', value as ProfileType)}>
                  <SelectTrigger><SelectValue placeholder="Selecciona tipo" /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(PROFILE_TYPES).map(([key, { label, emoji }]) => (
                      <SelectItem key={key} value={key}>{emoji} {label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.profile_type && <p className="text-sm text-destructive">{errors.profile_type.message}</p>}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>{t('profile.department')} *</Label>
                  <Select value={watch('department')} onValueChange={(value) => setValue('department', value)}>
                    <SelectTrigger><SelectValue placeholder="Selecciona departamento" /></SelectTrigger>
                    <SelectContent>
                      {DEPARTMENTS.map((dept) => (<SelectItem key={dept} value={dept}>{dept}</SelectItem>))}
                    </SelectContent>
                  </Select>
                  {errors.department && <p className="text-sm text-destructive">{errors.department.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">{t('profile.city')} *</Label>
                  <Input id="city" placeholder="Ej: Santa Rita" {...register('city')} />
                  {errors.city && <p className="text-sm text-destructive">{errors.city.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone_whatsapp">{t('profile.phone')} *</Label>
                <Input id="phone_whatsapp" placeholder="595981234567" {...register('phone_whatsapp')} />
                <p className="text-xs text-muted-foreground">{t('profile.phoneNote')}</p>
                {errors.phone_whatsapp && <p className="text-sm text-destructive">{errors.phone_whatsapp.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">{t('profile.description')}</Label>
                <Textarea id="description" placeholder="Cuéntanos sobre tu actividad..." rows={3} {...register('description')} />
                {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t('profile.saving')}</>) : t('profile.save')}
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
                  <div key={tx.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <p className="font-medium">{tx.listing?.title || 'Anuncio eliminado'}</p>
                      <p className="text-sm text-muted-foreground">
                        {tx.buyer_id === user?.id ? 'Compra' : 'Venta'} •{' '}
                        {new Date(tx.created_at).toLocaleDateString('es-PY')}
                      </p>
                      <div className="mt-1 flex gap-2">
                        {tx.buyer_confirmed && <span className="text-xs text-green-600">✓ Comprador confirmó</span>}
                        {tx.seller_confirmed && <span className="text-xs text-green-600">✓ Vendedor confirmó</span>}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {canConfirm(tx) && (
                        <Button size="sm" variant="outline" onClick={() => handleConfirmTransaction(tx.id)} disabled={confirmTransaction.isPending}>
                          <Check className="mr-1 h-4 w-4" />Confirmar
                        </Button>
                      )}
                      {tx.status === 'completed' && (
                        <Button size="sm" variant="outline" onClick={() => setReviewDialog({ transactionId: tx.id, reviewedId: getOtherPartyId(tx) })}>
                          <Star className="mr-1 h-4 w-4" />Calificar
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
                  <button key={star} type="button" onClick={() => setRating(star)} className="focus:outline-none">
                    <Star className={`h-8 w-8 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="review-comment">Comentario (opcional)</Label>
              <Textarea id="review-comment" placeholder="Cuéntanos cómo fue tu experiencia..." value={comment} onChange={(e) => setComment(e.target.value)} rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewDialog(null)}>{t('listing.cancel')}</Button>
            <Button onClick={handleSubmitReview} disabled={createReview.isPending}>
              {createReview.isPending ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t('common.loading')}</>) : 'Enviar Reseña'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Role Change Request Dialog */}
      <Dialog open={showRoleRequest} onOpenChange={setShowRoleRequest}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('profile.requestChange')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t('profile.selectNewRole')}</Label>
              <Select value={requestedRole} onValueChange={setRequestedRole}>
                <SelectTrigger><SelectValue placeholder={t('profile.selectNewRole')} /></SelectTrigger>
                <SelectContent>
                  {SELECTABLE_ROLES.filter(r => r !== currentRole).map(role => (
                    <SelectItem key={role} value={role}>{ROLE_INFO[role]?.emoji} {t(`role.${role}`)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t('profile.requestReason')}</Label>
              <Textarea placeholder={t('profile.requestReasonPlaceholder')} value={requestReason} onChange={(e) => setRequestReason(e.target.value)} rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRoleRequest(false)}>{t('listing.cancel')}</Button>
            <Button onClick={handleSubmitRoleRequest} disabled={createRoleChangeRequest.isPending || !requestedRole || !requestReason.trim()}>
              {createRoleChangeRequest.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              {t('profile.sendRequest')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
