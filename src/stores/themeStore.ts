import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// ✅ Crea un store con valor inicial 'light'
const storedTheme = writable<'light' | 'dark'>('light');

// ✅ Solo si estamos en el navegador (evita errores en SSR)
if (browser) {
  // Lee el valor guardado en localStorage
  const storedConf = localStorage.getItem('storedTheme');
  
  // Si existe, inicializa el store con ese valor
  if (storedConf === 'light' || storedConf === 'dark') {
    storedTheme.set(storedConf);
  }

  // Actualiza localStorage cada vez que el store cambia
  storedTheme.subscribe((val) => {
    localStorage.setItem('storedTheme', val);
  });
}

export default storedTheme;
