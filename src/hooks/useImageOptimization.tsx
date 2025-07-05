
import { useState, useCallback } from 'react';
import { compressImage } from '../utils/imageOptimization';

export const useImageOptimization = () => {
  const [isCompressing, setIsCompressing] = useState(false);

  const optimizeImage = useCallback(async (file: File, maxWidth = 1024, quality = 0.8) => {
    setIsCompressing(true);
    console.log('Starting image optimization for:', file.name, 'Size:', file.size);
    
    try {
      // Check if compression is needed
      if (file.size < 500000) { // Less than 500KB, probably fine
        console.log('File size is acceptable, skipping compression');
        setIsCompressing(false);
        return file;
      }

      console.log('Compressing image...');
      const compressedFile = await compressImage(file, maxWidth, quality);
      setIsCompressing(false);
      
      console.log(`Image optimized: ${file.size} -> ${compressedFile.size} bytes`);
      return compressedFile;
    } catch (error) {
      console.error('Image optimization failed:', error);
      setIsCompressing(false);
      // Return original if compression fails
      console.log('Returning original file due to compression failure');
      return file;
    }
  }, []);

  return { optimizeImage, isCompressing };
};
