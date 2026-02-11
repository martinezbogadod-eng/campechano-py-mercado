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
import { useIsWholesale, useUserRoles, isProducerRole } from '@/hooks/useUserRoles';
import { useLanguage } from '@/hooks/useLanguage';
import { useCreateListing, useUpdateListing, uploadListingImage, DbListing } from '@/hooks/useListings';
import { CATEGORIES, DEPARTMENTS, Category, PRICE_UNITS, PriceUnit } from '@/types/listing';
import { Loader2, Upload, X, Shield, Package } from 'lucide-react';

const listingSchema = z.object({
  title: z.string().min(5, 'Mínimo 5 caracteres').max(100, 'Máximo 100 caracteres'),
  description: z.string().min(20, 'Mínimo 20 caracteres').max(1000, 'Máximo 1000 caracteres'),
  price: z.string().optional(),
  price_unit: z.string().optional(),
  currency: z.enum(['PYG', 'USD']),
  category: z.enum(['granos', 'frutas-verduras', 'ganaderia', 'maquinaria', 'insumos', 'servicios'] as const),
  department: z.string().min(1, 'Selecciona un departamento'),
  city: z.string().min(2, 'Mínimo 2 caracteres').max(50, 'Máximo 50 caracteres'),
  phone_whatsapp: z.string().regex(/^595\d{9}$/, 'Formato: 595XXXXXXXXX'),
  // Wholesale fields
  min_volume: z.string().optional(),
  production_capacity: z.string().optional(),
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
  const [selectedPriceUnit, setSelectedPriceUnit] = useState<PriceUnit | ''>(
    (listing?.price_unit as PriceUnit) || ''
  );
  const [allowWhatsapp, setAllowWhatsapp] = useState(
    listing?.allow_whatsapp_contact ?? true
  );
  const [showWhatsappPublic, setShowWhatsappPublic] = useState(
    listing?.show_whatsapp_public ?? false
  );
  const [isWholesaleListing, setIsWholesaleListing] = useState(
    listing?.is_wholesale ?? false
  );
  
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const isWholesaleUser = useIsWholesale();
  const { data: userRoles } = useUserRoles();
  const createListing = useCreateListing();
  const updateListing = useUpdateListing();

  // Determine allowed categories based on role
  const isServiceProvider = userRoles?.includes('prestador') || false;
  const isProducer = userRoles?.some(r => isProducerRole(r)) || false;
  
  const getAllowedCategories = () => {
    if (isServiceProvider && !isProducer) {
      // Service providers can only post services
      return Object.entries(CATEGORIES).filter(([key]) => key === 'servicios');
    }
    if (isProducer && !isServiceProvider) {
      // Producers can only post products (not services)
      return Object.entries(CATEGORIES).filter(([key]) => key !== 'servicios');
    }
    // Both roles or admin: all categories
    return Object.entries(CATEGORIES);
  };

  const allowedCategories = getAllowedCategories();

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
      price_unit: listing?.price_unit || '',
      currency: (listing?.currency as 'PYG' | 'USD') || 'PYG',
      category: listing?.category || 'granos',
      department: listing?.department || '',
      city: listing?.city || '',
      phone_whatsapp: listing?.phone_whatsapp || '',
      min_volume: listing?.min_volume || '',
      production_capacity: listing?.production_capacity || '',
    },
  });

  const watchCategory = watch('category');
  const watchCurrency = watch('currency');

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

    // Validate file types
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    for (const file of files) {
      if (!validTypes.includes(file.type)) {
        toast({
          variant: 'destructive',
          title: 'Formato no válido',
          description: 'Solo se aceptan imágenes JPG, PNG o WEBP',
        });
        return;
      }
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
    // Validate price unit when price is fixed
    if (priceType === 'fixed' && !selectedPriceUnit) {
      toast({
        variant: 'destructive',
        title: 'Unidad requerida',
        description: 'Selecciona una unidad de precio',
      });
      return;
    }

    try {
      const listingData = {
        title: data.title,
        description: data.description,
        price: priceType === 'negotiable' ? null : parseFloat(data.price || '0'),
        price_unit: priceType === 'negotiable' ? null : selectedPriceUnit,
        currency: data.currency,
        category: data.category as Category,
        department: data.department,
        city: data.city,
        phone_whatsapp: data.phone_whatsapp,
        images,
        featured: false,
        allow_whatsapp_contact: allowWhatsapp,
        show_whatsapp_public: showWhatsappPublic,
        // Wholesale fields
        is_wholesale: isWholesaleUser && isWholesaleListing,
        min_volume: isWholesaleUser && isWholesaleListing ? data.min_volume || null : null,
        production_capacity: isWholesaleUser && isWholesaleListing ? data.production_capacity || null : null,
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
            {allowedCategories.map(([key, { label, emoji }]) => (
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
          <div className="space-y-3">
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
            
            {/* Price Unit */}
            <div className="space-y-2">
              <Label>Unidad de precio *</Label>
              <Select
                value={selectedPriceUnit}
                onValueChange={(value) => setSelectedPriceUnit(value as PriceUnit)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona unidad" />
                </SelectTrigger>
                <SelectContent>
                  {PRICE_UNITS.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      {/* Wholesale Settings - Only for wholesale producers */}
      {isWholesaleUser && (
        <div className="space-y-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-950/30">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <h4 className="font-semibold text-emerald-800 dark:text-emerald-300">{t('form.wholesaleInfo')}</h4>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="is-wholesale">Publicar como mayorista</Label>
              <p className="text-xs text-muted-foreground">
                Mostrar etiqueta "Mayorista" y campos adicionales
              </p>
            </div>
            <Switch
              id="is-wholesale"
              checked={isWholesaleListing}
              onCheckedChange={setIsWholesaleListing}
            />
          </div>

          {isWholesaleListing && (
            <>
              <div className="space-y-2">
                <Label htmlFor="min_volume">{t('form.minVolume')}</Label>
                <Input
                  id="min_volume"
                  placeholder={t('form.minVolumePlaceholder')}
                  {...register('min_volume')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="production_capacity">{t('form.productionCapacity')}</Label>
                <Input
                  id="production_capacity"
                  placeholder={t('form.productionCapacityPlaceholder')}
                  {...register('production_capacity')}
                />
              </div>
            </>
          )}
        </div>
      )}

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

      {/* Privacy Settings */}
      <div className="space-y-4 rounded-lg border bg-muted/50 p-4">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <h4 className="font-semibold">Configuración de Privacidad</h4>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="allow-whatsapp">Permitir contacto por WhatsApp</Label>
            <p className="text-xs text-muted-foreground">
              Los interesados podrán contactarte por WhatsApp desde el chat
            </p>
          </div>
          <Switch
            id="allow-whatsapp"
            checked={allowWhatsapp}
            onCheckedChange={setAllowWhatsapp}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="show-whatsapp-public">Mostrar WhatsApp públicamente</Label>
            <p className="text-xs text-muted-foreground">
              Mostrar botón de WhatsApp en el anuncio sin necesidad de chat
            </p>
          </div>
          <Switch
            id="show-whatsapp-public"
            checked={showWhatsappPublic}
            onCheckedChange={setShowWhatsappPublic}
            disabled={!allowWhatsapp}
          />
        </div>

        <p className="text-xs text-muted-foreground italic">
          Por seguridad, los teléfonos no se muestran como texto. 
          El contacto inicial siempre es por chat interno.
        </p>
      </div>

      {/* Images */}
      <div className="space-y-2">
        <Label>Imágenes (máx. 5, solo JPG/PNG)</Label>
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
                accept="image/jpeg,image/png,image/webp"
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
