import type { Sensor } from "$domain/sensor";

const API_URL = import.meta.env.VITE_API_URL;
const TOKEN = import.meta.env.VITE_API_TOKEN;

// Fetch todos los sensores
export async function getSensores(): Promise<Sensor[]> {
  const res = await fetch(`${API_URL}/sensores`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: TOKEN })
  });

  if (!res.ok) throw new Error("Failed to fetch sensores");
  return await res.json();
}

// Create or Update sensores
export async function saveSensor(sensor: Sensor): Promise<Sensor[]> {
  if (sensor.id && sensor.id > 0) {
    // Update
    await fetch(`${API_URL}/sensores/${sensor.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sensor, token: TOKEN })
    });
  } else {
    // Create
    await fetch(`${API_URL}/sensores/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sensor, token: TOKEN })
    });
  }

  
  return await getSensores();
}

// Delete 
export async function deleteSensor(id: number): Promise<Sensor[]> {
  await fetch(`${API_URL}/sensores/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" }
  });


  return await getSensores();
}
