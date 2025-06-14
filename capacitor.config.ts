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
  }
};

export default config;