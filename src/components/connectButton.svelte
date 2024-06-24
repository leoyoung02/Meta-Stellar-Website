<script lang="ts">
    
    import ConnectImg from '$lib/images/Connect.gif';
    import { fade, scale } from 'svelte/transition';
    
    import {Modal} from 'flowbite-svelte'

    import {connected, address, ballance, accountName} from '../store';   
    import {snapId} from '../constants';   

    // function handleClick(event:MouseEvent){
    //     console.log("Button Pressed");
    //     console.log(event.target);
    //     (event.target as HTMLElement).classList.add('buttonPressing');
    //     setTimeout(() => {
    //         (event.target as HTMLElement).classList.remove('buttonPressing');
    //     }, 1000);
    // }
    

    let isPressed = false;

    function pressButton() {
        isPressed = true;
        setTimeout(() => {
            isPressed = false;
        }, 200);
    }

    let flaskNotDetected:boolean;
    async function isFlask(){
        console.log('check flask');

      if (!window.ethereum) {
            return false;
        }
        console.log('exist flask');

        return (await window.ethereum.request({ method: 'web3_clientVersion' }))?.includes('flask');
    }
    
    async function connectSnap(){
        console.log('access connectSnap');
        flaskNotDetected = !(await isFlask())
        if(flaskNotDetected){
            return null
        }
        try {
            const result = await window.ethereum.request({
                method: 'wallet_requestSnaps',
                params: {
                [snapId]: {},
                },
            });
            console.log(result);
            getWalletAddress();
            getWalletBallance();
            getWalletAccountName();
        } catch (error) {
            console.log(error);
            throw error;
        }
        connected.set(true);
        
        
    }

    async function getWalletAddress(){
        try {
            const metamask_address = await window.ethereum.request({
                method: 'wallet_invokeSnap',
                params: {
                snapId: snapId,
                request: {
                    method: 'getAddress',
                    },
                },
            });
            
        address.set(metamask_address);

        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async function getWalletBallance() {
        try {
            const wallet_ballance = await window.ethereum.request({
                method: 'wallet_invokeSnap',
                params: {
                snapId: 'npm:stellar-snap',
                request: {
                    method: 'getBalance',
                    params: {"testnet":true}
                },
                },
            });
            ballance.set(wallet_ballance)
        } catch(error) {
            console.log(error);
            throw error;
        }
        
    }

    async function getWalletAccountName() {
        try {
            const wallet_account_name = await  window.ethereum.request({
                method: 'wallet_invokeSnap',
                params: {
                snapId: 'npm:stellar-snap',
                request: {
                    method: 'getWalletName',
                    params: {}
                },
                },
            })
            accountName.set(wallet_account_name);
        }  catch(error)   {
            console.log(error);
            throw error;
        }
      
    }
    
</script>

<img on:click={connectSnap} src={ConnectImg} alt="Connect" />
<Modal title="Flask Not Detected" bind:open={flaskNotDetected} autoclose>
    <p style="font-size:x-large;">This Demo Requires Metamask Flask</p>
    <hr/>
    <p>Though it will be on standard metamask before too long</p>
    <p>Install flask here: <a href="https://metamask.io/flask/">https://metamask.io/flask/</a></p>
</Modal>
<style>
    img{
        cursor: pointer;
        max-width: 150px; 
    }
    img:hover{
        transform: scale(1.1);
    }
    .buttonPressing {
        animation: 0.25s linear 0s  button-press;
    }
    img:active{       
    box-shadow: 0 5px #666;
    transform: translateY(4px);
    }
    @keyframes button-press {
     0% { transform: scale(1); }
     25%{ transform: scale(0.7); }
     90% { transform: scale(1.5); }
     100% { transform: scale(1); }
    }
</style>