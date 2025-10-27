import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Nav from '$lib/components/layout/Nav.svelte';

describe('Nav', () => {
  beforeEach(() => {
    // Silenzia console
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('debería alternar entre dark y light mode', async () => {
    const { container } = render(Nav);

    const button = container.querySelector('button');
    if (!button) throw new Error('Botón no encontrado');

    // Stato iniziale
    const html = document.documentElement;
    const initialDark = html.classList.contains('dark');

    // Click sul bottone per alternare
    button.click();

    // Controlla che lo stato sia invertito
    const afterClickDark = html.classList.contains('dark');
    expect(afterClickDark).toBe(!initialDark);
  });
});