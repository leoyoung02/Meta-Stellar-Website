<script lang="ts">
	import Header from './Header.svelte';
	import Footer from './Footer.svelte';
	import './styles.css';
	import "../app.css";
</script>
<div class="app">
	<Header />

	<main>
		<slot />
	</main>

	<footer>
		<Footer/>
	</footer>
</div>

<style>
	
</style>
