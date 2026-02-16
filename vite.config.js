import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 11235,
  },
  build: {
    rollupOptions: {
      external: [],
    },
  },
  // Exclude the old prototype from dependency scanning
  optimizeDeps: {
    exclude: [],
    entries: ['index.html'],
  },
});
