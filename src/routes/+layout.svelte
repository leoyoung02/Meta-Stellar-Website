<script lang="ts">
	import Header from './Header.svelte';
	import Footer from './Footer.svelte';
	import './styles.css';
	import "../app.css";
	import {lockScroll} from './store';
	let scroll = 'auto';
  import { env } from "$lib/env";
	
</script>
<div class="app">
	<Header />
	<main >
		<slot />
	</main>


</div>

<style>
	.scroll-lock {
		background-color: aqua;
		overflow: hidden;
	}
</style>
