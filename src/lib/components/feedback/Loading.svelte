<script lang="ts">
	import Overlay from "./Overlay.svelte";
    export let message:string;
</script>


    <Overlay>
        <div
        class="flex flex-col items-center justify-center bg-gray-900 text-white p-6 rounded-2xl shadow-lg"
        >
            <!-- Spinner -->
            <div
            class="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"
            >
            </div>
            <!-- Text -->
            <p class="mt-3 text-sm opacity-90">{message}</p>
        </div>
    </Overlay> 