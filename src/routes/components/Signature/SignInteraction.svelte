<script lang='ts'>
    import { onMount } from "svelte";
    import {createRope} from './rope';
    import RenderMaker from './CanvasRenderer';
    import StellarTOKENSPNG from './images/stellarTokens_transparent.png';
    import PenImg from './images/pen3.png';
    import windowsImg from './images/windows.webp'
    import checkmark from './images/checkmark.png'

    let context;
    let canvas:HTMLCanvasElement;
    let stellarImage:any;
    let backgroundImage:any;
    let penImage:any;
    let checkmarkImage:any;

    
    onMount(()=>{
        const img0 = document.createElement("img");
        img0.src = StellarTOKENSPNG;
        img0.onload = () => {
            stellarImage = img0;
        };
        const img1 = document.createElement("img");
        img1.src = windowsImg;
        img1.onload = () => {
            backgroundImage = img1;
        }
        const img2 = document.createElement('img');
        img2.src = PenImg;
        img2.onload = () =>{
            penImage = img2;
        }
        const img3 = document.createElement('img');
        img3.src = checkmark;
        img3.onload = () =>{
            checkmarkImage = img3;
        }
        context = canvas.getContext('2d') as CanvasRenderingContext2D;
        const ropeFuncs = createRope(canvas, context, {x:100,y:600}, {x:50, y:50});
        let renderMaker = new RenderMaker(canvas, context, 60);
        function drawBackground(canvas:HTMLCanvasElement, context:CanvasRenderingContext2D, dts?:number){
            try{
                context.rect(0, 0, canvas.width, canvas.height);
                context.fillStyle = "tan";
                context.fill();

                //context.drawImage(backgroundImage, 0,0, canvas.width, canvas.height);
                context.drawImage(stellarImage, 0,0, 800, (800*0.75));
                context.drawImage(penImage, 0, 270, 340, 320);
                context.drawImage(checkmarkImage, 110, 360);
            }
            catch(e){
                //ignore before image is loaded
            }
        }
        renderMaker.addDrawFunc(drawBackground);
        renderMaker.addDrawFunc(ropeFuncs.draw);

        renderMaker.addUpdateFunc(ropeFuncs.update);
        renderMaker.addMouseMove(ropeFuncs.mouseHandler);
        renderMaker.start()
    })

    function handleMouseDown(){

    }

    function handleMouseMove(){

    }
    function handleMouseUp(){

    }
    function handleDoubleClick(){

    }
</script>
<center>
    <canvas width={900}, height={700}, bind:this={canvas} ></canvas>
</center>