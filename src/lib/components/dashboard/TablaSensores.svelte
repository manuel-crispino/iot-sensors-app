<script lang="ts">
  import type { Sensor } from '$domain/sensor';

  // ✅ Props
  export let sensores: Sensor[] = [];
  export let onDelete: (id: number) => void = () => {};
  export let onEdit: (sensor: Sensor) => void = () => {};
</script>

<table class="min-w-full border-collapse border border-gray-300 dark:text-white">
  <thead class="bg-gray-100 dark:bg-gray-800">
    <tr>
      <th class="border px-4 py-2">id</th>
      <th class="border px-4 py-2">Nombre</th>
      <th class="border px-4 py-2">Tipo</th>
      <th class="border px-4 py-2">Valor</th>
      <th class="border px-4 py-2">Estado</th>
      <th class="border px-4 py-2">Acciones</th>
    </tr>
  </thead>
  <tbody>
    {#each sensores as sensor (sensor.id)}
      <tr class="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
        <td class="border px-4 py-2">{sensor.id}</td>
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
        <td class="border px-4 py-2 text-center space-x-2">
          <button
            on:click={() => onEdit(sensor)}
            class="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
          >
            Editar
          </button>
          <button
            on:click={() => onDelete(sensor.id)}
            class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
          >
            Eliminar
          </button>
        </td>
      </tr>
    {/each}

    {#if sensores.length === 0}
      <tr>
        <td colspan="5" class="border px-4 py-2 text-center">
          No hay sensores para mostrar
        </td>
      </tr>
    {/if}
  </tbody>
</table>
