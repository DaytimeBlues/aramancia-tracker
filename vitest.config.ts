import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    root: '.',
    setupFiles: path.resolve(__dirname, 'src/test/setup.ts'),
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        'src/features/minions/minionSlice.ts': { branches: 90 },
        'src/store/middleware/concentrationMiddleware.ts': { branches: 95 },
      },
    },
  },
})
