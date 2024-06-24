<script lang="ts">
    import * as StellarSdk from '@stellar/stellar-sdk';
    import {Horizon} from '@stellar/stellar-sdk';
    import {Card} from '@metastellar/ui-library';
    
    import copy from "copy-to-clipboard";
    import {connected, address, ballance, accountName} from '../../store';   
    import { Label, Toast } from 'flowbite-svelte';
    import { CheckCircleSolid, ExclamationCircleSolid, FireOutline, CloseCircleSolid } from 'flowbite-svelte-icons';

    export let currentView = "sendXLM";

    let open:boolean  = false;
    let counter:number = 2;

    let _currentView:string;
    $:_currentView = currentView;

    let sendToAddress:string = "GDPZOWVRHQV2SQ3N47CILKNU4NZQOXYDVXGKKJI32TVWIF7V7364G2QM";
    let sendAmount:number = 0;

    const setView = (view:string) => {
        currentView = view;
        console.log('view ', currentView);

    }
    
    const onCopy = (text:string) => {
        copy(text);
        open=true;
        counter = 2;
        timeout();
    }

    function timeout():any {
        if (--counter > 0) return setTimeout(timeout, 1000);
        open = false;
    }

    async function signTransaction() {
        const server = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');
    // const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
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
        const transaction = new StellarSdk.TransactionBuilder(account, { fee, networkPassphrase: "Test SDF Network ; September 2015" });

        // Add a payment operation to the transaction
        console.log("transaction builder initilazed");
        await transaction.addOperation(StellarSdk.Operation.payment({
        destination: receiverPublicKey,
        // The term native asset refers to lumens
        asset: StellarSdk.Asset.native(),
        // Specify 350.1234567 lumens. Lumens are divisible to seven digits past
        // the decimal. They are represented in JS Stellar SDK in string format
        // to avoid errors from the use of the JavaScript Number data structure.
        amount: sendAmount.toString()
        }));
        console.log("operations added")
        // Make this transaction valid for the next 30 seconds only
        await transaction.setTimeout(30);
        console.log("timeout set");
        // Uncomment to add a memo (https://www.stellar.org/developers/learn/concepts/transactions.html)
        // .addMemo(StellarSdk.Memo.text('Hello world!'))
        const endTransaction = await transaction.build();
        const xdrTransaction = endTransaction.toXDR();
        console.log(xdrTransaction);
        const response = await ethereum.request({
        method: 'wallet_invokeSnap',
        params:{snapId:'npm:stellar-snap', request:{
            method: 'signAndSubmitTransaction',
            params:{
            transaction: xdrTransaction,
            testnet: true
            }
        }}
        });
        return response
    }

    async function sendXNL() {
        const response = await signTransaction();
        console.log('transaction response', response);
        // getWalletBallance();
    }

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
            ballance.set(wallet_ballance)
        } catch(error) {
            console.log(error);
            throw error;
        }
        
    }
</script>
<div>
    <div id="midContainer"  class="uk-container">
        <Card class="p-5 mt-16  ">
            <div class="mt-12">
                <p class="text-center">{$ballance} </p>
                <h3 class="my-5 font-bold text-2xl text-center uppercase"> ballance</h3>
            </div>
            <div class="mt-5">
                <p class="text-center">{$address} <span class="border rounded-xl px-2 py-1" on:click={()=>onCopy($address)}>copy</span></p>
                <h3 class="my-5 font-bold text-center">address</h3>
            </div>
        </Card>
        <div class="grid md:grid-cols-6 sm:grid-cols-3 mt-12 gap-3">
            <button on:click={()=>{setView('sendXLM')}}>
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
                 <Card class="py-8 px-12  "
            hoverTransform>
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
            {#if _currentView == 'sendXLM'}
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
                    <button class="py-5 text-center w-full bg-blue-700 rounded-lg capitalize text-white" on:click={sendXNL}>send</button>
                </div>
                
            </Card>
            {:else if _currentView == 'receiveStellar'}
            <Card class="py-12 px-5 " >
                receive Stellar
            </Card>
            {:else if _currentView == 'sendToken'}
            <Card class="py-12 px-5 " >
                sendToken
            </Card>
            {:else if _currentView == 'viewNFT'}
            <Card class="py-12 px-5 " >
                viewNFT
            </Card>
            {:else if _currentView == 'sendNFT'}
            <Card class="py-12 px-5 " >
                sendNFT
            </Card>
            {:else if _currentView == 'mintNFT'}
            <Card class="py-12 px-5 " >
                mintNFT
            </Card>
            {/if}
        </div>
        
    </div>
</div>

<!-- on:close={()=>{
    alert('close ')
    isOpenToast=false;
}} -->
<Toast color="green" position="top-right" bind:open on:close={()=>{open=false; alert('false')}} 
>
    <svelte:fragment slot="icon">
        <CheckCircleSolid class="w-5 h-5" />
        <span class="sr-only">Check icon</span>
    </svelte:fragment>
    Copied!
</Toast>