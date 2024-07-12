<script lang='ts'>
	import VideoLogo from '$lib/video/metastellar.mp4';
	import svgLogo from '$lib/video/metastellar_Logo.svg';
	import newLogo from '$lib/images/metastellar.png';
	import ConnectButton from '../components/connectButton.svelte';
	import ConnectButtonCreepy from '../components/connectButtonCreepy.svelte';
	import { onMount } from 'svelte';
	import {videoPlayed} from '$lib/store';
	import {MetaStellarWallet} from 'metastellar-sdk';
	import {walletData} from '$lib/store';
    import {Button} from 'flowbite-svelte';

	let logo:'none'|'video'|'img' = 'none';
	let videoRef;
	let ButtonisCreepy = Math.random() < 0.05;
	const endVideo = () => {
		console.log("Video Ended");
		logo = 'img';
		videoPlayed.set(true);
	}
	onMount(() => {
		videoRef = document.createElement('video');
		videoRef.currentTime = 0;
		console.log($videoPlayed)
		if($videoPlayed){
			logo = 'img';
		}
		else{
			logo = 'video';
		}
		console.log(logo);
		handleResize();
    });
	let burger = false;
	function handleResize(){
		if(window.innerWidth<768){
			burger = true;
		}
		else{
			burger = false;
		}
	
	}
	
</script>
<svelte:window on:resize={handleResize} />
<div id="header-container" class="uk-container">
	<nav class="uk-navbar-container uk-width-expand" uk-navbar>
	  <div class="uk-navbar-center">
		{#if !burger}
		<ul class="uk-navbar-nav">
			
			<li id="logo" data-uk-hover class="uk-width-auto">
				<a href="/">
				{#if logo==='video'}	
					<video bind:this={videoRef} class="uk-width-2-3 uk-logo" on:ended={endVideo} muted={true} autoplay src={VideoLogo} >
						<track kind="captions" />
					</video>
				{/if}
				{#if logo==='img'}
					<img class="uk-logo uk-width-2-3" src={svgLogo} alt="Metastellar Logo"/>
				{/if}
				</a>
			</li>
			<li data-uk-hover class="uk-width-1-6"><a href="wallet">Wallet</a></li>
			<li data-uk-hover class="uk-width-1-6"><a href="#">FAQ</a></li>
			<li data-uk-hover class="uk-width-1-6"><a href="/docs">Docs</a></li>
			<li data-uk-hover class="uk-width-1-6"><a href="#">chat</a></li>
			<li data-uk-hover class="uk-width-1-6">
				<br/>
				{#if !(($walletData).connected)}
					<ConnectButton/>
				{:else}
					<Button color="yellow" >Connected</Button>
				{/if}
			</li>
		</ul>

		{:else}
		<ul class="uk-navbar-nav spaceApart">
			<li id="logo" data-uk-hover class="uk-width-auto">
				{#if logo==='video'}	
					<video bind:this={videoRef} class="uk-width-1-2 uk-logo" on:ended={endVideo} muted={true} autoplay src={VideoLogo} >
						<track kind="captions" />
					</video>
				{/if}
				{#if logo==='img'}
					<img class="uk-logo uk-width-1-2 uk-logo" src={svgLogo} alt="Metastellar Logo"/>
				{/if}
			</li>
			<li data-uk-hover class="uk-width-1-2"><div><ConnectButton/></div></li>
		</ul>
		{/if}
					
	</div>
					
	</nav>

</div>
<hr/>


<style>
	.uk-navbar-container{
		background-color: "white";
	}
	.uk-navbar-center{
		width: 100%;
		display: block;
		background-color: white;
	}
	#logo{
		width:50%;
		display: flex;
		justify-content: left;
		z-index: 5;
	}
	#logo *{
		max-width: 250px;
		min-width: 250px;
	}
	video{
		border:none;
		clip-path: inset(1px 1px);
	}
	.uk-container{
		background-color: white;
	}
	.uk-navbar-nav{
		background-color: white;
	}
	.uk-navbar-left{
		background-color: white;
	}
	.uk-navbar-container *{
		background-color: white;
	}
	.uk-width-expand{
		display: flex;
		justify-content: center;
	}
	hr{
		margin-top: 0px;
		
	}
	li a{
		font-size: larger;
	}
	.spaceApart{
		width: 100%;
		display: flex;
		justify-content: space-between;
	}
	.spaceApart li{
		margin-left: auto;
		margin-right: auto;
	}
	.spaceApart li *{
		float: right;
	}
	ul{
		width: 100%;
	}
</style>