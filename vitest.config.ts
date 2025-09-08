import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    // Simple, fast configuration
    testTimeout: 10000,
    // Disable coverage for speed
    coverage: {
      enabled: false,
    },
    // No watching
    watch: false,
    // Basic reporter
    reporter: ['basic'],
  },
});
