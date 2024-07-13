
<script lang='ts'>
  import * as StellarSdk from '@stellar/stellar-sdk';
  // import fetch from 'node-fetch';
  import fs from 'fs';

  import {Card} from '@metastellar/ui-library';
  import { env } from "$lib/env";
  import testNFTImage from "$lib/images/svelte-welcome.png";
  import {Input, Textarea, Spinner, Button} from 'flowbite-svelte'


  const issuerKeypair = StellarSdk.Keypair.random();
  // const issuerKeypair = StellarSdk.Keypair.fromSecret(env.VITE_NFT_ISSUER);
  const receiverKeypair = StellarSdk.Keypair.fromSecret(env.VITE_NFT_RECEIVER);
  const stellar_rpc_endpoint = env.VITE_STELLAR_RPC_ENDPOINT;
  const fritend_bot_url = env.VITE_FRIEND_BOT_URL;
  // const nft_storage_api_key = env.VITE_NFT_STORAGE_API_KEY;
  // const nft_storage_url = env.VITE_NFT_STORAGE_URL;
  let files: any;
  let itemCode:string;
  let itemName:string;
  let itemDesc:string;
  let isMinting:boolean;

  // // Optional: Log the keypair details if you want to save the information for later.
  console.log(`Issuer Public Key: ${issuerKeypair.publicKey()}`);
  console.log(`Issuer Secret Key: ${issuerKeypair.secret()}`);
  console.log(`Receiver Public Key: ${receiverKeypair.publicKey()}`);
  console.log(`Receiver Secret Key: ${receiverKeypair.secret()}`);

  console.log("testNFTImage", testNFTImage)

  async function funding() {

    console.log("==============funding==============");
    // Fund both accounts using Friendbot. We're performing the fetch operation, and ensuring the response comes back "OK".
    await Promise.all([ issuerKeypair, receiverKeypair ].map(async (kp) => {
      // Set up the Friendbot URL endpoints
      const friendbotUrl = `${fritend_bot_url}?addr=${kp.publicKey()}`;
      let response = await fetch(friendbotUrl);

      // // Optional: Looking at the responses from fetch
      // let json = await response.json();
      // console.log(json);

      // Check that the response is OK, and give a confirmation message.
      if (response.ok) {
        console.log(`Account ${kp.publicKey()} successfully funded.`);
      } else {
        console.log(`Something went wrong funding account: ${kp.publicKey}.`);
      }
    }))
    console.log("==============funding end==============");
  }

  async function generateNFT() {
    console.log("==============generate nft==============");
    // Create the Asset so we can issue it on the network.
    const nftAsset = new StellarSdk.Asset(itemCode, issuerKeypair.publicKey());

    // Connect to the testnet with the StellarSdk.
    const server = new StellarSdk.Horizon.Server(stellar_rpc_endpoint);
    const account = await server.loadAccount(issuerKeypair.publicKey());

    // Build a transaction that mints the NFT.
    let transaction = new StellarSdk.TransactionBuilder(
      account, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: StellarSdk.Networks.TESTNET
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
        source: receiverKeypair.publicKey(),
      }))
      // Add a `payment` operation to send the NFT to the receiving account.
      .addOperation(StellarSdk.Operation.payment({
        destination: receiverKeypair.publicKey(),
        asset: nftAsset,
        amount: "0.0000001",
        source: issuerKeypair.publicKey(),
      }))
      // setTimeout is required for a transaction, and it also must be built.
      .setTimeout(30)
      .build();

    // Sign the transaction with the necessary keypairs.
    transaction.sign(issuerKeypair);
    transaction.sign(receiverKeypair);

    try {
      await server.submitTransaction(transaction);
      console.log('The asset has been issued to the receiver');
    } catch (error: any) {
      console.log(`${error}. More details: \n${error.response.data}`);
    }
    console.log("==============generate nft end==============");
  }


  async function uploadFile() {
    //  const body = { data: JSON.stringify(mouseTrackData) };
    const formData = new FormData();
    formData.append("file", files[0]);

    const pinataMetadata = JSON.stringify({
      name: 'File name',
    });
    formData.append('pinataMetadata', pinataMetadata);

    const pinataOptions = JSON.stringify({
      cidVersion: 0,
    })
    formData.append('pinataOptions', pinataOptions);

    type responseType = {
      IpfsHash:string;
      PinSize:string;
      Timestamp:number
    }
    try {
    
      const res = await fetch(env.VITE_PINATA_UPLOAD_URL, {
        method:'post',
        headers: {
            'Authorization': `Bearer ${env.VITE_PINATA_API_KEY}`
        },
        body:formData
      });

      if (res.ok) {
        const responseData: responseType = await res.json();
        return {success:true, data: responseData.IpfsHash}
      }
      else {
        return {success:false, data:"", error: "parse error"}
      }

    } catch(e) {
      return {success:false, data:"", error: e}
    } 
  }


  async function resigterNFT(imageURL:string) {
    const req = {
      code: itemCode,
      issuer: issuerKeypair.publicKey(),
      name: itemName,
      desc: itemDesc,
      image: `${env.VITE_PINATA_BASE_URL}/${imageURL}`,
      display_decimals:7
    }
    try {
      const res = await fetch(`${env.VITE_STELLAR_TOML_SERVER_API}/insert_nft`, {
        method:'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(req)
      })
      if (res.ok) {

      }
      else {
        alert('register error');
      }
    } catch (e:any) {
      console.log('register error', e);
      alert('register error');
    }
  }
  
  async function testNFT() {
    isMinting=true;
    try {
      await funding();
      const uploadRes = await uploadFile();
      await resigterNFT(uploadRes.data);
      await generateNFT();
      // await testRegister();
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
</script>

<Card class="py-12 px-5 " >
    <div class="mb-5">
      mintNFT
    </div>
    <div class="flex flex-col gap-4">
      <div>
        <Input type="text" bind:value={itemName} on:input={handleItemNameChange} placeholder='NFT Name'/>
      </div>
      <div>
        <Input type="text" bind:value={itemCode} on:input={handleItemCodeChange}  placeholder='NFT Code'/>
      </div>
      <div>
        <Textarea bind:value={itemDesc} on:input={handleItemDescChange}   placeholder='NFT Description'/>
      </div>
      <div>
        <label for="avatar">picture:</label>
        <input accept="image/png, image/jpeg" bind:files id="avatar" name="avatar" type="file" />
      </div>
      <Button on:click={()=>{testNFT()}} disabled={isMinting}  color="blue">
        {#if isMinting}
        <span class="mr-3"><Spinner size={4}/></span>
        {/if}
        Mint</Button>
    </div>
    
</Card>

<style>
</style>