
<script lang='ts'>
  import * as StellarSdk from '@stellar/stellar-sdk';
  // import fetch from 'node-fetch';
  import { NFTStorage, Blob, type CIDString } from 'nft.storage';
  import fs from 'fs';

  import {Card} from '@metastellar/ui-library';
  import { env } from "$lib/env";
  import testNFTImage from "$lib/images/svelte-welcome.png";


  const issuerKeypair = StellarSdk.Keypair.random();
  const receiverKeypair = StellarSdk.Keypair.fromSecret(env.VITE_NFT_RECEIVER);
  const stellar_rpc_endpoint = env.VITE_STELLAR_RPC_ENDPOINT;
  const fritend_bot_url = env.VITE_FRIEND_BOT_URL;
  const nft_storage_api_key = env.VITE_NFT_STORAGE_API_KEY;
  const nft_storage_url = env.VITE_NFT_STORAGE_URL;
  let files: any;

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
    const nftAsset = new StellarSdk.Asset('MSNFT', issuerKeypair.publicKey());

    // // Store the Image and metadata using nft.storage
    const NFT_STORAGE_TOKEN = nft_storage_api_key; // Get this from https://nft.storage/manage
    const IMAGE_PATH = "$lib/images/svelte-welcome.png";
    const client = new NFTStorage({ token: '' });

    const imageCID = await client.storeBlob(new Blob([files[0]]));
    console.log(`imageCID: ${imageCID}`);

    const metadata = {
      name: "Test Meta Stellar NFT",
      description: "This is for testing meta stellar nft",
      image: `${nft_storage_url}/${imageCID}`,
      issuer: nftAsset.getIssuer(),
      code: nftAsset.getCode()
    };
    const metadataCID = await client.storeBlob(new Blob([JSON.stringify(metadata)]));
    console.log(`metadataCID: ${metadataCID}`);

    // Connect to the testnet with the StellarSdk.
    const server = new StellarSdk.Horizon.Server(stellar_rpc_endpoint);
    const account = await server.loadAccount(issuerKeypair.publicKey());

    // Build a transaction that mints the NFT.
    let transaction = new StellarSdk.TransactionBuilder(
      account, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: StellarSdk.Networks.TESTNET
      })
      // Add the NFT metadata to the issuer account using a `manageData` operation.
      .addOperation(StellarSdk.Operation.manageData({
        name: 'ipfshash',
        value: "QmQwPAxDLYRN4zRuMn3H9ZocmNNSSUWw2pdS5RdoV5vuHM" as CIDString,
        source: issuerKeypair.publicKey(),
      }))
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

  async function testNFT() {
    await funding();
    await generateNFT();
  }

</script>

<Card class="py-12 px-5 " >
    mintNFT
    <label for="avatar">Upload a picture:</label>
    <input accept="image/png, image/jpeg" bind:files id="avatar" name="avatar" type="file" />
    <button on:click={()=>{testNFT()}}>Mint</button>
</Card>

<style>
</style>