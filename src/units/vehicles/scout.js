/**
 * @author alkaitz
 */
Scout.inherits( MovableNode );
function Scout(x, y, name){
	/**
		Node inheritance calling public constructor with parameters
	*/
	this.inherits( MovableNode, name, 2, x, y, 32, {x: 1, y: 1}, {x: 128, y: 128}, 'recon_01_' );
	
	this.isSelected = false;	
	this.animSelected = new Animation('selector', 
    									this.getPosition().x - this.getOffsetDrawingZone().x, 
    									this.getPosition().y - this.getOffsetDrawingZone().y + 15, 
    									{x: 128, y: 128}, {x: 1, y: 1}, 0, false, false);
	
	/**
	 *	onMouseEvent callback event
	 */
	this.onclick = function(evt){
		var point = camera.localPosition({x: evt.x, y: evt.y});
		if (this.isTouched(point)){
			this.isSelected = !this.isSelected;
			if (keyboard.isDown( Keys.CTRL ) == false){
				selector.clearSelection();
			}
			selector.updateSelectedItem(this);
			return true;
		};
        return false;
	};
	
	
	/**
		Checks if current scout has been touched
	*/
	this.isTouched = function(point){
		return this.getCurrentAnimation().isPaintedPixel(point);
	};
};

Scout.prototype.update = function(){
	MovableNode.prototype.update.call( this );

	var newPosition = this.getPosition();
	var offset = this.getOffsetDrawingZone();
	this.animSelected.setOrigin(newPosition.x - offset.x, newPosition.y - offset.y + 15);
	if (this.isSelected){
		this.animSelected.show();
	}
	else{
		this.animSelected.hide();
	};
};

Scout.prototype.paint = function(ctx){
	if (this.isSelected == true){ // Paint selector graph
        this.animSelected.paint(ctx);
    }
    
	MovableNode.prototype.paint.call(this, ctx);
};
