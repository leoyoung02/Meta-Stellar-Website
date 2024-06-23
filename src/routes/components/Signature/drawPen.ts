import { canvasRope} from "./rope";
import type { Point } from "./rope";
import PenImg from './images/pen3.png';
import flippedImg from './images/pen3_flipped.png';

export class Pen{
    canvas:HTMLCanvasElement;
    context:CanvasRenderingContext2D;
    x:number;
    y:number;
    width:number;
    height:number;
    flipped:boolean = false;
    state:"idle" | "active" | "drawing" = "idle";
    penImage:any;
    hover:boolean = false;
    animationTicker:number =0;
    rope:canvasRope;
    pen_src:any;
    pen_src_flipped:any;

    signature:Point[][] = []
    currentLine:Point[] = []
    
    constructor(canvas:HTMLCanvasElement, context:CanvasRenderingContext2D, x:number , y:number, width:number, height:number){
        this.x = x;
        this.y = y;
        this.canvas = canvas;
        this.context = context;
        this.width = width;
        this.height = height;
        this.pen_src = document.createElement('img');
        this.pen_src.src = PenImg;
        this.pen_src.onload = () =>{
            this.penImage = this.pen_src;
        }
        this.pen_src_flipped = document.createElement('img');
        this.pen_src_flipped.src = flippedImg;
        this.pen_src_flipped.onload = () =>{
            console.log("flipped loaded");
        }
        this.rope = new canvasRope(canvas, context, {x:100, y:600}, {x:50, y:50}, {maxX:800, maxY:600});
        this.rope.setStartPoint({x:this.x+(this.width/10), y:this.y+(this.height/10)});
    }
    pickUp(){
        this.state = "active";
    }
    drawing(){
        this.state = "drawing";
    }
    
    drawPenBox(){
        let penWidth = this.width/5;
        let boxNum = 20;
        let box = [this.x, this.y, penWidth, this.height/boxNum]
        for(let i = 0; i<boxNum; i++){
            this.context.fillStyle = "black"
            this.context.fillRect(box[0]-(this.width/10), box[1], box[2], box[3]);
            box[0] += this.width/boxNum;
            box[1] += this.height/boxNum;
        }
        
    }
    checkPenCollision(x,y){
        let penWidth = this.width/5;
        let boxNum = 20;
        let box = [this.x-(this.width/10), this.y, penWidth, this.height/boxNum]
        for(let i = 0; i<boxNum; i++){
            if(box[0] < x && box[0]+box[2] > x){
                if(box[1] < y && box[1]+box[3] > y){
                    return true;
                }
            }
            box[0] += this.width/boxNum;
            box[1] += this.height/boxNum;
        }
        return false;
    }

    drawSignature(){
        this.context.beginPath();
        for(let line of this.signature){
            for(let i = 0; i<line.length; i++){
                if(i === 0){
                    this.context.moveTo(line[i].x, line[i].y);
                }
                else{
                    this.context.lineTo(line[i].x, line[i].y);
                }
            }
        }
        for(let i = 0; i<this.currentLine.length; i++){
            if(i === 0 ){
                this.context.moveTo(this.currentLine[i].x, this.currentLine[i].y)
            }
            else{
                this.context.lineTo(this.currentLine[i].x, this.currentLine[i].y);
            }
        }
        this.context.stroke();
    }

    draw(canvas:HTMLCanvasElement, context:CanvasRenderingContext2D, dt:number){
        this.animationTicker +=1;
        this.drawSignature();
        if(this.hover){
            
            let breather = 25*Math.cos(this.animationTicker/10);
            this.x -= (breather/2);
            this.y -= (breather/2);
            this.width += breather;
            this.height += breather
        }
        
        if(this.flipped){
            this.context.drawImage(this.pen_src_flipped, this.x, this.y, this.width, this.height)
            console.log("flipped");
        }
        else{
            this.context.drawImage(this.penImage, this.x, this.y, this.width, this.height)
        }
        
        if(this.flipped){
            this.rope.setStartPoint({x:this.x-(this.width/10)+(this.width), y:this.y+(this.height/10)}); 
        }
        else{
            this.rope.setStartPoint({x:this.x+(this.width/10), y:this.y+(this.height/10)});
        }
        this.rope.draw(this.canvas, this.context, dt);
        if(this.hover){
            
            let breather = 25*Math.cos(this.animationTicker/10);
            this.x += (breather/2);
            this.y += (breather/2);
            this.width -= breather;
            this.height -= breather
        }

        if(this.flipped){
            this.context.restore();
        }

    }
    update(dt:number){
        
        this.rope.tick(dt);
    }
    onMouseMove(x,y){
        if(this.state === 'idle'){
            if(this.checkPenCollision(x,y)){
                this.hover = true;
                this.canvas.style.cursor = 'grab';
            }
            else{
                this.hover = false;
                this.canvas.style.cursor = 'pointer';
            }
        }
        if(this.state === 'active' && this.flipped){
            
            this.y = y-((this.height/8)*6);
            this.x = x-((this.height/3));
            //this.canvas.style.cursor = 'none';
        }

        if(this.state === 'drawing' && this.flipped){
            this.y = y-((this.height/8)*6);
            this.x = x-((this.height/3));
            this.currentLine.push({
                x:this.x+(this.width/40), 
                y:this.y+this.height-(this.height/22)
            });
        }
        

    }
    onTouchMove(x,y){
        if(this.state === 'drawing'){
            this.currentLine.push({x:x, y:y})
            this.y = y-((this.height/8)*6);
            this.x = x-((this.height/3));
        }
    }
    onMouseDown(x,y){
        console.log(x)
        console.log(y)
        if(this.checkPenCollision(x,y) && this.state === 'idle'){
            this.state = 'active';
            this.hover = false;
            this.hover = false;
            this.flipped = true;
        }
        if(this.state === 'active'){
            this.state = 'drawing';
            this.rope.state = 'drawing';
            this.y = y-((this.height/8)*6);
            this.x = x-((this.height/3));
        }
    }
    onTouchDown(x, y){
        console.log("here in touch down");
        console.log(x,y);
        
        this.state = 'drawing';
        this.rope.state = 'drawing';
        this.y = y-((this.height/8)*6);
        this.x = x-((this.height/3));
        
    }

    onMouseUp(){
        if(this.state === 'drawing'){
            this.state = 'active';
            this.rope.state = 'active';
            this.signature.push(this.currentLine);
            this.currentLine = [];
        }
    }
    onTouchUp(){
        if(this.state === 'drawing'){
            this.state = 'active';
            this.rope.state = 'active';
            this.signature.push(this.currentLine);
            this.currentLine = [];
        }
    }
}