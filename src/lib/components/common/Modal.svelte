<script lang="ts">
	import Overlay from "../feedback/Overlay.svelte";
</script>
<Overlay>
    <div class="bg-gray-800 text-white p-6 rounded-xl shadow-lg text-center">
        <slot/>
    </div>
</Overlay>
