import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true, // Use external source maps instead of inline eval
  },
  server: {
    // For development, disable eval-based source maps to avoid CSP issues
    sourcemapIgnoreList: false,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test-setup.js',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test-setup.js',
        '**/*.test.{js,jsx}',
        '**/*.spec.{js,jsx}',
        'dist/',
      ],
    },
  },
})
