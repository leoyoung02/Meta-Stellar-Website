
<script lang="ts">
  import {onMount } from 'svelte';
  import {MetaStellarWallet} from 'metastellar-sdk';
  import {TransactionBuilder, Operation, BASE_FEE, Horizon, Asset, Claimant} from 'stellar-sdk';
  import {Card, NftPoster} from '@metastellar/ui-library';
  import {walletData} from '$lib/store';
  import {stellar_rpc_endpoint, passpharase} from '$lib/constants'
  import { Alert, assetType, Toast as toast } from '$lib/utils';
  import { Button } from 'flowbite-svelte';
  import { signTxn } from '$lib/services';

  let view:string = 'list';
  let assets:any;
  let selectedNFTCode:string = '';
  let selectedNFTIssuer:string = '';
  let destinationAddr:string = '';
  const goToDetail = (data:any) => {
    view = 'detail'
    selectedNFTCode = data.assetInfo.asset_code
    selectedNFTIssuer = data.assetInfo.asset_issuer;
  }
 const claimeTransaction = async() => {
    const server = new Horizon.Server(stellar_rpc_endpoint);
    const account = await server.loadAccount($walletData.address);
    const txnBuilder = new TransactionBuilder(account, {fee:BASE_FEE, networkPassphrase: passpharase});

    const assets = new Asset(selectedNFTCode, selectedNFTIssuer);
    
    const claimants = [
      new Claimant(
        destinationAddr,
      )
    ];
    
    const operationParam = {
      amount: '1',
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
    
    const assets = new Asset(selectedNFTCode, selectedNFTIssuer);
    const operationParam = {
      amount:'1',
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

  onMount(async ()=>{
    let wallet = MetaStellarWallet.loadFromState($walletData);
    assets = await wallet.getAssets();
  })
export const tokenInfo: AssetAccount = {
  code: "BTCLN",
  issuer: "GDPKQ2TSNJOFSEE7XSUXPWRP27H6GFGLWD7JCHNEYYWQVGFA543EVBVT"
}

                // assetAccount={{code:asset.asset_code, issuer:asset.asset_issuer}}
</script>
<Card class="py-7 px-5 " shadow>
  {#if view == 'list'}
    <h3 class="mb-4 text-center font-bold text-2xl"> NFT List </h3>
    <div>
      <div class="grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 gap-2 ">
        {#if assets}
          {#each assets  as asset}
            {#if assetType(asset) == 'nft'}  
            <div class="my-2 ">
              <NftPoster
                baseURL={stellar_rpc_endpoint}
                hoverTransform
                assetAccount={{code:asset.asset_code, issuer:asset.asset_issuer}}

                imgClass="h-[200px]"
                getNFTAssetInfo={goToDetail}
              />
              </div>
            {/if}
          {/each}
        {/if}
      </div>
    </div>
    {:else}
      <div class="">
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
        <Button type="button" on:click={sendTransaction} size="sm" color="blue">send</Button>
      </div>
      </div>
    </div>
      </div>
    {/if}
</Card>