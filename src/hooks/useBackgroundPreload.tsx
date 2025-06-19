import { useState, useEffect } from "react";

export const useBackgroundPreload = (shouldPreload: boolean) => {
  const [preloadStarted, setPreloadStarted] = useState(false);
  
  useEffect(() => {
    if (!shouldPreload || preloadStarted) return;
    
    // Use requestIdleCallback for better performance, fallback to setTimeout
    const startPreload = () => {
      setPreloadStarted(true);
    };

    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(startPreload, { timeout: 1000 });
    } else {
      setTimeout(startPreload, 200);
    }
  }, [shouldPreload, preloadStarted]);

  return {
    shouldLoadProfile: preloadStarted,
    shouldLoadCollections: preloadStarted,
    shouldLoadSearch: preloadStarted,
    isPreloaded: preloadStarted
  };
};