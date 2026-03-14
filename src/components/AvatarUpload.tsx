import { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Camera, Loader2, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ImageCropModal from '@/components/ImageCropModal';

interface AvatarUploadProps {
  currentAvatarUrl: string | null;
  userName: string | null;
  onAvatarChange: (url: string) => void;
}

const AvatarUpload = ({ currentAvatarUrl, userName, onAvatarChange }: AvatarUploadProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [cropSrc, setCropSrc] = useState<string | null>(null);

  const getInitials = (name: string | null) => {
    if (!name) return '';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith('image/')) {
      toast({ variant: 'destructive', title: 'Error', description: 'Solo se permiten archivos de imagen' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ variant: 'destructive', title: 'Error', description: 'La imagen no debe superar 5MB' });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setCropSrc(reader.result as string);
    reader.readAsDataURL(file);

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCropComplete = async (blob: Blob) => {
    if (!user) return;
    setUploading(true);

    try {
      const fileName = `${user.id}/avatar.jpg`;
      const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' });

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      const urlWithCacheBuster = `${publicUrl}?t=${Date.now()}`;

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: urlWithCacheBuster })
        .eq('id', user.id);

      if (updateError) throw updateError;

      onAvatarChange(urlWithCacheBuster);
      toast({ title: 'Foto actualizada', description: 'Tu foto de perfil ha sido guardada.' });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'No se pudo subir la imagen' });
    } finally {
      setUploading(false);
      setCropSrc(null);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <Avatar className="h-24 w-24">
          <AvatarImage src={currentAvatarUrl || undefined} alt={userName || 'Avatar'} />
          <AvatarFallback className="bg-primary/10 text-primary text-2xl">
            {userName ? getInitials(userName) : <User className="h-10 w-10" />}
          </AvatarFallback>
        </Avatar>
        
        <Button
          type="button"
          size="icon"
          variant="secondary"
          className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full shadow-md btn-hover"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Camera className="h-4 w-4" />
          )}
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />

      <p className="text-xs text-muted-foreground text-center">
        Hacé clic en el ícono de cámara para cambiar tu foto
      </p>

      {cropSrc && (
        <ImageCropModal
          open={!!cropSrc}
          onClose={() => setCropSrc(null)}
          imageSrc={cropSrc}
          aspectRatio={1}
          onCropComplete={handleCropComplete}
        />
      )}
    </div>
  );
};

export default AvatarUpload;
