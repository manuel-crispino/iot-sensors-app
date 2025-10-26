import type { Sensor } from "$domain/sensor";

const API = import.meta.env.VITE_API_URL;

// 🔹 GET all
export async function getSensores(): Promise<Sensor[]> {
  const res = await fetch(`${API}/sensores`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: import.meta.env.VITE_API_TOKEN })
  });

  if (!res.ok) throw new Error("Failed to fetch sensors");
  return res.json();
}

// 🔹 CREATE
export async function createSensor(sensor: Sensor): Promise<Sensor> {
  const res = await fetch(`${API}/sensores`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sensor)
  });
  if (!res.ok) throw new Error("Failed to create sensor");
  return res.json();
}

// 🔹 UPDATE
export async function updateSensor(sensor: Sensor): Promise<Sensor> {
  const res = await fetch(`${API}/sensores/${sensor.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sensor)
  });
  if (!res.ok) throw new Error("Failed to update sensor");
  return res.json();
}

// 🔹 DELETE
export async function deleteSensor(id: number): Promise<void> {
  const res = await fetch(`${API}/sensores/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete sensor");
}
