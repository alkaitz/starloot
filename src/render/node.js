/**
 * @author alkaitz
 * @param name Name of current node
 * @param x X coordinate of central point of node
 * @param y Y coordinate of central point of node
 * @param numAnimations number of different animations that node will have
 * @param numFrames {x:, y:} Number of frames in each dimension of graphic
 * @param sizeOfSprites {x:, y:} Size of each independent sprite
 * @param files prefix of name of animation files 
 */
function Node(name, x, y, numAnimations, numFrames, sizeOfSprites, files){
	/**
		Own properties
	*/
	var _name = name;
	var _point = {x: x, y: y};
	var _sizeOfSprite = sizeOfSprites || {x: 128, y: 128}; // Default sprite to 128 pixels
    var _offsetDrawingZone = {x: Math.floor( _sizeOfSprite.x / 2 ), y: Math.floor( _sizeOfSprite.y / 2 ) };
    var _currentAnimation = 0;
	var _animations = new Array;
	var _numAnimations = numAnimations; 
	for (var idx = 1; idx <= _numAnimations; idx++){
        var name = files + zfill(idx, 2);
        _animations.push(new Animation(name, _point.x - _offsetDrawingZone.x, _point.y - _offsetDrawingZone.y, _sizeOfSprite, numFrames, 0, true, false));
    };
    
	/**
	 * Name getter
	 * Type: String
	 */
    this.getName = function(){
    	return _name;
    };
    
	/**
	 * Position getter and setter
	 * Type: {x, y}
	 */
    this.setPosition = function(x, y){
    	_point = {x: x, y: y};
    };
    
    this.getPosition = function(){
    	return _point;
    };
    
	/**
	 * CurrentAnimation getter and setter
	 * Type: Animation
	 */
    this.setCurrentAnimation = function(currentFrame){
    	_currentAnimation = currentFrame;
    };
    
    this.getCurrentAnimation = function(){
    	return _animations[ _currentAnimation ];
    };
    
	/**
	 * OffsetDrawingZone getter
	 * Type: {x, y}
	 */
    this.getOffsetDrawingZone = function(){
    	return _offsetDrawingZone;
    };
    
    /**
	 * Size getter
	 * Type: {x, y}
	 */
	this.getSize = function(){
    	return _sizeOfSprite;
    };
};

/**
 *	Paints the current scout on screen
 */
Node.prototype.paint = function(ctx){
	var currentAnimation = this.getCurrentAnimation();
	currentAnimation.paint(ctx);
}