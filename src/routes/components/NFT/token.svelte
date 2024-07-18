<script lang="ts">
  import {Card} from '@metastellar/ui-library';
  import type {AssetAccount} from "$lib/types/index.js"
  import {OperationParams} from "$lib/types/index.js"
  import TokenComponent from '$lib/components/TestToken/index.svelte'
  import {testnet} from '../../../store';

  import { onMount } from 'svelte';
  import {MetaStellarWallet} from 'metastellar-sdk';
  import {TransactionBuilder, Operation, BASE_FEE, Horizon, Networks, Asset, Claimant} from 'stellar-sdk';

  import {walletData} from '$lib/store';
  import {stellar_rpc_endpoint, passpharase, snapId} from '$lib/constants'
  import { env } from '$lib/env';
	import {Toast as toast, Alert, assetType} from "$lib/utils"


  let options:Array<{name:string, value:string}> = []
  for(let op of Object.keys(OperationParams)){
        options.push({value:op, name:op})
    }
  let destinationAddr:string = '';
  let sendAmount:string = '0';

  let tokenIssuer:string = '';
  let tokenCode:string = '';

  let claimBalanceID:string = '';

  const tokenInfo: AssetAccount = {
    code: "BTCLN",
    issuer: "GDPKQ2TSNJOFSEE7XSUXPWRP27H6GFGLWD7JCHNEYYWQVGFA543EVBVT"
  }

  let selectedTokenCode:string = '';
  let selectedTokenIssuer:string = '';

  const getTokenAddr = (code:string, issuer:string) => {
    view= 'send';
    selectedTokenCode= code;
    selectedTokenIssuer= issuer;
    console.log('selectedTokenCode', selectedTokenCode);
    console.log('selectedTokenIssuer', selectedTokenIssuer);
  }

  const createClaime = async() => {
        const server = new Horizon.Server(stellar_rpc_endpoint);
        const account = await server.loadAccount($walletData.address);
        const txnBuilder = new TransactionBuilder(account, {fee:BASE_FEE, networkPassphrase: passpharase});

        const assets = new Asset(selectedTokenCode, selectedTokenIssuer);
      
        
        const claimants = [
          new Claimant(
            destinationAddr,
          )
        ];
        
        const operationParam = {
          amount: sendAmount.toString(),
          asset:assets,
          claimants:claimants
        }    

        try {
          const sadf = txnBuilder.addOperation(Operation.createClaimableBalance(operationParam));
          console.log(txnBuilder);
          txnBuilder.setTimeout(3600);
          const txn = txnBuilder.build().toXDR();
          console.log(txn);
          const signRes = await signTxn(txn);
  
          console.log('sign res', signRes);
          if (signRes.status == 400) {
            const resultCode = signRes.extras.result_codes;
            if (resultCode.operations) {
              for (let err of resultCode.operations){
                toast({type:'error', desc: err});
              }
            }
           return;
          }

        } catch (e:any) {
          toast({type:'error', desc: e.message});
          console.log('error', e);
        }
  }

  const createSendTransaction = async () => {
    const server = new Horizon.Server(stellar_rpc_endpoint);
    const account = await server.loadAccount($walletData.address);
    const txnBuilder = new TransactionBuilder(account, {fee:BASE_FEE, networkPassphrase: passpharase});
    
    const assets = new Asset(selectedTokenCode, selectedTokenIssuer);
    const operationParam = {
      amount: sendAmount.toString(),
      destination: destinationAddr,
      asset:assets
    }
    try {
      txnBuilder.addOperation(Operation.payment(operationParam));
      console.log(txnBuilder);
      txnBuilder.setTimeout(3600);
      const txn = txnBuilder.build().toXDR();
      console.log(txn);
      const signRes = await signTxn(txn);

      console.log('sign res', signRes);
      if (signRes.status == 400) {
        const resultCode = signRes.extras.result_codes;
        if (resultCode.operations) {
          for (let err of resultCode.operations){
            toast({type:'error', desc: err});
            if (err = 'op_no_trust'){
              Alert({
                type:'error', 
                desc:'Destination does not have this asset, do you want to create a claimable balance instead (this requires 1 XLM locked until is claimed)?',
                successText:'success',
                errText:'error',
                callback:createClaime
              })
            }
          }
        }
        return;
      }
      toast({type:'success', desc:'success claim.'});

    } catch (e:any) {
      toast({type:'error', desc: e.message});
      console.log('error', e);
    }
  }

  const claimClaimableBalance= async() => {
        const server = new Horizon.Server(stellar_rpc_endpoint);
        const account = await server.loadAccount($walletData.address);
        const txnBuilder = new TransactionBuilder(account, {fee:BASE_FEE, networkPassphrase: passpharase});
        
        const operationParam = {
          balanceId: claimBalanceID
        }    

        try {
          const sadf = txnBuilder.addOperation(Operation.claimClaimableBalance(operationParam));
          console.log(txnBuilder);
          txnBuilder.setTimeout(3600);
          const txn = txnBuilder.build().toXDR();
          console.log(txn);
          const signRes = await signTxn(txn);
  
          console.log('sign res', signRes);
          if (signRes.status == 400) {
            const resultCode = signRes.extras.result_codes;
            if (resultCode.operations) {
              for (let err of resultCode.operations){
                toast({type:'error', desc: err});
              }
            }
           return;
          }

          toast({type:'success', desc:'success received.'});

        } catch (e:any) {
          toast({type:'error', desc: e.message});
          console.log('error', e);
        }
  }
  async function signTxn(txnXDR){
    console.log("here in sign transaction");
    const signTransactionResult = await window.ethereum.request({
          method: 'wallet_invokeSnap',
          params: {
          snapId: snapId,
          request: {
              method: 'signAndSubmitTransaction',
              params:{
                transaction:txnXDR,
                testnet:true
              }
          },
          },
    });

    return signTransactionResult;

  }

  let assets:any;
  onMount(async ()=>{
    let wallet = MetaStellarWallet.loadFromState($walletData);
    assets = await wallet.getAssets();
    console.log('assets', assets);
  })
  let view:string = 'list';

  const changeTrustTransaction = async () => {
    const operationParam ={
      type: "changeTrust",
      params: {
          code: tokenCode,
          issuer: tokenIssuer,
        limit:"500"
      }
    };
    debugger;
        const server = new Horizon.Server(stellar_rpc_endpoint);
        const account = await server.loadAccount($walletData.address);
        const txnBuilder = new TransactionBuilder(account, {fee:BASE_FEE, networkPassphrase: passpharase});
        // for(let operation of operations){
        //     console.log(operation);
        //     console.log(operation.type);
        //     console.log(' operation.params', operation.params);
        // const asset:Asset = new Asset({code: tokenCode, issuer:tokenIssuer});
        const assets = new Asset(tokenCode, tokenIssuer);
        txnBuilder.addOperation(Operation.changeTrust({asset:assets}));
        // }
        console.log(txnBuilder);
        txnBuilder.setTimeout(3600);
        const txn = txnBuilder.build().toXDR()
        console.log(txn);
        signTxn(txn);
  }
</script>
<!-- <Card class="py-7 px-5 " > -->
 {#if view === 'list'}
 <div>
    <h3 class="mb-4 text-center font-bold text-2xl"> Token </h3>
    <div class="flex flex-col gap-5">
      <div>
        <input type="text" bind:value={tokenCode}  placeholder='code' class="w-full p-2 h-[48px] border border-slate-200 rounded-lg"/>
      </div>
      <div>
        <input type="text" bind:value={tokenIssuer}  placeholder='issuer' class="w-full p-2 h-[48px] border border-slate-200 rounded-lg"/>
      </div>
      <div>
        <button on:click={changeTrustTransaction}>Trust</button>
      </div>
      <div>
        <input type="text" bind:value={claimBalanceID}  placeholder='issuer' class="w-full p-2 h-[48px] border border-slate-200 rounded-lg"/>
      </div>
      <div>
        <button on:click={claimClaimableBalance}>receive</button>
      </div>
    </div>
    <div class="grid">
        {#if assets}
          {#each assets  as asset}
            {#if assetType(asset) == 'token'}  
            <TokenComponent
              baseURL = {stellar_rpc_endpoint}
              assetAccount={{code: asset.asset_code, issuer: asset.asset_issuer}}   
              onClick={getTokenAddr}
            ></TokenComponent>
            {/if}
          {/each}
        {/if}
    </div>
  </div>
 {:else}
    <div>
      <button on:click={()=>{
        view='list'
      }}>back</button>
      <h3 class="mb-4 text-center font-bold text-2xl"> Send Token </h3>
      <div class="flex flex-col gap-3">
      <div>
        <input type="text" bind:value={destinationAddr} placeholder='Destination' class="w-full p-2 h-[48px] border border-slate-200 rounded-lg"/>
      </div>
      <div>
        <input type="number" bind:value={sendAmount} placeholder='amount' class="w-full p-2 h-[48px] border border-slate-200 rounded-lg"/>
      </div>
      <div>
        <button type="button" on:click={createSendTransaction}>send</button>
      </div>
      </div>
    </div>
  {/if}

<!-- </Card> -->