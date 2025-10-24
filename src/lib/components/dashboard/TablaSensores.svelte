<script lang="ts">
  import type { Sensor } from '$domain/sensor';

  // Riceve i sensori filtrati come prop
  export let sensores: Sensor[];
</script>

<table class="min-w-full border-collapse border border-gray-300 dark:text-white">
  <thead class="bg-gray-100 dark:bg-gray-800">
    <tr>
      <th class="border px-4 py-2">Nombre</th>
      <th class="border px-4 py-2">Tipo</th>
      <th class="border px-4 py-2">Valor</th>
      <th class="border px-4 py-2">Estado</th>
    </tr>
  </thead>
  <tbody class="z-10">
    {#each sensores as sensor}
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
    {#if sensores.length === 0}
      <tr>
        <td class="border px-4 py-2 text-center" colspan="4">
          No hay sensores para mostrar
        </td>
      </tr>
    {/if}
  </tbody>
</table>
