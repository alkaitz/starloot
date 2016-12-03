var BuildingTypes = {
    RECON_HQ : 0,
    ANTENNA : 1,
	CRATER: 2,
	WALL: 3
};

function getParalel(p1,p2,r) {
	var alpha = Math.PI - Math.atan2(p1[0] - p2[0],p1[1] - p2[1]);
	// We don't need float precision for this
	var a = [Math.floor(p1[0] + Math.cos(alpha)*r), Math.floor(p1[1] + Math.sin(alpha)*r/2)];
	var b = [Math.floor(p2[0] + Math.cos(alpha)*r), Math.floor(p2[1] + Math.sin(alpha)*r/2)];
	return [a,b];
}

function drawParalel(ctx, p1, p2, r) {
	var p = getParalel(p1,p2,r);
	ctx.lineTo(p[0][0],p[0][1]);
	ctx.lineTo(p[1][0],p[1][1]);
}

function Building(type, x, y, name, orientation){
	this.x = x*128;
	this.y = y*64;
	this.name = name;
    this.orientation = orientation;
	this.img = new Image;
	switch (type) {
	case BuildingTypes.RECON_HQ:
		this.box = [[120,120],[222,172],[193,188],[121,167],[73,143]];
        this.img = resourceManager.getImage('recon_hq');
		this.sprites = [
			[256*0,256*0],
			[256*0,256*1],
			[256*1,256*0],
			[256*1,256*1],
		];
		this.size = [256,256];
		this.center = [128,128];
	    break;
	case BuildingTypes.ANTENNA:
		this.box = [[55,475],[111,447],[168,475],[111,503]];
        this.img = resourceManager.getImage('antenna');
		this.sprites = [[0,0],[0,0],[0,0],[0,0]];
		this.size = [512,512];
		this.center = [111,475];
		break;
	case BuildingTypes.CRATER:
		this.box = [[306,35],[399,103],[400,127],[385,148],[295,202],[247,204],[207,190],[163,175],[144,168],[91,131],[124,99],[151,83],[220,40],[267,22]];
        this.img = resourceManager.getImage('crater');
		this.sprites = [[0,0],[0,0],[0,0],[0,0]];
		this.size = [512,256];
		this.center = [256,118];
		break;
	case BuildingTypes.WALL:
		this.box = [[81,121],[92,117],[175,160],[162,164]];
        this.img = resourceManager.getImage('wall');
		this.sprites = [[0,0],[0,0],[0,0],[0,0]];
		this.size = [256,256];
		this.center = [128,128];
		break;
	default:
		break;
	}
	
	this.getPosition = function(){
		return {x: this.x, y: this.y};
	};
	
	this.getBoundingBox = function(r) {
		// create bounding box only if it isn't created or if radius has changed
		if (this.boundingBox == undefined || this.r!=r) {
			this.boundingBox = new Array;
			this.r = r;
			var i = 0;
			while (i<this.box.length) {
				var p = getParalel( 
						[this.x - this.center[0] + this.box[i][0],this.y - this.center[1] + this.box[i][1]],
						[this.x - this.center[0] + this.box[(i+1)%this.box.length][0],this.y - this.center[1] + this.box[(i+1)%this.box.length][1]],
						r);
				this.boundingBox.push(p[0]);
				this.boundingBox.push(p[1]);
				i++;
			}
		}	
		return this.boundingBox;
	}
	
	this.paint = function(ctx){
		/* draw sprite */
        ctx.drawImage(this.img, this.sprites[this.orientation][0], this.sprites[this.orientation][1], this.size[0], this.size[1], this.x-this.center[0], this.y-this.center[1], this.size[0], this.size[1]);

        /* draw bounding box */
		
        ctx.strokeStyle="#AA6600";
        ctx.beginPath();
        var i = 0;
        while (i<this.box.length) {
        	ctx.lineTo(this.x+this.box[i][0]-this.center[0],this.y+this.box[i][1]-this.center[1]);
        	i++;
        }
		ctx.closePath();
		ctx.stroke();
		

		/* draw expanded bounding box */
		/*
		ctx.strokeStyle="#BB66BB";
		ctx.beginPath();
		i = 0;
		var r = 30; // the radius of the expansion (this will be the radius of the moving unit)
		while (i<this.box.length-1) {
			drawParalel(ctx, 
					[this.x - this.center[0] + this.box[i][0],this.y - this.center[1] + this.box[i][1]],
					[this.x - this.center[0] + this.box[i+1][0],this.y - this.center[1] + this.box[i+1][1]],
					r);
			i++;
		}
		drawParalel(ctx, 
				[this.x - this.center[0] + this.box[i][0],this.y - this.center[1] + this.box[i][1]],
				[this.x - this.center[0] + this.box[0][0],this.y - this.center[1] + this.box[0][1]],
				r);
		
		ctx.closePath();
		ctx.stroke();
		*/

	};
	
	this.update = function(){
	};
};