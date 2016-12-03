function Camera(){
	this.CAMERA_SPEED_X = 0;
	this.CAMERA_SPEED_Y = 0;
	this.transformX = 0;
	this.transformY = 0;
	this.minX = 0;
	this.minY = 0;
	this.maxX = 10000;
	this.maxY = 10000;
	
	this.applyTransforms = function(ctx){
		ctx.scale(1, 0.5);
		ctx.rotate(45 * Math.PI /180);
	};
	
	this.applyLimits = function(){
		if (this.transformX < this.minX) {this.transformX = this.minX; this.CAMERA_SPEED_X = 0;}
		if (this.transformY < this.minY) {this.transformY = this.minY; this.CAMERA_SPEED_Y = 0;}
		if (this.transformX > this.maxX) {this.transformX = this.maxX; this.CAMERA_SPEED_X = 0;}
		if (this.transformY > this.maxY) {this.transformY = this.maxY; this.CAMERA_SPEED_Y = 0;}
	};
    
    this.localPosition = function(point){
        return { x: point.x + this.transformX, y: point.y + this.transformY};
    };
	
	this.cam_direction_X	= 0;
	this.cam_direction_Y	= 0;
	this.updateLogic = function(){
		this.applyLimits();
		
		// Update camera position
		if (this.cam_direction_X>0) {
			if (this.cam_direction_X==2) {
                if (this.CAMERA_SPEED_X < 0) this.CAMERA_SPEED_X = 0
				this.CAMERA_SPEED_X += 0.4;
			} else if (this.cam_direction_X==1) {
                if (this.CAMERA_SPEED_X > 0) this.CAMERA_SPEED_X = 0
				this.CAMERA_SPEED_X -= 0.4;
			}
		} else {
			if (this.CAMERA_SPEED_X < 0.4 && this.CAMERA_SPEED_X > -0.4) {this.CAMERA_SPEED_X = 0;}
			if (this.CAMERA_SPEED_X > 0) {this.CAMERA_SPEED_X -= 0.4;}
			if (this.CAMERA_SPEED_X < 0) {this.CAMERA_SPEED_X += 0.4;}
		}
		
		if (this.cam_direction_Y>0) {
			if (this.cam_direction_Y==2) {
                if (this.CAMERA_SPEED_Y < 0) this.CAMERA_SPEED_Y = 0
				this.CAMERA_SPEED_Y += 0.4;
			} else if (this.cam_direction_Y==1) {
                if (this.CAMERA_SPEED_Y > 0) this.CAMERA_SPEED_Y = 0
				this.CAMERA_SPEED_Y -= 0.4;
			}
		} else {
			if (this.CAMERA_SPEED_Y < 0.4 && this.CAMERA_SPEED_Y > -0.4) {this.CAMERA_SPEED_Y = 0;}
			if (this.CAMERA_SPEED_Y > 0) {this.CAMERA_SPEED_Y -= 0.4;}
			if (this.CAMERA_SPEED_Y < 0) {this.CAMERA_SPEED_Y += 0.4;}
		}
		this.transformX += this.CAMERA_SPEED_X;
		this.transformY += this.CAMERA_SPEED_Y;
        //console.log("Speed: " + this.CAMERA_SPEED_X + "," + this.CAMERA_SPEED_Y);
		
		//this.cam_direction_X = 0;
		//this.cam_direction_Y = 0;
	};
    
    // Captures keyboard key pressed
    this.onkeyboardevent = function(evt){
        if (evt.type == "keydown"){
            switch (evt.keyCode) {
            case Keys.W: /* W */
            case Keys.UP_ARROW: /* Up arrow was pressed */
                this.cam_direction_Y = 1;
                break;
            case Keys.S: /* S */
            case Keys.DOWN_ARROW: /* Down arrow was pressed */
                this.cam_direction_Y = 2;
                break;
            case Keys.A: /* A */   
            case Keys.LEFT_ARROW: /* Left arrow was pressed */
                this.cam_direction_X = 1;
                break;
            case Keys.D: /* D */   
            case Keys.RIGHT_ARROW: /* Right arrow was pressed */
                this.cam_direction_X = 2;
                break;
            }
        }
        else if (evt.type == "keyup"){
            switch (evt.keyCode) {
            case Keys.W: /* W */
            case Keys.UP_ARROW: /* Up arrow was pressed */
                this.cam_direction_Y = 0;
                break;
            case Keys.S: /* S */
            case Keys.DOWN_ARROW: /* Down arrow was pressed */
                this.cam_direction_Y = 0;
                break;
            case Keys.A: /* A */   
            case Keys.LEFT_ARROW: /* Left arrow was pressed */
                this.cam_direction_X = 0;
                break;
            case Keys.D: /* D */   
            case Keys.RIGHT_ARROW: /* Right arrow was pressed */
                this.cam_direction_X = 0;
                break;
            case Keys.F1: /* F1 */
            	renderer.debugMode = ! renderer.debugMode;
            	break;
            }
        };
    };
	
	// Captures the slide
	this.onmouseslide = function(evt){
        if (evt.button == MouseButtons.LEFT){
			this.transformX -= evt.lx;
			this.transformY -= evt.ly;
			return true;
		};
		
		if (evt.button == MouseButtons.RIGHT){
			var point = this.localPosition({x: evt.originDown_x, y: evt.originDown_y});
			selector.setMouseSelection({x: point.x, y: point.y, gx: evt.gx, gy: evt.gy});
			return true;
		};
		
		return false;
    };
	
	this.onmouseup = function(evt){
		if (evt.button == MouseButtons.RIGHT){
			selector.endMouseSelection();
		}
	};
	
	this.onmousedown = function(evt){
		if (evt.button == MouseButtons.RIGHT){
			selector.clearSelection();
		}
	};
    
}

camera = new Camera;



