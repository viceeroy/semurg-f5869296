
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Minimal resource preloading for faster startup
const connection = (navigator as any).connection;
const isSlowConnection = connection && (connection.effectiveType === '2g' || connection.effectiveType === '3g');

// Only preload on fast connections and desktop
if (!isSlowConnection && window.innerWidth > 768) {
  import('./hooks/usePerformance').then(({ preloadCriticalResources }) => {
    preloadCriticalResources().catch(() => {
      // Silently fail to avoid blocking app startup
    });
  });
}

createRoot(document.getElementById("root")!).render(<App />);
