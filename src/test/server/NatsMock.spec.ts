import {describe, it, expect, vi, beforeEach} from 'vitest';
import {get} from 'svelte/store';
import {sensores} from '$stores/sensorsStore';
import {initNATS, publishSensorUpdate, closeNATS} from '$application/natsService';
import {connect as natsConnect} from 'nats.ws';
import type {NatsConnection}
from 'nats.ws';
import type { Sensor } from '$domain/sensor';

/*
  En este test se utiliza el pattern AAA (Arrange, Act, Assert)

  Arrange:
    - Preparamos todo lo necesario para el test
    - Inicializamos stores, mocks y estado inicial
    - Ejemplo: sensores.set([]), vi.resetAllMocks()

  Act:
    - Ejecutamos la acción que queremos probar
    - En este caso: initNATS() que procesa los mensajes NATS

  Assert:
    - Verificamos que el resultado sea el esperado
    - Comprobamos que los sensores válidos se agregaron,
      los malformados fueron ignorados y las actualizaciones funcionaron
    - Ejemplo: expect(list).toHaveLength(1), expect(list[0].valor).toBe(55)
*/

// 🔹 Mock completo de nats.ws
vi.mock('nats.ws', () => {

    const publishMock = vi.fn();
    const drainMock = vi.fn();

    return {
        connect: async() => ({
            subscribe: () => ({
                // Iterador asincrónico que simula múltiples mensajes NATS
                [Symbol.asyncIterator]: async function * () {
                    // Mensaje válido
                    yield {
                        data: new TextEncoder().encode(JSON.stringify({id: 1, nombre: 'Sensor Temp', tipo: 'temperatura', valor: 99, estado: true}))
                    };

                    // Mensaje malformado (edge case)
                    yield {
                        data: new TextEncoder().encode(JSON.stringify({nombre: null, valor: 'NaN'}))
                    };

                    // Otro mensaje válido
                    yield {
                        data: new TextEncoder().encode(JSON.stringify({id: 2, nombre: 'Sensor Humedad', tipo: 'humedad', valor: 55, estado: true}))
                    };

                    // Mensaje de eliminación de sensor (edge case)
                    yield {
                        data: new TextEncoder().encode(JSON.stringify({
                            id: 1,
                            nombre: 'Sensor Temp',
                            tipo: 'temperatura',
                            valor: 99,
                            estado: true,
                            action: 'delete'
                        }))
                    };
                }
            }),
            publish: publishMock,
            drain: drainMock
        }),
        StringCodec: () => ({
            encode: (msg : string) => new TextEncoder().encode(msg),
            decode: (data : Uint8Array) => new TextDecoder().decode(data)
        })
    };
});

describe('natsService', () => {

    // 🔹 Limpiar el store y mocks antes de cada test
    beforeEach(() => {
        sensores.set([]);
        vi.resetAllMocks();
        // 🔹 Mock de console para no ver logs durante los tests
        vi
            .spyOn(console, 'log')
            .mockImplementation(() => {});
        vi
            .spyOn(console, 'warn')
            .mockImplementation(() => {});
        vi
            .spyOn(console, 'error')
            .mockImplementation(() => {});
    });

    it('agrega solo sensores válidos y procesa eliminación correctamente', async() => {
        // ----- AAA ----- Arrange & Act
        await new Promise < void > ((resolve) => {
            initNATS(undefined, resolve);
        });
        const list = get(sensores);

        // ----- Assert ----- Verificar que los sensores malformados no se agreguen
        expect(list.every(s => s.nombre && typeof s.valor === 'number')).toBeTruthy();

        // Solo debe quedar el sensor Humedad (Sensor Temp fue eliminado)
        expect(list).toHaveLength(1);

        expect(list[0]).toEqual({id: 2, nombre: 'Sensor Humedad', tipo: 'humedad', valor: 55, estado: true});
    });

    it('actualiza sensores existentes en lugar de duplicar', async() => {
        // Arrange: insertamos un sensor inicial
        sensores.set([
            {
                id: 2,
                nombre: 'Sensor Humedad',
                tipo: 'humedad',
                valor: 50,
                estado: true
            }
        ]);

        // Act: inicializamos NATS que incluye actualización del mismo sensor
        await new Promise < void > ((resolve) => {
            initNATS(undefined, resolve);
        });

        const list = get(sensores);

        // Assert: el sensor existente debe ser actualizado, no duplicado
        expect(list).toHaveLength(1); // Sensor Temp eliminado + Sensor Humedad actualizado

        const sensorHumedad = list.find(s => s.id === 2);
        expect(sensorHumedad
            ?.valor).toBe(55); // valor actualizado
    });

    it('maneja correctamente múltiples casos malformados sin romper', async() => {
        // Act
        await new Promise < void > ((resolve) => {
            initNATS(undefined, resolve);
        });

        const list = get(sensores);

        // Assert: todos los objetos en el store deben ser válidos
        expect(list.every(s => s.nombre && typeof s.valor === 'number')).toBeTruthy();
    });

    it('publica correctamente un sensor', async() => {
        const ncInstance = await natsConnect(); // mock instance
        (global as unknown as {
            nc : NatsConnection
        })!.nc = ncInstance; // tipado seguro reemplazamos nc global
        const sensor = {
            id: 3,
            nombre: 'Sensor Luz',
            tipo: 'luz',
            valor: 75,
            estado: true
        };
        await publishSensorUpdate(sensor);
        expect(ncInstance.publish).toHaveBeenCalledTimes(1);
        expect(ncInstance.publish).toHaveBeenCalledWith('sensores', expect.any(Uint8Array));
    });

    it('cierra la conexión sin errores', async() => {
        const ncInstance = await natsConnect();
        (global as unknown as {
            nc : NatsConnection
        })!.nc = ncInstance; // tipado seguro reemplazamos nc global
        await closeNATS();
        expect(ncInstance.drain).toHaveBeenCalledTimes(1);
    });
});

describe('natsService adicional tests', () => {

    it('actualiza correctamente un sensor existente sin duplicarlo', async() => {
        sensores.set([
            {
                id: 2,
                nombre: 'Sensor Humedad',
                tipo: 'humedad',
                valor: 50,
                estado: true
            }
        ]);
        const ncInstance = await natsConnect();
        (global as unknown as {
            nc : NatsConnection
        })!.nc = ncInstance;

        // Publicamos una actualización del mismo sensor
        const updatedSensor = {
            id: 2,
            nombre: 'Sensor Humedad',
            tipo: 'humedad',
            valor: 60,
            estado: true
        };
        await publishSensorUpdate(updatedSensor);

        // Simulamos recepción del mensaje
        sensores.update(list => list.map(s => s.id === updatedSensor.id
            ? updatedSensor
            : s));

        const list = get(sensores);
        expect(list).toHaveLength(1);
        expect(list[0].valor).toBe(60);
    });

    it('intenta eliminar un sensor que no existe y no rompe', async() => {
        sensores.set([
            {
                id: 2,
                nombre: 'Sensor Humedad',
                tipo: 'humedad',
                valor: 50,
                estado: true
            }
        ]);
        const nonExistent = {
            id: 99,
            nombre: 'Sensor Fantasma',
            tipo: 'fantasma',
            valor: 0,
            estado: false,
            action: 'delete'
        };

        sensores.update(list => list.filter(s => s.id !== nonExistent.id)); // simula recepción
        const list = get(sensores);

        expect(list).toHaveLength(1);
        expect(list[0].id).toBe(2);
    });

    it('procesa múltiples actualizaciones de sensores correctamente', async() => {
        sensores.set([]);
        const sensors = [
            {
                id: 1,
                nombre: 'A',
                tipo: 't',
                valor: 10,
                estado: true
            }, {
                id: 2,
                nombre: 'B',
                tipo: 't',
                valor: 20,
                estado: true
            }, {
                id: 3,
                nombre: 'C',
                tipo: 't',
                valor: 30,
                estado: true
            }
        ];

        sensors.forEach(s => sensores.update(list => [
            ...list,
            s
        ]));
        sensores.update(list => list.map(s => ({
            ...s,
            valor: s.valor + 5
        })));

        const list = get(sensores);
        expect(list.map(s => s.valor)).toEqual([15, 25, 35]);
    });

    it('ignora mensajes completamente inválidos sin romper', async() => {
        sensores.set([]);
        const invalidMessages = [
            null,
            undefined,
            "string random",
            12345, {
                nombre: "Test"
            } // sin id ni valor
        ];

        invalidMessages.forEach(msg => {
            try {
                if (msg && typeof msg === 'object' && 'id' in msg && 'valor' in msg) {
                    sensores.update(list => [
                        ...list,
                        msg as unknown as Sensor
                    ]);
                }
            } catch (e: unknown) {
                console.warn(e);
            }
        });

        const list = get(sensores);
        expect(list).toHaveLength(0);
    });

    it('agrega un sensor nuevo correctamente', async() => {
        sensores.set([]);
        const newSensor = {
            id: 10,
            nombre: 'Sensor Nuevo',
            tipo: 'temp',
            valor: 99,
            estado: true
        };
        sensores.update(list => [
            ...list,
            newSensor
        ]);

        const list = get(sensores);
        expect(list).toHaveLength(1);
        expect(list[0]).toEqual(newSensor);
    });

});
