<script lang="ts">
	import { Toaster, toast } from 'svelte-sonner'
  import { env } from "$lib/env";
	import Header from './Header.svelte';
	import Footer from './Footer.svelte';
	import './styles.css';
	import "../app.css";
	import {lockScroll} from './store';
	let scroll = 'auto';
</script>
<div class="app">
	<Header />
	<main >
		<slot />
		<Toaster richColors position="top-right" />
	</main>
</div>
<style>
	.scroll-lock {
		background-color: aqua;
		overflow: hidden;
	}
</style>
