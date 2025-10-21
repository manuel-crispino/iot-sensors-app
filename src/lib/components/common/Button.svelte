<script lang="ts">
  // props
  export let text: string | undefined; 
  export let type: "button" | "submit" | "reset" = "button"; // default type
  export let onClick: (() => void) | undefined = undefined;
</script>

<button 
    type={type} 
    onclick={onClick} 
    class="bg-black text-white dark:bg-white dark:text-black p-2 hover:cursor-pointer hover:bg-gray-200 hover:text-black"
>
    {text}
</button>
