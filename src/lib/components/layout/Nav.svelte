<script lang="ts">
  import Button from "../common/Button.svelte";
  import { authStore, logout } from '$stores/authStore';
  import { goto } from '$app/navigation';
	import { onMount } from "svelte";

  let element: HTMLElement;
  let isDark:boolean = false;
	
	
  function handleLogout(){
    logout();
    goto('/login').then(()=>{

    });
  }

onMount(() => {
  element = document.documentElement;
  element.setAttribute('data-theme', isDark ? 'dark' : 'light');
});

function toggleTheme() {
  isDark = !isDark;
  element.classList.toggle('dark', isDark);
}
</script>

<nav class="fixed w-full z-0 bg-gray-200/20 py-2 px-10 flex items-center justify-between dark:bg-gray-800/20 dark:text-white">
    <h1 class="text-xl font-semibold">IOT SENSORS APP</h1>
    <Button onClick={toggleTheme} text={ isDark ? '🌞 Light Mode' : '🌙 Dark Mode' }/>

    {#if $authStore.user}
        <Button text="Logout" onClick={handleLogout} />
    {/if}
</nav>