/**
 * @author alkaitz
 * @param file - Name to image file to draw
 * @param x - Origin x coord
 * @param y - Origin y coord 
 * @param size - [x:, y:] Number of pixels in each dimension of full sprite
 * @param numFrames - [x:, y:] Number of frames in each dimension
 * @param timeBetweenFrames - time between each couple of frames in ms
 * @param visible - true if the animation is shown by default
 * @param play - true or false if animation should start playing by default
*/
Animation.inherits( Drawable );
function Animation(file, x, y, size, numFrames, timeBetweenFrames, visible, play){
	/**
		Own properties
	*/
	var _currentFrame = 0;
	var _spriteSize = {x: size.x / numFrames.x, y: size.y / numFrames.y};
	var _nFrames = numFrames;
	var _sprites = new Array;
    for (var j = 0; j < _nFrames.y; j++){
        for (var i = 0; i < _nFrames.x; i++){
            _sprites.push( {x: _spriteSize.x * i, y: _spriteSize.y * j} );
        };
    };
	var _timeBetweenFrames = timeBetweenFrames || 40; // Updates each 40 ms (24 fps aprox)
	var _timePending = timeBetweenFrames;
    var _isPlaying = play || false;
    var _isVisible = visible || false;
	
	/**
		Drawable inheritance calling public constructor with parameters
	*/
	this.inherits( Drawable, file, x, y, _spriteSize );
    
    /**
		CurrentFrame getter and setter
	*/
    this.setCurrentFrame = function(newFrame){
        _currentFrame = newFrame;
    };
    
    this.getCurrentFrame = function(){
        return _currentFrame;
    };
    
    /**
     	Sprites getter
     */
    this.getSprites = function(){
    	return _sprites;
    };
    
    /**
		Start playing animation from current frame
	*/
    this.play = function(){
        _isPlaying = true;
        _timePending = _timeBetweenFrames;
    };
    
    /**
		Stop playing animation
	*/
    this.stop = function(){
        _isPlaying = false;
    };
    
    /**
		Get the number of frames of the animation
	*/
    this.getNumFrames = function(){
        return ( _nFrames.x * _nFrames.y );
    };
    
    /**
		Shows the animation frame
	*/
    this.show = function(){
        _isVisible = true;    
    };
    
    /**
		Hides the animation
	*/
    this.hide = function(){
        _isVisible = false;
    };
    
    /**
     	Returns if the current animation is or not visible 
     */
    this.isVisible = function(){
    	return _isVisible;
    };
    
    /**
		Updates the current frame to draw
	*/
    this.updateCurrentFrame = function(timeElapsed){
        if (_isPlaying && _timeBetweenFrames > 0){
			_timePending -= timeElapsed;
			if (_timePending <= 0){
				var counter = 0;
				while (_timePending <= 0){
					_timePending += _timeBetweenFrames;
					counter++;
				};				
				_currentFrame += counter;
				_currentFrame %= this.getNumFrames();
			};
        };
    };
};

/**
    Override paint drawable method
*/
Animation.prototype.paint = function(ctx){
	var currentFrame 	= this.getCurrentFrame();
	var sprites			= this.getSprites();
    if (this.isVisible())
        Drawable.prototype.paint.call(this, ctx, 
                            sprites[ currentFrame ].x, 
                            sprites[ currentFrame ].y);
};

Animation.prototype.isPaintedPixel = function(pixel){
	return Drawable.prototype.isPaintedPixel.call(this,pixel);
};

