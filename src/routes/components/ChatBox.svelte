

<script lang='ts'>
    import LOGO from '$lib/images/metastellar.png';
    import { fly, fade} from 'svelte/transition';
    import { onMount } from 'svelte';
    import { cubicOut } from 'svelte/easing';

	let visible = true;
    let chatHead:any;
    onMount(() => {
        console.log(chatHead);
        chatHead = document.createElement('div');
    });
    let chatOpen = false;

    function toggleChat(){
        chatOpen = !chatOpen;
        let chatHeadBubble = document.getElementById('chatHeadBubble');
        let chatHeadImage = document.getElementById('chatHead');
        if(chatOpen){
            chatHeadImage.style.transitionDuration = "0.45s";
            chatHeadBubble.style.right = "250px";
            setTimeout(() => {
                chatHeadImage.style.width = "60px";
                chatHeadImage.style.height = "60px";
                chatHeadImage.style.padding = "5px";
                chatHeadBubble.style.right = "275px";
                
                chatHeadBubble.style.transitionDuration = "0.2s";
                
                chatHeadBubble.style.bottom = "92vh";
            }, 400);
            
        }
        else{
            chatHeadBubble.style.transitionDuration = "0.2s";
            chatHeadBubble.style.right = "2em";

            setTimeout(() => {
                chatHeadImage.style.width = "100px";
                chatHeadImage.style.height = "100px";
                chatHeadBubble.style.transitionDuration = "0.45s";
                chatHeadImage.style.padding = "10px";
                chatHeadBubble.style.bottom = "2em";  
            }, 400);
            
        }
        
    }


</script>


<div id="offcanvas-flip" uk-offcanvas="flip: true; overlay: true; bg-close: false;">
    <div class="uk-offcanvas-bar">

        <h3 class="chatTitle">CryptoChat</h3>
        <span style="display: block; width:100%; border-top:1px solid black;"></span>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>

    </div>
</div>




<a id="chatHeadBubble" class='chatHeadContainer' href="#" uk-toggle="target: #offcanvas-flip" type="button" on:click={toggleChat}>
    <img id="chatHead" src = {LOGO} alt="metastellar logo"/>
</a>





<style>
    .chatHeadContainer{
        position: fixed;
        z-index: 999999;
        bottom: 2em;
        right: 2em;
        -webkit-transition:all 0.4s ease;
        -moz-transition:all 0.4s ease;
            -ms-transition:all 0.4s ease;
            -o-transition:all 0.4s ease;
                transition:all 0.4s ease;

    }
    #chatHead{
        background-color: black;
        border-radius: 100%;
        padding:10px;
        width: 100px;
        height: 100px;
        cursor: pointer;
        filter: drop-shadow(1px 11px 11px #333333);
        animation-name: chatHeadAnimation;
        animation-duration: 5s;
        animation-timing-function: ease-in-out;
        animation-iteration-count: infinite;
    }
    #chatHead:hover{
        transform: scale(1.1);
        animation:none;
    }
    .right{
        width:100%;
        display: flex;
        justify-content: flex-end;
    }
    .uk-offcanvas-bar{
        z-index: 99999;
        width: 350px;
        left: -350px;
        background-color: white;
        border-radius: 1em;
        color:black;
    }

    h3{
        color:black;
    }

    hr{
        color:black;
    }

    .uk-offcanvas-close:hover{
        color:#222;
        transform: scale(1.1);
    }
   
    .chatTitle{
        text-align: center;
        transform:translateY(-50%);
    }
    
    @keyframes chatHeadAnimation {
        0% { 
            transform: translateY(0) scale(1.00); 
            filter: drop-shadow(1px 6px 11px #333333);
        }
        25%{ 
            transform: translateY(-2px) scale(0.97); 
            filter: drop-shadow(0px 8px 11px #333333);
        
        }
        75% { 
            transform: translateY(6px) scale(1.03); 
            filter: drop-shadow(0px 4px 16px #333333);
        }
        100% { 
            transform: translateY(0) scale(1.00); 
            filter: drop-shadow(1px 6px 11px #333333);
        }
    }

</style>