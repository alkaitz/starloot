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
    
    this.overAbles = new Array;
    this.outAbles = new Array;
    this.downAbles = new Array(3);
    this.upAbles = new Array(3);
    this.clickAbles = new Array(3);
    this.doubleclickAbles = new Array(3);
    this.wheelAbles = new Array;
	this.slideAbles = new Array;
    
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
		//window.ontouchstart     = function(evt){mouse.mouseDown(evt);};
		//window.ontouchend       = function(evt){mouse.mouseUp(evt);};
		//window.ontouchmove      = function(evt){mouse.mouseMoved(evt);};
		this.downAbles = [[], [], []];
		this.upAbles = [[], [], []];
		this.clickAbles = [[], [], []];
		this.doubleclickAbles = [[], [], []];
	};
    
    this.mouseOver = function(evt){
        for(var i in this.overAbles)
        {
            var object = this.overAbles[ i ][ 0 ];
            var callback = this.overAbles[ i ][ 1 ];
            if (object != undefined)
                object[callback]();
            else
                callback();
        }
    };
    
    this.mouseOut = function(){
        for(var i in this.outAbles)
        {
            var object = this.outAbles[ i ][ 0 ];
            var callback = this.outAbles[ i ][ 1 ];
            if (object != undefined)
                object[callback]();
            else
                callback();
        }
    };
    
    this.mouseDown = function(evt){
        this.button = evt.button;
        for(var i in this.downAbles[ this.button ])
        {
            var object = this.downAbles[ this.button ][ i ][ 0 ];
            var callback = this.downAbles[ this.button ][ i ][ 1 ];
            if (object != undefined)
                object[callback]();
            else
                callback();
        }
		this.lastX = this.x;
		this.lastY = this.y;
		this.originDown_x = this.x;
		this.originDown_y = this.y;
		this.buttondown = true;
        evt.preventDefault();
        evt.stopPropagation();
    };
    
    this.mouseUp = function(evt){
        this.button = evt.button;
        for(var i in this.upAbles[ this.button ])
        {
            var object = this.upAbles[ this.button ][ i ][ 0 ];
            var callback = this.upAbles[ this.button ][ i ][ 1 ];
            if (object != undefined)
                object[callback]();
            else
                callback();
        }
		this.button = 'none';
		this.buttondown = false;
        evt.preventDefault();
        evt.stopPropagation();        
    };
    
    this.mouseClick = function(evt){
        this.button = evt.button;
        for(var i in this.clickAbles[ this.button ])
        {
            var object = this.clickAbles[ this.button ][ i ][ 0 ];
            var callback = this.clickAbles[ this.button ][ i ][ 1 ];
            if (object != undefined){
				if (object.isTouched( {x: this.x + camera.transformX, y: this.y + camera.transformY} ))
					object[callback]();
                 /*if (object.x - camera.transformX < this.x && this.x < object.x + object.sizeX - camera.transformX &&
                    object.y - camera.transformY < this.y && this.y < object.y + object.sizeY - camera.transformY)
                    object[callback]();*/
            }
            else
                callback();
        } 
    };
    
    this.mouseDoubleClick = function(evt){
        this.button = evt.button;
        for(var i in this.doubleclickAbles[ this.button ])
        {
            var object = this.doubleclickAbles[ this.button ][ i ][ 0 ];
            var callback = this.doubleclickAbles[ this.button ][ i ][ 1 ];
            if (object != undefined)
                object[callback]();
            else
                callback();
        }
        //console.log("MouseDoubleClick");
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
				for(var i in this.slideAbles)
				{
					var object = this.slideAbles[ i ][ 0 ];
					var callback = this.slideAbles[ i ][ 1 ];
					if (object != undefined)
						object[callback](this.button, localSlidedX, localSlidedY, globalSlideX, globalSlideY);
					else
						callback(this.button, localSlidedX, localSlidedY, globalSlideX, globalSlideY);
				};
				this.lastX = this.x;
				this.lastY = this.y;
			};
		};
    };    
	
    this.mouseWheel = function(evt){
        //console.log("MouseWheel " + (evt.wheelDelta / 120)); 
        for(var i in this.wheelAbles)
        {
            var object = this.wheelAbles[ i ][ 0 ];
            var callback = this.wheelAbles[ i ][ 1 ];
            if (object != undefined)
                object[callback](evt.wheelDelta);
            else
                callback(evt.wheelDelta);
        }
        evt.preventDefault();
        evt.stopPropagation();        
    };   

    this.addEventListener = function (event, object, callback, button){
        switch (event){
            case MouseEvents.MOUSE_OVER:    
				this.overAbles.push([object, callback]);       
				break;
            case MouseEvents.MOUSE_OUT:     
				this.outAbles.push([object, callback]);        
				break;
            case MouseEvents.MOUSE_DOWN:    
				this.downAbles[ button ].push([object, callback]);       
				break;
            case MouseEvents.MOUSE_UP:      
				this.upAbles[ button ].push([object, callback]);         	
				break;
            case MouseEvents.CLICK:         
				this.clickAbles[ button ].push([object, callback]);      	
				break;
            case MouseEvents.DOUBLE_CLICK:  
				this.doubleclickAbles[ button ].push([object, callback]);
				break;
            case MouseEvents.MOUSE_MOVE:    
				break;
            case MouseEvents.WHEEL:         
				this.wheelAbles.push([object, callback]);      
				break;
			case MouseEvents.MOUSE_SLIDE:   
				this.slideAbles.push([object, callback]);      
				break;
            default:    
				return false;
        };
    };    
	
	this.removeEventListener = function (event, object, callback, button){
		var list;
		switch (event){
            case MouseEvents.MOUSE_OVER:    
				list = this.overAbles;	     			
				break;
            case MouseEvents.MOUSE_OUT:     
				list = this.outAbles;	     			
				break;
            case MouseEvents.MOUSE_DOWN:    
				list = this.downAbles[ button ];       	
				break;
            case MouseEvents.MOUSE_UP:      
				list = this.upAbles[ button ];         	
				break;
            case MouseEvents.CLICK:         
				list = this.clickAbles[ button ];      	
				break;
            case MouseEvents.DOUBLE_CLICK:  
				list = this.doubleclickAbles[ button ];		
				break;
            case MouseEvents.MOUSE_MOVE:    
				list = [];			  		 			
				break;
            case MouseEvents.WHEEL:         
				list = this.wheelAbles;      			
				break;
			case MouseEvents.MOUSE_SLIDE:   
				list = this.slideAbles;      			
				break;
            default:    
				return false;
        };
		var idx = indexPair( [object, callback], list, button);
		if (idx != -1){
			switch (event){
				case MouseEvents.MOUSE_OVER:    
					this.overAbles.splice(idx, 1);	      			
					break;
				case MouseEvents.MOUSE_OUT:     
					this.outAbles.splice(idx, 1);	      			
					break;
				case MouseEvents.MOUSE_DOWN:    
					this.downAbles[ button ].splice(idx, 1);        
					break;
				case MouseEvents.MOUSE_UP:      
					this.upAbles[ button ].splice(idx, 1);          
					break;
				case MouseEvents.CLICK:         
					this.clickAbles[ button ].splice(idx, 1);       
					break;
				case MouseEvents.DOUBLE_CLICK:  
					this.doubleclickAbles[ button ].splice(idx, 1); 
					break;
				case MouseEvents.MOUSE_MOVE:    			  		 			      			
					break;
				case MouseEvents.WHEEL:         
					this.wheelAbles.splice(idx, 1);       			
					break;
				case MouseEvents.MOUSE_SLIDE:   
					this.slideAbles.splice(idx, 1);       			
					break;
				default: 
					console.warn("Mouse::removeEventListener: callback " + callback + " not existing in " + object + "." + event); 
					break;			
			};
		}	
		else{
			console.warn("Mouse::removeEventListener: Trying to remove " + event + " event with " + object + "." + callback);			
		};
	};
};

mouse = new Mouse;
