<script lang="ts">
  import type { Sensor } from '$domain/sensor';

  // ✅ Props
  export let sensor: Sensor = { 
    id: 0, 
    nombre: '', 
    tipo: '', 
    valor: 0, 
    estado: true 
  };

  export let onSubmit: (payload: Sensor) => void = () => {};

  function handleSubmit() {
    onSubmit?.(sensor);
  }
</script>

<form 
  class="bg-white p-4 rounded shadow flex flex-col gap-2"
  on:submit|preventDefault={handleSubmit}
>
  <label for="">Nombre</label>
  <input bind:value={sensor.nombre} class="border p-1 rounded" required/>

  <label for="">Tipo</label>
  <input bind:value={sensor.tipo} class="border p-1 rounded" required/>

  <label for="">Valor</label>
  <input type="number" step="0.01" bind:value={sensor.valor} class="border p-1 rounded" required/>

  <label for="">Estado</label>
  <select bind:value={sensor.estado} class="border p-1 rounded">
    <option value={true}>Activo</option>
    <option value={false}>Inactivo</option>
  </select>

  <button type="submit" class="bg-blue-500 text-white rounded p-2 mt-2 hover:bg-blue-600">
    Guardar
  </button>
</form>
