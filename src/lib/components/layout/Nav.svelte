<script lang="ts">
  import Button from "../common/Button.svelte";
  import { authStore, logout } from '$stores/authStore';
  import { goto } from '$app/navigation';
  import { onMount } from "svelte";
  import storedTheme from "$stores/themeStore";
  import {closeNATS} from "$application/natsService"
	import Loading from "../feedback/Loading.svelte";
  let element: HTMLElement;

  // ✅ isDark se deriva automáticamente del store
  // Si $storedTheme es 'dark', entonces isDark será true
  $: isDark = $storedTheme === 'dark';

  let isLoading:boolean = false;
  // Función para cerrar sesión
  async function handleLogout(){
    isLoading = true;
    await closeNATS();  // CLOSE connection safely
    logout();          // Elimina el usuario del store y localStorage
    goto('/login');    // Redirige a la página de login
    setTimeout(()=>{isLoading=false},2000); // 2 seconds
  }

  // Se ejecuta cuando el componente se monta en el DOM
  onMount(() => {
    element = document.documentElement;  // Referencia al elemento <html>
    element.classList.toggle('dark', isDark);  // Añade o quita la clase 'dark' según isDark
    element.setAttribute('data-theme', isDark ? 'dark' : 'light'); // Para CSS basado en atributo
  });

  // Función para alternar entre temas claro y oscuro
  function toggleTheme() {
    // Determina el nuevo valor: si está en 'light' o vacío, cambia a 'dark'
    const newDark = !$storedTheme || $storedTheme === 'light';

    storedTheme.set(newDark ? 'dark' : 'light'); // Actualiza el store
    element.classList.toggle('dark', newDark);   // Cambia la clase en <html>
    element.setAttribute('data-theme', newDark ? 'dark' : 'light'); // Actualiza atributo
  }
</script>

<!-- Navbar -->
<nav class="fixed w-full z-0 bg-gray-200/20 py-2 px-10 flex items-center justify-between dark:bg-gray-800/20 dark:text-white">
    <h1 class="text-xl font-semibold">IOT SENSORS APP</h1>

    <!-- Botón para alternar tema -->
    <Button onClick={toggleTheme} text={ isDark ? '🌞 Light Mode' : '🌙 Dark Mode' }/>

    <!-- Mostrar botón de Logout solo si el usuario está autenticado -->
    {#if $authStore.user}
        <Button text="Logout" onClick={handleLogout} />
    {/if}
</nav>

{#if isLoading}
  <div class="z-10">
    <Loading message="Signing out..."/>
  </div>
{/if}

