<script lang="ts">
  import { login } from '$stores/authStore';
  import { goto } from '$app/navigation';
  import { findUser } from '$infrastructure/mockDatabase';

  let username: string = '';
  let password: string = '';
  let trials: number = 3;
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
    isLoading = false;
  }
</script>

<div class="flex flex-col items-center gap-5">
  <!-- 🔄 Overlay loading -->
  {#if isLoading}
    <div class="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm rounded-lg">
    <!-- loading component -->
      <div class="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      <p class="text-white mt-3 text-sm">Verificando credenciales...</p>
    </div>
  {/if}
  <div class="bg-gray-300 dark:bg-blue-500/40 p-2 w-100 flex flex-col justify-center gap-5">
    <h1 class="dark:text-white">Login</h1>
    <form on:submit={handleLogin} class="flex flex-col items-center gap-4">
      <input type="text" placeholder="Username" bind:value={username} autocomplete="username" required>
      <input type="password" placeholder="Password" bind:value={password} autocomplete="current-password" required>
      <button type="submit" class="bg-black text-white dark:bg-white dark:text-black p-2 hover:cursor-pointer hover:bg-gray-200">
        Login
      </button>
    </form>
  </div>
  {#if showModal}
    <div class="fixed inset-0 flex items-center justify-center bg-black/50">
      <div class="bg-gray-800 text-white p-6 rounded-xl shadow-lg text-center">
        <p>Has alcanzado el límite de intentos.</p>
        <p class="mt-2 text-sm opacity-80">Espera 5 segundos para intentarlo nuevamente.</p>
      </div>
    </div>
  {/if}
  
</div>
