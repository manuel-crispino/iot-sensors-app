// src/stores/authStore.ts
import { writable } from 'svelte/store';
import {browser} from '$app/environment';


// localStorage if user is already logged in 
let initialUser:App.User | null = null;

// initial state
if (browser)
{
  const storedUser = localStorage.getItem('user');
  initialUser = storedUser ? JSON.parse(storedUser) as App.User : null;
}

export const authStore = writable<{ user: App.User | null }>({ user: initialUser });

//  login
export function login(username: string) {
  const user : App.User = {
      username,
      token: `token-${Date.now()}`
  }
  if (browser)
    localStorage.setItem('user', JSON.stringify(user))

  authStore.set({user});
}

// logout
export function logout() {
  if (browser)
    localStorage.removeItem('user');
  authStore.set({ user: null });
}

// authentication check
export function isAuthenticated(): boolean {

  //local storage undefined
  if (!browser) return false;  

  const storedUser = localStorage.getItem('user');
  if (!storedUser) return false;

 try {
  const user = JSON.parse(storedUser) as App.User;
  
  // if there is not user 
  if (!user) return false;

  // if the username is not a string 
  if (typeof user.username !== 'string') return false;

  // if there is not token  
  if (!user.token) return false;

  return true;
} catch(err) {
  // Failed  
  console.log("error in authentication check from $stores/authStore.ts",err)
  return false;
}
}