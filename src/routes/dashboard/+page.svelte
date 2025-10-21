<script lang="ts">
import { authStore, logout } from '$stores/authStore';
import { onMount } from 'svelte';
import { goto } from '$app/navigation';

onMount(() => {
  authStore.subscribe((state) => {
    if (!state.user) goto('/login'); // redirect if not logged in
  });
});

function handleLogout() {
  logout();
  goto('/login');
}
</script>

<h1 class="dark:text-white">Dashboard</h1>
<button class="dark:text-black dark:bg-white p-2 " 
onclick={handleLogout}>
Logout
</button>
