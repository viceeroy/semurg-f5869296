import { useEffect, useRef, useCallback, useState } from 'react';

// Hook for performance monitoring
export const usePerformance = () => {
  const performanceRef = useRef<{[key: string]: number}>({});

  const markStart = useCallback((label: string) => {
    performanceRef.current[`${label}_start`] = performance.now();
  }, []);

  const markEnd = useCallback((label: string) => {
    const startTime = performanceRef.current[`${label}_start`];
    if (startTime) {
      const duration = performance.now() - startTime;
      console.log(`Performance: ${label} took ${duration.toFixed(2)}ms`);
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

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Hook for request idle callback
export const useIdleCallback = (callback: () => void, dependencies: any[] = []) => {
  useEffect(() => {
    const handle = requestIdleCallback ? 
      requestIdleCallback(callback) : 
      setTimeout(callback, 0);

    return () => {
      if (requestIdleCallback) {
        cancelIdleCallback(handle as number);
      } else {
        clearTimeout(handle as number);
      }
    };
  }, dependencies);
};

// Preload images
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

// Preload critical resources
export const preloadCriticalResources = async () => {
  const criticalImages = [
    '/lovable-uploads/27ae4cc5-04c1-4658-9874-0047f68ae963.png',
    // Add other critical images here
  ];

  await Promise.all(criticalImages.map(preloadImage));
};