import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    // Performance optimizations
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true
      }
    },
    // Reduce test timeout
    testTimeout: 10000,
    // Disable coverage for faster runs
    coverage: {
      enabled: false
    }
  }
})