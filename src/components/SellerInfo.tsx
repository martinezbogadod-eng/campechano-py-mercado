import { Star, MapPin, ShoppingBag, User } from 'lucide-react';
import { useProfileById, PROFILE_TYPES } from '@/hooks/useProfile';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface SellerInfoProps {
  sellerId: string;
  compact?: boolean;
}

const SellerInfo = ({ sellerId, compact = false }: SellerInfoProps) => {
  const { data: profile, isLoading } = useProfileById(sellerId);

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-24" />
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const profileType = profile.profile_type ? PROFILE_TYPES[profile.profile_type] : null;

  const getInitials = (name: string | null) => {
    if (!name) return '';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Avatar className="h-6 w-6">
          <AvatarImage src={profile.avatar_url || undefined} alt={profile.name || 'Avatar'} />
          <AvatarFallback className="bg-primary/10 text-primary text-xs">
            {profile.name ? getInitials(profile.name) : <User className="h-3 w-3" />}
          </AvatarFallback>
        </Avatar>
        <span className="font-medium">{profile.name || 'Usuario'}</span>
        {profileType && (
          <span className="text-muted-foreground">
            {profileType.emoji} {profileType.label}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-muted/50 p-4">
      <h4 className="mb-3 text-sm font-semibold text-foreground uppercase tracking-wide">
        Información del Oferente
      </h4>
      
      <div className="flex items-start gap-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={profile.avatar_url || undefined} alt={profile.name || 'Avatar'} />
          <AvatarFallback className="bg-primary/10 text-primary">
            {profile.name ? getInitials(profile.name) : <User className="h-5 w-5" />}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground">
              {profile.name || 'Usuario'}
            </span>
          </div>

          {profileType && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{profileType.emoji}</span>
              <span>{profileType.label}</span>
            </div>
          )}

          {(profile.city || profile.department) && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>
                {[profile.city, profile.department].filter(Boolean).join(', ')}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Reputation */}
      <div className="mt-3 flex items-center gap-4 border-t pt-3">
        {profile.reviewCount > 0 && (
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="font-medium">{profile.avgRating.toFixed(1)}</span>
            <span className="text-sm text-muted-foreground">
              ({profile.reviewCount} {profile.reviewCount === 1 ? 'reseña' : 'reseñas'})
            </span>
          </div>
        )}
        
        {profile.completedOperations > 0 && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <ShoppingBag className="h-4 w-4" />
            <span>{profile.completedOperations} operaciones</span>
          </div>
        )}

        {profile.reviewCount === 0 && profile.completedOperations === 0 && (
          <span className="text-sm text-muted-foreground">
            Nuevo en la plataforma
          </span>
        )}
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        Por seguridad, los teléfonos no se muestran públicamente. 
        Contactá por chat y luego pasá a WhatsApp si el vendedor lo autoriza.
      </p>
    </div>
  );
};

export default SellerInfo;
