<script lang="ts">
  import type { AutoCompleteType } from '$domain/form';
  import { Eye, EyeOff } from 'lucide-svelte';

  export let value: string;
  export let placeholder: string;
  export let type: 'text' | 'password' | 'email' | 'number';
  export let autocomplete: AutoCompleteType = 'off';
  export let required: boolean = false;

  let showPassword = false;
</script>

<div class="relative w-full">
  <input
    type={type === 'password' && showPassword ? 'text' : type}
    placeholder={placeholder}
    bind:value={value}
    autocomplete={autocomplete}
    {required}
    class="p-2 border bg-white rounded w-full pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
  />

  {#if type === 'password'}
    <button
      type="button"
      on:click={() => (showPassword = !showPassword)}
      class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
      aria-label="Toggle password visibility"
    >
      {#if showPassword}
        <EyeOff size={18} />
      {:else}
        <Eye size={18} />
      {/if}
    </button>
  {/if}
</div>
