<script lang="ts">
import { authStore, logout } from '$stores/authStore';
import { onMount } from 'svelte';
import { goto } from '$app/navigation';
import { sensors } from '$stores/sensorsStore';
	import Container from '$lib/components/layout/Container.svelte';

onMount(() => {
  authStore.subscribe((state) => {
    if (!state.user) goto('/login');
  });
});

</script>

<div class="flex flex-col items-center ">
<h1 class="dark:text-white">Dashboard</h1>

<br>
<Container>
<table class="min-w-full border-collapse border border-gray-300 dark:text-white">
  <thead class="bg-gray-100 dark:bg-gray-800">
    <tr>
      <th class="border px-4 py-2">Nombre</th>
      <th class="border px-4 py-2">Tipo</th>
      <th class="border px-4 py-2">Valor</th>
      <th class="border px-4 py-2">Estado</th>
    </tr>
  </thead>
  <tbody>
    {#each $sensors as sensor}
      <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
        <td class="border px-4 py-2">{sensor.name}</td>
        <td class="border px-4 py-2">{sensor.type}</td>
        <td class="border px-4 py-2 text-center">{sensor.value}</td>
        <td class="border px-4 py-2 text-center">{sensor.status}</td>
      </tr>
    {/each}
  </tbody>
</table>
</Container>
</div>



