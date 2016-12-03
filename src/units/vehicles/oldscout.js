/**
 * x - Central x coord
 * y - Central y coord
 * name - Element name
*/
function Scout(x, y, name){
	this.x = x;
	this.y = y;
    var sizeOfSprite = {x: 128, y: 128};
    var offsetDrawingZone = {x: 64, y: 64};
	this.name = name;
    this.angle = 0 * Math.PI/180;
	this.v = 2;
	this.target = undefined;
	this.path = new Array;
	
    this.sprite = 0;
    this.animations = new Array;
    for (var idx = 1; idx <= 32; idx++){
        var name = "recon_01_" + zfill(idx, 2);
        this.animations.push(new Animation(name, this.x - offsetDrawingZone.x, this.y - offsetDrawingZone.y, sizeOfSprite, {x: 1, y: 1}, 0, true, false));
    };
		
	this.isSelected = false;
    this.animSelected = new Animation('selector', this.x - offsetDrawingZone.x, this.y - offsetDrawingZone.y + 15, sizeOfSprite, {x: 1, y: 1}, 0, false, false);

	this.update = function(){
		if (this.path != undefined && this.path.length > 0 && this.target == undefined) {
			this.target = this.path.splice(0,1)[0];
		}
		if (this.target != undefined && Math.abs(this.target.x - (this.x)) < 1.5 && Math.abs(this.target.y - (this.y)) < 1.5){
			this.target = undefined;
		}
		if (this.v!= 0 && this.target != undefined){
			var alpha = Math.atan2((this.target.y- (this.y)),(this.target.x - (this.x)));
			if (alpha < 0) alpha += 2 * Math.PI;
			else alpha %= 2 * Math.PI;
			//console.log("Alpha: "+(scout.angle/(Math.PI/180)).toFixed(2) +" degrees");
			var tempAngle = (2 * Math.PI) - alpha;		
            // First we turn to get correct direction and if we got the right direction we move
            if (Math.abs(tempAngle - this.angle) < 0.1){ // If the angle is correct we move
                this.angle = tempAngle;
                var x = this.x + Math.cos(alpha)*2.0;
                var y = this.y + Math.sin(alpha)*2.0;
                /*if (!collision(x,y)){*/
                    this.x = x;
                    this.y = y;
                /*}*/
            } else { // We turn
                if (direction(this.angle, tempAngle) == AngleDirection.COUNTER){
                    this.angle -= 0.075;
                    if (this.angle < 0) this.angle += (2 * Math.PI);
                }
                else {
                    this.angle += 0.075;
                    this.angle %= (2 * Math.PI);
                }
            }
			// Update painting data
			this.sprite = Math.round(this.angle / (11.25 * (Math.PI/180))) % 32;
            this.animations[ this.sprite ].setOrigin(this.x - offsetDrawingZone.x, this.y - offsetDrawingZone.y);
            this.animSelected.setOrigin(this.x - offsetDrawingZone.x, this.y - offsetDrawingZone.y + 15);
		}
        if (this.isSelected){
            this.animSelected.show();
        }
        else{
            this.animSelected.hide();
        };
	}
    
    this.getSize = function(){
    	var size = this.animations[ this.sprite ].getSize();
        return {x: size.x, y: size.y};
    };
	
	this.rotate = function(angle){
		var newAngle = this.angle+angle;
		if (newAngle < 0){
			this.angle = 2*Math.PI + newAngle;
		}else{
			this.angle = newAngle % (2*Math.PI);
		}		
	}
    
    
	
	/**
		onMouseEvent callback event
	*/
	this.onclick = function(evt){
		var point = camera.localPosition({x: evt.x, y: evt.y});
		if (this.isSelected && !this.isTouched(point)){
            var point = camera.localPosition({x: evt.x, y: evt.y});
			this.path = findPath([this.x,this.y],[point.x,point.y],terrainProps,40);
			this.target = undefined;
			return false; // Not capturing as another element may have a new target as well
            
        }
        return false;
	};
	
	/**
		Paints the current scout on screen
	*/
	this.paint = function(ctx){
        if (this.isSelected == true){ // Paint selector graph
            this.animSelected.paint(ctx);
        }
        
        this.animations[ this.sprite ].paint(ctx);
	}
	
	/**
		Checks if current scout has been touched
	*/
	this.isTouched = function(point){
		return this.animations[ this.sprite ].isPaintedPixel(point);
	};
}
