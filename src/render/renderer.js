function Renderer(){
	var canvas = document.getElementById("canvas");
	var menuCanvas = document.getElementById("mapCanvas");
	menuCanvas.width=128;
	menuCanvas.height=128;
	var ctx = canvas.getContext("2d");;
	var menuCtx = menuCanvas.getContext("2d");
	var guiCtx;
	
    this.timeRendering = 0;
    this.debugMode = true;
    
    this.debugData = function(ctx){
    	if (this.debugMode)
    	{
    		ctx.fillStyle="#FFFFFF";
	        ctx.font = "bold 14px sans-serif";
	        ctx.fillText("Mouse: ("+mouse.x + ","+mouse.y+")",10,20);
	        ctx.fillText("Tile: ("+mouse.tile_x + ","+mouse.tile_y+")",140,20);
	        if (mouse.button != "none")
	            ctx.fillText("MouseButton: "+mouse.button+" pressed", 10, 40);
	        else
	            ctx.fillText("MouseButton: idle", 10, 40);
	        ctx.fillText("Keys: "+keyboard.toString(),10,60);
	        ctx.fillText("RenderTime: "+this.timeRendering+" ms",10,80);
	        ctx.fillText("LogicTime: "+logic.logicTime+" ms",10,100);
	        ctx.fillText("Sprite: "+scout1.sprite,10,150);
	        ctx.fillText("Angle: "+(scout1.angle/(Math.PI/180)).toFixed(2),10,170);
	        ctx.fillText("Camera: "+camera.transformX+","+camera.transformY,10,190);
	        ctx.fillText("Target: "+(scout1.target == undefined ? "undefined" : scout1.target.x+","+scout1.target.y),10,210);	
    	};
    };

    this.renderFrame = function(){
        // Start timing
        var time1 = new Date().getTime();
        
        // Restore from resize
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        ctx.save();
        ctx.translate(-camera.transformX,-camera.transformY);
        board.paint(ctx);
        gui.paint(ctx, menuCtx);
        ctx.restore();
        this.debugData(ctx); // Print usefull data
        this.timeRendering = new Date().getTime() - time1;
    };
};

renderer = new Renderer();