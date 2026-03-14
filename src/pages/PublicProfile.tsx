import { useParams, useNavigate } from 'react-router-dom';
import { useProfileById } from '@/hooks/useProfile';
import { useListings } from '@/hooks/useListings';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/Header';
import ListingCard from '@/components/ListingCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Star, User, MessageCircle, Edit } from 'lucide-react';

const PublicProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const { data: profile, isLoading } = useProfileById(userId);
  const { data: allListings } = useListings();

  const userListings = allListings?.filter((l) => l.user_id === userId) || [];
  const isOwnProfile = user?.id === userId;

  const getInitials = (name: string | null) => {
    if (!name) return '';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-12 text-center">
          <p className="text-lg text-muted-foreground">Usuario no encontrado</p>
          <Button variant="ghost" className="mt-4" onClick={() => navigate('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('common.back')}
        </Button>

        {/* Profile Card */}
        <div className="mx-auto max-w-3xl">
          <div className="rounded-lg border bg-card p-6 mb-8">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile.avatar_url || undefined} alt={profile.name || 'Avatar'} />
                <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                  {profile.name ? getInitials(profile.name) : <User className="h-10 w-10" />}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-col items-center gap-2 sm:flex-row">
                  <h1 className="text-2xl font-bold text-foreground">
                    {profile.name || 'Sin nombre'}
                  </h1>
                  {profile.profile_type && (
                    <Badge variant="secondary" className="capitalize">
                      {profile.profile_type === 'productor' ? '🌾 Productor' : profile.profile_type === 'tecnico' ? '🔧 Técnico' : '🏪 Proveedor'}
                    </Badge>
                  )}
                </div>

                {(profile.department || profile.city) && (
                  <div className="mt-1 flex items-center justify-center gap-1 text-sm text-muted-foreground sm:justify-start">
                    <MapPin className="h-4 w-4" />
                    <span>{[profile.city, profile.department].filter(Boolean).join(', ')}</span>
                  </div>
                )}

                {profile.description && (
                  <p className="mt-3 text-sm text-foreground/80">{profile.description}</p>
                )}

                {/* Stats */}
                <div className="mt-4 flex items-center justify-center gap-6 sm:justify-start">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="font-semibold">
                      {profile.avgRating ? profile.avgRating.toFixed(1) : '—'}
                    </span>
                    <span className="text-xs text-muted-foreground">({profile.reviewCount})</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {profile.completedOperations} operaciones
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  {profile.phone_whatsapp && (
                    <Button
                      size="sm"
                      className="bg-whatsapp text-whatsapp-foreground hover:bg-whatsapp/90"
                      onClick={() => window.open(`https://wa.me/${profile.phone_whatsapp}`, '_blank')}
                    >
                      <MessageCircle className="mr-1 h-4 w-4" />
                      Contactar por WhatsApp
                    </Button>
                  )}
                  {isOwnProfile && (
                    <Button size="sm" variant="outline" onClick={() => navigate('/perfil')}>
                      <Edit className="mr-1 h-4 w-4" />
                      Editar perfil
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* User Listings */}
          <h2 className="mb-4 text-xl font-bold text-foreground">
            Publicaciones ({userListings.length})
          </h2>
          {userListings.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {userListings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={{
                    id: listing.id,
                    title: listing.title,
                    description: listing.description,
                    price: listing.price,
                    priceUnit: listing.price_unit,
                    currency: listing.currency as 'PYG' | 'USD',
                    category: listing.category,
                    department: listing.department,
                    city: listing.city,
                    phoneWhatsapp: listing.phone_whatsapp,
                    imageUrl: listing.images?.[0] || '/placeholder.svg',
                    images: listing.images || [],
                    featured: listing.featured,
                    createdAt: listing.created_at,
                    userId: listing.user_id,
                    isWholesale: listing.is_wholesale,
                    minVolume: listing.min_volume,
                    productionCapacity: listing.production_capacity,
                    listingType: listing.listing_type,
                    quantity: listing.quantity,
                    quantityUnit: listing.quantity_unit,
                  }}
                  onClick={() => navigate(`/anuncio/${listing.id}`)}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              Este usuario aún no tiene publicaciones.
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default PublicProfile;
