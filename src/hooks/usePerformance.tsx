
import { useEffect, useRef, useCallback, useState } from 'react';

// Simplified performance monitoring
export const usePerformance = () => {
  const performanceRef = useRef<{[key: string]: number}>({});

  const markStart = useCallback((label: string) => {
    performanceRef.current[`${label}_start`] = Date.now();
  }, []);

  const markEnd = useCallback((label: string) => {
    const startTime = performanceRef.current[`${label}_start`];
    if (startTime) {
      const duration = Date.now() - startTime;
      if (duration > 200) { // Only log very slow operations
        console.log(`Performance: ${label} took ${duration}ms`);
      }
      return duration;
    }
    return 0;
  }, []);

  return { markStart, markEnd };
};

// Simplified debounce hook
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

// Minimal idle callback
export const useIdleCallback = (callback: () => void, dependencies: any[] = []) => {
  useEffect(() => {
    const handle = setTimeout(callback, 100); // Simple timeout for mobile
    return () => clearTimeout(handle);
  }, dependencies);
};

// Minimal resource preloading
export const preloadCriticalResources = async () => {
  try {
    const img = new Image();
    img.src = '/semurg-logo.png';
  } catch (error) {
    // Silently fail
  }
};

// Simple image preloader
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const timeout = setTimeout(() => reject(new Error('Timeout')), 2000);
    
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
