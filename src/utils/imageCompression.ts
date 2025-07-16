// Image compression utility for better performance
export const compressImageUrl = (imageUrl: string, quality: 'thumbnail' | 'medium' | 'full' = 'medium'): string => {
  // If it's a base64 image and very large, we should handle it differently
  if (imageUrl.startsWith('data:image/')) {
    // For demo purposes, return original for now
    // In production, you'd want to extract and store these in Supabase storage
    return imageUrl;
  }
  
  // For Supabase storage URLs, add transformation parameters
  if (imageUrl.includes('.supabase.co/storage/')) {
    const qualityParams = {
      thumbnail: '?width=200&height=200&resize=cover&quality=60',
      medium: '?width=400&height=400&resize=cover&quality=75',
      full: '?width=800&height=800&resize=cover&quality=85'
    };
    
    return imageUrl + qualityParams[quality];
  }
  
  return imageUrl;
};

export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};