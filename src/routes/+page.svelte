<script lang="ts">
import { authStore } from '$stores/authStore';
import { onMount } from 'svelte';
import { goto } from '$app/navigation';
	import Container from '$lib/components/layout/Container.svelte';
	import Loading from '$lib/components/feedback/Loading.svelte';

onMount(() => {
  authStore.subscribe((state) => {
    // setTimeout simula redirecting
    setTimeout(()=>{
    if (state.user) {
      goto('/dashboard'); 
    } else {
      goto('/login');     
    }
    },2000)
  });
});
</script>

<Container>
  <Loading message="Redirecting..."/>
</Container>