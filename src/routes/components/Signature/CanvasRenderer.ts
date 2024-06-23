export class App {
    constructor(
    window,
    canvas,
    context,
    updateHandler,
    drawHandler,
    frameRate = 60)
    {
        console.log(window);
      this._window = window;
      this._canvas = canvas;
      this._context = context;
      this._updateHandler = updateHandler;
      this._drawHandler = drawHandler;
      this._frameRate = frameRate;
      this._lastTime = 0;
      this._currentTime = 0;
      this._deltaTime = 0;
      this._interval = 0;
      this.onMouseMoveHandler = (x, y) => {};
      this.onMouseDownHandler = (x, y) => {};
      this.start = this.start.bind(this);
      this._onMouseEventHandlerWrapper = this._onMouseEventHandlerWrapper.bind(
      this);
  
      this._onRequestAnimationFrame = this._onRequestAnimationFrame.bind(this);
    }
  
    start() {
      this._lastTime = new Date().getTime();
      this._currentTime = 0;
      this._deltaTime = 0;
      this._interval = 1000 / this._frameRate;
  
      this._canvas.addEventListener(
      "mousemove",
      e => {
        this._onMouseEventHandlerWrapper(e, this.onMouseMoveHandler);
      },
      false);
  
  
      this._canvas.addEventListener(
      "mousedown",
      e => {
        this._onMouseEventHandlerWrapper(e, this.onMouseDownHandler);
      },
      false);
  
  
      this._onRequestAnimationFrame();
    }
  
    _onMouseEventHandlerWrapper(e, callback) {
      let element = this._canvas;
      let offsetX = 0;
      let offsetY = 0;
  
      if (element.offsetParent) {
        do {
          offsetX += element.offsetLeft;
          offsetY += element.offsetTop;
        } while (element = element.offsetParent);
      }
  
      const x = e.pageX - offsetX;
      const y = e.pageY - offsetY;
  
      callback(x, y);
    }
  
    _onRequestAnimationFrame() {
      this._window.requestAnimationFrame(this._onRequestAnimationFrame);
  
      this._currentTime = new Date().getTime();
      this._deltaTime = this._currentTime - this._lastTime;
  
      if (this._deltaTime > this._interval) {
  
        //delta time in seconds
        const dts = this._deltaTime * 0.001;
  
        this._updateHandler(dts);
  
        this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this._drawHandler(this._canvas, this._context, dts);
  
        this._lastTime = this._currentTime - this._deltaTime % this._interval;
      }
    }}

export default class CanvasRenderer{
    canvas:HTMLCanvasElement;
    context:CanvasRenderingContext2D;
    frameRate:number;
    updateHandlerArray:Function[] = [];
    drawHandlerArray:Function[] = [];
    _renderer:App|null = null;
    mouseMoveHandler: Function = (x:number,y:number)=>{}; 

    constructor( canvas:HTMLCanvasElement, context:CanvasRenderingContext2D, frameRate = 60){
        this.canvas = canvas;
        this.context = context;
        this.frameRate = frameRate;   
    }

    addDrawFunc(func:Function){
        this.drawHandlerArray.push(func);
    }

    addUpdateFunc(func:Funciton){
        this.updateHandlerArray.push(func)
    }

    addMouseMove(func:Function){
        this.mouseMoveHandler = func;
    }

    start(){
        const getCombinedFunc = function(funcs:Function[]){
            
            return (canvas:HTMLCanvasElement, context:CanvasRenderingContext2D, dts:number)=>{
                for(let func of funcs){
                    func(canvas, context, dts);
                }
            }
        }
        console.log(this.canvas);
        this._renderer = new App(
            window, 
            this.canvas, 
            this.context, 
            getCombinedFunc(this.updateHandlerArray), 
            getCombinedFunc(this.drawHandlerArray), this.frameRate
        );
        this._renderer.onMouseMoveHandler = this.mouseMoveHandler
        this._renderer.start();
    }




}