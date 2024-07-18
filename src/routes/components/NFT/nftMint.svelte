
<script lang='ts'>
  import { onMount } from 'svelte';
  import {Button} from 'flowbite-svelte'
  import { createForm } from "svelte-forms-lib";
  import {Chasing} from 'svelte-loading-spinners'
  import * as StellarSdk from '@stellar/stellar-sdk';
  import {Card} from '@metastellar/ui-library';
  import {MetaStellarWallet} from 'metastellar-sdk';
  import {walletData} from '$lib/store';
  import { env } from "$lib/env";
	import {Toast as toast} from "$lib/utils"
  import {funding, uploadNFTFile, resigterNFT, generateNFTOnStellar} from '$lib/services/nft'
  import {stellar_explorer_url} from '$lib/constants'

  let files: any | null;
  let itemCode:string = "";
  let itemName:string = "";
  let nftIssuer: string = "";
  let itemDesc:string = "";
  let isMinting:boolean;

  let issuerKeypair:StellarSdk.Keypair;

 
  async function mintNFT() {
    isMinting=true;
    
    issuerKeypair = StellarSdk.Keypair.random();
    handleNFTIssuerChange(issuerKeypair.publicKey().toString());

    try {
      let result = await funding(issuerKeypair.publicKey());
      if(!result.ok) {
        console.log("funding error", result.error);
        return;
      }
      const uploadRes = await uploadNFTFile({files, itemName});
      if(!uploadRes.ok) {
        console.log("upload failed", uploadRes.error);
        toast({type:'error', desc:`minting error: ${uploadRes.error}`});
        return;
      }
      result = await resigterNFT({code:itemCode, issuer:issuerKeypair.publicKey(), name:itemName, desc:itemDesc, imageURL:uploadRes.data});
      if(!result.ok) {
        console.log("register nft failed", result.error);
        toast({type:'error', desc:`register nft failed: ${result.error}`});
        return;
      }
      const nftResult = await generateNFTOnStellar({code:itemCode, issuerKeypair:issuerKeypair});
      if(nftResult.ok) {
        console.log("transaction hash", stellar_explorer_url + nftResult.data);
        toast({type:'info', desc:`transaction hash: ${stellar_explorer_url+nftResult.data}`});
        
        walletData.update(item=>({...item, dataPacket:null }));
        walletData.subscribe(val=>console.log(val));
        const wallet = MetaStellarWallet.loadFromState($walletData);
        await wallet.init();
        walletData.set(wallet.exportState());

      } else {
        console.log("transaction failed", nftResult.error);
        toast({type:'error', desc:`transaction failed: ${nftResult.error}`});
      }
    } catch (e:any) {
      console.log('error', e);
      toast({type:'error', desc:`transaction failed: ${e}`});
    }
    finally {
      isMinting = false;
    }
      
  }
  $: if (files) {
		console.log(files);
	}

  function handleNFTIssuerChange(issuerKeyStr: string) {
    nftIssuer = issuerKeyStr;
  }

  let isSubmitEnabled:boolean = false;
  const validateForm = () => {
    console.log('files validation', files);
    isSubmitEnabled = itemCode.trim() != "" && itemCode.trim().length < 12 && itemName.trim() != "" && itemDesc.trim() != "" && files != null;
    console.log('isSubmitEnabled', isSubmitEnabled);
  }
  onMount(()=>{
    // validateForm();
  })

</script>
<Card class="py-7 px-5 " >
    <h3 class="mb-4 text-center font-bold text-2xl">Mint NFT</h3>
    <div class="flex flex-col gap-4">
      <div>
        <input type="text" bind:value={itemCode} on:input={validateForm} placeholder='NFT Code' class="w-full p-2 h-[48px] border border-slate-200 rounded-lg">
      </div>
      <div>
        <input type="text" bind:value={nftIssuer} on:input={validateForm}  placeholder='NFT Issuer' disabled class="w-full p-2 h-[48px] border border-slate-200 rounded-lg"/>
      </div>
      <div>
        <input type="text" bind:value={itemName} on:input={validateForm}  placeholder='NFT Name' class="w-full p-2 h-[48px] border border-slate-200 rounded-lg"/>
      </div>
      <div>
        <textarea bind:value={itemDesc} placeholder='NFT Description' class="w-full p-2 border border-slate-200 rounded-lg"/>
      </div>
      <div>
        <label for="avatar">picture:</label>
        <input accept="image/png, image/jpeg" bind:files id="avatar" name="avatar" type="file" on:change={validateForm}/>
      </div>
      {#if isSubmitEnabled}
        <Button on:click={()=>{mintNFT()}} disabled={isMinting}  color="blue" class="py-3">
          {#if isMinting}
          <span class="mr-3"><Chasing size="15" color="white" unit="px" /></span>
          {/if}
          Mint
        </Button>
      {:else}
        <Button disabled  color="blue" class="py-3">Mint</Button>
      {/if}
      </div>
  </Card>
<style>
</style>
