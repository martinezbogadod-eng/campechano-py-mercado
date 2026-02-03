import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Star, Trash2, Eye, Check, X, ExternalLink } from 'lucide-react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import {
  useIsAdmin,
  useAllListings,
  useFeaturedRequests,
  useApproveFeaturedRequest,
  useRejectFeaturedRequest,
  useToggleListingFeatured,
  useAdminDeleteListing,
} from '@/hooks/useAdmin';

export default function AdminPanel() {
  const [deleteListingId, setDeleteListingId] = useState<string | null>(null);
  const [rejectRequestId, setRejectRequestId] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: listings, isLoading: listingsLoading } = useAllListings();
  const { data: requests, isLoading: requestsLoading } = useFeaturedRequests();
  const { toast } = useToast();

  const approveFeatured = useApproveFeaturedRequest();
  const rejectFeatured = useRejectFeaturedRequest();
  const toggleFeatured = useToggleListingFeatured();
  const deleteListing = useAdminDeleteListing();

  // Auth check
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
            <p className="mt-2 text-muted-foreground">
              No tienes permisos para acceder a esta sección.
            </p>
            <Button onClick={() => navigate('/')} className="mt-4">
              Volver al inicio
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const handleApproveRequest = async (requestId: string, listingId: string, durationDays: number) => {
    try {
      await approveFeatured.mutateAsync({ requestId, listingId, durationDays });
      toast({
        title: 'Solicitud aprobada',
        description: 'El anuncio ha sido destacado correctamente.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo aprobar la solicitud',
      });
    }
  };

  const handleRejectRequest = async () => {
    if (!rejectRequestId) return;
    try {
      await rejectFeatured.mutateAsync({ requestId: rejectRequestId });
      toast({
        title: 'Solicitud rechazada',
        description: 'La solicitud ha sido rechazada.',
      });
      setRejectRequestId(null);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo rechazar la solicitud',
      });
    }
  };

  const handleToggleFeatured = async (listingId: string, currentFeatured: boolean) => {
    try {
      await toggleFeatured.mutateAsync({ listingId, featured: !currentFeatured });
      toast({
        title: currentFeatured ? 'Destacado removido' : 'Anuncio destacado',
        description: currentFeatured
          ? 'El anuncio ya no está destacado.'
          : 'El anuncio ahora está destacado.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo actualizar el anuncio',
      });
    }
  };

  const handleDeleteListing = async () => {
    if (!deleteListingId) return;
    try {
      await deleteListing.mutateAsync(deleteListingId);
      toast({
        title: 'Anuncio eliminado',
        description: 'El anuncio ha sido eliminado correctamente.',
      });
      setDeleteListingId(null);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo eliminar el anuncio',
      });
    }
  };

  const pendingRequests = requests?.filter((r) => r.status === 'pending') || [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6">
        <div className="mb-6">
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <Shield className="h-6 w-6 text-primary" />
            Panel de Administración
          </h1>
          <p className="text-muted-foreground">
            Gestiona anuncios y solicitudes de destacados
          </p>
        </div>

        {/* Summary Cards */}
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Anuncios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{listings?.length || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Destacados Activos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-featured">
                {listings?.filter((l) => l.featured).length || 0}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Solicitudes Pendientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-accent">
                {pendingRequests.length}
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="listings">
          <TabsList>
            <TabsTrigger value="listings">Todos los Anuncios</TabsTrigger>
            <TabsTrigger value="requests" className="relative">
              Solicitudes de Destacados
              {pendingRequests.length > 0 && (
                <Badge className="ml-2 bg-accent text-accent-foreground">
                  {pendingRequests.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Listings Tab */}
          <TabsContent value="listings" className="mt-4">
            {listingsLoading ? (
              <div className="flex justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : (
              <div className="rounded-lg border">
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
                          {listing.title}
                        </TableCell>
                        <TableCell>{listing.category}</TableCell>
                        <TableCell>
                          {listing.featured ? (
                            <Badge className="bg-featured text-featured-foreground">
                              <Star className="mr-1 h-3 w-3" />
                              Destacado
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Normal</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {new Date(listing.created_at).toLocaleDateString('es-PY')}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleFeatured(listing.id, listing.featured)}
                            >
                              <Star
                                className={`h-4 w-4 ${
                                  listing.featured ? 'fill-featured text-featured' : ''
                                }`}
                              />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteListingId(listing.id)}
                            >
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
          <TabsContent value="requests" className="mt-4">
            {requestsLoading ? (
              <div className="flex justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : requests?.length === 0 ? (
              <div className="rounded-lg border p-8 text-center">
                <p className="text-muted-foreground">No hay solicitudes</p>
              </div>
            ) : (
              <div className="space-y-4">
                {requests?.map((request) => (
                  <Card key={request.id}>
                    <CardContent className="p-4">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex-1">
                          <p className="font-medium">
                            {request.listing?.title || 'Anuncio eliminado'}
                          </p>
                          <div className="mt-1 flex flex-wrap gap-2 text-sm text-muted-foreground">
                            <span>{request.duration_days} días</span>
                            <span>•</span>
                            <span>
                              {new Date(request.created_at).toLocaleDateString('es-PY')}
                            </span>
                            <span>•</span>
                            <Badge
                              variant={
                                request.status === 'pending'
                                  ? 'secondary'
                                  : request.status === 'approved'
                                  ? 'default'
                                  : 'destructive'
                              }
                            >
                              {request.status === 'pending'
                                ? 'Pendiente'
                                : request.status === 'approved'
                                ? 'Aprobado'
                                : 'Rechazado'}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(request.receipt_url, '_blank')}
                          >
                            <ExternalLink className="mr-1 h-4 w-4" />
                            Ver Comprobante
                          </Button>
                          
                          {request.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() =>
                                  handleApproveRequest(
                                    request.id,
                                    request.listing_id,
                                    request.duration_days
                                  )
                                }
                                disabled={approveFeatured.isPending}
                              >
                                <Check className="mr-1 h-4 w-4" />
                                Aprobar
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => setRejectRequestId(request.id)}
                              >
                                <X className="mr-1 h-4 w-4" />
                                Rechazar
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteListingId} onOpenChange={() => setDeleteListingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar anuncio?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El anuncio será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteListing}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Confirmation Dialog */}
      <AlertDialog open={!!rejectRequestId} onOpenChange={() => setRejectRequestId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Rechazar solicitud?</AlertDialogTitle>
            <AlertDialogDescription>
              La solicitud de destacado será rechazada.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleRejectRequest}>
              Rechazar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
