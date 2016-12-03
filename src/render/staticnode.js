/**
 * @author alkaitz
 * @param name Name of current node
 * @param orientation Orientation of current static node
 * @param x X coordinate of central point of node
 * @param y Y coordinate of central point of node
 * @param numAnimations number of different animations that node will have
 * @param numFrames {x:, y:} Number of frames in each dimension of graphic
 * @param sizeOfSprites {x:, y:} Size of each independent sprite
 * @param files prefix of name of animation files 
 */
StaticNode.inherits( Node );
function StaticNode(name, orientation, x, y, numAnimations, numFrames, sizeOfSprites, files){
	var _tile = {x: x * 128, y: y * 64};
	var _orientation = orientation;
	
	/**
		Node inheritance calling public constructor with parameters
	*/
	this.inherits( Node, name, _tile.x, _tile.y, numAnimations, numFrames, sizeOfSprites, files );
 };
 
StaticNode.prototype.getBoundingBox = function(r) {
	var boundingBox = new Array;
	return boundingBox;
}

StaticNode.prototype.paint = function(ctx){
	Node.prototype.paint.call(this, ctx);
};