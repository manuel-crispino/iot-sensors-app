<script lang="ts">
	import type { Icon} from "lucide-svelte";

  // ✅ Props
  export let text: string | Icon = '';
  export let type: "button" | "submit" | "reset" = "button";
  export let onClick: (() => void) = () => {};
  export let personalClass: string = "";

  const baseClass =
    "rounded-lg cursor-pointer px-4 py-2 font-medium transition-all bg-black text-white dark:bg-white dark:text-black hover:bg-gray-200 hover:text-black";
</script>

<button
  type={type}
  on:click={onClick}
  class={`${baseClass} ${personalClass}`}
>
  {text}
  <slot/>
</button>
