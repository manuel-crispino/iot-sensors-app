<script lang="ts">
	import Overlay from "../feedback/Overlay.svelte";
</script>
<Overlay>
   <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
  <div class="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-md shadow-xl relative z-60">
    <slot />
  </div>
</div>
</Overlay>
