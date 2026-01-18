import { defineConfig } from 'vite';

export default defineConfig({
  // Build optimization
  build: {
    outDir: 'dist',
    minify: 'terser',
    sourcemap: false,
    rollupOptions: {
      input: {
        main: 'index.html',
        results: 'results.html',
      },
      output: {
        manualChunks: undefined,
      },
    },
  },

  // Server configuration for development
  server: {
    port: 3000,
    open: true,
  },

  // Preview configuration
  preview: {
    port: 4173,
  },
});
