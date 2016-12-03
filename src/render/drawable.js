/**
 * @author alkaitz
 * @param file - Name to id  of image file to draw
 * @param x - Origin x coord
 * @param y - Origin y coord
 * @param size - [x: , y:] Size in pixels in each direction to draw
*/
function Drawable(file, x, y, size){
	/**
		Own properties
	*/
    var _img = resourceManager.getImage(file);
	var _origin = {x: x, y: y};
	var _size = size;
    
    /**
		Set origin point to draw
	*/
    this.setOrigin = function(X, Y){
    	_origin = {x: X, y: Y};
    };
    
    /**
     	Gets origin point
     */
    this.getOrigin = function(){
    	return _origin;
    };
    
    /**
		Set size to draw
	*/
    this.setSize = function(X, Y){
        _size = {x: X, y: Y};
    };
    
    /**
     	Gets the size of the drae 
     */
    this.getSize = function(){
    	return _size;
    };
        
    /**
     	Get image to paint 
     */
    this.getImage = function(){
    	return _img;
    }
};

/**
	Returns true if custom pixel is visible and false if it is transparent
*/
Drawable.prototype.isPaintedPixel = function(pixel){
	var origin 	= this.getOrigin();
	var size 	= this.getSize();
	// Let's see if it's inside the painted zone
	if (origin.x > pixel.x || pixel.x > origin.x + size.x ||
		origin.y > pixel.y || pixel.y > origin.y + size.y)
		return false;
	
	return true;
};

/**
	Paints the current sprite on screen
*/
Drawable.prototype.paint = function(ctx, offsetX, offsetY){
	var img 	= this.getImage();
	var origin 	= this.getOrigin();
	var size 	= this.getSize();
	if (img.complete)
		ctx.drawImage(img,
			offsetX,
			offsetY,
			size.x,
			size.y,
			origin.x,
			origin.y,
			size.x,
			size.y);
};
