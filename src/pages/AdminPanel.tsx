import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield, Star, Trash2, Check, X, Flag, UserCog, Users, BarChart3,
  Ban, CheckCircle, Eye, ShieldCheck,
} from 'lucide-react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import {
  useIsAdmin, useAllListings, useFeaturedRequests,
  useApproveFeaturedRequest, useRejectFeaturedRequest,
  useToggleListingFeatured, useAdminDeleteListing,
} from '@/hooks/useAdmin';
import { useAdminReports, useUpdateReport } from '@/hooks/useReports';
import { useAdminRoleChangeRequests, useApproveRoleChange, useRejectRoleChange } from '@/hooks/useRoleChangeRequests';
import { useAdminUsers, useToggleUserSuspension } from '@/hooks/useAdminUsers';
import { ROLE_INFO, SelectableRole } from '@/hooks/useUserRoles';
import { useAllCapabilityRequests, useUpdateCapabilityStatus, CAPABILITY_INFO, Capability } from '@/hooks/useCapabilities';

export default function AdminPanel() {
  const [deleteListingId, setDeleteListingId] = useState<string | null>(null);
  const [rejectRequestId, setRejectRequestId] = useState<string | null>(null);
  const [suspendUserId, setSuspendUserId] = useState<{ id: string; suspended: boolean } | null>(null);

  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: listings, isLoading: listingsLoading } = useAllListings();
  const { data: requests, isLoading: requestsLoading } = useFeaturedRequests();
  const { data: reports, isLoading: reportsLoading } = useAdminReports();
  const { data: roleChangeRequests, isLoading: roleRequestsLoading } = useAdminRoleChangeRequests();
  const { data: adminUsers, isLoading: usersLoading } = useAdminUsers();
  const { data: capabilityRequests, isLoading: capsLoading } = useAllCapabilityRequests();
  const updateReport = useUpdateReport();
  const approveRoleChange = useApproveRoleChange();
  const rejectRoleChange = useRejectRoleChange();
  const toggleSuspension = useToggleUserSuspension();
  const updateCapability = useUpdateCapabilityStatus();
  const { toast } = useToast();

  const approveFeatured = useApproveFeaturedRequest();
  const rejectFeatured = useRejectFeaturedRequest();
  const toggleFeatured = useToggleListingFeatured();
  const deleteListing = useAdminDeleteListing();

  if (authLoading || adminLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-12">
          <div className="text-center">
            <Shield className="mx-auto h-16 w-16 text-muted-foreground" />
            <h1 className="mt-4 text-2xl font-bold">Acceso Restringido</h1>
            <p className="mt-2 text-muted-foreground">No tienes permisos para acceder a esta sección.</p>
            <Button onClick={() => navigate('/')} className="mt-4">{t('common.back')}</Button>
          </div>
        </main>
      </div>
    );
  }

  const pendingRequests = requests?.filter((r) => r.status === 'pending') || [];
  const pendingReports = reports?.filter((r) => r.status === 'pending') || [];
  const pendingRoleRequests = roleChangeRequests?.filter((r) => r.status === 'pending') || [];
  const pendingCapRequests = capabilityRequests?.filter((r) => r.status === 'pending') || [];
  const featuredListings = listings?.filter((l) => l.featured) || [];
  const totalUsers = adminUsers?.length || 0;
  const suspendedUsers = adminUsers?.filter(u => u.suspended).length || 0;

  const handleApproveRequest = async (requestId: string, listingId: string, durationDays: number) => {
    try {
      await approveFeatured.mutateAsync({ requestId, listingId, durationDays });
      toast({ title: 'Solicitud aprobada', description: 'El anuncio ha sido destacado por 7 días.' });
    } catch {
      toast({ variant: 'destructive', title: t('common.error') });
    }
  };

  const handleRejectRequest = async () => {
    if (!rejectRequestId) return;
    try {
      await rejectFeatured.mutateAsync({ requestId: rejectRequestId });
      toast({ title: 'Solicitud rechazada' });
      setRejectRequestId(null);
    } catch {
      toast({ variant: 'destructive', title: t('common.error') });
    }
  };

  const handleToggleFeatured = async (listingId: string, currentFeatured: boolean) => {
    try {
      await toggleFeatured.mutateAsync({ listingId, featured: !currentFeatured });
      toast({ title: currentFeatured ? 'Destacado removido' : 'Anuncio destacado (7 días)' });
    } catch {
      toast({ variant: 'destructive', title: t('common.error') });
    }
  };

  const handleDeleteListing = async () => {
    if (!deleteListingId) return;
    try {
      await deleteListing.mutateAsync(deleteListingId);
      toast({ title: 'Anuncio eliminado' });
      setDeleteListingId(null);
    } catch {
      toast({ variant: 'destructive', title: t('common.error') });
    }
  };

  const handleApproveRoleChange = async (requestId: string, userId: string, toRole: string) => {
    try {
      await approveRoleChange.mutateAsync({ requestId, userId, toRole });
      toast({ title: t('common.approved'), description: 'El perfil ha sido actualizado.' });
    } catch {
      toast({ variant: 'destructive', title: t('common.error') });
    }
  };

  const handleRejectRoleChange = async (requestId: string) => {
    try {
      await rejectRoleChange.mutateAsync({ requestId });
      toast({ title: t('common.rejected') });
    } catch {
      toast({ variant: 'destructive', title: t('common.error') });
    }
  };

  const handleDismissReport = async (reportId: string) => {
    try {
      await updateReport.mutateAsync({ reportId, status: 'dismissed' });
      toast({ title: 'Reporte descartado' });
    } catch {
      toast({ variant: 'destructive', title: t('common.error') });
    }
  };

  const handleAcceptReport = async (reportId: string, listingId: string) => {
    try {
      await deleteListing.mutateAsync(listingId);
      await updateReport.mutateAsync({ reportId, status: 'accepted', adminNotes: 'Publicación eliminada' });
      toast({ title: 'Publicación eliminada por reporte' });
    } catch {
      toast({ variant: 'destructive', title: t('common.error') });
    }
  };

  const handleToggleSuspend = async () => {
    if (!suspendUserId) return;
    try {
      await toggleSuspension.mutateAsync({ userId: suspendUserId.id, suspended: !suspendUserId.suspended });
      toast({ title: suspendUserId.suspended ? 'Usuario reactivado' : 'Usuario suspendido' });
      setSuspendUserId(null);
    } catch {
      toast({ variant: 'destructive', title: t('common.error') });
    }
  };

  const getRoleBadge = (role: string) => {
    const info = ROLE_INFO[role as SelectableRole];
    if (role === 'admin') return <Badge className="bg-purple-100 text-purple-800">🛡️ Admin</Badge>;
    if (info) return <Badge className={info.color}>{info.emoji} {info.label}</Badge>;
    return <Badge variant="secondary">{role}</Badge>;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6">
        <div className="mb-6">
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <Shield className="h-6 w-6 text-primary" />
            {t('admin.title')}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Gestión integral de la plataforma KAMPS PY</p>
        </div>

        {/* Dashboard Metrics */}
        <div className="mb-6 grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <Users className="h-3 w-3" /> Usuarios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{totalUsers}</p>
              {suspendedUsers > 0 && (
                <p className="text-xs text-destructive">{suspendedUsers} suspendidos</p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <BarChart3 className="h-3 w-3" /> Publicaciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{listings?.length || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <Star className="h-3 w-3" /> Destacados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-featured">{featuredListings.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <Flag className="h-3 w-3" /> Reportes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-destructive">{pendingReports.length}</p>
              <p className="text-xs text-muted-foreground">pendientes</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <UserCog className="h-3 w-3" /> Cambios Rol
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{pendingRoleRequests.length}</p>
              <p className="text-xs text-muted-foreground">pendientes</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <Star className="h-3 w-3" /> Sol. Destacados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{pendingRequests.length}</p>
              <p className="text-xs text-muted-foreground">pendientes</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users">
          <TabsList className="flex-wrap h-auto gap-1">
            <TabsTrigger value="users">
              <Users className="mr-1 h-4 w-4" /> Usuarios
            </TabsTrigger>
            <TabsTrigger value="listings">{t('admin.listings')}</TabsTrigger>
            <TabsTrigger value="featured" className="relative">
              {t('admin.featured')}
              {pendingRequests.length > 0 && (
                <Badge className="ml-1 bg-accent text-accent-foreground text-xs">{pendingRequests.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="reports" className="relative">
              {t('admin.reports')}
              {pendingReports.length > 0 && (
                <Badge className="ml-1 bg-destructive text-destructive-foreground text-xs">{pendingReports.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="role-requests" className="relative">
              {t('admin.roleRequests')}
              {pendingRoleRequests.length > 0 && (
                <Badge className="ml-1 bg-accent text-accent-foreground text-xs">{pendingRoleRequests.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="capabilities" className="relative">
              <ShieldCheck className="mr-1 h-4 w-4" /> Capacidades
              {pendingCapRequests.length > 0 && (
                <Badge className="ml-1 bg-accent text-accent-foreground text-xs">{pendingCapRequests.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="mt-4">
            {usersLoading ? (
              <div className="flex justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : (
              <div className="rounded-lg border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuario</TableHead>
                      <TableHead>Ubicación</TableHead>
                      <TableHead>Roles</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Registro</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {adminUsers?.map((u) => (
                      <TableRow key={u.id} className={u.suspended ? 'opacity-60' : ''}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {u.avatar_url ? (
                              <img src={u.avatar_url} alt="" className="h-8 w-8 rounded-full object-cover" />
                            ) : (
                              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                                {(u.name || '?')[0]?.toUpperCase()}
                              </div>
                            )}
                            <span className="font-medium truncate max-w-[150px]">{u.name || 'Sin nombre'}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {u.city && u.department ? `${u.city}, ${u.department}` : u.department || '-'}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {u.roles.length > 0 ? u.roles.map(r => (
                              <span key={r}>{getRoleBadge(r)}</span>
                            )) : <Badge variant="outline">Sin rol</Badge>}
                          </div>
                        </TableCell>
                        <TableCell>
                          {u.suspended ? (
                            <Badge variant="destructive"><Ban className="mr-1 h-3 w-3" />Suspendido</Badge>
                          ) : (
                            <Badge variant="secondary"><CheckCircle className="mr-1 h-3 w-3" />Activo</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(u.created_at).toLocaleDateString('es-PY')}
                        </TableCell>
                        <TableCell className="text-right">
                          {!u.roles.includes('admin') && (
                            <Button
                              variant={u.suspended ? 'default' : 'destructive'}
                              size="sm"
                              onClick={() => setSuspendUserId({ id: u.id, suspended: u.suspended })}
                            >
                              {u.suspended ? (
                                <><CheckCircle className="mr-1 h-3 w-3" /> Reactivar</>
                              ) : (
                                <><Ban className="mr-1 h-3 w-3" /> Suspender</>
                              )}
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          {/* Listings Tab */}
          <TabsContent value="listings" className="mt-4">
            {listingsLoading ? (
              <div className="flex justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : (
              <div className="rounded-lg border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {listings?.map((listing) => (
                      <TableRow key={listing.id}>
                        <TableCell className="font-medium max-w-xs truncate">
                          <button
                            className="text-left hover:text-primary transition-colors"
                            onClick={() => navigate(`/anuncio/${listing.id}`)}
                          >
                            {listing.title}
                          </button>
                        </TableCell>
                        <TableCell>{listing.category}</TableCell>
                        <TableCell>
                          {listing.featured ? (
                            <Badge className="bg-featured text-featured-foreground">
                              <Star className="mr-1 h-3 w-3" /> ⭐ {t('listing.featured')}
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Normal</Badge>
                          )}
                        </TableCell>
                        <TableCell>{new Date(listing.created_at).toLocaleDateString('es-PY')}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="sm" onClick={() => navigate(`/anuncio/${listing.id}`)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleToggleFeatured(listing.id, listing.featured)}>
                              <Star className={`h-4 w-4 ${listing.featured ? 'fill-featured text-featured' : ''}`} />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => setDeleteListingId(listing.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          {/* Featured Requests Tab */}
          <TabsContent value="featured" className="mt-4">
            {requestsLoading ? (
              <div className="flex justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : requests?.length === 0 ? (
              <div className="rounded-lg border p-8 text-center">
                <p className="text-muted-foreground">{t('admin.noRequests')}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {requests?.map((request) => (
                  <Card key={request.id}>
                    <CardContent className="p-4">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex-1">
                          <p className="font-medium">{request.listing?.title || 'Anuncio eliminado'}</p>
                          <div className="mt-1 flex flex-wrap gap-2 text-sm text-muted-foreground">
                            <span>7 días</span>
                            <span>•</span>
                            <span>{new Date(request.created_at).toLocaleDateString('es-PY')}</span>
                            <span>•</span>
                            <Badge variant={request.status === 'pending' ? 'secondary' : request.status === 'approved' ? 'default' : 'destructive'}>
                              {request.status === 'pending' ? t('common.pending') : request.status === 'approved' ? t('common.approved') : t('common.rejected')}
                            </Badge>
                          </div>
                        </div>
                        {request.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => handleApproveRequest(request.id, request.listing_id, 7)} disabled={approveFeatured.isPending}>
                              <Check className="mr-1 h-4 w-4" /> {t('common.approve')}
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => setRejectRequestId(request.id)}>
                              <X className="mr-1 h-4 w-4" /> {t('common.reject')}
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="mt-4">
            {reportsLoading ? (
              <div className="flex justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : !reports?.length ? (
              <div className="rounded-lg border p-8 text-center">
                <p className="text-muted-foreground">{t('admin.noRequests')}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reports.map((report) => (
                  <Card key={report.id}>
                    <CardContent className="p-4">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Flag className="h-4 w-4 text-destructive" />
                            <p className="font-medium">{report.listing?.title || 'Anuncio eliminado'}</p>
                            <Badge variant={report.status === 'pending' ? 'secondary' : report.status === 'accepted' ? 'destructive' : 'outline'}>
                              {report.status === 'pending' ? t('common.pending') : report.status === 'accepted' ? 'Aceptado' : 'Descartado'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{report.reason}</p>
                          <p className="text-xs text-muted-foreground mt-1">{new Date(report.created_at).toLocaleDateString('es-PY')}</p>
                        </div>
                        {report.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button size="sm" variant="destructive" onClick={() => report.listing && handleAcceptReport(report.id, report.listing_id)}>
                              <Trash2 className="mr-1 h-4 w-4" /> Eliminar anuncio
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleDismissReport(report.id)}>
                              Descartar
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Role Change Requests Tab */}
          <TabsContent value="role-requests" className="mt-4">
            {roleRequestsLoading ? (
              <div className="flex justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : !roleChangeRequests?.length ? (
              <div className="rounded-lg border p-8 text-center">
                <p className="text-muted-foreground">{t('admin.noRequests')}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {roleChangeRequests.map((req) => (
                  <Card key={req.id}>
                    <CardContent className="p-4">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <UserCog className="h-4 w-4 text-primary" />
                            <p className="font-medium">
                              {t(`role.${req.from_role}`)} → {t(`role.${req.to_role}`)}
                            </p>
                            <Badge variant={req.status === 'pending' ? 'secondary' : req.status === 'approved' ? 'default' : 'destructive'}>
                              {req.status === 'pending' ? t('common.pending') : req.status === 'approved' ? t('common.approved') : t('common.rejected')}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{t('admin.reason')}: {req.reason}</p>
                          <p className="text-xs text-muted-foreground mt-1">{new Date(req.created_at).toLocaleDateString('es-PY')}</p>
                        </div>
                        {req.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => handleApproveRoleChange(req.id, req.user_id, req.to_role)} disabled={approveRoleChange.isPending}>
                              <Check className="mr-1 h-4 w-4" /> {t('common.approve')}
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleRejectRoleChange(req.id)} disabled={rejectRoleChange.isPending}>
                              <X className="mr-1 h-4 w-4" /> {t('common.reject')}
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Capabilities Tab */}
          <TabsContent value="capabilities" className="mt-4">
            {capsLoading ? (
              <div className="flex justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : !capabilityRequests?.length ? (
              <div className="rounded-lg border p-8 text-center">
                <p className="text-muted-foreground">No hay solicitudes de capacidades.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {capabilityRequests.map((req) => {
                  const capInfo = CAPABILITY_INFO[req.capability as Capability];
                  return (
                    <Card key={req.id}>
                      <CardContent className="p-4">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <ShieldCheck className="h-4 w-4 text-primary" />
                              <p className="font-medium">
                                {capInfo?.emoji} {capInfo?.label || req.capability}
                              </p>
                              <Badge variant={req.status === 'pending' ? 'secondary' : req.status === 'approved' ? 'default' : 'destructive'}>
                                {req.status === 'pending' ? 'Pendiente' : req.status === 'approved' ? 'Aprobado' : 'Rechazado'}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Usuario: {req.user_id.slice(0, 8)}... • {new Date(req.requested_at).toLocaleDateString('es-PY')}
                            </p>
                          </div>
                          {req.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={async () => {
                                  try {
                                    await updateCapability.mutateAsync({ id: req.id, status: 'approved' });
                                    toast({ title: 'Capacidad aprobada' });
                                  } catch {
                                    toast({ variant: 'destructive', title: t('common.error') });
                                  }
                                }}
                                disabled={updateCapability.isPending}
                              >
                                <Check className="mr-1 h-4 w-4" /> Aprobar
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={async () => {
                                  try {
                                    await updateCapability.mutateAsync({ id: req.id, status: 'rejected' });
                                    toast({ title: 'Capacidad rechazada' });
                                  } catch {
                                    toast({ variant: 'destructive', title: t('common.error') });
                                  }
                                }}
                                disabled={updateCapability.isPending}
                              >
                                <X className="mr-1 h-4 w-4" /> Rechazar
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Delete Listing Dialog */}
      <AlertDialog open={!!deleteListingId} onOpenChange={() => setDeleteListingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('listing.deleteConfirm')}</AlertDialogTitle>
            <AlertDialogDescription>{t('listing.deleteDesc')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('listing.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteListing}>{t('listing.delete')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Featured Dialog */}
      <AlertDialog open={!!rejectRequestId} onOpenChange={() => setRejectRequestId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Rechazar solicitud?</AlertDialogTitle>
            <AlertDialogDescription>La solicitud de destacado será rechazada.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('listing.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleRejectRequest}>{t('common.reject')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Suspend/Reactivate User Dialog */}
      <AlertDialog open={!!suspendUserId} onOpenChange={() => setSuspendUserId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {suspendUserId?.suspended ? '¿Reactivar usuario?' : '¿Suspender usuario?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {suspendUserId?.suspended
                ? 'El usuario podrá volver a acceder a la plataforma normalmente.'
                : 'El usuario no podrá publicar ni interactuar en la plataforma mientras esté suspendido.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('listing.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleToggleSuspend}>
              {suspendUserId?.suspended ? 'Reactivar' : 'Suspender'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
