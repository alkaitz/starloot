var MouseButtons = {
    LEFT: 0,
    MIDDLE: 1,
    RIGHT: 2
};

var MouseEvents = {
    MOUSE_OVER : 0,
    MOUSE_OUT : 1,
    MOUSE_DOWN : 2,
    MOUSE_UP : 3,
    CLICK : 4,
    DOUBLE_CLICK : 5,
    MOUSE_MOVE : 6,
    WHEEL:  7,
	MOUSE_SLIDE: 8
};

function Mouse(){
    this.x = 0;
    this.y = 0;
	this.lastX = 0;
	this.lastY = 0;
    this.tile_x = 0;
    this.tile_y = 0;
    this.button = "none";
	this.buttondown = false;
	this.originDown_x = 0;
	this.originDown_y = 0;
	this.epsilonSlide = 10;
    
    this.init = function(){
        window.onmouseover      = function(evt){mouse.mouseOver(evt);};
        window.onmouseout       = function(evy){mouse.mouseOut();};
        window.onmousedown      = function(evt){mouse.mouseDown(evt);};
        window.onmouseup        = function(evt){mouse.mouseUp(evt);};
        window.onclick          = function(evt){mouse.mouseClick(evt);};
        window.ondoubleclick    = function(evt){mouse.mouseDoubleClick(evt);};
        window.onmousemove      = function(evt){mouse.mouseMoved(evt);};
        window.onmousewheel     = function(evt){mouse.mouseWheel(evt);};
        window.oncontextmenu    = function(evt){return false;}; // Disable right-click context menu*/
	};
    
    this.mouseOver = function(evt){
		root.onevent('onmouseover');
    };
    
    this.mouseOut = function(){
		root.onevent('onmouseout');
    };
    
    this.mouseDown = function(evt){
		root.onevent('onmousedown', evt);
        this.lastX = this.x;
		this.lastY = this.y;
		this.originDown_x = this.x;
		this.originDown_y = this.y;
		this.buttondown = true;
        evt.preventDefault();
        evt.stopPropagation();
    };
    
    this.mouseUp = function(evt){
		root.onevent('onmouseup', evt);
		this.button = evt.button;
		this.button = 'none';
		this.buttondown = false;
        evt.preventDefault();
        evt.stopPropagation();        
    };
    
    this.mouseClick = function(evt){
        root.onevent('onclick', evt);
    };
    
    this.mouseDoubleClick = function(evt){
		root.onevent('ondoubleclick', evt);
    };
    
    this.mouseMoved = function(evt){
        //console.log("MouseMoved");
        this.x = evt.clientX;
		this.y = evt.clientY;
		// Find corresponding grid tile
		m_x = (evt.clientX + camera.transformX)%64;
		m_y = (evt.clientY + camera.transformY)%32;
		this.tile_x = Math.floor((evt.clientX + camera.transformX) / 64);
		this.tile_y = Math.floor((evt.clientY + camera.transformY) / 32);
		if (this.tile_x%2 == this.tile_y%2) {
			if (m_x + (m_y*2)>64) {this.tile_x++; this.tile_y++;}
		} else {
			if (-m_x + (m_y*2)<0) {this.tile_x++;}
			else {this.tile_y++;}
		}
		
		if (this.buttondown == true){
			var localSlidedX = this.x - this.lastX;
			var localSlidedY = this.y - this.lastY;
			var globalSlideX = this.x - this.originDown_x;
			var globalSlideY = this.y - this.originDown_y;
			if (Math.abs(localSlidedX) > this.epsilonSlide ||  Math.abs(localSlidedY) > this.epsilonSlide){
				evt.lx = localSlidedX;
				evt.ly = localSlidedY;
				evt.gx = globalSlideX;
				evt.gy = globalSlideY;
				evt.originDown_x = this.originDown_x;
				evt.originDown_y = this.originDown_y;
				root.onevent('onmouseslide', evt);
				this.lastX = this.x;
				this.lastY = this.y;
			};
		};
    };    
	
    this.mouseWheel = function(evt){
		root.onevent('onmousewheel', evt);
        //console.log("MouseWheel " + (evt.wheelDelta / 120)); 
        evt.preventDefault();
        evt.stopPropagation();        
    };   
};

mouse = new Mouse;
