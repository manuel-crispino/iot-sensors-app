<script lang="ts">
  import {login} from '$stores/authStore';
  import {goto} from '$app/navigation';
  import {findUser} from '$infrastructure/mockDatabase';
	import Modal from '$lib/components/common/Modal.svelte';
	import Loading from '$lib/components/feedback/Loading.svelte';
	import LoginForm from "$lib/components/auth/LoginForm.svelte";
	import Container from '$lib/components/layout/Container.svelte';

  let username : string = '';
  let password : string = '';
  let trials : number = 3; // simulacion defensa brute force attack
  let showModal : boolean = false;
  let isLoading = false;

  function handleShowModal() 
  {
      showModal = true;
      setTimeout(() => {
          trials = 3;
          showModal = false;
      }, 5000);
  }

  async function handleLogin(event : Event) 
  {
      event.preventDefault();

      if (!username || !password) {
          alert('Agrega usuario y contraseña');
          return;
      }
      isLoading = true;

      // simula un fetch en el database
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // simula un check en el database 
      if (findUser(username, password)) {
          login(username);
          goto('/dashboard');
      } else {
          trials--;
          alert(`El usuario o la password no existe en la base de datos. Intentos restantes: ${trials}`);
          if (trials === 0) 
              handleShowModal();
          }
      username = '';
      password = '';
      isLoading = false;
  }
</script>

<Container>
    <!-- 🔄 Overlay loading -->
    {#if isLoading}
      <Loading message="Verificando credenciales..."/> 
    {/if}

    {#if !isLoading}
      <LoginForm 
        bind:username={username} 
        bind:password={password} 
        onSubmit={handleLogin}
        /> 
    {/if}

    {#if showModal}
     <Modal>
                <p>Has alcanzado el límite de intentos</p>
                <p class="text-white/90">Espera 5 segundos para intentarlo nuevamente.</p>
      </Modal>
    {/if}
</Container>