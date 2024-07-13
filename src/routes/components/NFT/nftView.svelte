
<script lang="ts">
  import {Card, NftPoster} from '@metastellar/ui-library';
  import {Input, Textarea, Spinner, Button} from 'flowbite-svelte'
  import { getNFT, type NftModel, nftStore} from '$lib/store/nft';
  import { onDestroy, onMount } from 'svelte';

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

  onMount(async ()=>{
    await getNFT();
  })

  onDestroy(unsubscribe);
</script>
<Card class="py-12 px-5 " >
    <div class="mb-5">
      NFT View
    </div>
    <div>
      <div class="grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 gap-2 ">
        {#each nftList  as nft}  
        <div class="my-2 ">
          <NftPoster
          dataURL="http://localhost/api" 
          assetAccount={nft}
          />
          </div>
        {/each}
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