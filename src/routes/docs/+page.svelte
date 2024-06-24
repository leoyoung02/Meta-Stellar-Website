<script lang='ts'>
import SignInteraction from '../components/Signature/SignInteraction.svelte';
import ConnectButtonCreepy from '../../components/connectButtonCreepy.svelte';
let signVisable = false;
let swapConnect = function(){
    setTimeout(()=>signVisable = true, 1500)
}
</script>

<h1>Hello world</h1>

{#if signVisable}
<SignInteraction/>
{:else}
<span style="display:flex; justify-content:center; width:100%;">
    <button on:click={swapConnect}>

        <ConnectButtonCreepy />

    </button>
</span>
{/if}
