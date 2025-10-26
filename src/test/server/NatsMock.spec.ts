import { describe, it, expect, vi, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import { sensores } from '$stores/sensorsStore';

// MOCK NATS prima di importare initNATS
vi.mock('nats.ws', () => {
  const fakeMessage = { id: 1, nombre: 'Sensor Temp', valor: 99 };
  return {
    connect: async () => ({
      subscribe: () => ({
        [Symbol.asyncIterator]() {
          return {
            async *[Symbol.asyncIterator]() {
              yield { data: new TextEncoder().encode(JSON.stringify(fakeMessage)) };
            }
          };
        }
      })
    }),
    StringCodec: () => ({
      encode: (msg: string) => new TextEncoder().encode(msg),
      decode: (data: Uint8Array) => new TextDecoder().decode(data)
    }),
  };
});

// Ora importiamo il modulo che usa nats.ws
import { initNATS } from '$application/natsService';

describe('natsService', () => {
  beforeEach(() => {
    sensores.set([]); // reset store
  });

  it('actualiza sensores al recibir mensaje', async () => {
    await initNATS();

    const list = get(sensores);
    expect(list.some(s => s.nombre === 'Sensor Temp')).toBeTruthy();
    expect(list[0].valor).toBe(99);
  });
});
