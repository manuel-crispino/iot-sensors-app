<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { authStore } from '$stores/authStore';
  import { sensores,filtro, filtroTipo, filtroEstado, sensoresFiltrados } from '$stores/sensorsStore';
  import Container from '$lib/components/layout/Container.svelte';
  import Input from '$lib/components/common/Input.svelte';
  import type { Sensor } from '$stores/sensorsStore';

  onMount(() => {
    authStore.subscribe((state) => {
      if (!state.user) goto('/login');
    });
  });


  // 🔁 Genera una lista di tipos unici (senza duplicati)
  $: tiposUnicos = [...new Set($sensores.map((sensor:Sensor) => sensor.tipo))];
</script>

<div class="flex flex-col items-center gap-6">
  <h1 class="text-2xl font-semibold dark:text-white">Panel de Sensores</h1>

  <Container>
    <!-- 🔍 Filtros -->
    <div class="flex flex-wrap justify-between items-center gap-3 mb-4">
      <Input type="text" placeholder="Buscar..." bind:value={$filtro} />

    <!-- 🧩 Filtro por tipo -->
    <select bind:value={$filtroTipo} class="border rounded p-2 dark:bg-white dark:text-black">
      <option value="">Todos los tipos</option>

    <!-- 🔁 Generamos las opciones dinámicamente -->
      {#each tiposUnicos as tipo}
        <option value={tipo}>
          {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
        </option>
      {/each}
    </select>

      <!-- ⚙️ Filtro por estado -->
      <select bind:value={$filtroEstado} class="border rounded p-2  dark:bg-white dark:text-black">
        <option value="">Todos</option>
        <option value="activo">Activo</option>
        <option value="inactivo">Inactivo</option>
      </select>
    </div>

    <!-- 📋 Tabla -->
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
        {#each $sensoresFiltrados as sensor}
          <tr class="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
            <td class="border px-4 py-2">{sensor.nombre}</td>
            <td class="border px-4 py-2">{sensor.tipo}</td>
            <td class="border px-4 py-2 text-center">{sensor.valor}</td>
            <td class="border px-4 py-2 text-center">
              {#if sensor.estado}
                <span class="text-green-500 font-semibold">Activo</span>
              {:else}
                <span class="text-red-500 font-semibold">Inactivo</span>
              {/if}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </Container>
</div>
