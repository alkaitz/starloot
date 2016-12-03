var MouseButtons = {
    0 : 'left',
    1 : 'middle',
    2 : 'right',
    3 : 'none'
};

var MouseEvents = {
    0 : 'mouseover',
    1 : 'mouseout',
    2 : 'mousedown',
    3 : 'mouseup',
    4 : 'click',
    5 : 'doubleclick',
    6 : 'mousemove',
    7 : 'mousewheel',
    8 : 'mouseslide'
};

function Mouse(){
    var _position = new Coordinate2D(0, 0);
    var _pressedOrigin = new Coordinate2D(0, 0);
    var _button = "none";
    var _buttonPressed = [];
    var _eventTable = undefined;

    this.init = function(table){
        var mouse = this;
        if (table != undefined){
            _eventTable = table;
        }
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
    
    this.mouseOver = function(evt){ // Should not get out the canvas (or we do not worry about it)
    };
    
    this.mouseOut = function(){ // Should not get out the canvas (or we do not worry about it)
    };

    /*
     * Private function that calls event callbacks
     */
    var callEvents = function( evt, params ){
        if (_eventTable != undefined){
            var eventList = _eventTable[evt];
            if (eventList != undefined && eventList.length > 0){
                for(var evnt in eventList){
                    eventList[evnt](params);
                }
            }
        }
    };
    
    this.mouseDown = function(evt){
        _position = new Coordinate2D( evt.x, evt.y ); 
        _pressedOrigin = new Coordinate2D( evt.x, evt.y );
        _button = MouseButtons[ evt.button ];
        _buttonPressed[_button] = _button;
        evt.preventDefault();
        evt.stopPropagation();
        callEvents('onmousedown', {'position':_position,'button':_button});
    };
    
    this.mouseUp = function(evt){
         _position = new Coordinate2D( evt.x, evt.y ); 
        var pressedDown = new Coordinate2D( evt.x, evt.y );
        var button = MouseButtons[ evt.button ];
        _buttonPressed[_button] = undefined;
        _button = "none";
        evt.preventDefault();
        evt.stopPropagation();
        callEvents('onmouseup', {'position':_position,'button':_button, 'origin':_pressedOrigin});
    };
    
    this.mouseClick = function(evt){
        _position = new Coordinate2D( evt.x, evt.y ); 
        var pressedDown = new Coordinate2D( evt.x, evt.y );
        var button = MouseButtons[ evt.button ];
        _button = "none";
        callEvents('onclick', {'position':_position,'button':_button});
    };
    
    this.mouseDoubleClick = function(evt){
        _position = new Coordinate2D( evt.x, evt.y ); 
        var pressedDown = new Coordinate2D( evt.x, evt.y );
        var button = MouseButtons[ evt.button ];
        _button = "none";
        callEvents('ondoubleclick', {'position':_position,'button':_button});
    };
    
    this.mouseMoved = function(evt){
        _position = new Coordinate2D( evt.x, evt.y ); 
        callEvents('onmousemove', {'position':_position,});
    };    
	
    this.mouseWheel = function(evt){
		evt.preventDefault();
        evt.stopPropagation();
        callEvents('onmousewheel', {'delta':evt.wheelDelta/120,});
    };

    this.isDown = function(button){
        return _buttonPressed[button] != undefined;
    }   
};
