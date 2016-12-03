/**
 * @author alkaitz
 * @param name Name of current node
 * @param speed Integral speed of current node
 * @param x X coordinate of central point of node
 * @param y Y coordinate of central point of node
 * @param numAnimations number of different animations that node will have
 * @param numFrames {x:, y:} Number of frames in each dimension of graphic
 * @param sizeOfSprites {x:, y:} Size of each independent sprite
 * @param files prefix of name of animation files 
 */
MovableNode.inherits( Node );
function MovableNode(name, speed, x, y, numAnimations, numFrames, sizeOfSprites, files){
	/**
		Own properties
	*/
	var _angle = 0 * Math.PI/180;
	var _velocity = 2;
	var _target = undefined;
	var _path = new Array;
	
	/**
	 * Angles getter and setter
	 * Type: Float
	 */
	this.setAngle = function(angle){
		_angle = angle;
		// The angle is always between 0 and 2*Pi radians
		if (_angle < 0)
			_angle += (2 * Math.PI);
		_angle %= (2 * Math.PI);
	};
	
	this.getAngle = function(){
		return _angle;
	};
	
	/**
	 * Path getter and setter
	 * Type: [ {x0, y0}, {x1, y1} ... {xn, yn} ]
	 */
	this.setPath = function(path){
		_path = path;
	};
	
	this.getPath = function(){
		return _path;
	};
	
	/**
	 * Target getter and setter
	 * Type: {x, y}
	 */
	this.setTarget = function(target){
		_target = target;
	};
	
	this.getTarget = function(){
		return _target;
	};
	
	/**
	 * Velocity getter and setter
	 * Type: Number
	 */
	this.setVelocity = function(v){
		_velocity = v;
	};
	
	this.getVelocity = function(){
		return _velocity;
	};
	
	/**
		Node inheritance calling public constructor with parameters
	*/
	this.inherits( Node, name, x, y, numAnimations, numFrames, sizeOfSprites, files );
 };
 
 MovableNode.prototype.update = function(){
	var position = this.getPosition();
	var path = this.getPath();
	var target = this.getTarget();
	var velocity = this.getVelocity();
	var angle = this.getAngle();
	// If we are on target and the path is not empty we move to next target
	if (path != undefined && path.length > 0 && target == undefined) {
		this.setTarget( path.splice(0,1)[0] );
	}
	// If we are close enough to target we make the final movement
	if (target != undefined && Math.abs(target.x - position.x) < 1.5 && Math.abs(target.y - position.y) < 1.5){
		this.setTarget( undefined );
	}
	if (velocity != 0 && target != undefined){
		var alpha = Math.atan2(target.y - position.y, target.x - position.x);
		if (alpha < 0) alpha += 2 * Math.PI;
		else alpha %= 2 * Math.PI;
		var tempAngle = (2 * Math.PI) - alpha;		
		// First we turn to get correct direction and if we got the right direction we move
		if (Math.abs(tempAngle - angle) < 0.1){ // If the angle is correct we move
			this.setAngle( tempAngle );
			var x = position.x + Math.cos(alpha) * velocity;
			var y = position.y + Math.sin(alpha) * velocity;
			this.setPosition(x, y);
		} else { // We turn
			if (direction(angle, tempAngle) == AngleDirection.COUNTER){
				this.setAngle( angle - 0.075 );
			}
			else {
				this.setAngle( angle + 0.075 );
			}
		}
		// Update painting data
		angle = this.getAngle();
		this.setCurrentAnimation( Math.round(angle / (11.25 * (Math.PI/180))) % 32 );
		var newPosition = this.getPosition();
		var offset = this.getOffsetDrawingZone();
		this.getCurrentAnimation().setOrigin(newPosition.x - offset.x, newPosition.y - offset.y );
	}
 };
 
MovableNode.prototype.paint = function(ctx){
	Node.prototype.paint.call(this, ctx);
};