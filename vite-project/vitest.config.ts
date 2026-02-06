import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    // Enable global test APIs (e.g., `expect`, `test`, `beforeEach`)
    globals: true,
    // Use a DOM-like environment for the tests
    environment: 'happy-dom',
    // If you need a script to run before every test file,
    // create `vitest.setup.ts` at the project root and
    // reference it here.
    setupFiles: ['./vitest.setup.ts'],
    // Add any additional Vitest options here.
  },
});
