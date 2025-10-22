  
<script lang="ts">
  export let title: string = '';
</script>

<div class="bg-gray-300 dark:bg-blue-500/40 p-4 w-full max-w-md flex flex-col justify-center gap-5 rounded-xl shadow-md">
  {#if title}
    <h1 class="dark:text-white text-lg font-semibold text-center">{title}</h1>
  {/if}
  <slot />
</div>
