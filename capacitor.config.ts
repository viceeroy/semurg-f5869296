import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.289c5b12c26a4968a44795dc54ddd840',
  appName: 'semurg',
  webDir: 'dist',
  server: {
    url: 'https://289c5b12-c26a-4968-a447-95dc54ddd840.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    Camera: {
      permissions: [
        'camera',
        'photos'
      ]
    }
  },
  android: {
    webContentsDebuggingEnabled: false,
    allowMixedContent: false,
    captureInput: true,
    webViewPreferences: {
      javaScriptEnabled: true,
      loadsImagesAutomatically: true,
      allowFileAccessFromFileURLs: false,
      allowUniversalAccessFromFileURLs: false
    },
    // Android-specific performance optimizations
    backgroundColor: '#ffffff',
    toolbar: {
      height: 0
    }
  },
  ios: {
    webContentsDebuggingEnabled: false,
    allowsLinkPreview: false,
    backgroundColor: '#ffffff'
  }
};

export default config;