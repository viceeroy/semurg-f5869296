
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface LazyFeedImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  onLoad?: () => void;
}

const LazyFeedImage = ({
  src,
  alt,
  className,
  priority = false,
  onLoad
}: LazyFeedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [imageSrc, setImageSrc] = useState<string>('');
  const imgRef = useRef<HTMLImageElement>(null);

  // Generate optimized image URL for mobile feeds
  const getOptimizedSrc = (originalSrc: string) => {
    // For mobile optimization, use smaller images
    const isMobile = window.innerWidth < 768;
    const targetWidth = isMobile ? 400 : 600;
    
    if (originalSrc.includes('unsplash.com')) {
      return `${originalSrc}&w=${targetWidth}&q=75&fm=webp&fit=crop&h=${Math.round(targetWidth * 0.75)}`;
    }
    return originalSrc;
  };

  useEffect(() => {
    if (priority || !imgRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '100px 0px' // Start loading 100px before entering viewport
      }
    );

    observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, [priority]);

  useEffect(() => {
    if (isInView && src) {
      setImageSrc(getOptimizedSrc(src));
    }
  }, [isInView, src]);

  const handleImageLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  // Lightweight placeholder
  const placeholder = `data:image/svg+xml;base64,${btoa(`
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <circle cx="200" cy="150" r="20" fill="#e5e7eb"/>
    </svg>
  `)}`;

  return (
    <div ref={imgRef} className={cn('relative overflow-hidden bg-gray-100', className)}>
      {/* Minimal loading state */}
      {!isLoaded && isInView && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Actual image */}
      {imageSrc && (
        <img
          src={imageSrc}
          alt={alt}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
          onLoad={handleImageLoad}
          onError={() => {
            // Fallback to original src if optimized version fails
            if (imageSrc !== src) {
              setImageSrc(src);
            }
          }}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
        />
      )}
      
      {/* Show placeholder only if image hasn't started loading */}
      {!isInView && !imageSrc && (
        <img
          src={placeholder}
          alt=""
          className="w-full h-full object-cover"
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default LazyFeedImage;
