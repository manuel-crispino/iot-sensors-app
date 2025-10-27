import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { playwright } from '@vitest/browser-playwright';

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],

  test: {
    expect: {
      requireAssertions: true,
    },
    projects: [
      // ✅ CLIENT / BROWSER TESTS
      {
        extends: './vite.config.ts',
        test: {
          name: 'client',
          browser: {
            enabled: true,
            provider: playwright(),
            instances: [{ browser: 'chromium' }],
          },
          include: [
            'src/test/browser/**/*.spec.{ts,js}',
            'src/test/browser/**/*.test.{ts,js}',
          ],
          exclude: ['src/lib/server/**'],
          setupFiles: ['./vitest-setup-client.ts'],
        },
      },

      // ✅ SERVER / NODE TESTS
      {
        extends: './vite.config.ts',
        test: {
          name: 'server',
          environment: 'node',
          include: [
            'src/test/server/**/*.spec.{ts,js}',
            'src/test/server/**/*.test.{ts,js}',
          ],
          // Escludiamo componenti Svelte e moduli browser-only
          exclude: [
            'src/**/*.svelte',
            'node_modules/@zerodevx/svelte-toast/**',
          ],
          setupFiles: ['./vitest.setup-server.ts'],
        },
      },
    ],
  },
});

