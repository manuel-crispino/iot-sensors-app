<script lang="ts">
  import type { AutoCompleteType } from '$domain/form';
  import { Eye, EyeOff } from 'lucide-svelte';

  export let value: string;
  export let placeholder: string;
  export let type: 'text' | 'password' | 'email' | 'number';
  export let autocomplete: AutoCompleteType = 'off';
  export let required: boolean = false;
  export let password: boolean = false;


  let showPassword = false;
</script>

 {#if password}
<div class="relative w-full">
  <input 
    name={placeholder}
    type={type}
    placeholder={placeholder}
    bind:value={value}
    autocomplete={autocomplete}
    {required}
    class=" p-2 border bg-white rounded w-full pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
  />

    <button
      type="button"
      on:click={() => (showPassword = !showPassword)}
      class="cursor-pointer absolute rounded-full right-2 top-1/2 -translate-y-1/2 bg-black p-2 text-white hover:bg-gray-400 z-10"
      aria-label="Toggle password visibility"
    >
      {#if showPassword}
        <EyeOff size={18} />
      {:else}
        <Eye size={18} />
      {/if}
    </button>
</div>
 {/if}
{#if !password}
 <input 
    name={placeholder}
    type={type}
    placeholder={placeholder}
    bind:value={value}
    autocomplete={autocomplete}
    {required}
    class=" p-2 border bg-white rounded w-full pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
  {/if}