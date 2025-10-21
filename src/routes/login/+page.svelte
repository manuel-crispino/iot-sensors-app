<script lang="ts">
import { login } from '$stores/authStore';
import { goto } from '$app/navigation';

let username = '';
let password = '';

function handleLogin() {
  if (username && password) {
    login(username);
    goto('/dashboard');
  } else {
    alert('Add Username and Password');
  }
}
</script>
<div class=" flex flex-col items-center gap-5 ">
<div class="bg-gray-300 dark:bg-blue-500/40 p-2 w-100 flex flex-col justify-center gap-5">
<h1 class="dark:text-white">Login</h1>
<input type="text" placeholder="Username" bind:value={username} required>
<input type="password" placeholder="Password" bind:value={password} required>
<button 
    type="button"
    class=" bg-black text-white dark:bg-white dark:text-black p-2 hover:cursor-pointer hover:bg-gray-200" 
    onclick={handleLogin}>
    Login
</button>
</div>
</div>