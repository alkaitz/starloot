/**
 * @author alkaitz
 * @param name Name of current node
 * @param coords X position coordinate of the node
 * @param y Y position coordinate of the node
 * @param numAnimations number of different animations that node will have
 * @param numFrames {x:, y:} Number of frames in each dimension of graphic
 * @param sizeOfSprites {x:, y:} Size of each independent sprite
 * @param files lanimations list 
 */
function Node(name, coords, numAnimations, numFrames, sizeOfSprites, files){
	/**
		Own properties
	*/
	var _name = name;
    var _3dPos = coords != undefined && coords.constructor.name == 'Coordinate3D' ? true : false;
	var _position = coords || new Coordinate2D(0, 0);
	var _sizeOfSprite = sizeOfSprites || {x: 128, y: 128}; // Default sprite to 128 pixels
    var _offsetDrawingZone = new Coordinate2D( Math.floor( _sizeOfSprite.x / 2 ),Math.floor( _sizeOfSprite.y / 2 ) )
    var _currentAnimation = 0;
	var _animations = [];
	var _numAnimations = numAnimations; 
	for (var idx = 0; idx < _numAnimations; idx++){
		_animations.push(new Animation(files[ idx ], {x: _sizeOfSprite.x * numFrames.x, y: _sizeOfSprite.y * numFrames.y}, numFrames, 0, true, false));
    };
    var _parent = undefined;
    var _children = [];

    this.addNode = function(node){
        if (node != undefined){
        	node.setParent(this);
        	_children[node.getName()] = node;
        }
    };

    /**
     * Function that will remove a child node from this structure.
     * Type: Node or String
     */
    this.removeNode = function(node){
    	if (typeof(node) == "string"){
            if (_children[node] != undefined){
        		_children[node].setParent(undefined);
        		delete _children[node];
            }
    	}else if (_children[node.getName()] != undefined){
    		_children[node.getName()].setParent(undefined);
    		delete _children[node.getName()];
    	}
    };    

    /**
     * Parent getter
     * Type: Node
     */
    this.getParent = function(){
    	return _parent;
    };

    /**
     * Parent setter
     * Type: Node
     */
    this.setParent = function(parent){
    	_parent = parent;
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
    this.setPosition = function( position ){
    	_position = position;
    };
    
    this.getPosition = function(){
    	if (_parent != undefined){
    		_position.x = _position.x+_parent.getPosition().x;
    		_position.y = _position.y+_parent.getPosition().y;
            if (_3dPos){
                _position.z = _position.z+_parent.getPosition().z;
            }	
    	}
    	return _position
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
     * Current animation start and stop
     */
    this.play = function(){
    	_animations[ _currentAnimation ].play();
    };

    this.stop = function(){
    	_animations[ _currentAnimation ].stop();
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


    /**
	 * Update functions
	 * timeElapsed in milliseconds
	 */
    this.update = function( timeElapsed ){
    	_animations[ _currentAnimation ].updateCurrentFrame( timeElapsed );
        if (_children != undefined && _children.length > 0){
            for(var child in _children){
                _children[child].update(timeElapsed);
            }
        }
    };
};

function XMLNode(name, coords, xmlFile){
	xmlInfo = XMLReader.getInstance().getNodeInfo(xmlFile);
	if (Object.keys(xmlInfo).length == 0){
		return {};
	}
	return new Node( name, coords, xmlInfo.numAnimations, xmlInfo.numFrames, xmlInfo.sizeOfSprites, xmlInfo.files);
};

/**
 *	Paints the current node on screen
 */
Node.prototype.paint = function( ctx, scale ){
	var currentAnimation = this.getCurrentAnimation();
	var nodePosition = this.getPosition();
	var offset = this.getOffsetDrawingZone();
	var origin = { x: nodePosition.x - offset.x, y: nodePosition.y - offset.y };
	currentAnimation.paint(ctx, origin, scale);
}