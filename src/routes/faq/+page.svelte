<script lang='ts'>
    import {Card, NftPoster, Jumbotron} from '@metastellar/ui-library';
    import {Button} from 'flowbite-svelte';
    import {walletData} from '$lib/store';
    import {MetaStellarWallet} from 'metastellar-sdk';
    import type {WalletState} from 'metastellar-sdk';

    async function importWallet(){
        let wallet = MetaStellarWallet.loadFromState($walletData);
        await wallet.importAccount();
        await wallet.sync();
        walletData.set(wallet.exportState());
    }
    async function exportKeys(){
        let wallet = MetaStellarWallet.loadFromState($walletData);
        await wallet.exportAccount();
    }
</script>


<h1 class="title">Frequently Asked Questions</h1>
<div style="margin-left:2em;">
    <br/>
    <p class="question">Where can I view my Wallet?</p>
    <p class="anwser">go to <a href="/wallet">metastellar.io/wallet</a></p>
    <br/>
    <hr/>
    <br/>
    <p class="question">How can I import a stellar wallet?</p>
    <p class="anwser">have your private key ready and click the button below</p>
    <Button color="light" on:click={importWallet}>import wallet</Button>
    <br/>
    <br/>
    <hr/>
    <br/>
    <p class="question">How can I export my private key from my wallet?</p>
    <p class="anwser">click the button below</p>
    <Button color="light" on:click={exportKeys}>export keys</Button>
    <br/>
    <br/>
    <hr/>
    <br/>
    <p class="question">Where are my keys stored</p>
    <p class="anwser">your keys are stored in the same place as your metamask ethereum keys in encrypted storeage</p>
</div>

<style>
    .title{
        font-size: 2em;
    }
    .question{
        font-size: 1.5em;
    }
    .anwser{
        font-size: 1em;
        font-style: bold;
    }
</style>