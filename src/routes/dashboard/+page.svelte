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
    sensoresFiltrados
  } from '$stores/sensorsStore';
  import Container from '$lib/components/layout/Container.svelte';
  import Input from '$lib/components/common/Input.svelte';
  import type { Sensor } from '$domain/sensor';
  import {getSensores} from '$application/sensorService'
	import Loading from '$lib/components/feedback/Loading.svelte';
	import FilterSelect from '$lib/components/dashboard/FilterSelect.svelte';
	import TablaSensores from '$lib/components/dashboard/TablaSensores.svelte';

  let loaded:boolean = false;
  let error: string | null = null;

  onMount(async()=> {
    authStore.subscribe((state) => {
      if (!state.user) goto('/login');
    });
   
    // Timeout di 15 secondi
    const timeout = setTimeout(() => {
      if (!loaded) {
        error = 'El servidor no responde. Inténtalo más tarde.';
        loaded = true; // fermiamo il loading
      }
    }, 15000);

    try {
      const data = await getSensores();
      if (data) {
        sensores.set(data);
        loaded = true;
        error = null;
        clearTimeout(timeout); // cancella il timeout se fetch finisce
      }
    } catch (err) {
      console.error(err);
      error = 'Error al obtener los sensores.';
      loaded = true;
      clearTimeout(timeout);
    }
  });

  // 🔁 Genera una lista di tipos unici (senza duplicati)
  $: tiposUnicos = [...new Set($sensores.map((sensor:Sensor) => sensor.tipo))];
  $: nombresUnicos = [...new Set($sensores.map((sensor:Sensor) => sensor.nombre))];
  $: idUnica = [...new Set($sensores.map((sensor:Sensor) => sensor.id))];
  $: valorUnicos = [...new Set($sensores.map((sensor:Sensor) => sensor.valor))];
  $: estadoUnicos = [...new Set($sensores.map((sensor:Sensor) => sensor.estado? 'activo':'inactivo'))];

</script>
<Container>
  {#if !loaded}
    <Loading message="Fetching data"/>
      {:else if error}
    <h1 class="text-red-500 font-semibold">
      {error}
    </h1>
  {/if}
  <div class="flex flex-col items-center gap-6">
    <h1 class="text-2xl font-semibold dark:text-white">
      Panel de Sensores
    </h1>
    <!--Filtros -->
    <div class="flex flex-wrap justify-between items-center gap-3 mb-4">
      <div>
        <h1 class="dark:text-white">
          Filtros
        </h1>
      </div>
      <!--Search bar-->
      <Input type="text" placeholder="Buscar..." bind:value={$filtro} />

      <!--filtro por Id--> 
      <FilterSelect bind:value={$filtroId} label="Id" options={idUnica}  />

      <!--filtro Nombre-->
      <FilterSelect bind:value={$filtroNombre} label="Nombre" options={nombresUnicos}  />

      <!--  Filtro tipo -->
        <FilterSelect bind:value={$filtroTipo} label="Tipos" options={tiposUnicos}  />

      <!--  Filtro Valor -->
        <FilterSelect bind:value={$filtroValor} label="Valores" options={valorUnicos}  />

      <!--  Filtro estado -->
        <FilterSelect bind:value={$filtroEstado} label="Estados" options={estadoUnicos}  />
    </div>

    <!-- Tabla -->
     <TablaSensores sensores={$sensoresFiltrados}/>

  </div>
</Container>
