<script lang="ts">
  export let label: string; 
  export let value:string | number;
  export let options: (string | number)[]; 
  export let showDefaultValue:boolean = true;
</script>
<div class="flex flex-col">
  <label for={label} class="text-sm font-medium dark:text-white">
    {label}
  </label>
  <select id={label} bind:value={value} class="border rounded p-2 dark:bg-white dark:text-black">
    <!--default value-->
    {#if showDefaultValue}
      <option  value="">Todos</option>
    {/if}
    {#each options as option (option)}
      <option value={option}>{option}</option>
    {/each}
  </select>
</div>
