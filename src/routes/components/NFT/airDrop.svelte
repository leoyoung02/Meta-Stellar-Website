<script lang="ts">
  import { onMount } from 'svelte';
  import {getAirDropData, claimClaimableBalance, trustNClaimTransaction} from '$lib/services'
  import { checkTrust } from '$lib/utils/airdrop';

  let airDropData:any;
  
  const createClaimTransaction = async ({asset, balanceID, amount}:{asset:string, balanceID:string, amount:string}) => {
      await claimClaimableBalance({asset, balanceID, amount});
  }
  const createTrustNClaimTransaction = async({asset,balanceID,amount}:{asset:string, balanceID:string, amount:string}) => {
    await trustNClaimTransaction({asset, balanceID, amount});
  }
  onMount(async ()=>{
      const response = await getAirDropData();
      airDropData = response._embedded.records;
      console.log('airDropData', airDropData);
  })
</script>
<div class="py-4">
  {#if airDropData}
    {#each airDropData  as item}
      <div class="flex justify-between my-4">
        <div class="flex gap-4">
          <div class="flex justify-center items-center bg-gray-300 rounded dark:bg-gray-700">
            <svg width="48" height="48" class="text-gray-200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="currentColor" viewBox="0 0 10 10">
              <path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" />
            </svg>
          </div>
          <div class="flex flex-col">
            <p>{item.asset.split(":")[0]}</p>
            <button on:click={()=>{checkTrust({code:item.asset.split(":")[0], issuer:item.asset.split(":")[1]}) ? createClaimTransaction({asset: item.asset,balanceID:item.id,amount:item.amount}): createTrustNClaimTransaction({asset: item.asset,balanceID:item.id,amount:item.amount})}}>claim</button>
          </div>
        </div>
        <div class="mt-5">
          {item.amount}
        </div>
      </div>
    {/each}
  {/if}
</div>