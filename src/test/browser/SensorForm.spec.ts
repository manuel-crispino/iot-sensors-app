import { describe, it, vi, expect, beforeEach } from 'vitest';
import { render } from 'vitest-browser-svelte';
import SensorForm from '$lib/components/dashboard/SensorForm.svelte';

describe('SensorForm', () => {
  let onSubmit: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onSubmit = vi.fn();
  });

  it('no llama onSubmit si se envía vacío', async () => {
    // crea un div nel DOM dove montare il componente
    const target = document.createElement('div');
    document.body.appendChild(target);

    render(SensorForm, { target, props: { onSubmit } });

    // trova il bottone
    const button = target.querySelector('button');
    if (!button) throw new Error('Botón no encontrado');

    // click sul bottone
    button.click();

    // verifica che onSubmit non sia stato chiamato
    expect(onSubmit).not.toHaveBeenCalled();

    // pulizia
    target.remove();
  });
});
