<script lang="ts">
  // ✅ Props
  export let text: string;
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
</button>
