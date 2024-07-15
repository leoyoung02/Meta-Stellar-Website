<script lang="ts">
    import * as StellarSdk from '@stellar/stellar-sdk';
    import {Card} from '@metastellar/ui-library';
    import {Chasing} from 'svelte-loading-spinners'
    import copy from "copy-to-clipboard";
    // import {connected, } from '../../store';   
    import {walletData} from '$lib/store';
    import type {WalletState} from 'metastellar-sdk';
    import {MetaStellarWallet} from 'metastellar-sdk';
    import { Label, Button  } from 'flowbite-svelte';
    import { CheckCircleSolid, FileCopyAltOutline} from 'flowbite-svelte-icons';
    import ConnectButton from '../../components/connectButton.svelte';
    import { env } from "$lib/env";
	import {Toast as toast} from "$lib/utils"
    import NFTMint from "../components/NFT/nftMint.svelte";
    import NftView from '../components/NFT/nftView.svelte';
    import SendXML from '../components/XML/SendXml.svelte';

    export let currentView = "sendXLM";

  let xlmBalance:number = 0;
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
        <Card class=" mt-6 py-7 ">
            <div>
                
            </div>
            <div class="">
                <!-- <p class="text-center text-4xl">{xlmBalance} XLM</p> -->
                <p class="text-center text-4xl">{($walletData).getBalance} XLM</p>
                <h3 class="my-2 font-bold text-2xl text-center "> ballance</h3>
            </div>
            <div class="mt-2">
                <div class="text-center flex justify-center gap-2 px-4">
                    <p class="max-w-[90%] truncate">{($walletData).address}</p> 
                    <p class="copy-address inline-block flex items-center" on:click={()=>onCopy(($walletData).address)}><FileCopyAltOutline/></p></div>
                <h3 class="mt-4 font-bold text-2xl text-center ">address</h3>
            </div>
        </Card>
        <div class="grid md:grid-cols-6 sm:grid-cols-3 mt-2 gap-3">
            <button on:click={()=>{setView('sendXLM')}} >
                <Card class="py-4 lg:px-12 min-h-[80px] justify-center" hoverTransform>
                    <span>Send XLM</span>
                </Card>
            </button>
            <button on:click={()=>{setView('receiveStellar')}}>
                <Card class="py-4 lg:px-12 min-h-[80px] justify-center" hoverTransform>
                    <span>Receive</span>
                </Card>
            </button>
            <button on:click={()=>{setView('sendToken')}}>
                <Card class="py-4 lg:px-12  min-h-[80px] justify-center"
                hoverTransform>
                    Send token
                </Card>
            </button>
            <button on:click={()=>{setView('viewNFT')}}>
                <Card class="py-4 lg:px-12 min-h-[80px] justify-center" hoverTransform>
                    View NFT
                </Card>
              </button>
            <button on:click={()=>{setView('sendNFT')}}>
                <Card class="py-4 lg:px-12  min-h-[80px] justify-center" hoverTransform>
                    Send NFT
                </Card>
            </button>
            <button on:click={()=>{setView('mintNFT')}}>
                <Card class="py-4 lg:px-12  min-h-[80px] justify-center" hoverTransform>
                    Mint NFT
                </Card>
            </button>
        </div>
        
        <div class="mt-2">
            {#if currentView == 'sendXLM'}
            <SendXML/>
            {:else if currentView == 'receiveStellar'}
            <Card class="py-12 px-5 " >
                receive Stellar
            </Card>
            {:else if currentView == 'sendToken'}
            <Card class="py-12 px-5 " >
                sendToken
            </Card>
            {:else if currentView == 'viewNFT'}
                <NftView/>
            {:else if currentView == 'sendNFT'}
            <Card class="py-12 px-5 " >
                sendNFT
            </Card>
            {:else if currentView == 'mintNFT'}
                <NFTMint />
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