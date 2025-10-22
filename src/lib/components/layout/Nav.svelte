<script lang="ts">
  import Button from "../common/Button.svelte";
  import { authStore, logout } from '$stores/authStore';
  import { goto } from '$app/navigation';

  function handleLogout() {
  logout();
  goto('/login');
}
</script>

<nav class="fixed w-full bg-gray-200/20 pt-2 px-10 flex items-center justify-between dark:bg-gray-800/20 dark:text-white">
    <h1 class="text-xl font-semibold">IOT SENSORS APP</h1>
    {#if $authStore.user}
        <Button text="Logout" onClick={handleLogout} />
    {/if}
</nav>
