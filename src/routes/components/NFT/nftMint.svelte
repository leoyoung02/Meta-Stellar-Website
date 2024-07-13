
<script lang='ts'>
  import {Input, Textarea, Spinner, Button} from 'flowbite-svelte'
  import * as StellarSdk from '@stellar/stellar-sdk';

  import {Card} from '@metastellar/ui-library';
  import { env } from "$lib/env";
  import {updateNFT} from '$lib/store/nft';


  const stellar_rpc_endpoint = env.VITE_STELLAR_RPC_ENDPOINT;
  const stellar_network_passphrase = env.VITE_NETWORK_PASSPHRASE;
  const fritend_bot_url = env.VITE_FRIEND_BOT_URL;
  const stellar_server_url = env.VITE_STELLAR_TOML_SERVER_URL;
  const pinata_upload_url = env.VITE_PINATA_UPLOAD_URL;
  const pinata_api_key = env.VITE_PINATA_API_KEY;
  const pinata_base_url = env.VITE_PINATA_BASE_URL;
  const stellar_explorer_url = env.VITE_STELLAR_EXPLORER_URL;

  let files: any;
  let itemCode:string;
  let itemName:string;
  let nftIssuer: string;
  let itemDesc:string;
  let isMinting:boolean;

  let issuerKeypair:StellarSdk.Keypair;

  async function funding(account: any) {
    console.log("==============funding==============");
    const friendbotUrl = `${fritend_bot_url}?addr=${account}`;
    try {
      let response = await fetch(friendbotUrl);
      if (response.ok) {
        console.log(`Account ${account} successfully funded.`);
        return {
          ok: true,
          error: null
        }
      } else {
        console.log(`Something went wrong funding account: ${account}`);
        return {
          ok: false,
          error: "funding failed"
        }
      }
    } catch (error) {
      console.log(`Something went wrong funding account: ${account}`);
      return {
          ok: false,
          error: error
        }
    }
  }

  async function generateNFTOnStellar() {
    console.log("==============generate nft==============");
    console.log(`Issuer Public Key: ${issuerKeypair.publicKey()}`);
    console.log(`Issuer Secret Key: ${issuerKeypair.secret()}`);

    // Create the Asset so we can issue it on the network.
    const nftAsset = new StellarSdk.Asset(itemCode, issuerKeypair.publicKey());

    // Connect to the testnet with the StellarSdk.
    const server = new StellarSdk.Horizon.Server(stellar_rpc_endpoint);
    const receiverPuplicKey = await ethereum.request({
        method: 'wallet_invokeSnap',
        params: {snapId:'npm:stellar-snap', request:{
        method: 'getAddress',
        }}
    });
    const issuer = await server.loadAccount(issuerKeypair.publicKey());
    const receiver = await server.loadAccount(receiverPuplicKey);
    // Build a transaction that mints the NFT.
    let transaction = new StellarSdk.TransactionBuilder(
    issuer, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: stellar_network_passphrase
    })
    .addOperation(
      StellarSdk.Operation.setOptions({
        homeDomain: "deoss.anonid.io",
      }),
    )
    // Add the NFT metadata to the issuer account using a `manageData` operation.
    // .addOperation(StellarSdk.Operation.manageData({
    //   name: 'ipfshash',
    //   value: "QmQwPAxDLYRN4zRuMn3H9ZocmNNSSUWw2pdS5RdoV5vuHM" as CIDString,
    //   source: issuerKeypair.publicKey(),
    // }))
    // Perform a `changeTrust` operation to create a trustline for the receiver account.
    .addOperation(StellarSdk.Operation.changeTrust({
      asset: nftAsset,
      limit: '0.0000001',
      source: receiverPuplicKey,
    }))
    // Add a `payment` operation to send the NFT to the receiving account.
    .addOperation(StellarSdk.Operation.payment({
      destination: receiverPuplicKey,
      asset: nftAsset,
      amount: "0.0000001",
      source: issuerKeypair.publicKey(),
    }));

    transaction.setTimeout(30);

    const endTransaction = transaction.build();

    endTransaction.sign(issuerKeypair);
    
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
      console.log('The asset has been issued to the receiver', response.hash);
      return {
        ok: true,
        error: null,
        data: response.hash
      }
    } catch (error: any) {
      console.log(`${error}. More details: \n${error.response.data}`);
      return {
        ok: false,
        error: error,
        data: null
      }
    }
  }


  async function uploadFile() {
    //  const body = { data: JSON.stringify(mouseTrackData) };
    console.log("==============upload==============");
    const formData = new FormData();
    formData.append("file", files[0]);

    const pinataMetadata = JSON.stringify({
      name: itemName,
    });
    formData.append('pinataMetadata', pinataMetadata);

    const pinataOptions = JSON.stringify({
      cidVersion: 0,
    })
    formData.append('pinataOptions', pinataOptions);

    type responseType = {
      IpfsHash:string;
      PinSize:string;
      Timestamp:number,
      isDuplicate?:boolean
    }
    try {
    
      const res = await fetch(pinata_upload_url, {
        method:'post',
        headers: {
            'Authorization': `Bearer ${pinata_api_key}`
        },
        body:formData
      });

      if (res.ok) {
        const responseData: responseType = await res.json();
        if (responseData.isDuplicate)
          return {ok:false, data:'', error:'duplicated'}
        return {ok:true, data: responseData.IpfsHash, error: null}
      }
      else {
        return {ok:false, data:"", error: "parse error"}
      }

    } catch(e) {
      return {ok:false, data:"", error: e}
    } 
  }


  async function resigterNFT(imageURL:string) {
    console.log("==============register==============");
    const req = {
      code: itemCode,
      issuer: issuerKeypair.publicKey(),
      name: itemName,
      desc: itemDesc,
      image: `${pinata_base_url}/${imageURL}`,
      display_decimals:7
    }
    try {
      const res = await fetch(`${stellar_server_url}/insert_nft`, {
        method:'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(req)
      })
      if (res.ok) {
        return {
          ok: true,
          error: null
        }
      }
      else {
        console.log("register error");
        return {
          ok: false,
          error: "register error"
        }
      }
    } catch (e:any) {
      console.log('register error', e);
      return {
          ok: false,
          error: e
      }
    }
  }
  
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
      const uploadRes = await uploadFile();
      if(!uploadRes.ok) {
        console.log("upload failed", uploadRes.error);
        return;
      }
      result = await resigterNFT(uploadRes.data);
      if(!result.ok) {
        console.log("register nft failed", result.error);
        return;
      }
      const nftResult = await generateNFTOnStellar();
      if(nftResult.ok) {
        console.log("transaction hash", stellar_explorer_url + nftResult.data);
        alert(stellar_explorer_url + nftResult.data);
        // updateNFT({code:itemCode, issuer:})
      } else {
        console.log("transaction failed", nftResult.error);
      }
      isMinting = false;
    } catch (e:any) {
      console.log('error', e);
      isMinting = false;
    }
      
  }
  $: if (files) {
		console.log(files);
	}

  function handleItemNameChange(e:Event) {
    const target = e.target as HTMLInputElement;
    itemName = target.value;
  } 
  function handleItemCodeChange(e:Event) {
    const target = e.target as HTMLInputElement;
    itemCode = target.value;
  }
  function handleItemDescChange(e:Event) {
    const target = e.target as HTMLInputElement;
    itemDesc = target.value;
  }
  function handleNFTIssuerChange(issuerKeyStr: string) {
    nftIssuer = issuerKeyStr;
  }
</script>

<Card class="py-12 px-5 " >
    <div class="mb-5">
      mintNFT
    </div>
    <div class="flex flex-col gap-4">
      <div>
        <input type="text" bind:value={itemCode}  placeholder='NFT Code' on:input={handleItemCodeChange} class="w-full p-2 h-[48px] border border-slate-200 rounded-lg">

      </div>
      <div>
        <input type="text" bind:value={nftIssuer} placeholder='NFT Issuer' disabled class="w-full p-2 h-[48px] border border-slate-200 rounded-lg"/>
      </div>
      <div>
        <input type="text" bind:value={itemName} on:input={handleItemNameChange} placeholder='NFT Name' class="w-full p-2 h-[48px] border border-slate-200 rounded-lg"/>
      </div>
      <div>
        <textarea bind:value={itemDesc} on:input={handleItemDescChange}   placeholder='NFT Description' class="w-full p-2 border border-slate-200 rounded-lg"/>
      </div>
      <div>
        <label for="avatar">picture:</label>
        <input accept="image/png, image/jpeg" bind:files id="avatar" name="avatar" type="file" />
      </div>
      <Button on:click={()=>{mintNFT()}} disabled={isMinting}  color="blue">
        {#if isMinting}
        <span class="mr-3"><Spinner size={4}/></span>
        {/if}
        Mint</Button>
    </div>
    
</Card>

<style>
</style>