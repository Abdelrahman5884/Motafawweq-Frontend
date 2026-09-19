import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('lucide-react')) return 'icons';
            if (id.includes('canvas-confetti')) return 'confetti';
            if (id.includes('react-router-dom') || id.includes('react-dom') || id.includes('react/')) return 'vendor';
          }
        }
      }
    }
  }
});
