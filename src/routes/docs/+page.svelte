<script lang='ts'>
import SignInteraction from '../components/Signature/SignInteraction.svelte';
import ConnectButtonCreepy from '../../components/connectButtonCreepy.svelte';
import { scale } from 'svelte/transition';
import { quintOut } from 'svelte/easing';

import { cubicOut } from 'svelte/easing';


let connectLoader:HTMLElement;
function scalePop(node:HTMLElement, {delay=0, duration=400}){
    
    return {
		delay,
		duration,
		css: (t) => `transform:scale(${t})`
	};
}
let signVisable = false;
let swapConnect = function(){
    
    console.log(connectLoader);
    connectLoader.style.zIndex = 'auto';
    connectLoader.style.transition = 'transform, 1.1s'
    connectLoader.style.transitionDelay = '0.4s';
    connectLoader.style.transform = 'scale(1.3)';
    setTimeout(()=>signVisable = true, 1500);
}
</script>


<div style="text-align:left; width:100%;">
    <h1 style="font-size:xx-large; text-align:left;">Hello world</h1>
</div>

{#if signVisable}
<span in:scale >
    <SignInteraction/>
</span>
{:else}
<span bind:this={connectLoader} style="display:flex; justify-content:center; width:100%;">
    <button on:click={swapConnect}>

        <ConnectButtonCreepy />

    </button>
</span>
{/if}
