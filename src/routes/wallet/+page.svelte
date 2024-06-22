<script lang="ts">
    import {Card} from '@metastellar/ui-library';
    import {Modal} from 'flowbite-svelte'

    import {connected, address, ballance, accountName} from '../../store';   
    import {snapId} from '../../constants';   
  import Button from '../../components/Button.svelte';
 
    export let balance= "";
    export let accountInfo= "";
</script>
<div>
    <div id="midContainer"  class="uk-container">
        <Card class="p-5 mt-16">
            <h3 class="my-5 font-bold">Metamask Account</h3>
            <p>{$address}</p>
            
            <h3 class="my-5 font-bold"> ballance of wallet</h3>
            <p>{$ballance}</p>
             <h3 class="my-5 font-bold"> account name</h3>
            <p>{$accountName}</p>
        </Card>
        <Card class="p-5 mt-16">
            <div class="flex gap-2 text-white">
            <Button>
                Send XLM
            </Button>
            <Button>
                Receive stellar
            </Button>
            
            <Button>
                Send token
            </Button>
            <Button>
                View token
            </Button>
            
            <Button>
                Send NFT
            </Button>
            <Button>
                Mint NFT
            </Button>
            </div>
        </Card>
        <!-- <Card class="p-5 mt-16">
            <div class="mb-5">
                <button on:click={getAccountName} class="border bg-slate-700 text-white py-3 px-7 rounded-lg">get account name</button>
            </div>
            <h3>get account name</h3>
            <p>{accountInfo}</p>
        </Card>       -->
        <!-- <Card class="p-5 mt-16">
            <div class="mb-5">
                <button on:click={getBallance} class="border bg-slate-700 text-white py-3 px-7 rounded-lg">get ballance</button>
            </div>
            <h3>get stellar balances</h3>
            <p>{balance}</p>
        </Card>   -->
        
    </div>
</div>
