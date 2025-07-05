
// Image optimization utilities
export const compressImage = (file: File, maxWidth = 1024, quality = 0.8): Promise<File> => {
  return new Promise((resolve, reject) => {
    console.log('Compressing image:', file.name, 'maxWidth:', maxWidth, 'quality:', quality);
    
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
        console.log('Image loaded, original dimensions:', img.width, 'x', img.height);
        
        // Calculate new dimensions
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        const newWidth = Math.floor(img.width * ratio);
        const newHeight = Math.floor(img.height * ratio);
        
        canvas.width = newWidth;
        canvas.height = newHeight;

        console.log('New dimensions:', newWidth, 'x', newHeight);

        // Draw and compress
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              console.log('Compression successful, new size:', compressedFile.size);
              resolve(compressedFile);
            } else {
              console.error('Failed to create blob from canvas');
              reject(new Error('Failed to create blob from canvas'));
            }
          },
          'image/jpeg',
          quality
        );
      } catch (error) {
        console.error('Error during image processing:', error);
        reject(error);
      }
    };

    img.onerror = (error) => {
      console.error('Error loading image:', error);
      reject(new Error('Failed to load image'));
    };

    // Create object URL for the image
    try {
      img.src = URL.createObjectURL(file);
    } catch (error) {
      console.error('Error creating object URL:', error);
      reject(new Error('Failed to create object URL'));
    }
  });
};

// Create optimized image URL
export const createOptimizedImageUrl = (url: string, width?: number) => {
  if (!width) return url;
  
  // For Supabase storage, we could add resize parameters
  // For now, return as-is since Lovable handles optimization
  return url;
};

// Lazy load images with Intersection Observer
export const lazyLoadImage = (img: HTMLImageElement, src: string) => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        img.src = src;
        img.classList.remove('lazy');
        observer.unobserve(img);
      }
    });
  });

  observer.observe(img);
  return observer;
};
