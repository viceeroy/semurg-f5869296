import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

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
  const imgRef = useRef<HTMLImageElement>(null);

  // Generate optimized image URL for mobile
  const getOptimizedSrc = (originalSrc: string, targetWidth: number = 400) => {
    // For mobile, we want smaller images for better performance
    const isMobile = window.innerWidth < 768;
    if (isMobile && originalSrc.includes('unsplash.com')) {
      return `${originalSrc}&w=${targetWidth}&q=75&fm=webp`;
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
        rootMargin: '50px 0px' // Start loading 50px before entering viewport
      }
    );

    observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, [priority]);

  useEffect(() => {
    if (isInView && src) {
      setImageSrc(getOptimizedSrc(src, width));
    }
  }, [isInView, src, width]);

  const placeholder = `data:image/svg+xml;base64,${btoa(`
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="50%" y="50%" text-anchor="middle" dy="0.3em" fill="#9ca3af" font-family="Arial" font-size="14">Loading...</text>
    </svg>
  `)}`;

  return (
    <div ref={imgRef} className={cn('relative overflow-hidden', className)}>
      {/* Placeholder background */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Actual image */}
      {imageSrc && (
        <img
          src={imageSrc}
          alt={alt}
          width={width}
          height={height}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
          onLoad={() => setIsLoaded(true)}
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
    </div>
  );
};

export default OptimizedPostImage;