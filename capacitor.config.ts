import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.colinkiama.ninjump',
  appName: 'Ninjump',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
