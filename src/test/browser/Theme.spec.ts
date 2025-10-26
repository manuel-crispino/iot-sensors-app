import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Nav from '$lib/components/layout/Nav.svelte';
import { page } from '@vitest/browser/context';

describe('Nav', () => {
	it('debería alternar entre dark y light mode', async () => {
		render(Nav);

		const button = page.getByRole('button', { name: /dark/i });
		await button.click();

		const html = document.documentElement;
		expect(html.classList.contains('dark')).toBeTruthy();
	});
});