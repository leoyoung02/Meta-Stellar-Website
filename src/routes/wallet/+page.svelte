<script lang="ts">
    import * as StellarSdk from '@stellar/stellar-sdk';
    import {Card} from '@metastellar/ui-library';
    import {Chasing} from 'svelte-loading-spinners'
    import copy from "copy-to-clipboard";
    // import {connected, } from '../../store';   
    import {walletData} from '$lib/store';
    import type {WalletState} from 'metastellar-sdk';
    import {MetaStellarWallet} from 'metastellar-sdk';
    import { Label, Toast, Button  } from 'flowbite-svelte';
    import { CheckCircleSolid, FileCopyAltOutline} from 'flowbite-svelte-icons';
<<<<<<< HEAD
=======
    import ConnectButton from '../../components/connectButton.svelte';
>>>>>>> main
    import NFTMint from "../components/NFT/nftMint.svelte";
    import { env } from "$lib/env";

    export let currentView = "sendXLM";

    let open:boolean  = false;
    let counter:number = 4;

    let _currentView:string;

    let processing:boolean = false;

    let sendToAddress:string = "GDPZOWVRHQV2SQ3N47CILKNU4NZQOXYDVXGKKJI32TVWIF7V7364G2QM";
    let sendAmount:number = 5;

    const stellar_rpc_endpoint = env.VITE_STELLAR_RPC_ENDPOINT;
<<<<<<< HEAD

    // console.log("stellar_rpc_endpoint", stellar_rpc_endpoint);
=======
    const network_passphrase = env.VITE_NETWORK_PASSPHRASE;
>>>>>>> main

    const setView = (view:string) => {
        currentView = view;
        console.log('view ', currentView);

    }
    
    const onCopy = (text:string) => {
        // if (!$connected) {alert('plz connect to wallet'); return}

        copy(text);
        open=true;
        counter = 4;
        timeout();
    }

    function timeout():any {
        if (--counter > 0) return setTimeout(timeout, 1000);
        open = false;
    }

    async function signTransaction() {
        // if (!$connected) {
        //     alert('plz connect to wallet');
        //     return;
        // }
        
        if (sendToAddress == "") {
            alert('please input address to send');
            return;
        }
        
        if (sendAmount == 0) {
            alert('please input amount to send');
            return;
        }
        processing = true;
        const server = new StellarSdk.Horizon.Server(stellar_rpc_endpoint);
        const sourcePublicKey = await ethereum.request({
            method: 'wallet_invokeSnap',
            params: {snapId:'npm:stellar-snap', request:{
            method: 'getAddress',
            }}
        });


        const account = await server.loadAccount(sourcePublicKey);
        const fee = await server.fetchBaseFee();

        console.log("base fee is");
        console.log(fee);
        const receiverPublicKey = sendToAddress;
        console.log("metamask public key: ");
        console.log(sourcePublicKey);
        console.log("account is");
        console.log(account);
        console.log("building Transaction");
        const transaction = new StellarSdk.TransactionBuilder(account, { fee , networkPassphrase: network_passphrase });

        // Add a payment operation to the transaction
        console.log("transaction builder initilazed");
        try {
            await transaction.addOperation(StellarSdk.Operation.payment({
                destination: receiverPublicKey,
                asset: StellarSdk.Asset.native(),
                amount: sendAmount.toString()
            }));
            console.log("operations added")
        } catch (e:any) {
            alert('error:'+e.message);
            return false;
        }
        
        // Make this transaction valid for the next 30 seconds only
        try {
            await transaction.setTimeout(30);
        } catch (e:any) {
            alert('error:'+e.message);
            return false;
        }
        console.log("timeout set");
        const endTransaction = await transaction.build();
        const xdrTransaction = endTransaction.toXDR();
        console.log(xdrTransaction);
        let response = null;
        try {
            response = await ethereum.request({
                method: 'wallet_invokeSnap',
                params:{snapId:'npm:stellar-snap', request:{
                    method: 'signAndSubmitTransaction',
                    params:{
                    transaction: xdrTransaction,
                    testnet: true
                    }
                }}
            });
            getWalletBallance();
        } catch (e:any) {
            alert('error:'+e.message);
            return false;
        }

        return true;
    }

    async function sendXNL() {
        // const response = await signTransaction();
        // debugger;
        // console.log('transaction response', response);
        // // getWalletBallance();
        // processing = false;
        await signTransaction();
        processing = false;
    }
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

    async function getWalletBallance() {
        try {
            const wallet_ballance = await window.ethereum.request({
                method: 'wallet_invokeSnap',
                params: {
                snapId: 'npm:stellar-snap',
                request: {
                    method: 'getBalance',
                    params: {"testnet":true}
                },
                },
            });
            xlmBalance = wallet_ballance;
        } catch(error) {
            console.log(error);
            throw error;
        }
        
    }

</script>
{#if ($walletData).connected}
<div>
    <div id="midContainer"  class="uk-container">
        <Card class="p-5 mt-16  ">
            <div>
                
            </div>
            <div class="mt-12">
                <p class="text-center text-4xl">{xlmBalance} XLM</p>
                <h3 class="my-5 font-bold text-2xl text-center "> ballance</h3>
            </div>
            <div class="mt-5">
                <p class="text-center">{($walletData).address} <span class="copy-address inline-block ml-2 pt-1" on:click={()=>onCopy(($walletData).address)}><FileCopyAltOutline /></span></p>
                <h3 class="my-5 font-bold text-2xl text-center ">address</h3>
            </div>
        </Card>
        <div class="grid md:grid-cols-6 sm:grid-cols-3 mt-12 gap-3">
            <button on:click={()=>{setView('sendXLM')}} >
                <Card class="py-8 px-12  " hoverTransform>
                    <span>Send XLM</span>
                </Card>
            </button>
            <button on:click={()=>{setView('receiveStellar')}}>
                <Card class="py-8 px-12 " hoverTransform>
                    <span>Receive</span>
                </Card>
            </button>
            <button on:click={()=>{setView('sendToken')}}>
                <Card class="py-8 px-12  "
                hoverTransform>
                    Send token
                </Card>
            </button>
            <button on:click={()=>{setView('viewNFT')}}>
                <Card class="py-8 px-12  " hoverTransform>
                    View token
                </Card>
              </button>
            <button on:click={()=>{setView('sendNFT')}}>
                <Card class="py-8 px-12  " hoverTransform>
                    Send NFT
                </Card>
            </button>
            <button on:click={()=>{setView('mintNFT')}}>
                <Card class="py-8 px-12  " hoverTransform>
                    Mint NFT
                </Card>
            </button>
        </div>
        
        <div class="mt-12">
            {#if currentView == 'sendXLM'}
            <Card class="py-12 px-5 " >
                <h3 class="mb-4 text-center font-bold text-2xl">Send XLM</h3>
                <div class="mb-2">
                    <Label class="my-2">Send To</Label>
                    <div>
                        <input type="text" class="w-full p-3 h-[58px] border border-slate-200 rounded-lg" placeholder="Enter public address " bind:value={sendToAddress}>
                    </div>
                </div>
                <div class="mb-2">
                    <Label class="my-5">Amount</Label>
                    <div>
                        <input type="number" class="w-full p-3 h-[58px] border border-slate-200 rounded-lg" bind:value={sendAmount}>
                    </div>
                </div>
                <div class="mb-2 mt-2">
                    <Button class="py-5 text-center w-full bg-blue-700 rounded-lg capitalize text-white hover:bg-blue-800" on:click={sendXNL} disabled={processing}>
                        <div class="text-center">
                            {#if processing}
                            <div class="inline-block">
                                <Chasing size="15" color="white" unit="px" />
                            </div>
                            {/if}
                            Send
                        </div>
                    </Button>
                </div>
                
            </Card>
            {:else if currentView == 'receiveStellar'}
            <Card class="py-12 px-5 " >
                receive Stellar
            </Card>
            {:else if currentView == 'sendToken'}
            <Card class="py-12 px-5 " >
                sendToken
            </Card>
            {:else if currentView == 'viewNFT'}
            <Card class="py-12 px-5 " >
                viewNFT
            </Card>
            {:else if currentView == 'sendNFT'}
            <Card class="py-12 px-5 " >
                sendNFT
            </Card>
            {:else if currentView == 'mintNFT'}
<<<<<<< HEAD
            <NFTMint />
=======
                <NFTMint />
>>>>>>> main
            {/if}
        </div>
        
    </div>
</div>
<Toast color="green" position="top-right" bind:open on:close={()=>{open=false; alert('false')}}>
    <svelte:fragment slot="icon">
        <CheckCircleSolid class="w-5 h-5 " />
        <span class="sr-only">Check icon</span>
    </svelte:fragment>
    Copied!
</Toast>
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