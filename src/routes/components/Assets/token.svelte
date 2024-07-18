<script lang="ts">
  import { onMount } from 'svelte';
  import {MetaStellarWallet} from 'metastellar-sdk';
  import {Card, TokenPoster} from '@metastellar/ui-library';
  import {TransactionBuilder, Operation, BASE_FEE, Horizon, Asset, Claimant} from 'stellar-sdk';

  import {walletData} from '$lib/store';
  import {stellar_rpc_endpoint, passpharase} from '$lib/constants'
	import {Toast as toast, Alert, assetType} from "$lib/utils"
  import { Button } from 'flowbite-svelte';
  import { signTxn } from '$lib/services/token';
    
  let assets:any; let view:string = 'list';
  let destinationAddr:string = '';
  let sendAmount:string = '0';

  let tokenIssuer:string = '';
  let tokenCode:string = '';

  let claimBalanceID:string = '';

  let selectedTokenCode:string = '';
  let selectedTokenIssuer:string = '';

  const gotTodetail = (data:any) => {
    view= 'detail';
    console.log(data);
    selectedTokenCode= data.asset_code;
    selectedTokenIssuer= data.asset_issuer;
  }

  const claimeTransaction = async() => {
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
      txnBuilder.addOperation(Operation.createClaimableBalance(operationParam));
      txnBuilder.setTimeout(3600);
      const txn = txnBuilder.build().toXDR();
      const signRes = await signTxn(txn);

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

  const sendTransaction = async () => {
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
      txnBuilder.setTimeout(3600);
      const txn = txnBuilder.build().toXDR();
      const signRes = await signTxn(txn);
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
                callback:claimeTransaction
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

  const claimClaimableBalanceTransaction= async() => {
    const server = new Horizon.Server(stellar_rpc_endpoint);
    const account = await server.loadAccount($walletData.address);
    const txnBuilder = new TransactionBuilder(account, {fee:BASE_FEE, networkPassphrase: passpharase});
    
    const operationParam = {
      balanceId: claimBalanceID
    }    

    try {
      txnBuilder.addOperation(Operation.claimClaimableBalance(operationParam));
      txnBuilder.setTimeout(3600);
      const txn = txnBuilder.build().toXDR();
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

  const changeTrustTransaction = async () => {
    const server = new Horizon.Server(stellar_rpc_endpoint);
    const account = await server.loadAccount($walletData.address);
    const txnBuilder = new TransactionBuilder(account, {fee:BASE_FEE, networkPassphrase: passpharase});
    const assets = new Asset(tokenCode, tokenIssuer);

    txnBuilder.addOperation(Operation.changeTrust({asset:assets}));
    txnBuilder.setTimeout(3600);
    
    const txn = txnBuilder.build().toXDR()
    
    signTxn(txn);
  }

  onMount(async ()=>{
    let wallet = MetaStellarWallet.loadFromState($walletData);
    assets = await wallet.getAssets();
    console.log('assssssssssss', assets);
  })
</script>
<Card class="py-7 px-5 " shadow>
 {#if view === 'list'}
 <div>
    <div class=" flex justify-between">
      <h3 class="mb-4 text-center font-bold text-2xl"> Token </h3>
      <div>
      <Button on:click={()=>{
        view = 'add_asset'
      }} color="blue" size="sm">Add Asset</Button>
      <Button on:click={()=>{
        view = 'receive'
      }} color="none" size="sm">Receive</Button>
      </div>
    </div>
    <div class="grid">
        {#if assets}
          {#each assets  as asset}
            {#if assetType(asset) == 'token'}  
            <TokenPoster
              baseURL = {stellar_rpc_endpoint}
              assetAccount={{code: asset.asset_code, issuer: asset.asset_issuer}}   
              getTokenAssetInfo={gotTodetail}
              class="my-2"
              shadow
              balance={asset.balance}
            ></TokenPoster>
            {/if}
          {/each}
        {/if}
    </div>
  </div>
 {:else if view == 'detail'}
    <div>
      <div class="flex justify-between">
        <h3 class="mb-4 text-center font-bold text-2xl"> Send Token </h3>
        <div>
          <Button on:click={()=>{
            view='list'
          }} color="none">back</Button>
        </div>
      </div>
      
      <div class="flex flex-col gap-3">
      <div>
        <input type="text" bind:value={destinationAddr} placeholder='Destination' class="w-full p-2 h-[48px] border border-slate-200 rounded-lg"/>
      </div>
      <div>
        <input type="number" bind:value={sendAmount} placeholder='amount' class="w-full p-2 h-[48px] border border-slate-200 rounded-lg"/>
      </div>
      <div>
        <Button type="button" on:click={sendTransaction} size="sm" color="blue">send</Button>
      </div>
      </div>
    </div>
  {:else if view == 'add_asset'}
    <div class="my-4">Add Asset</div>
    <div class="flex flex-col gap-5">
      <div>
        <input type="text" bind:value={tokenCode}  placeholder='code' class="w-full p-2 h-[48px] border border-slate-200 rounded-lg"/>
      </div>
      <div>
        <input type="text" bind:value={tokenIssuer}  placeholder='issuer' class="w-full p-2 h-[48px] border border-slate-200 rounded-lg"/>
      </div>
      <div>
        <Button on:click={changeTrustTransaction} color="blue" size="sm">Confirm</Button>
        <Button on:click={()=>{view="list"}} color="none" size="sm">Back</Button>
      </div>
    </div>
    {:else}
    <h3 class="my-4">Receive</h3>
    <div class="flex flex-col gap-5">
      <div>
        <input type="text" bind:value={claimBalanceID}  placeholder='issuer' class="w-full p-2 h-[48px] border border-slate-200 rounded-lg"/>
      </div>
      <div>
        <Button on:click={claimClaimableBalanceTransaction} color="blue">receive</Button>
        <Button on:click={()=>{view="list"}} color="none" size="sm">Back</Button>
      </div>
    </div>
  {/if}

</Card>