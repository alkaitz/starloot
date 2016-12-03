function Touch(){
	this.init = function(){
		var mouse = Game.mouse;
		window.ontouchstart     = function(evt){mouse.mouseDown(evt);};
		window.ontouchend       = function(evt){mouse.mouseUp(evt);};
		window.ontouchmove      = function(evt){mouse.mouseMoved(evt);};
	};
};