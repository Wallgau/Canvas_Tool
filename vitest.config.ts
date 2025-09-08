import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    // Memory-efficient configuration
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    testTimeout: 10000,
    // Disable coverage for speed
    coverage: {
      enabled: false,
    },
    // No watching
    watch: false,
    // Use default reporter instead of deprecated 'basic'
    reporter: ['default'],
    // Memory management
    maxConcurrency: 1,
    isolate: true,
  },
});
