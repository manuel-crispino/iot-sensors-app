import type { Sensor } from "$domain/sensor";

//fetching sensors 
export async function getSensores(): Promise<Sensor[]> {

  const res = await fetch(`${import.meta.env.VITE_API_URL}/sensores`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: `${import.meta.env.VITE_API_TOKEN}` }) // esempio token
  });

  if (!res.ok) throw new Error("Failed to fetch sensors");
  console.log(` http == ${import.meta.env.VITE_API_URL}`)
  return await res.json();
}