<script lang="ts">
import { authStore, logout } from '$stores/authStore';
import { onMount } from 'svelte';
import { goto } from '$app/navigation';
import Button from '$lib/components/common/Button.svelte';

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

<div class="flex flex-col items-center ">
<h1 class="dark:text-white">Dashboard</h1>

<Button
onClick={handleLogout}
text="Logout"/>
</div>

