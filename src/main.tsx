
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Only preload on desktop or fast connections
const shouldPreload = () => {
  const connection = (navigator as any).connection;
  if (!connection) return window.innerWidth > 768; // Desktop fallback
  
  return connection.effectiveType === '4g' || 
         connection.effectiveType === 'wifi' || 
         window.innerWidth > 768;
};

// Preload critical resources only when appropriate
if (shouldPreload()) {
  import('./hooks/usePerformance').then(({ preloadCriticalResources }) => {
    preloadCriticalResources().catch(console.warn);
  });
}

createRoot(document.getElementById("root")!).render(<App />);
