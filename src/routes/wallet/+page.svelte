<script lang="ts">
    import {Card} from '@metastellar/ui-library';
    const onClick = async () => {
        const res = await connect();
        console.log('res', res);

    }

    async function connect(){
        const connected = await ethereum.request({
            method: 'wallet_requestSnaps',
            params: {
            [`npm:stellar-snap`]: {}
            },
        });
    }

function getAddress(){
     window.ethereum.request({
        method: 'wallet_invokeSnap',
        params: {
          snapId: 'npm:stellar-snap',
          request: {
            method: 'getAddress',
            params: {"testnet":true}
          },
        },
      })
      .then((result)=>{
        address = JSON.stringify(result)
    })
        
}

function getAccountName() {
    window.ethereum.request({
        method: 'wallet_invokeSnap',
        params: {
          snapId: 'npm:stellar-snap',
          request: {
            method: 'getWalletName',
            params: {}
          },
        },
      })
      .then((result)=>{accountInfo = JSON.stringify(result)})
        

}
      

async function getBallance() {
   balance = await ethereum.request({
        method: 'wallet_invokeSnap',
        params: {snapId:`npm:stellar-snap`, request:{
            method: `getBalance`,
            params:{
                testnet: true
            }
        }}
    })


    console.log(balance);
}
 
    export let address = "";
    export let balance= "";
    export let accountInfo= "";
    export let ballance = "";
</script>
<div>
    <div id="midContainer"  class="uk-container">
        <Card class="p-5 mt-16">
            <div class="mb-5">
                <button on:click={getAddress} class="border bg-slate-700 text-white py-3 px-7 rounded-lg">getAddress</button>
            </div>
            <h3>wallet Address</h3>
            <p>{address}</p>
        </Card>
        <Card class="p-5 mt-16">
            <div class="mb-5">
                <button on:click={getAccountName} class="border bg-slate-700 text-white py-3 px-7 rounded-lg">get account name</button>
            </div>
            <h3>get account name</h3>
            <p>{accountInfo}</p>
        </Card>      
        <Card class="p-5 mt-16">
            <div class="mb-5">
                <button on:click={getBallance} class="border bg-slate-700 text-white py-3 px-7 rounded-lg">get ballance</button>
            </div>
            <h3>get stellar balances</h3>
            <p>{balance}</p>
        </Card>  
    </div>
</div>