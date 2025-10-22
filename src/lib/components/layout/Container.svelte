<script lang="ts">
  export let className: string = "";
</script>

<div class={`flex flex-col items-center gap-5 ${className}`}>
  <slot />
</div>