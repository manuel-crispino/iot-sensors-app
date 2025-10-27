import { vi, beforeAll, afterAll } from 'vitest';

// 🔹 Mock di SvelteToast per evitare errori in Node
vi.mock('@zerodevx/svelte-toast', () => ({
  toast: { push: vi.fn() },
}));

beforeAll(() => {
  console.log('💡 Server setup started');

  // 🔹 Silenzia gli errori SSR “transport was disconnected”
  const origError = console.error;
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('transport was disconnected') ||
        args[0].includes('cannot call "fetchModule"'))
    ) {
      return;
    }
    origError(...(args as [unknown, ...unknown[]]));
  };

  // 🔹 Silenzia favicon 404 nei test Node
  if (typeof window !== 'undefined') {
    const origFetch = window.fetch.bind(window);
    window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
      const url =
        typeof input === 'string'
          ? input
          : input instanceof URL
          ? input.href
          : input.url;
      if (url.includes('favicon.ico') || url.includes('favicon.svg')) {
        return Promise.resolve(new Response(null, { status: 200 }));
      }
      return origFetch(input, init);
    };
  }
});

afterAll(() => {
  console.log('💡 Server teardown finished');
});

