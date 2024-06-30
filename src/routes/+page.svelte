<script lang='ts'>
    import {Card, NftPoster} from '@metastellar/ui-library';
	import Greeting from "../components/greeting.svelte";
    import OfficeImg from "$lib/images/wallet.webp";
    import { onMount } from "svelte";
    import ChatBox from "./components/Chat/index.svelte";


    let titles = {
        wallet: "Wallet",
        news: "News",
        docs: "Documentation",
        chat: "Chat"
    }
    let screen:'lg'|'md'|'sm'|'xs' = 'lg';
    let screens = {
        lg: 1200,
        md: 992,
        sm: 768,
        xs: 576
    }

    function handleResize(){
        if(window.innerWidth > screens.md){
            screen = 'lg';
            titles.docs = "Documentation";
        }
        if(window.innerWidth < screens.lg){
            screen = 'md';
            titles.docs = "Docs";
        }
        if(window.innerWidth < screens.md){
            screen = 'sm';
        }
        if(window.innerWidth < screens.sm){
            screen = 'xs';
        }
    }
    onMount(() => {
        handleResize();
    });

    interface AssetAccount {
        code: string, // This asset's code
        issuer: string, // The Stellar address of this asset’s issuer.
    }

    const assetInfo: AssetAccount = {
        code: "Spunks",
        issuer: "GCAR7OJULRZBOMMUPJ33YMI3O6GPBMKHWVWQAD2BHSH6NZ25QYMI44UP"
    }
</script>
<svelte:window on:resize={handleResize} />
<Greeting />
<ChatBox />
{#if screen === 'lg' || screen === 'md'}
<div id="midContainer"  class="uk-container">
    
    <div class='w-72 mt-5'>
        <NftPoster 
            isMouseTrackRecord={true} 
            dataURL="http://localhost/api" 
            intervalData={5} 
            hoverTransform
            imgHoverTransform
            class="p-4 uk-width-2-3"
            assetAccount={assetInfo}
        >
    </NftPoster>
    </div>
	<div class="uk-flex uk-flex-wrap uk-flex-wrap-around mt-5">
        <!-- <Card 
            img={OfficeImg}
            imgClass=" rounded-lg"
            bodyClass="mt-5"
            class="p-5 uk-width-2-3"
            isMouseTrackRecord={true} 
            dataURL="http://localhost/api" 
            intervalData={5}
            hoverTransform
            imgHoverTransform
            reverse
            >
            <h5 class="mb-2 text-xl  tracking-tight text-gray-900 ">{titles.wallet}</h5> 
        </Card> -->

        
        <Card 
            bodyClass="mt-5"
            class="px-5 py-10 uk-width-expand"
            isMouseTrackRecord={true} 
            dataURL="http://localhost/api" 
            intervalData={5}
            hoverTransform
            imgHoverTransform
            >
            <h3 class="uk-card-title ">{titles.news}</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
        </Card>
    </div>
		<!-- <div class="uk-card uk-card-default uk-card-hover uk-card-body uk-width-expand">
        </div> -->
    <br>
    <div class="uk-flex uk-flex-wrap uk-flex-wrap-around">
        <Card 
            bodyClass="mt-5"
            class="py-12 px-5 uk-width-expand"
            isMouseTrackRecord={true} 
            dataURL="http://localhost/api" 
            intervalData={5}
            hoverTransform
            imgHoverTransform
            >
            <h3 class="uk-card-title ">{titles.docs}</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
        </Card>
        <Card 
            class="py-12 px-5 uk-width-expand"
            isMouseTrackRecord={true} 
            dataURL="http://localhost/api" 
            intervalData={5}
            hoverTransform
            imgHoverTransform
            >
            <h3 class="uk-card-title ">{titles.chat}</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
        </Card>

	</div>
    </div>
{:else}
<div id="midContainer"  class="uk-container">
	<div class="uk-flex uk-flex-wrap uk-flex-wrap-around">
		<div id="webWalelt" class="uk-card uk-card-default uk-card-hover uk-card-body uk-width-expand">
            <h3>{titles.wallet}</h3>
            <img class="uk-animation-reverse uk-transform-origin-top-right" src={OfficeImg} alt="off the office">
        </div>
    </div>
    <br>
    <div class="uk-flex uk-flex-wrap uk-flex-wrap-around">
		<div class="uk-card uk-card-default uk-card-hover uk-card-body uk-width-expand">
            <h3 class="uk-card-title ">{titles.news}</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
        </div>
    </div>
    <br>
    <div class="uk-flex uk-flex-wrap uk-flex-wrap-around">
        <div class="uk-card uk-card-default uk-card-hover uk-card-body uk-width-1-2">
            <h3 class="uk-card-title ">{titles.docs}</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
        </div>
		<div class="uk-card uk-card-default uk-card-hover uk-card-body uk-width-expand">
            <h3 class="uk-card-title ">{titles.chat}</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
        </div>

	</div>
</div>

{/if}

<style>
	.uk-flex{
		gap: 10px;
    }
    .uk-card{
        cursor: pointer;
    }
    /* .uk-card:hover{
        animation: both 3s float infinite;
    } */

    @keyframes float {
	0% {
		box-shadow: 0 5px 15px 0px rgba(0,0,0,0.6);
		transform: translatey(0px) scale(1);
	}
	50% {
		box-shadow: 0 25px 15px 0px rgba(0,0,0,0.2);
		transform: translatey(-5px) scale(1.01);

	}
	100% {
		box-shadow: 0 5px 15px 0px rgba(0,0,0,0.6);
		transform: translatey(0px) scale(1);
	}
}

    .uk-container:has(.ms-frame:hover) .ms-frame:not(:hover) {
        filter: blur(5px);
    }
</style>