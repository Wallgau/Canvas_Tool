import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    // Memory optimizations - use processes instead of threads
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    // Reduce test timeout
    testTimeout: 10000,
    // Disable coverage for faster runs
    coverage: {
      enabled: false,
    },
    // Memory management
    maxConcurrency: 1,
    // Reduce memory usage
    isolate: true,
    // Disable file watching
    watch: false,
    // Force sequential execution
    sequence: {
      concurrent: false,
    },
  },
});
