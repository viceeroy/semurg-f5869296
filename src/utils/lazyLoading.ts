// Optimized lazy loading utilities for Android performance

export interface LazyLoadOptions {
  rootMargin?: string;
  threshold?: number;
  fallbackDelay?: number;
}

const DEFAULT_OPTIONS: LazyLoadOptions = {
  rootMargin: '50px',
  threshold: 0.1,
  fallbackDelay: 300,
};

// Enhanced intersection observer with Android optimization
export const createLazyLoader = (options: LazyLoadOptions = {}) => {
  const config = { ...DEFAULT_OPTIONS, ...options };
  
  // Use a more conservative threshold for Android devices
  const isAndroid = /Android/i.test(navigator.userAgent);
  if (isAndroid) {
    config.threshold = Math.min(config.threshold!, 0.05);
    config.rootMargin = '100px'; // Larger margin for slower devices
  }

  let observer: IntersectionObserver | null = null;
  const pendingElements = new Set<Element>();

  const initObserver = () => {
    if (!observer && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target;
            
            // Remove from pending set
            pendingElements.delete(element);
            
            // Trigger load event
            const event = new CustomEvent('lazyload', { detail: element });
            element.dispatchEvent(event);
            
            // Stop observing
            observer?.unobserve(element);
          }
        });
      }, {
        rootMargin: config.rootMargin,
        threshold: config.threshold,
      });
    }
  };

  const observe = (element: Element) => {
    initObserver();
    
    if (observer) {
      observer.observe(element);
      pendingElements.add(element);
    } else {
      // Fallback for unsupported browsers
      setTimeout(() => {
        const event = new CustomEvent('lazyload', { detail: element });
        element.dispatchEvent(event);
      }, config.fallbackDelay);
    }
  };

  const unobserve = (element: Element) => {
    observer?.unobserve(element);
    pendingElements.delete(element);
  };

  const disconnect = () => {
    observer?.disconnect();
    observer = null;
    pendingElements.clear();
  };

  return { observe, unobserve, disconnect };
};

// Preload critical resources
export const preloadCriticalResources = () => {
  const resources = [
    '/semurg-logo.png',
    // Add other critical resources
  ];

  resources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = resource.endsWith('.png') || resource.endsWith('.jpg') || resource.endsWith('.webp') ? 'image' : 'fetch';
    link.href = resource;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
};

// Image format detection for WebP support
export const supportsWebP = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
};

// Adaptive loading based on device capabilities
export const getOptimalImageQuality = (): 'low' | 'medium' | 'high' => {
  // Check device capabilities
  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
  const isAndroid = /Android/i.test(navigator.userAgent);
  const isLowEndDevice = navigator.hardwareConcurrency <= 2;

  if (connection) {
    const effectiveType = connection.effectiveType;
    if (effectiveType === 'slow-2g' || effectiveType === '2g') {
      return 'low';
    }
    if (effectiveType === '3g' || (isAndroid && isLowEndDevice)) {
      return 'medium';
    }
  }

  // Default to medium quality for Android, high for others
  return isAndroid ? 'medium' : 'high';
};

// Resource hints for better loading performance
export const addResourceHints = () => {
  const hints = [
    { rel: 'dns-prefetch', href: 'https://mpmweyfstejwjesvgguh.supabase.co' },
    { rel: 'preconnect', href: 'https://mpmweyfstejwjesvgguh.supabase.co' },
    { rel: 'dns-prefetch', href: 'https://fonts.googleapis.com' },
    { rel: 'dns-prefetch', href: 'https://fonts.gstatic.com' },
  ];

  hints.forEach(hint => {
    const existing = document.querySelector(`link[rel="${hint.rel}"][href="${hint.href}"]`);
    if (!existing) {
      const link = document.createElement('link');
      link.rel = hint.rel;
      link.href = hint.href;
      if (hint.rel === 'preconnect') {
        link.crossOrigin = 'anonymous';
      }
      document.head.appendChild(link);
    }
  });
};