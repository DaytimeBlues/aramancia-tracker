import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
<<<<<<< HEAD
    root: '.',
    setupFiles: path.resolve(__dirname, 'src/test/setup.ts'),
=======
    setupFiles: path.resolve(__dirname, './src/test/setup.ts'),
>>>>>>> 5b0877a (fix: restore build and tests (resolve type errors, missing imports, syntax issue))
  },
})
