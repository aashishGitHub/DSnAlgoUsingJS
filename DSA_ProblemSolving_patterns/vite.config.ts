import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    // Vitest configuration
    globals: true,
    environment: 'node',
    include: ['src/**/*.{test,spec}.{js,ts}'],
    exclude: ['node_modules', 'dist'],
  },
})
