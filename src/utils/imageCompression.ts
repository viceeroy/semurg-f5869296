// Enhanced image compression utility for better performance
export const compressImageUrl = (imageUrl: string, quality: 'thumbnail' | 'medium' | 'full' = 'medium'): string => {
  // If it's a base64 image, return as-is for now (handled by upload compression)
  if (imageUrl.startsWith('data:image/')) {
    return imageUrl;
  }
  
  // For Supabase storage URLs, add aggressive transformation parameters
  if (imageUrl.includes('.supabase.co/storage/')) {
    const qualityParams = {
      thumbnail: '?width=150&height=150&resize=cover&quality=40&format=webp',
      medium: '?width=400&height=400&resize=cover&quality=60&format=webp', 
      full: '?width=800&height=600&resize=cover&quality=75&format=webp'
    };
    
    return imageUrl + qualityParams[quality];
  }
  
  // For external URLs (like Unsplash), add optimization parameters
  if (imageUrl.includes('unsplash.com')) {
    const sizeParams = {
      thumbnail: '&w=150&h=150&fit=crop&auto=format,compress&q=40',
      medium: '&w=400&h=400&fit=crop&auto=format,compress&q=60',
      full: '&w=800&h=600&fit=crop&auto=format,compress&q=75'
    };
    
    const separator = imageUrl.includes('?') ? '&' : '?';
    return imageUrl + separator + sizeParams[quality].substring(1);
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

// Compress image file before upload
export const compressImageFile = async (file: File, maxWidth = 800, quality = 0.7): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const compressedFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });
          resolve(compressedFile);
        } else {
          resolve(file); // Fallback to original
        }
      }, 'image/jpeg', quality);
    };
    
    img.src = URL.createObjectURL(file);
  });
};