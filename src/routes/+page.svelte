<script lang="ts">
import { authStore } from '$stores/authStore';
import { onMount } from 'svelte';
import { goto } from '$app/navigation';

onMount(() => {
  authStore.subscribe((state) => {
    if (state.user) {
      goto('/dashboard'); // se loggato → dashboard
    } else {
      goto('/login');     // altrimenti → login
    }
  });
});
</script>

<h1>Redirecting...</h1>
