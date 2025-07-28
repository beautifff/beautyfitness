import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  optimizeDeps: {
    exclude: [
      './static/js/forms.js',
      './static/js/main.js',
      './static/js/modal.js',
      './static/js/fitness-classes.js',
      './static/js/blog.js',
      './static/js/locations.js'
    ]
  },
  build: {
    rollupOptions: {
      external: [
        './static/js/forms.js',
        './static/js/main.js',
        './static/js/modal.js',
        './static/js/fitness-classes.js',
        './static/js/blog.js',
        './static/js/locations.js'
      ]
    }
  }
}); 