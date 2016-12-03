function Minimap(){
	var menuCanvas = document.getElementById("mapCanvas");
	this.x = 0;
    this.y = 0;
	this.maxSizeX = 128;
    this.sizeX = 0;
    this.sizeY = 0;
    var img = new Image;
    img.src = 'sprites/background/gravel_red.jpg';
    
    this.refreshSize = function(){
		var rel = canvas.width / this.maxSizeX;
        this.sizeX = canvas.width / rel;
        this.sizeY = canvas.height / rel;
        this.x = 0;
        this.y = (this.maxSizeX-this.sizeY)/2;
    };
    
    this.toMinimapCoord = function(point){
        var origin = camera.localPosition({x:this.x, y:this.y});
        return {x: this.x + ((point.x / (camera.maxX + menuCanvas.width)) * this.sizeX), 
                y: this.y + ((point.y / (camera.maxY + menuCanvas.height)) * this.sizeY)};
    };
    
    this.paint = function(ctx){
        this.refreshSize();
        // Background
        ctx.fillStyle="black";
        /*var point = camera.localPosition({x:this.x, y:this.y});
		ctx.fillRect(point.x - 1, point.y - 1, this.sizeX, this.sizeY);*/
		var point = {x:0,y:this.y};
		ctx.fillRect(0,0, menuCanvas.width, menuCanvas.height);
        // Tiles
        var tileWidth = 256 / 8;
		var tileHeight = 128 / 8;
		// Let's see where we have to paint...
		for (var i = point.x; i < point.x + this.sizeX; i += tileWidth){
            for (var j = point.y; j < point.y + this.sizeY; j += tileHeight){
                ctx.drawImage(img, i, j, 256 / 8, 128 / 8);
            }
        }
        // Let's paint every other component...
        for (var obj in board.movable){
            var object = board.movable[ obj ];
            var position = object.getPosition();
            ctx.fillStyle="red";
            ctx.beginPath();
            var coord = this.toMinimapCoord({x: position.x, y: position.y});
            ctx.arc(coord.x,coord.y,2,0,Math.PI*2,true);
            ctx.closePath();
            ctx.fill();
        };
        
        // Paint every building
        for (var obj in board.buildings){
            var object = board.buildings[ obj ];
            ctx.fillStyle="blue";
            ctx.beginPath();
            var coord = this.toMinimapCoord({x: object.x, y: object.y});
            ctx.arc(coord.x,coord.y,2,0,Math.PI*2,true);
            ctx.closePath();
            ctx.fill();
        }
        // Paint obstacles
        for (var obj in board.obstacles){
            var object = board.obstacles[ obj ];
            ctx.fillStyle="yellow";
            ctx.beginPath();
            var coord = this.toMinimapCoord({x: object.x, y: object.y});
            ctx.arc(coord.x,coord.y,2,0,Math.PI*2,true);
            ctx.closePath();
            ctx.fill();
        }
        // Current view
        ctx.strokeStyle="green";
        var point = {x:this.x, y:this.y};
        var startView = {x: point.x + ((camera.transformX / (camera.maxX + canvas.width)) * this.sizeX), y: point.y + ((camera.transformY / (camera.maxY + canvas.height)) * this.sizeY)};
        var sizeView = {sizeX: (canvas.width / camera.maxX) * this.sizeX, sizeY: (canvas.height / camera.maxY) * this.sizeY};
		ctx.strokeRect(startView.x, startView.y, sizeView.sizeX, sizeView.sizeY);
	};
};

minimap = new Minimap;    