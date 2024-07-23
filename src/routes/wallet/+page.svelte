<script lang="ts">
    import {Card} from '@metastellar/ui-library';
    import {Chasing} from 'svelte-loading-spinners'
    import copy from "copy-to-clipboard";
    import {walletData} from '$lib/store';
    import {FileCopyAltOutline} from 'flowbite-svelte-icons';
    import ConnectButton from '../../components/connectButton.svelte';
    import { env } from "$lib/env";
	import {Toast as toast} from "$lib/utils"
    import NftView from '../components/Assets/nftView.svelte';
    import SendXML from '../components/XML/SendXml.svelte';
    import Token from '../components/Assets/token.svelte';
    import AirDrop from '../components/Assets/airDrop.svelte';
    import {formatWalletAddValue, formatWalletAddress} from '$lib/utils/string'

    export let currentView = "sendXLM";

//   let xlmBalance:number = 0;
    // async function getWalletBallance() {
    //     let wallet = MetaStellarWallet.loadFromState($walletData);
    //     let balance = await wallet.getBalance();
    //     console.log("balance", balance);
    //     let data = wallet.exportState();
    //     walletData.set(data);
    //     xlmBalance = balance;
    //     return balance;
    // }
    
    const setView = (view:string) => {
        currentView = view;
        console.log('view ', currentView);
    }
    
    const onCopy = (text:string) => {
        // if (!$connected) {alert('plz connect to wallet'); return}
        copy(text);
        toast({type:'info', desc:'Copied!'});
    }

</script>
{#if ($walletData).connected}
<div>
    <div id="midContainer"  class="uk-container">
        <Card class=" mt-6 py-7 " shadow >
            <div>
                
            </div>
            <div class="">
                <!-- <p class="text-center text-4xl">{xlmBalance} XLM</p> -->
                <p class="text-center text-4xl">{formatWalletAddValue(import.meta.env.VITE_DEV ? ($walletData).dataPacket?.testnetXLMBalance : ($walletData).dataPacket?.mainnetXLMBalance)} XLM</p>
                <h3 class="my-2 font-bold text-2xl text-center "> Ballance</h3>
            </div>
            <div class="mt-2">
                <div class="text-center flex justify-center gap-2 px-4">
                    <p class="max-w-[90%] truncate">{formatWalletAddress(($walletData).address, 7,4)}</p> 
                    <p class="copy-address inline-block flex items-center" on:click={()=>onCopy(($walletData).address)}><FileCopyAltOutline/></p></div>
                <h3 class="mt-4 font-bold text-2xl text-center ">Address</h3>
            </div>
        </Card>
        <div class="grid md:grid-cols-4 sm:grid-cols-2 mt-2 gap-3">
            <button on:click={()=>{setView('sendXLM')}} >
                <Card class="py-4 lg:px-12 min-h-[80px] justify-center" shadow>
                    <span>Send XLM</span>
                </Card>
            </button>
            <button on:click={()=>{setView('viewNFT')}}>
                <Card class="py-4 lg:px-12 min-h-[80px] justify-center" shadow >
                    NFT
                </Card>
              </button>
            <button on:click={()=>{setView('token')}}>
                <Card class="py-4 lg:px-12  min-h-[80px] justify-center"  shadow>
                    Token
                </Card>
            </button>
            <button on:click={()=>{setView('airDrop')}}>
                <Card class="py-4 lg:px-12  min-h-[80px] justify-center" shadow >
                    AirDrop
                </Card>
            </button>
        </div>
        
        <div class="mt-2">
            {#if currentView == 'sendXLM'}
                <SendXML/>
            {:else if currentView == 'viewNFT'}
                <NftView/>
            {:else if currentView == 'token'}
                <Token/>
            {:else if currentView == 'airDrop'}
                <AirDrop />
            {/if}
        </div>
        
    </div>
</div>
{/if}
{#if !(($walletData).connected)}
    <ConnectButton/>
{/if}
<style>
    button.active {
		/* box-shadow: 0 25px 15px 0px rgba(0,0,0,0.2);
		transform: translatey(-5px) scale(1.01); */
        color:#1d4ed8;
    }
</style>