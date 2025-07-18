
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { compressImageUrl } from '../utils/imageCompression';

interface OptimizedPostImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

const OptimizedPostImage = ({
  src,
  alt,
  className,
  width,
  height,
  priority = false
}: OptimizedPostImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [imageSrc, setImageSrc] = useState<string>('');
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Use the centralized compression utility
  const getOptimizedSrc = (originalSrc: string) => {
    // The compression utility handles all optimization logic
    return compressImageUrl(originalSrc, 'medium');
  };

  useEffect(() => {
    if (priority || !imgRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          console.log('Image entering viewport:', src);
          setIsInView(true);
          observer.disconnect();
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '50px 0px' // Start loading 50px before entering viewport
      }
    );

    observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, [priority, src]);

  useEffect(() => {
    if (isInView && src) {
      const optimizedSrc = getOptimizedSrc(src);
      setImageSrc(optimizedSrc);
    }
  }, [isInView, src]);

  const handleImageLoad = () => {
    console.log('Image loaded successfully:', imageSrc);
    setIsLoaded(true);
    setHasError(false);
  };

  const handleImageError = () => {
    console.error('Error loading optimized image:', imageSrc);
    setHasError(true);
    
    // Fallback to original src if optimized version fails
    if (imageSrc !== src) {
      console.log('Attempting fallback to original src:', src);
      setImageSrc(src);
      setHasError(false);
    }
  };

  return (
    <div ref={imgRef} className={cn('relative overflow-hidden', className)}>
      {/* Placeholder background */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Error state */}
      {hasError && imageSrc === src && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-gray-500 text-xs">❌</span>
            </div>
            <p className="text-xs text-gray-500">Failed to load image</p>
          </div>
        </div>
      )}
      
      {/* Actual image */}
      {imageSrc && !hasError && (
        <img
          src={imageSrc}
          alt={alt}
          width={width}
          height={height}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
        />
      )}
    </div>
  );
};

export default OptimizedPostImage;
