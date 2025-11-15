import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.zanza.app',
  appName: 'zanza',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
