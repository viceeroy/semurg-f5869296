
// Enhanced image optimization utilities with better compression
export const compressImage = (file: File, maxWidth = 800, quality = 0.7): Promise<File> => {
  return new Promise((resolve, reject) => {
    console.log('Starting advanced compression for:', file.name, 'Size:', file.size);
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    if (!ctx) {
      console.error('Could not get canvas context');
      reject(new Error('Could not get canvas context'));
      return;
    }

    img.onload = () => {
      try {
        // Calculate optimal dimensions
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        const newWidth = Math.floor(img.width * ratio);
        const newHeight = Math.floor(img.height * ratio);
        
        canvas.width = newWidth;
        canvas.height = newHeight;

        // Use better image rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              
              const compressionRatio = ((file.size - compressedFile.size) / file.size * 100).toFixed(1);
              console.log(`Compression successful: ${file.size} -> ${compressedFile.size} bytes (${compressionRatio}% reduction)`);
              resolve(compressedFile);
            } else {
              reject(new Error('Failed to create compressed blob'));
            }
          },
          'image/jpeg',
          quality
        );
      } catch (error) {
        console.error('Error during compression:', error);
        reject(error);
      }
    };

    img.onerror = () => reject(new Error('Failed to load image for compression'));
    img.src = URL.createObjectURL(file);
  });
};

// Progressive image loading
export const createProgressiveImageUrl = (url: string, size: 'thumb' | 'medium' | 'full' = 'medium') => {
  if (!url || url.startsWith('data:')) return url;
  
  const sizeParams = {
    thumb: { width: 200, quality: 60 },
    medium: { width: 400, quality: 75 },
    full: { width: 800, quality: 85 }
  };
  
  const params = sizeParams[size];
  
  // For Supabase storage URLs
  if (url.includes('.supabase.co/storage/')) {
    return `${url}?width=${params.width}&quality=${params.quality}&format=webp`;
  }
  
  // For other URLs (like Unsplash)
  if (url.includes('unsplash.com')) {
    return `${url}&w=${params.width}&q=${params.quality}&fm=webp&auto=compress`;
  }
  
  return url;
};

// Preload critical images
export const preloadImages = (urls: string[]) => {
  return Promise.all(
    urls.map(url => new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = resolve;
      img.onerror = reject;
      img.src = createProgressiveImageUrl(url, 'thumb');
    }))
  );
};
