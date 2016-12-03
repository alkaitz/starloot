/**
 * @author alkaitz
 */
function Entity(name){

	var _name = name;
	var _entities = [];
	var _nodes = [];

	var removeObj = function(obj, list){
		if (typeof(obj) == "string"){
            if (list[obj] != undefined){
        		delete list[obj];
        		return true;
            }
    	}else if (list[obj.getName()] != undefined){
    		delete list[obj.getName()];
    		return true;
    	}
		else return false;
	}

	this.addEntity = function( entity ){
		if (entity != undefined){
			_entities[entity.getName()] = entity;
		}
	};

	this.removeEntity = function( entity ){
		return removeObj(entity,_entities);
	};

	this.addNode = function( node ){
		if (node != undefined){
			_nodes[node.getName()] = node;
		}
	};

	this.removeNode = function( node ){
		return removeObj(node,_nodes);
	};

	this.getNodes = function(){
		return _nodes;
	};

	this.getName = function(){
		return _name;
	}

	this.update = function( timeElapsed ){
		for (var node in _nodes){
			_nodes[node].update( timeElapsed );
		};
		for (var entity in _entities){
			_entities[entity].update( timeElapsed );
		};
	};
};

/**
 *	Paints the current entity on screen
 */
Entity.prototype.paint = function( ctx, scale ){
	var nodes = this.getNodes();
	for (var node in nodes){
		nodes[node].paint( ctx, scale );
	};
}