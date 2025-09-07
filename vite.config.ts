/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  const isProduction = command === 'build';
  
  return {
    plugins: [react()],
    server: {
      port: 5173,
      host: true,
      strictPort: true,
      // Extreme performance optimizations
      hmr: {
        overlay: false,
        port: 24678, // Use different port for HMR
      },
      // Minimal file watching
      watch: {
        usePolling: false,
        interval: 300,
        ignored: ['**/node_modules/**', '**/dist/**']
      },
      // Faster middleware
      middlewareMode: false,
    },
    // Aggressive development optimizations
    css: {
      devSourcemap: false,
      postcss: undefined, // Skip PostCSS in dev
      preprocessorOptions: {},
      modules: false, // Disable CSS modules for faster processing
    },
    // Minimal transforms in development
    define: {
      __DEV__: !isProduction,
    },
  build: {
    target: 'es2015',
    minify: 'esbuild',
    cssMinify: true,
    sourcemap: true, // Add sourcemaps for debugging like dev
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom']
        }
      }
    },
    reportCompressedSize: false, // Faster builds
    chunkSizeWarningLimit: 1000
  },
    optimizeDeps: {
      include: ['react', 'react-dom'],
      // Force immediate optimization
      force: true,
      entries: ['./src/main.tsx'],
      esbuildOptions: {
        target: 'es2020',
        loader: { '.js': 'jsx' },
        // Ultra-fast dev transforms
        minify: false,
        keepNames: false,
        treeShaking: false,
        sourcemap: false,
      }
    },
    // Faster builds
    esbuild: {
      target: 'es2020',
      logOverride: { 'this-is-undefined-in-esm': 'silent' },
      // Skip unnecessary features in dev
      drop: isProduction ? ['console', 'debugger'] : [],
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/test/setup.ts',
    },
  };
});
