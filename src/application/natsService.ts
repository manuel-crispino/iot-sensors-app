import { connect, StringCodec } from "nats.ws";
import type { NatsConnection } from "nats.ws";
import { sensores } from "$stores/sensorsStore";
import type { Sensor } from "$domain/sensor";

let nc: NatsConnection;
const sc = StringCodec();

// 🔹 Conectarse a NATS
export async function initNATS(url = "ws://localhost:4224") {
  try {
    nc = await connect({ servers: url });
    console.log("✅ Conectado a NATS:", url);

    // Suscribirse al canal de sensores
    const sub = nc.subscribe("sensores");
    (async () => {
      for await (const msg of sub) {
        try {
          const updatedSensor: Sensor & { action?: string } = JSON.parse(sc.decode(msg.data));
          console.log("📡 Mensaje NATS recibido:", updatedSensor);
            
          // Actualizar el store
          sensores.update(list => {

            // delete
            if (updatedSensor.action === "delete") {
              // 👇 Si es una eliminación, eliminar de la lista
              return list.filter(s => s.id !== updatedSensor.id);
            }

            const index = list.findIndex(s => s.id === updatedSensor.id);
            if (index > -1) {
              list[index] = { ...list[index], ...updatedSensor };
            } else {
              list.push(updatedSensor); // si es nuevo, lo añade
            }
            return [...list];
          });
        } catch (err) {
          console.error("❌ Error al analizar el mensaje NATS:", err);
        }
      }
    })();
  } catch (err) {
    console.error("❌ Error al conectar con NATS:", err);
  }
}

// 🔹 Enviar mensajes (opcional)
export async function publishSensorUpdate(sensor: Sensor) {
  if (!nc) return;
  nc.publish("sensores", sc.encode(JSON.stringify(sensor)));
  console.log("📤 Actualización enviada a NATS:", sensor);
}
