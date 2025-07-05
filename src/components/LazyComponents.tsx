
import { lazy } from "react";

// Lazy load components for better performance
export const LazySearchPage = lazy(() => import("./SearchPage"));
export const LazyProfilePage = lazy(() => import("./ProfilePage"));
export const LazyUploadFlow = lazy(() => import("./UploadFlow"));
