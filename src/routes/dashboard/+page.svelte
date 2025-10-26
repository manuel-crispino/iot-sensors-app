<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { authStore } from '$stores/authStore';
  import { 
    sensores,
    filtro,
    filtroNombre,
    filtroId,
    filtroValor, 
    filtroTipo, 
    filtroEstado, 
    sensoresFiltrados,
    ordenAscendente,
    criterioOrden
  } from '$stores/sensorsStore';
  import Container from '$lib/components/layout/Container.svelte';
  import Input from '$lib/components/common/Input.svelte';
  import type { Sensor } from '$domain/sensor';
  import { getSensores } from '$application/sensorService';
  import Loading from '$lib/components/feedback/Loading.svelte';
  import FilterSelect from '$lib/components/dashboard/FilterSelect.svelte';
  import TablaSensores from '$lib/components/dashboard/TablaSensores.svelte';
  import Button from '$lib/components/common/Button.svelte';
  import SensorForm from '$lib/components/dashboard/SensorFrom.svelte';

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
    const urlBase = import.meta.env.VITE_API_URL;
    const token = import.meta.env.VITE_API_TOKEN;

    if (sensor.id && sensor.id > 0) {
      // Update
      await fetch(`${urlBase}/sensores/${sensor.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sensor, token })
      });
    } else {
      // Create
      await fetch(`${urlBase}/sensores/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sensor, token })
      });
    }

    // Aggiorna lista dal server
    const res = await fetch(`${urlBase}/sensores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    });
    sensores.set(await res.json());
    showModal = false;
  }

  // 🔴 Delete
  async function handleDelete(id: number) {
    const confirm = window.confirm("Eliminar ?");
    if(confirm){
    const urlBase = import.meta.env.VITE_API_URL;
    await fetch(`${urlBase}/sensores/${id}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' } });
    sensores.update(list => list.filter(s => s.id !== id));
    }
    return;
  }

</script>

<Container>
  {#if !loaded}
    <Loading message="Fetching data" />
  {:else if error}
    <h1 class="text-red-500 font-semibold">{error}</h1>
  {/if}

  <div class="flex flex-col items-center gap-6">
    <h1 class="text-2xl font-semibold dark:text-white">Panel de Sensores</h1>

    <!-- Filtri -->
    <div class="flex flex-wrap justify-between items-center gap-3 mb-4">
      <h1 class="dark:text-white">Filtros</h1>
      <Input type="text" placeholder="Buscar..." bind:value={$filtro} />
      <FilterSelect bind:value={$filtroId} label="Id" options={idUnica} />
      <FilterSelect bind:value={$filtroNombre} label="Nombre" options={nombresUnicos} />
      <FilterSelect bind:value={$filtroTipo} label="Tipos" options={tiposUnicos} />
      <FilterSelect bind:value={$filtroValor} label="Valores" options={valorUnicos} />
      <FilterSelect bind:value={$filtroEstado} label="Estados" options={estadoUnicos} />
      <div>
        <FilterSelect bind:value={$criterioOrden} label="Ordenar por" options={['nombre','tipo','valor']} showDefaultValue={false} />
        <Button onClick={() => ordenAscendente.set(!$ordenAscendente)} text={$ordenAscendente ? 'Ascendente ↑' : 'Descendente ↓'} />
      </div>
    </div>

    <!-- Bottone nuovo sensore -->
    <button class="bg-green-500 text-white rounded p-2" on:click={() => { editingSensor = null; showModal = true; }}>
      Nuevo Sensor
    </button>

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
