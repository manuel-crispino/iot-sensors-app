import { page } from '@vitest/browser/context';
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-svelte';
import SensorForm from '$lib/components/dashboard/SensorForm.svelte';

describe('SensorForm', () => {
	it('debe mostrar error si se envía vacío', async () => {
		render(SensorForm);

		const button = page.getByRole('button', { name: /guardar/i });
		await button.click();

		const error = page.getByText('El nombre es obligatorio');
		await expect.element(error).toBeInTheDocument();
	});
});