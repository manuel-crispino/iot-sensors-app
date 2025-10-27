// src/lib/utils/toast.ts
import type { Sensor } from "$domain/sensor";
import { authStore } from "$stores/authStore";
import { notificationMessage } from "$stores/notificationStore";
import { toast } from "@zerodevx/svelte-toast";

// Funzione async perché dobbiamo aspettare la posizione
export async function handleToast(updatedSensor: Sensor, action: string): Promise<void> {
    let username: string | undefined;

    const unsubscribe = authStore.subscribe(state => {
        username = state.user?.username ?? 'Desconocido';
    });
    unsubscribe();

    const userAgent = navigator.userAgent;
    const now = new Date();
    const date = now.toLocaleString();

    // Otteniamo la posizione tramite Promise
    let positionText = 'No disponible';
    try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        positionText = `Lat: ${position.coords.latitude}, Lon: ${position.coords.longitude}`;
    } catch (err) {
        console.warn('Geolocalización no disponible', err);
    }

    const msg = `
    Sensor ${updatedSensor.nombre}
    ${action} por el usuario: ${username}
    Position: ${positionText}
    Desde (${userAgent})
    En fecha: ${date}`;

    toast.push(msg, { duration: 5000 });
    notificationMessage.update((list)=>[...list, msg]);
    
}
