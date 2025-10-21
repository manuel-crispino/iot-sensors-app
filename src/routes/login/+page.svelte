<script lang="ts">
  import { login } from '$stores/authStore';
  import { goto } from '$app/navigation';
  import { findUser } from '$infrastructure/mockDatabase';
	import Button from '$lib/components/common/Button.svelte';
	import Input from '$lib/components/common/Input.svelte';

  let username: string = '';
  let password: string = '';
  let trials: number = 3; // simulacion defensa brute force attack 
  let showModal: boolean = false;
  let isLoading = false;

  function handleShowModal(){
    showModal = true;
      setTimeout(() => {
        trials = 3;
        showModal = false;
      }, 5000);
  }

  async function handleLogin(event: Event) {
    event.preventDefault(); 

    if (!username || !password) {
      alert('Agrega usuario y contraseña');
      return;
    }
      isLoading = true; 

      // simula un fetch en el database 
      await new Promise((resolve) => setTimeout(resolve, 2000));

    // simula un check en el database
    if (findUser(username, password)) {
      login(username);
      goto('/dashboard');
    } 
    else 
    {
      trials--;
      alert(`El usuario no existe en la base de datos. Intentos restantes: ${trials}`);
      if (trials === 0) 
        handleShowModal();
    }
    username = '';
    password = '';
    isLoading = false;
  }
</script>

<div class="flex flex-col items-center gap-5">
  <!-- 🔄 Overlay loading -->
  {#if isLoading}
    <div class="absolute inset-0 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      <!-- Contenitore centrale -->
      <div class="flex flex-col items-center justify-center bg-gray-900 text-white p-6 rounded-2xl shadow-lg">
      <!-- Spinner -->
      <div class="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>

      <!-- Text -->
      <p class="mt-3 text-sm opacity-90">Verificando credenciales...</p>
      </div>
    </div>
  {/if}

  {#if !isLoading}
    <div class="bg-gray-300 dark:bg-blue-500/40 p-2 w-100 flex flex-col justify-center gap-5">
      <h1 class="dark:text-white">Login</h1>
      <form on:submit={handleLogin} class="flex flex-col items-center gap-4">
        <Input 
          type="text" 
          placeholder="Username" 
          bind:value={username} 
          autocomplete="username" 
        />
        <Input 
          type="password" 
          placeholder="Password" 
          bind:value={password} 
          autocomplete="current-password" 
          required
        />
        <Button 
          type="submit" 
          text="Login"
        />
      </form>
    </div>
  {/if}

  {#if showModal}
    <div class="fixed inset-0 flex items-center justify-center bg-black/50">
      <div class="bg-gray-800 text-white p-6 rounded-xl shadow-lg text-center">
        <p>Has alcanzado el límite de intentos.</p>
        <p class="mt-2 text-sm opacity-80">Espera 5 segundos para intentarlo nuevamente.</p>
      </div>
    </div>
  {/if}
  
</div>
