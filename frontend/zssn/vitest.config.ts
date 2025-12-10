import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: ['./src/setupTests.tsx'],
    environment: 'jsdom',
    mockReset: true,
    // Mock CSS files
    globals: {
      __TEST__: true,
    },
    // Mock image imports
    ssr: {
      external: ['@rsbuild'],
    },
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'lcov', 'html', 'json'], // supports lcov for CI tools and html for vitest.ui
      reportsDirectory: './coverage',
      include: ['src/pages/*', 'src/components/*', 'src/api/*'],
      thresholds: {
        statements: 30,
        branches: 30,
        functions: 20,
        lines: 30,
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src', // Alias @ to src folder
    },
  },
});
