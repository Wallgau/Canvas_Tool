import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    // Ultra-fast configuration
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    // Very short timeout
    testTimeout: 5000,
    // Disable coverage
    coverage: {
      enabled: false,
    },
    // Single test at a time
    maxConcurrency: 1,
    // No isolation for speed
    isolate: false,
    // No watching
    watch: false,
    // Sequential only
    sequence: {
      concurrent: false,
    },
    // Skip slow tests
    slowTestThreshold: 1000,
    // Reporters
    reporter: ['basic'],
  },
});
