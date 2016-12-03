/**
 * @author alkaitz
 * @param file - Name to id  of image file to draw
 * @param size - Size to draw in each axis
*/
function Drawable(file, size){
	/**
		Own properties
	*/
    var _img = ResourceManager.getInstance().getImage(file);
	var _size = size || new Size2D(_img.height, _img.width);
    
    /**
		Set size to draw
	*/
    this.setSize = function( size ){
        _size = size;
    };
    
    /**
     	Gets the size of the drae 
     */
    this.getSize = function(){
    	return _size;
    };

    /**
     	Set image to paint 
     */
    this.setImage = function( img ){
    	_img = img;
    }
        
    /**
     	Get image to paint 
     */
    this.getImage = function(){
    	return _img;
    }
};

/**
	Paints the current sprite on screen
*/
Drawable.prototype.paint = function( ctx, origin, offset, scale ){
	var img 	= this.getImage();
	var size 	= this.getSize();
    var factor  = scale || 1.0;
    if (img.loaded)
		ctx.drawImage(img,
			offset.x,
			offset.y,
			size.x,
			size.y,
			origin.x * factor,
			origin.y * factor,
			size.x * factor,
			size.y * factor);
};
