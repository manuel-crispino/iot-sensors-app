import tailwindcss from '@tailwindcss/vite';
import {defineConfig} from 'vitest/config';
import {sveltekit} from '@sveltejs/kit/vite';

export default defineConfig({
    plugins: [
        tailwindcss(), sveltekit()
    ],
    test: {
        expect: {
            requireAssertions: true
        },
        projects: [
            // ✅ Client / Browser Tests
            {
                extends: './vite.config.ts',
                test: {
                    name: 'client',
                    environment: 'browser',
                    browser: {
                        enabled: true,
                        provider: 'playwright',
                        instances: [
                            {
                                browser: 'chromium'
                            }
                        ]
                    },
                    include: [
                        'src/test/browser/**/*.spec.{ts,js}', 'src/test/browser/**/*.test.{ts,js}'
                    ],
                    exclude: ['src/lib/server/**'],
                    setupFiles: ['./vitest-setup-client.ts'] 
                }
            },

            // ✅ Server / Node Tests
            {
                extends: './vite.config.ts',
                test: {
                    name: 'server',
                    environment: 'node',
                    include: [
                        'src/test/server/**/*.spec.{ts,js}', 'src/test/server/**/*.test.{ts,js}'
                    ],
                    exclude: ['src/**/*.svelte.{spec,test}.{ts,js}']
                }
            }
        ]
    }
});
