// src/stores/authStore.ts

/**
 * Este store gestiona el estado de autenticación del usuario en el lado del cliente.
 * Los datos se guardan SOLO en localStorage.
 * 
 * Nota: los datos que llegan a este punto ya han sido "sanitizados".
 * infrastructure/mockData actúa como una base de datos simulada y verifica si el usuario existe.
 */

import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Usuario inicial si ya está logueado en localStorage
let initialUser: App.User | null = null;

if (browser) {
  const storedUser = localStorage.getItem('user');
  initialUser = storedUser ? JSON.parse(storedUser) as App.User : null;
}

// Store reactivo de Svelte para la autenticación
export const authStore = writable<{ user: App.User | null }>({ user: initialUser });

/**
 * Realiza el login del usuario
 * @param username - nombre de usuario ingresado
 * Crea un token ficticio y guarda el usuario en localStorage y en el store
 */
export function login(username: string) {
  const user: App.User = {
    username,
    token: `token-${Date.now()}`
  };

  if (browser) localStorage.setItem('user', JSON.stringify(user));

  authStore.set({ user });
}

/**
 * Realiza el logout del usuario
 * Elimina los datos de localStorage y reinicia el store
 */
export function logout() {
  if (browser) localStorage.removeItem('user');
  authStore.set({ user: null });
}

/**
 * Verifica si el usuario está autenticado
 * returns true si existe un usuario válido en localStorage
 */
export function isAuthenticated(): boolean {
  if (!browser) return false;

  const storedUser = localStorage.getItem('user');
  if (!storedUser) return false;

  try {
    const user = JSON.parse(storedUser) as App.User;

    if (!user) return false;
    if (typeof user.username !== 'string') return false;
    if (!user.token) return false;

    return true;
  } catch (err) {
    console.log("Error en la verificación de autenticación desde $stores/authStore.ts", err);
    return false;
  }
}
