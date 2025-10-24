<script lang="ts">

  export let label: string; 
  export let value:string | number;
  export let options: (string | number)[]; 
</script>

<div class="flex flex-col">
  <label for="" class="text-sm font-medium dark:text-white">{label}</label>
  <select name={label} bind:value={value} class="border rounded p-2 dark:bg-white dark:text-black">
    <option  value="">Todos</option>
    {#each options as As}
      <option value={As}>{As}</option>
    {/each}
  </select>
</div>
