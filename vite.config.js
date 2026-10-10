import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/',
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // Keep the standard backdrop-filter declaration in the production CSS.
    // The default CSS minifier emits only the WebKit-prefixed form, which
    // Chromium ignores for these glass surfaces.
    cssMinify: false,
  },
});
