function Touch(){
	this.x = 0;
    this.y = 0;
	
	this.init = function(){
		window.ontouchstart     = function(evt){mouse.mouseDown(evt);};
		window.ontouchend       = function(evt){mouse.mouseUp(evt);};
		window.ontouchmove      = function(evt){mouse.mouseMoved(evt);};
	};
};