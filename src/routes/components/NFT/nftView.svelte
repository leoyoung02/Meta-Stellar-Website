
<script lang="ts">
  import {Card, NftPoster} from '@metastellar/ui-library';
  import {Input, Textarea, Spinner, Button} from 'flowbite-svelte'
  import { getNFT, type NftModel, nftStore} from '$lib/store/nft';
  import {walletData} from '$lib/store';
  import { onDestroy, onMount } from 'svelte';
  import {MetaStellarWallet} from 'metastellar-sdk';

  let itemCode:string="";
  let nftIssuer:string="";
  let isLoadingNFT:boolean = false;
  
  // function handleItemCodeChange(e:Event) {
  //   const target = e.target as HTMLInputElement;
  //   itemCode = target.value;
  // } 
  // function handleItemIssuerChange(e:Event) {
  //   const target = e.target as HTMLInputElement;
  //   nftIssuer = target.value;
  // }
  
  let nftList:NftModel[] = [];
  const unsubscribe = nftStore.subscribe(value => {
    nftList = value;
  });

  let assets:any;
  onMount(async ()=>{
    let wallet = MetaStellarWallet.loadFromState($walletData);
    assets = await wallet.getAssets();
    console.log('assets', assets);
    
  })

  onDestroy(unsubscribe);
</script>
<Card class="py-7 px-5 " >
    <h3 class="mb-4 text-center font-bold text-2xl"> View NFT </h3>
    <div>
      <div class="grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 gap-2 ">
        {#if assets}
          {#each assets  as asset}  
          <div class="my-2 ">
            <NftPoster
            dataURL="http://localhost/api" 
            assetAccount={{code:asset.asset_code, issuer:asset.asset_issuer}}
            />
            </div>
          {/each}
        {/if}
      </div>
    </div>
    <!-- <div class="flex flex-col gap-4">
      <div>
        <input type="text" bind:value={itemCode}  placeholder='NFT Code' on:input={handleItemCodeChange} class="w-full p-2 h-[48px] border border-slate-200 rounded-lg">

      </div>
      <div>
        <input type="text" bind:value={nftIssuer}  on:input={handleItemIssuerChange}  placeholder='NFT Issuer'  class="w-full p-2 h-[48px] border border-slate-200 rounded-lg"/>
      </div>
      <Button on:click={()=>{console.log('erere')}} disabled={isLoadingNFT}  color="blue">
        {#if isLoadingNFT}
          <span class="mr-3"><Spinner size={4}/></span>
        {/if}
        NFT view</Button>
    </div> -->
    
</Card>