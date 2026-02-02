import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useCreateListing, useUpdateListing, uploadListingImage, DbListing } from '@/hooks/useListings';
import { CATEGORIES, DEPARTMENTS, Category } from '@/types/listing';
import { Loader2, Upload, X } from 'lucide-react';

const listingSchema = z.object({
  title: z.string().min(5, 'Mínimo 5 caracteres').max(100, 'Máximo 100 caracteres'),
  description: z.string().min(20, 'Mínimo 20 caracteres').max(1000, 'Máximo 1000 caracteres'),
  price: z.string().optional(),
  currency: z.enum(['PYG', 'USD']),
  category: z.enum(['granos', 'frutas-verduras', 'ganaderia', 'maquinaria', 'insumos', 'servicios'] as const),
  department: z.string().min(1, 'Selecciona un departamento'),
  city: z.string().min(2, 'Mínimo 2 caracteres').max(50, 'Máximo 50 caracteres'),
  phone_whatsapp: z.string().regex(/^595\d{9}$/, 'Formato: 595XXXXXXXXX'),
  featured: z.boolean(),
});

type ListingFormData = z.infer<typeof listingSchema>;

interface ListingFormProps {
  listing?: DbListing;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ListingForm({ listing, onSuccess, onCancel }: ListingFormProps) {
  const [images, setImages] = useState<string[]>(listing?.images || []);
  const [isUploading, setIsUploading] = useState(false);
  const [priceType, setPriceType] = useState<'fixed' | 'negotiable'>(
    listing?.price === null ? 'negotiable' : 'fixed'
  );
  
  const { user } = useAuth();
  const { toast } = useToast();
  const createListing = useCreateListing();
  const updateListing = useUpdateListing();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      title: listing?.title || '',
      description: listing?.description || '',
      price: listing?.price?.toString() || '',
      currency: (listing?.currency as 'PYG' | 'USD') || 'PYG',
      category: listing?.category || 'granos',
      department: listing?.department || '',
      city: listing?.city || '',
      phone_whatsapp: listing?.phone_whatsapp || '',
      featured: listing?.featured || false,
    },
  });

  const watchCategory = watch('category');
  const watchCurrency = watch('currency');
  const watchFeatured = watch('featured');

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !user) return;

    if (images.length + files.length > 5) {
      toast({
        variant: 'destructive',
        title: 'Límite de imágenes',
        description: 'Máximo 5 imágenes por anuncio',
      });
      return;
    }

    setIsUploading(true);
    try {
      const uploadPromises = Array.from(files).map((file) =>
        uploadListingImage(file, user.id)
      );
      const urls = await Promise.all(uploadPromises);
      setImages((prev) => [...prev, ...urls]);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudieron subir las imágenes',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ListingFormData) => {
    try {
      const listingData = {
        title: data.title,
        description: data.description,
        price: priceType === 'negotiable' ? null : parseFloat(data.price || '0'),
        currency: data.currency,
        category: data.category as Category,
        department: data.department,
        city: data.city,
        phone_whatsapp: data.phone_whatsapp,
        images,
        featured: data.featured,
      };

      if (listing) {
        await updateListing.mutateAsync({ id: listing.id, ...listingData });
        toast({
          title: '¡Anuncio actualizado!',
          description: 'Tu anuncio ha sido actualizado correctamente.',
        });
      } else {
        await createListing.mutateAsync(listingData);
        toast({
          title: '¡Anuncio publicado!',
          description: 'Tu anuncio ya está visible para todos.',
        });
      }
      onSuccess?.();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo guardar el anuncio',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Título del anuncio *</Label>
        <Input
          id="title"
          placeholder="Ej: Soja de primera calidad - Cosecha 2024"
          {...register('title')}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label>Categoría *</Label>
        <Select
          value={watchCategory}
          onValueChange={(value) => setValue('category', value as Category)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona categoría" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(CATEGORIES).map(([key, { label, emoji }]) => (
              <SelectItem key={key} value={key}>
                {emoji} {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && (
          <p className="text-sm text-destructive">{errors.category.message}</p>
        )}
      </div>

      {/* Location */}
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

      {/* Price */}
      <div className="space-y-4">
        <Label>Precio</Label>
        <div className="flex gap-4">
          <Button
            type="button"
            variant={priceType === 'fixed' ? 'default' : 'outline'}
            onClick={() => setPriceType('fixed')}
          >
            Precio fijo
          </Button>
          <Button
            type="button"
            variant={priceType === 'negotiable' ? 'default' : 'outline'}
            onClick={() => setPriceType('negotiable')}
          >
            A convenir
          </Button>
        </div>

        {priceType === 'fixed' && (
          <div className="flex gap-2">
            <Select
              value={watchCurrency}
              onValueChange={(value) => setValue('currency', value as 'PYG' | 'USD')}
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PYG">Gs.</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="Monto"
              {...register('price')}
              className="flex-1"
            />
          </div>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Descripción *</Label>
        <Textarea
          id="description"
          placeholder="Describe tu producto o servicio en detalle..."
          rows={4}
          {...register('description')}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <Label htmlFor="phone_whatsapp">Teléfono WhatsApp *</Label>
        <Input
          id="phone_whatsapp"
          placeholder="595981234567"
          {...register('phone_whatsapp')}
        />
        <p className="text-xs text-muted-foreground">
          Formato: 595 + número (ej: 595981234567)
        </p>
        {errors.phone_whatsapp && (
          <p className="text-sm text-destructive">{errors.phone_whatsapp.message}</p>
        )}
      </div>

      {/* Images */}
      <div className="space-y-2">
        <Label>Imágenes (máx. 5)</Label>
        <div className="flex flex-wrap gap-2">
          {images.map((url, index) => (
            <div key={index} className="relative">
              <img
                src={url}
                alt={`Imagen ${index + 1}`}
                className="h-20 w-20 rounded-md object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -right-1 -top-1 rounded-full bg-destructive p-1 text-destructive-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          {images.length < 5 && (
            <label className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-muted-foreground/50 hover:border-primary">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                disabled={isUploading}
              />
              {isUploading ? (
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              ) : (
                <Upload className="h-6 w-6 text-muted-foreground" />
              )}
            </label>
          )}
        </div>
      </div>

      {/* Featured */}
      <div className="flex items-center justify-between rounded-lg border p-4">
        <div>
          <Label htmlFor="featured">⭐ Destacar anuncio</Label>
          <p className="text-sm text-muted-foreground">
            Tu anuncio aparecerá primero en los resultados
          </p>
        </div>
        <Switch
          id="featured"
          checked={watchFeatured}
          onCheckedChange={(checked) => setValue('featured', checked)}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : listing ? (
            'Actualizar anuncio'
          ) : (
            'Publicar anuncio'
          )}
        </Button>
      </div>
    </form>
  );
}
