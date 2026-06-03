import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/dashboard': {
        target: 'https://inventory-management-jo7m.onrender.com',
        changeOrigin: true,
        secure: false
      },
      '/customers': {
        target: 'https://inventory-management-jo7m.onrender.com',
        changeOrigin: true,
        secure: false
      },
      '/orders': {
        target: 'https://inventory-management-jo7m.onrender.com',
        changeOrigin: true,
        secure: false
      },
      '/products': {
        target: 'https://inventory-management-jo7m.onrender.com',
        changeOrigin: true,
        secure: false
      }
    }
  }
});
