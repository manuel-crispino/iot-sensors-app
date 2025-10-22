<script lang="ts">
  import '../app.css';
  import favicon from '$lib/assets/favicon.svg';
  import Nav from '$lib/components/layout/Nav.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<div class="flex flex-col min-h-screen">
  <!-- Navbar sticky -->
  <Nav/>

  <!-- Main content -->
  <main class="flex-1 py-40">
    <slot />
  </main>
  <Footer/>
</div>
