/*
 Este store gestiona el estado de autenticación del usuario en el lado del cliente.
 Los datos se guardan SOLO en localStorage.

 Nota: los datos que llegan a este punto ya han sido "sanitizados" (validados y seguros).
 infrastructure/mockData actúa como una base de datos simulada y verifica si el usuario existe.
*/

import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// ------------------------------
// Inicialización del usuario
// ------------------------------
// Si ya hay un usuario guardado en localStorage, lo cargamos.
// Esto permite que al recargar la página el usuario siga logueado.
let initialUser: App.User | null = null;

if (browser) {
  // browser === true solo en el cliente, para evitar errores en SSR
  const storedUser = localStorage.getItem('user'); // obtenemos 'user' de localStorage
  initialUser = storedUser ? JSON.parse(storedUser) as App.User : null;
}

// ------------------------------
// Store reactivo de Svelte
// ------------------------------
// authStore guarda el estado global de autenticación
// cualquier componente que lo use se actualizará automáticamente cuando cambie
export const authStore = writable<{ user: App.User | null }>({ user: initialUser });


// ------------------------------
// FUNCIONES DE AUTENTICACIÓN
// ------------------------------

/**
 * Realiza el login del usuario
 * @param username - nombre de usuario ingresado por el cliente
 *
 * Crea un token ficticio y guarda el usuario en localStorage y en el store reactivo
 */
export function login(username: string) {
  // Creamos un objeto usuario simple
  const user: App.User = {
    username,
    token: `token-${Date.now()}` // token generado dinámicamente
  };

  // Guardamos en localStorage solo si estamos en el cliente
  if (browser) localStorage.setItem('user', JSON.stringify(user));

  // Actualizamos el store, notificando a todos los componentes que dependan de authStore
  authStore.set({ user });
}


/**
 * Realiza el logout del usuario
 * Elimina los datos de localStorage y reinicia el store
 */
export function logout() {
  if (browser) localStorage.removeItem('user'); // borramos los datos del navegador
  authStore.set({ user: null }); // reseteamos el store
}


/**
 * Verifica si el usuario está autenticado
 * @returns true si existe un usuario válido en localStorage, false en caso contrario
 */
export function isAuthenticated(): boolean {
  if (!browser) return false; // SSR no tiene localStorage

  const storedUser = localStorage.getItem('user');
  if (!storedUser) return false; // no hay usuario guardado

  try {
    const user = JSON.parse(storedUser) as App.User;

    // Validaciones simples de seguridad
    if (!user) return false;
    if (typeof user.username !== 'string') return false;
    if (!user.token) return false;

    // Todo correcto
    return true;
  } catch (err) {
    console.log("Error en la verificación de autenticación desde $stores/authStore.ts", err);
    return false;
  }
}
