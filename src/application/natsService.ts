// Importamos las funciones y tipos necesarios de la librería NATS para
// WebSockets
import {connect, StringCodec} from "nats.ws";
import type {NatsConnection}
from "nats.ws";
import { handleToast } from "$lib/utils/handleToast"; 

// Importamos nuestro store de sensores, que es un store Svelte para mantener la
// lista de sensores reactiva en la aplicación
import {sensores} from "$stores/sensorsStore";

// Importamos el tipo Sensor para tipar correctamente los mensajes
import type {Sensor}
from "$domain/sensor";

// Variable global que contendrá la conexión activa a NATS
let nc : NatsConnection;

//  StringCodec se usa para codificar y decodificar los mensajes como strings
// Esto es necesario porque NATS transmite mensajes como Uint8Array
const sc = StringCodec();

/**
 * Función para inicializar la conexión con el servidor NATS
 * @param url URL del servidor NATS con protocolo ws (WebSocket)
 * - Por defecto: "ws://localhost:4224"
 *
 */

export async function initNATS(url = "ws://localhost:4224", onComplete?: () => void) {
    try {
        //  Conectarse al servidor NATS Esto retorna un objeto NatsConnection que
        // usaremos para publicar y suscribir
        nc = await connect({servers: url});
        console.log("✅ Conectado a NATS:", url);

        // Suscribirse al canal "sensores" Cada mensaje enviado a este canal será
        // recibido en el bucle for await
        const sub = nc.subscribe("sensores");

        // Iniciamos un bucle asíncrono para procesar todos los mensajes recibidos
        (async() => {

            for await(const msg of sub) {
                try {

                    // Decodificamos el mensaje de bytes a string y luego a JSON
                    const updatedSensor : Sensor & {
                        action?: string
                    } = JSON.parse(sc.decode(msg.data));
                    console.log("📡 Mensaje NATS recibido:", updatedSensor);

                    // Convalidacion de sensor antes de hacer un update
                    if (updatedSensor
                        ?.id && updatedSensor
                            ?.nombre && updatedSensor
                                ?.tipo && typeof updatedSensor.valor === 'number') {

                        //  Actualizamos el store reactivo de Svelte Esto hace que la UI se actualice
                        // automáticamente cuando cambian los sensores
                        sensores.update(list => {

                            // Si el mensaje indica una acción "delete", eliminamos el sensor de la lista
                            if (updatedSensor.action === "delete") {

                                // Filter crea un nuevo array excluyendo el sensor eliminado
                                handleToast(updatedSensor, "eliminado");
                                return list.filter(s => s.id !== updatedSensor.id);
                            }

                            // Si no es eliminación, buscamos si el sensor ya existe
                            const index = list.findIndex(s => s.id === updatedSensor.id);
                            if (index > -1) {
                                // Si existe, actualizamos sus campos
                                handleToast(updatedSensor, "actualizado");
                                list[index] = {
                                    ...list[index],
                                    ...updatedSensor
                                };
                            } else {
                                // Si no existe, lo añadimos como nuevo
                                handleToast(updatedSensor, "añadido");
                                list.push(updatedSensor);
                            }

                            // Retornamos una nueva copia del array para forzar la reactividad
                            return [...list];
                        });

                    } else {
                        console.warn('Convalidacion no validada! ', updatedSensor);
                    }

                } catch (err) {
                    // Capturamos errores en la decodificación o parsing del mensaje
                    console.error("❌ Error al analizar el mensaje NATS:", err);
                }

            }

            // onComplete senala el test el terminar de la funcion
            if (onComplete) 
                onComplete();
            }
        )();
    } catch (err) {
        // Captura errores de conexión inicial a NATS
        console.error("Error al conectar con NATS:", err);
    }
}

/**
 *  Función para enviar mensajes de actualización de un sensor a NATS
 * @param sensor Objeto Sensor a publicar
 * - Esto permitirá que otros clientes suscritos al canal "sensores" reciban la actualización
 *
 * Documentación NATS Publish: https://docs.nats.io/using-nats/developer/clients/javascript#publish
 */

export async function publishSensorUpdate(sensor : Sensor) {
    // Verificamos que haya conexión activa
    if (!nc) 
        return;
    nc.publish("sensores", sc.encode(JSON.stringify(sensor)));
    console.log("📤 Actualización enviada a NATS:", sensor);
}

// cerrar conexion
export async function closeNATS() {
    if (!nc) 
        return;
    await nc.drain(); // espera a que todo se complete
    console.log("🛑 Conexión NATS cerrada de forma segura");
}