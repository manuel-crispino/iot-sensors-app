/// <reference types="@vitest/browser/matchers" />
/// <reference types= "@vitest/browser-playwright"/>

import { beforeAll } from 'vitest';

// Silenzia warning SSR e 404 favicon
beforeAll(() => {
  // --- console.error ---
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

  // --- window.fetch ---
  const origFetch = window.fetch.bind(window);
  window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
    if (url.includes('favicon.ico') || url.includes('favicon.svg')) {
      return Promise.resolve(new Response(null, { status: 200 }));
    }
    return origFetch(input, init);
  };
});
