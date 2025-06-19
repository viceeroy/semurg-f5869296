import { useState, useCallback } from 'react';
import { compressImage } from '../utils/imageOptimization';

export const useImageOptimization = () => {
  const [isCompressing, setIsCompressing] = useState(false);

  const optimizeImage = useCallback(async (file: File, maxWidth = 1024, quality = 0.8) => {
    setIsCompressing(true);
    
    try {
      // Check if compression is needed
      if (file.size < 500000) { // Less than 500KB, probably fine
        setIsCompressing(false);
        return file;
      }

      const compressedFile = await compressImage(file, maxWidth, quality);
      setIsCompressing(false);
      
      console.log(`Image optimized: ${file.size} -> ${compressedFile.size} bytes`);
      return compressedFile;
    } catch (error) {
      console.error('Image optimization failed:', error);
      setIsCompressing(false);
      return file; // Return original if compression fails
    }
  }, []);

  return { optimizeImage, isCompressing };
};