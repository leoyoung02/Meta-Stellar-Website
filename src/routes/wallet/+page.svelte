<script lang="ts">
    import {Card} from '@metastellar/ui-library';
    
    import copy from "copy-to-clipboard";
    import {connected, address, ballance, accountName} from '../../store';   
 
    export let currentView = "sendXLM";
    const setView = (view:string) => {
        currentView = view;
        console.log('view ', currentView);

    }

    const onCopy = (text:string) => {
        copy(text);
        alert('copied!');
    }

    let _currentView;
    $:_currentView = currentView;

</script>
<div>
    <div id="midContainer"  class="uk-container">
        <Card class="p-5 mt-16  ">
            <div class="mt-12">
                <p class="text-center">{$ballance} </p>
                <h3 class="my-5 font-bold text-2xl text-center uppercase"> ballance</h3>
            </div>
            <div class="mt-5">
                <p class="text-center">{$address} <span class="border rounded-xl px-2 py-1" on:click={()=>onCopy($address)}>copy</span></p>
                <h3 class="my-5 font-bold text-center">address</h3>
            </div>
        </Card>
        <div class="flex flex-row mt-12 justify-between ">
            <button on:click={()=>{setView('sendXLM')}}>
                <Card class="py-8 px-12  " hoverTransform>
                    <span>Send XLM</span>
                </Card>
            </button>
            <button on:click={()=>{setView('receiveStellar')}}>
                <Card class="py-8 px-12 " hoverTransform>
                    <span>Receive</span>
                </Card>
            </button>
            <button on:click={()=>{setView('sendToken')}}>
            <Card class="py-8 px-12  "
            hoverTransform>
                Send token
            </Card>
              </button>
            <button on:click={()=>{setView('viewNFT')}}>
                 <Card class="py-8 px-12  "
            hoverTransform>
                View token
            </Card>
              </button>
            <button on:click={()=>{setView('sendNFT')}}>
                <Card class="py-8 px-12  " hoverTransform>
                    Send NFT
                </Card>
            </button>
            <button on:click={()=>{setView('mintNFT')}}>
                <Card class="py-8 px-12  " hoverTransform>
                    Mint NFT
                </Card>
            </button>
        </div>
        <div class="mt-12">
            {#if _currentView == 'sendXLM'}
            <Card class="py-12 px-5 " >
                Send XLM
            </Card>
            {:else if _currentView == 'receiveStellar'}
            <Card class="py-12 px-5 " >
                receive Stellar
            </Card>
            {:else if _currentView == 'sendToken'}
            <Card class="py-12 px-5 " >
                sendToken
            </Card>
            {:else if _currentView == 'viewNFT'}
            <Card class="py-12 px-5 " >
                viewNFT
            </Card>
            {:else if _currentView == 'sendNFT'}
            <Card class="py-12 px-5 " >
                sendNFT
            </Card>
            {:else if _currentView == 'mintNFT'}
            <Card class="py-12 px-5 " >
                mintNFT
            </Card>
            {/if}
        </div>
        
    </div>
</div>
