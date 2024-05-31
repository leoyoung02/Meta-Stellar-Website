<script>
    import ConnectImg from '$lib/images/Connect.gif';
    import { fade, scale } from 'svelte/transition';
    function handleClick(event){
        console.log("Button Pressed");
        console.log(event.target);
        event.target.classList.add('buttonPressing');
        setTimeout(() => {
            event.target.classList.remove('buttonPressing');
        }, 1000);
    }
    

    let isPressed = false;

    function pressButton() {
        isPressed = true;
        setTimeout(() => {
            isPressed = false;
        }, 200);
    }
    
</script>

<img on:click={handleClick} src={ConnectImg} alt="Connect" />

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