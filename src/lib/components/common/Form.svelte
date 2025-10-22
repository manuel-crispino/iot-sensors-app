<script lang="ts">
  export let onSubmit: (event: SubmitEvent) => void = () => {};
</script>

<form on:submit|preventDefault={onSubmit} class="flex flex-col items-center gap-4">
  <slot />
</form>