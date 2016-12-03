var Keys = {
    NONE : 0,
    BACKSPACE : 8,
    TAB : 9,
    ENTER : 13,
    PAUSE : 19,
    CAPS : 20,
    ESC : 27,
    SPACE : 32,
    PAGE_UP : 33,
    PAGE_DOWN : 34,
    END : 35,
    HOME : 36,
    LEFT_ARROW : 37,
    UP_ARROW : 38,
    RIGHT_ARROW : 39,
    DOWN_ARROW : 40,
    INSERT : 45,
    DELETE : 46,
    N0 : 48,
    N1 : 49,
    N2 : 50,
    N3 : 51,
    N4 : 52,
    N5 : 53,
    N6 : 54,
    N7 : 55,
    N8 : 56,
    N9 : 57,
    A : 65,
    B : 66,
    C : 67,
    D : 68,
    E : 69,
    F : 70,
    G : 71,
    H : 72,
    I : 73,
    J : 74,
    K : 75,
    L : 76,
    M : 77,
    N : 78,
    O : 79,
    P : 80,
    Q : 81,
    R : 82,
    S : 83,
    T : 84,
    U : 85,
    V : 86,
    W : 87,
    X : 88,
    Y : 89,
    Z : 90,
    NUMPAD_0 : 96,
    NUMPAD_1 : 97,
    NUMPAD_2 : 98,
    NUMPAD_3 : 99,
    NUMPAD_4 : 100,
    NUMPAD_5 : 101,
    NUMPAD_6 : 102,
    NUMPAD_7 : 103,
    NUMPAD_8 : 104,
    NUMPAD_9 : 105,
    MULTIPLY : 106,
    ADD : 107,
    SUBSTRACT : 109,
    DECIMAL : 110,
    DIVIDE : 111,
    F1 : 112,
    F2 : 113,
    F3 : 114,
    F4 : 115,
    F5 : 116,
    F6 : 117,
    F7 : 118,
    F8 : 119,
    F9 : 120,
    F10 : 121,
    F11 : 122,
    F12 : 123,
    SHIFT : 16,
    CTRL : 17,
    ALT : 18,
    PLUS : 187,
    COMMA : 188,
    MINUS : 189,
    PERIOD : 190
};

function Keyboard(){
	this.keysPressed = new Array;
    
    this.init = function(){
        window.onkeydown    = function(evt){keyboard.keyDown(evt);};
        window.onkeyup      = function(evt){keyboard.keyUp(evt);};
    };
	
	this.keyDown = function (evt){
        //console.log("KeyDown: " + evt.keyCode + "," + this.keysPressed);
        this.keysPressed[ evt.keyCode ] = evt.keyCode;
		root.onevent('onkeyboardevent', evt);
		evt.preventDefault();
        evt.stopPropagation();
	};
	
	this.keyUp = function (evt){
        this.keysPressed[ evt.keyCode ] = undefined;
		root.onevent('onkeyboardevent', evt);
		//console.log("KeyUp: " + evt.keyCode + ',' + this.keysPressed);
		evt.preventDefault();
        evt.stopPropagation();
	};
    
    this.isDown = function(key){
        return this.keysPressed[ key ] != undefined;
    };
}

Keyboard.prototype.toString = function(){
    var str = "";
    for (var idx in this.keysPressed){
        if (this.keysPressed[ idx ])
            str += this.keysPressed[ idx ] + ', ';
    }
    if (str.length > 0)
         str = str.substring(0, str.length - 2); // Remove last ", "
    return str;
};

keyboard = new Keyboard;