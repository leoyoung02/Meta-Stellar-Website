
<script lang="ts">
  import {onMount } from 'svelte';
  import {MetaStellarWallet} from 'metastellar-sdk';
  import {Card, NftPoster} from '@metastellar/ui-library';
  import {walletData} from '$lib/store';
  import {stellar_rpc_endpoint} from '$lib/constants'
  import { assetType } from '$lib/utils';


  let assets:any;
  onMount(async ()=>{
    let wallet = MetaStellarWallet.loadFromState($walletData);
    assets = await wallet.getAssets();
  })

</script>
<Card class="py-7 px-5 " >
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
                imgClass="h-[200px]"
                assetAccount={{code:asset.asset_code, issuer:asset.asset_issuer}}
              />
              </div>
            {/if}
          {/each}
        {/if}
      </div>
    </div>
    
</Card>