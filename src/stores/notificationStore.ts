// src/stores/notificationMessage.ts
import { writable} from 'svelte/store';
import { browser } from '$app/environment';


let initial: string[] = [];

// Verifica se siamo in browser
if (browser){
  const saved = localStorage.getItem('notificationMessage');
  initial = saved ? JSON.parse(saved) : [];
}

export const notificationMessage = writable<string[]>(initial);

if (browser) {
  notificationMessage.subscribe((val) => {
    localStorage.setItem('notificationMessage', JSON.stringify(val));
  });
}