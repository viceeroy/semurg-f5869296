import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { preloadCriticalResources } from './hooks/usePerformance'

// Preload critical resources in the background
preloadCriticalResources().catch(console.error);

createRoot(document.getElementById("root")!).render(<App />);