import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        assetFileNames: '[name].[ext]', // This will keep the original filename and extension
        chunkFileNames: '[name].js', // For chunk files
        entryFileNames: '[name].js', // For entry files
      },
    },
  },
});
