Renderer = (function(){
    function Renderer(){
        var ctx = Config.getInstance().getContext();

        // We need another structure besides nodeHeap to store all the nodes indexed by their name
        var globalNodesMap = new Array;
        var nodesHeap = new MinHeap(null,Game.nodeComparison);
    	
        this.timeRendering = 0;

        var getNameWParent = function(node){
            var name = '';
            if (node.getParent() != undefined){
                name += node.getParent().getName()+'.';
            }
            name += node.getName();

            return name;
        }

        // DELETE ME
        // Temp scale
        var _scale = 1.0;
        this.setScale = function(value){
            console.log(value);
            if ( value.delta == 1 ){ // positive wheel
                _scale += 0.05;
            } 
            else if ( value.delta == -1 ){ // Negative wheel
                _scale -= 0.05;
                if (_scale <= 0.0) _scale = 0.05;
            }
            console.log(_scale);
        };
        //////////////////////////////////////////////

        var clone = function (obj) {
            if (null == obj || "object" != typeof obj) return obj;
            var copy = obj.constructor();
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
            }
            return copy;
        }
        this.renderFrame = function(){
            // Start timing
            var time1 = new Date().getTime();
            
            // Restore from resize
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            var tempHeap = new MinHeap(null,Game.nodeComparison);
            var tempGlobalNodes = clone(globalNodesMap);
            var node;
            var name;
            while((node = nodesHeap.pop()) != undefined){
                node.paint(ctx,_scale);
                name = getNameWParent(node);
                if (globalNodesMap[name] != undefined){
                    // Deleting the nodes that are already in the tree in tempGlobalNodes we will guarantee that in the end
                    // tempGlobalNodes will have the new nodes to be added to the tree
                    delete tempGlobalNodes[name];
                    tempHeap.push(node);
                }
            }

            // We add the new nodes to be added
            for(var node in tempGlobalNodes){
                node = tempGlobalNodes[node];
                tempHeap.push(node);
            }

            nodesHeap = tempHeap;
                  
            this.timeRendering = new Date().getTime() - time1;
        };

        

        this.addNode = function(node){
            globalNodesMap[getNameWParent(node)] = node;
        }

        this.removeNode = function(node){
            var name = getNameWParent(node);
            if (globalNodesMap[name] != undefined){
                delete globalNodesMap[name];
            }
        }

        this.removeNode
    };
    
    var instance;
    
    return {
        getInstance : function (){
            if (instance == null){
                instance = new Renderer();
                // This way the constructor can not be called
                instance.constructor = null;
            }
            return instance;
        }
    };
})();

