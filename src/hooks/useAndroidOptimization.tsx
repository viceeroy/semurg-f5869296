import { useEffect, useRef } from 'react';
import { addResourceHints, preloadCriticalResources } from '@/utils/lazyLoading';

interface AndroidOptimizationOptions {
  enableResourceHints?: boolean;
  enableCriticalResourcePreload?: boolean;
  optimizeScrolling?: boolean;
  reduceAnimations?: boolean;
}

const DEFAULT_OPTIONS: AndroidOptimizationOptions = {
  enableResourceHints: true,
  enableCriticalResourcePreload: true,
  optimizeScrolling: true,
  reduceAnimations: true,
};

export const useAndroidOptimization = (options: AndroidOptimizationOptions = {}) => {
  const config = { ...DEFAULT_OPTIONS, ...options };
  const isAndroid = /Android/i.test(navigator.userAgent);
  const initialized = useRef(false);

  useEffect(() => {
    if (!isAndroid || initialized.current) return;

    const optimizeForAndroid = async () => {
      // Add resource hints for faster DNS resolution and preconnections
      if (config.enableResourceHints) {
        addResourceHints();
      }

      // Preload critical resources
      if (config.enableCriticalResourcePreload) {
        preloadCriticalResources();
      }

      // Optimize scrolling performance
      if (config.optimizeScrolling) {
        // Add passive event listeners for better scroll performance
        const passiveIfSupported = supportsPassive() ? { passive: true } : false;
        
        document.addEventListener('touchstart', () => {}, passiveIfSupported);
        document.addEventListener('touchmove', () => {}, passiveIfSupported);
        document.addEventListener('wheel', () => {}, passiveIfSupported);

        // Add scroll optimization CSS
        const style = document.createElement('style');
        style.textContent = `
          * {
            -webkit-overflow-scrolling: touch;
            scroll-behavior: smooth;
          }
          
          /* Optimize Android WebView rendering */
          body {
            -webkit-transform: translateZ(0);
            transform: translateZ(0);
            -webkit-backface-visibility: hidden;
            backface-visibility: hidden;
          }
          
          /* Reduce paint complexity for Android */
          img, video {
            -webkit-transform: translateZ(0);
            transform: translateZ(0);
          }
        `;
        document.head.appendChild(style);
      }

      // Reduce animations on low-end Android devices
      if (config.reduceAnimations && isLowEndDevice()) {
        const style = document.createElement('style');
        style.textContent = `
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        `;
        document.head.appendChild(style);
      }

      // Set Android-specific meta tags
      setAndroidMetaTags();

      // Optimize viewport for Android
      optimizeViewport();

      initialized.current = true;
    };

    optimizeForAndroid();
  }, [isAndroid, config]);

  return {
    isAndroid,
    isOptimized: initialized.current,
  };
};

// Helper functions
const supportsPassive = (): boolean => {
  let passiveSupported = false;
  try {
    const options = {
      get passive() {
        passiveSupported = true;
        return false;
      }
    };
    window.addEventListener('testpassive' as any, () => {}, options as any);
    window.removeEventListener('testpassive' as any, () => {}, options as any);
  } catch (err) {
    passiveSupported = false;
  }
  return passiveSupported;
};

const isLowEndDevice = (): boolean => {
  // Check for low-end device indicators
  const cores = navigator.hardwareConcurrency || 1;
  const memory = (navigator as any).deviceMemory || 1;
  const connection = (navigator as any).connection || {};
  
  return (
    cores <= 2 ||
    memory <= 2 ||
    connection.saveData ||
    connection.effectiveType === '2g' ||
    connection.effectiveType === 'slow-2g'
  );
};

const setAndroidMetaTags = () => {
  // Add Android-specific meta tags if they don't exist
  const metaTags = [
    { name: 'mobile-web-app-capable', content: 'yes' },
    { name: 'theme-color', content: '#10b981' },
    { name: 'msapplication-TileColor', content: '#10b981' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
  ];

  metaTags.forEach(({ name, content }) => {
    const existing = document.querySelector(`meta[name="${name}"]`);
    if (!existing) {
      const meta = document.createElement('meta');
      meta.name = name;
      meta.content = content;
      document.head.appendChild(meta);
    }
  });
};

const optimizeViewport = () => {
  // Optimize viewport for Android devices
  const viewport = document.querySelector('meta[name="viewport"]');
  if (viewport) {
    viewport.setAttribute('content', 
      'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover'
    );
  }
};

// Export utility functions for direct use
export const androidOptimizationUtils = {
  isAndroid: /Android/i.test(navigator.userAgent),
  isLowEndDevice,
  supportsPassive,
  setAndroidMetaTags,
  optimizeViewport,
};