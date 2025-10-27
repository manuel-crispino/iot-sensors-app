<script lang='ts'>
  import Button from "../common/Button.svelte";
  import { notificationMessage } from "$stores/notificationStore";
  import { CircleX, Mail } from "lucide-svelte";

  let showModal: boolean = false; 
</script>

<!-- Notificaciones --> 

<div class="relative inline-block">
  <Button onClick={() => { showModal = true }} personalClass="hover:!bg-gray-400">
    <Mail/>
  </Button>

  {#if $notificationMessage.length > 0}
    <div class="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
      {$notificationMessage.length}
    </div>
  {/if}
</div>

{#if showModal}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-auto p-5">
    <!-- Botón de cierre -->
    <Button 
      onClick={() => { showModal = false }} 
      personalClass="fixed absolute top-45 right-40 bg-white !text-black hover:bg-red-300"
    >
      Cerrar <CircleX />
    </Button>
    
    <div class="bg-gray-800 text-white p-6 rounded-xl shadow-lg max-h-full w-full max-w-lg overflow-y-auto relative">
      <!-- Lista de notificaciones -->
       <Button personalClass={"bg-white !text-black hover:bg-red-300"} onClick={()=>{notificationMessage.set([]),showModal = false}}>Elimina notificaciones</Button>
      <ul class="mt-4">
        {#if $notificationMessage.length < 1}
          <li>No tienes notificaciones aún</li>
        {/if}
        {#each $notificationMessage as msg (msg)}
            {#each msg.split(';').filter(line => line.trim() !== '') as line}
              <div>{line}</div>
            {/each}
          <hr class="my-2">
        {/each}
      </ul>
    </div>
  </div>
{/if}
