
import { useEffect, useRef, useCallback, useState } from 'react';

// Hook for performance monitoring (simplified for mobile)
export const usePerformance = () => {
  const performanceRef = useRef<{[key: string]: number}>({});

  const markStart = useCallback((label: string) => {
    if (typeof performance !== 'undefined') {
      performanceRef.current[`${label}_start`] = performance.now();
    }
  }, []);

  const markEnd = useCallback((label: string) => {
    if (typeof performance === 'undefined') return 0;
    
    const startTime = performanceRef.current[`${label}_start`];
    if (startTime) {
      const duration = performance.now() - startTime;
      if (duration > 100) { // Only log slow operations
        console.log(`Performance: ${label} took ${duration.toFixed(2)}ms`);
      }
      return duration;
    }
    return 0;
  }, []);

  return { markStart, markEnd };
};

// Hook for debounced API calls
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

// Hook for request idle callback (optimized for mobile)
export const useIdleCallback = (callback: () => void, dependencies: any[] = []) => {
  useEffect(() => {
    const handle = requestIdleCallback ? 
      requestIdleCallback(callback, { timeout: 1000 }) : 
      setTimeout(callback, 50); // Shorter timeout for mobile

    return () => {
      if (requestIdleCallback && typeof handle === 'number') {
        cancelIdleCallback(handle);
      } else {
        clearTimeout(handle as number);
      }
    };
  }, dependencies);
};

// Preload critical resources (reduced for mobile)
export const preloadCriticalResources = async () => {
  const criticalImages = ['/semurg-logo.png']; // Reduced list
  
  // Only preload on fast connections
  const connection = (navigator as any).connection;
  if (connection && (connection.effectiveType === '4g' || connection.effectiveType === 'wifi')) {
    try {
      await Promise.all(criticalImages.map(preloadImage));
    } catch (error) {
      console.warn('Failed to preload some images:', error);
    }
  }
};

// Preload images with timeout
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const timeout = setTimeout(() => reject(new Error('Timeout')), 3000);
    
    img.onload = () => {
      clearTimeout(timeout);
      resolve();
    };
    img.onerror = () => {
      clearTimeout(timeout);
      reject();
    };
    img.src = src;
  });
};
