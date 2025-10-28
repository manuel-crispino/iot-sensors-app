// src/lib/utils/toast.ts
import type { Sensor } from "$domain/sensor";
import { authStore } from "$stores/authStore";
import { notificationMessage } from "$stores/notificationStore";
import { toast } from "@zerodevx/svelte-toast";

// Funcion async para la espera de la Posicion 
export async function handleToast(updatedSensor: Sensor, action: string): Promise<void> {
    let username: string | undefined;

    const unsubscribe = authStore.subscribe(state => {
        username = state.user?.username ?? 'Desconocido';
    });
    unsubscribe();

    const userAgent = navigator.userAgent;
    const now = new Date();
    const date = now.toLocaleString();

    // Tenemos la Posicion tramite Promise
    let positionText = 'No disponible';
    try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        positionText = `${position.coords.latitude}, ${position.coords.longitude}`;
    } catch (err) {
        console.warn('Geolocalización no disponible', err);
    }

        const msg = `
    🔔 Sensor: ${updatedSensor.nombre};
    🛠️ Acción: ${action}; 
    👤 Usuario: ${username}; 
    📍 Coordenadas: ${positionText};
    🧭 Navegador: ${userAgent}; 
    🕒 Fecha: ${date};
    `;

    toast.push(msg, { 
    duration: 5000,
    });
    notificationMessage.update((list)=>[...list, msg]);
    
}
