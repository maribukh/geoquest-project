import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    base: '/',
    server: {
      host: true,
      port: 5173,
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: [
              'react',
              'react-dom',
              'framer-motion',
              'leaflet',
              'react-leaflet',
            ],
            firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
            ai: ['@google/genai'],
          },
        },
      },
    },
    define: {
      // SECURITY UPDATE:
      // In Development: Expose key so you can test locally without running a backend server.
      // In Production: Set to empty string. The app will use the secure /api/ endpoints instead.
      'process.env.API_KEY': JSON.stringify(
        mode === 'development' ? env.VITE_API_KEY || env.API_KEY : ''
      ),
      'process.env.VITE_FIREBASE_API_KEY': JSON.stringify(
        env.VITE_FIREBASE_API_KEY
      ),
    },
  };
});
