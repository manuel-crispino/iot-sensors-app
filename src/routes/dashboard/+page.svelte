<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { authStore } from '$stores/authStore';
  import { sensores,filtro,filtroNombre,filtroId,filtroValor,filtroTipo,filtroEstado,sensoresFiltrados,ordenAscendente,criterioOrden} from '$stores/sensorsStore';
  import Container from '$lib/components/layout/Container.svelte';
  import Input from '$lib/components/common/Input.svelte';
  import { getSensores, saveSensor, deleteSensor } from '$application/sensorService';
  import Loading from '$lib/components/feedback/Loading.svelte';
  import FilterSelect from '$lib/components/dashboard/FilterSelect.svelte';
  import TablaSensores from '$lib/components/dashboard/TablaSensores.svelte';
  import Button from '$lib/components/common/Button.svelte';
  import SensorForm from '$lib/components/dashboard/SensorForm.svelte';
  import { initNATS } from "$application/natsService";
  // type
  import type { Sensor } from '$domain/sensor';

  let loaded: boolean = false;
  let error: string | null = null;

  // Stati per modal e editing
  let showModal: boolean = false;
  let editingSensor: Sensor | null = null;

  // 🔹 Carica sensori al mount
  onMount(async () => {
    authStore.subscribe(state => {
      if (!state.user) goto('/login');
    });

    const timeout = setTimeout(() => {
      if (!loaded) {
        error = 'El servidor no responde. Inténtalo más tarde.';
        loaded = true;
      }
    }, 15000);

    try {
      await initNATS("ws://localhost:4224"); // URL del tuo server NATS
      const data = await getSensores();
      sensores.set(data);
      loaded = true;
      error = null;
      clearTimeout(timeout);
    } catch (err) {
      console.error(err);
      error = 'Error al obtener los sensores.';
      loaded = true;
      clearTimeout(timeout);
    }
  });

  // 🔁 Genera valori unici per filtri
  $: tiposUnicos = [...new Set($sensores.map(s => s.tipo))];
  $: nombresUnicos = [...new Set($sensores.map(s => s.nombre))];
  $: idUnica = [...new Set($sensores.map(s => s.id))];
  $: valorUnicos = [...new Set($sensores.map(s => s.valor))];
  $: estadoUnicos = [...new Set($sensores.map(s => s.estado ? 'activo' : 'inactivo'))];

// 🟢 Create / Update
async function createOrUpdate(sensor: Sensor) {
  try {
    await saveSensor(sensor);
    showModal = false;
  } catch (err) {
    console.error("Error saving sensor:", err);
    alert("No se pudo guardar el sensor.");
  }
}

// 🔴 Delete
async function handleDelete(id: number) {
  if (window.confirm("Eliminar ?")) {
    try {
      await deleteSensor(id);
    } catch (err) {
      console.error("Error deleting sensor:", err);
      alert("No se pudo eliminar el sensor.");
    }
  }
}

</script>

<Container>
  {#if !loaded}
    <Loading message="Fetching data" />
  {:else if error}
    <h1 class="text-red-500 font-semibold">{error}</h1>
  {/if}

  <div class="flex flex-col items-center gap-5">
    <h1 class="text-2xl font-semibold dark:text-white">Panel de Sensores</h1>

    <!-- Filtri -->
     
    <div class="flex flex-wrap justify-between items-center gap-3 mb-4">
      <h1 class="dark:text-white">Filtros</h1>
      <Input type="text" placeholder="Buscar por nombre o por tipos..." bind:value={$filtro} />
      <FilterSelect bind:value={$filtroId} label="Id" options={idUnica} />
      <FilterSelect bind:value={$filtroNombre} label="Nombre" options={nombresUnicos} />
      <FilterSelect bind:value={$filtroTipo} label="Tipos" options={tiposUnicos} />
      <FilterSelect bind:value={$filtroValor} label="Valores" options={valorUnicos} />
      <FilterSelect bind:value={$filtroEstado} label="Estados" options={estadoUnicos} />
      <div>
        <FilterSelect 
          bind:value={$criterioOrden} 
          label="Ordenar por" 
          options={['nombre','tipo','valor']} 
          showDefaultValue={false} />
        <Button
          personalClass="mt-1"
          onClick={() => ordenAscendente.set(!$ordenAscendente)} text={$ordenAscendente ? 'Ascendente ↑':'Descendente ↓'} />
      </div>
    </div>

    <!-- Bottone nuovo sensore -->
    <Button 
      personalClass="bg-green-500 hover:bg-green-600 text-white hover:text-white" 
      onClick={() => { editingSensor = null; showModal = true; }}
      text=" Nuevo Sensor"
    />

    <!-- Modal form -->
    {#if showModal}
      <SensorForm 
        sensor={editingSensor || { id:0, nombre:'', tipo:'', valor:0, estado:true }} 
        onSubmit={createOrUpdate} 
      />
    {/if}

    <!-- Tabella sensori -->
    <TablaSensores 
      sensores={$sensoresFiltrados} 
      onDelete={handleDelete} 
      onEdit={(sensor: Sensor) => { editingSensor = sensor; showModal = true; }}
    />
  </div>
</Container>
