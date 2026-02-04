/**
 * Transforms a Supabase storage URL to use image optimization
 * @param url Original image URL
 * @param width Desired width in pixels
 * @param quality Image quality (1-100)
 * @returns Optimized image URL
 */
export function getOptimizedImageUrl(
  url: string,
  width: number,
  quality: number = 80
): string {
  if (!url) return url;
  
  // Check if it's a Supabase storage URL
  const supabaseStoragePattern = /\/storage\/v1\/object\/public\//;
  
  if (supabaseStoragePattern.test(url)) {
    // Transform to render endpoint with optimization params
    const optimizedUrl = url.replace(
      '/storage/v1/object/public/',
      '/storage/v1/render/image/public/'
    );
    
    // Add query params for optimization
    const separator = optimizedUrl.includes('?') ? '&' : '?';
    return `${optimizedUrl}${separator}width=${width}&quality=${quality}&format=origin`;
  }
  
  return url;
}
