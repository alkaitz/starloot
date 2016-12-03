function EventManager(){
	this.keyboard = new Keyboard();
	this.mouse = new Mouse();
	this.touch = new Touch();
	
	this.init = function(){
		this.keyboard.init();
		this.mouse.init();
		this.touch.init();
	};
};

eventManager = new EventManager;