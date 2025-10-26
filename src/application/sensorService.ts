import type { Sensor } from "$domain/sensor";
import { publishSensorUpdate } from './natsService';

const API_URL = import.meta.env.VITE_API_URL;
const TOKEN = import.meta.env.VITE_API_TOKEN;

// 🔹 Fetch all sensores
export async function getSensores(): Promise<Sensor[]> {
  const res = await fetch(`${API_URL}/sensores`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: TOKEN })
  });

  if (!res.ok) throw new Error("Failed to fetch sensores");
  return await res.json();
}

// 🔹 Create or Update sensor
export async function saveSensor(sensor: Sensor): Promise<Sensor[]> {
  try {
    let res;

    if (sensor.id && sensor.id > 0) {
      // 🔧 Update existing sensor
      res = await fetch(`${API_URL}/sensores/${sensor.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sensor, token: TOKEN }) // 👈 annidato!
      });
    } else {
      // 🔧 Create new sensor
      res = await fetch(`${API_URL}/sensores/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sensor, token: TOKEN }) // 👈 annidato!
      });
    }

    if (!res.ok) throw new Error("Failed to save sensor");

    const updatedSensor: Sensor = await res.json();

    // 🔔 Pubblica su NATS
    publishSensorUpdate(updatedSensor);

    return await getSensores();

  } catch (err) {
    console.error("Error in saveSensor:", err);
    throw err;
  }
}


// 🔴 Delete sensor
export async function deleteSensor(id: number): Promise<Sensor[]> {
  try {
    const res = await fetch(`${API_URL}/sensores/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, token: TOKEN }) // 👈 annidato!
    });

    if (!res.ok) throw new Error("Failed to delete sensor");

    const deleted = await res.json();

    // 👇 Pubblica evento di eliminazione
    publishSensorUpdate({ ...deleted, action: "delete" });
    
    return await getSensores();

  } catch (err) {
    console.error("Error in deleteSensor:", err);
    throw err;
  }
}