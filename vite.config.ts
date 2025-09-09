/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  const isProduction = command === 'build';

  return {
    base: '/',
    resolve: {
      alias: {
        '@': new URL('./src', import.meta.url).pathname,
      },
    },
    plugins: [
      react({
        // Disable React DevTools in dev
        include: '**/*.{jsx,tsx}',
        // Optimize JSX runtime
        jsxRuntime: 'automatic',
      }),
    ],
    esbuild: {
      target: 'es2020',
      logOverride: { 'this-is-undefined-in-esm': 'silent' },
      ...(command === 'serve' && {
        logLevel: 'silent',
        logOverride: { 'this-is-undefined-in-esm': 'silent' },
        // More aggressive dev optimizations
        treeShaking: true,
        drop: ['console', 'debugger'],
        legalComments: 'none',
        sourcemap: false,
      }),
      drop: isProduction ? ['console', 'debugger'] : [],
    },
    server: {
      port: 5173,
      host: true,
      strictPort: true,
      // Extreme performance optimizations - disable HMR entirely
      hmr: false, // Completely disable HMR for maximum performance
      // Minimal file watching - more aggressive
      watch: {
        usePolling: false,
        interval: 2000, // Even less frequent checks
        ignored: [
          '**/node_modules/**',
          '**/dist/**',
          '**/coverage/**',
          '**/*.test.*',
          '**/*.spec.*',
          '**/*_backup.*',
          '**/*_fixed.*',
          '**/.git/**',
          '**/src/**/*.test.*',
          '**/src/**/*.spec.*',
        ],
      },
      // Faster middleware
      middlewareMode: false,
      // Enable compression
      compression: true,
      // Disable fs strict mode for faster file access
      fs: {
        strict: false,
        allow: ['..'],
      },
      // Disable source map serving for faster dev
      // sourcemapIgnoreList: true // Removed - not supported in this Vite version
    },
    // Optimized CSS handling
    css: {
      devSourcemap: false,
      postcss: './postcss.config.js',
      preprocessorOptions: {},
      modules: {
        localsConvention: 'camelCase',
        generateScopedName: '[name]__[local]___[hash:base64:5]',
      },
    },
    // Additional performance optimizations
    logLevel: 'warn', // Reduce log verbosity
    clearScreen: false, // Don't clear screen on restart
    // Disable TypeScript checking in dev for faster builds
    ...(command === 'serve' && {
      build: {
        rollupOptions: {
          external: (): boolean => {
            // Skip TypeScript checking for faster dev builds
            return false;
          },
        },
      },
    }),
    // Minimal transforms in development
    define: {
      __DEV__: !isProduction,
    },
    optimizeDeps: {
      include: ['react', 'react-dom'],
      force: false, // Don't force re-optimization unless needed
      entries: ['./src/main.tsx'],
      esbuildOptions: {
        target: 'es2020',
        loader: { '.js': 'jsx' },
        minify: true,
        keepNames: false,
        treeShaking: true,
        sourcemap: false,
        // More aggressive optimizations
        drop: ['console', 'debugger'],
        legalComments: 'none',
      },
    },
    // Performance optimizations
    build: {
      target: 'es2020',
      minify: 'esbuild',
      cssMinify: true,
      sourcemap: false,
      rollupOptions: {
        output: {
          format: 'es',
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            components: ['./src/components/ToolCard/ToolCard.tsx'],
          },
        },
      },
    },
    // Faster builds - esbuild config moved up
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/test/setup.ts',
    },
  };
});
