function Selector(){
	this.selection = new Array;
	this.squareSelection = new Array;
	this.avgX = 0; // Average point of everyone to get tagret point
	this.avgY = 0;
	
	this.targetPoint = function(xOrig,yOrig,xTarg,yTarg){
		return {x: Math.floor(xTarg - this.avgX + xOrig), y: Math.floor(yTarg - this.avgY + yOrig)};
	};
	
	this.refreshAveragePoint = function(){
		var sumX = 0;
		var sumY = 0;
		for (var obj in this.selection){
			sumX += this.selection[ obj ].x;
			sumY += this.selection[ obj ].y;
		};
		this.avgX = Math.floor(sumX / this.selection.length);
		this.avgY = Math.floor(sumY / this.selection.length);
		//console.log("Avg point: " + this.avgX + "," + this.avgY);
	};
	    
    this.addSelection = function(obj){
		this.selection.push(obj);
        obj.isSelected = true;
		root.onevent('onSelection',{selected:this.selection},'guiEvents');
		this.refreshAveragePoint();
    };
    
    this.removeSelection = function(obj){
        var idx = this.selection.indexOf(obj);
		if (idx != -1){
            this.selection[ idx ].isSelected = false;
            this.selection.splice(idx, 1);
        }
		root.onevent('onUnSelection', {selected:this.selection},'guiEvents');
		this.refreshAveragePoint();
    };
    
    this.clearSelection = function(){
        for (var idx in this.selection){
            this.selection[ idx ].isSelected = false;
        };
        this.selection = [];
		root.onevent('onUnSelection', {selected:this.selection},'guiEvents');
		this.avgX = 0; 
		this.avgY = 0;
    };
    
    this.isSelected = function(obj){
        for (var idx in this.selection){
            if (this.selection[ idx ] == obj)   
                return true;
        };
        return false;
    };
	
	this.setMouseSelection = function(a){
		this.squareSelection = [a.x, a.y, a.gx, a.gy];
        
		// Lets see ogirin from selection (different starting points)
		if (a.gx < 0){
			a.x += a.gx;
			a.gx = -a.gx;
		};
		if (a.gy < 0){
			a.y += a.gy;
			a.gy = -a.gy;
		};
		// Select objects under selection
		for (var obj in board.movable){
			var object = board.movable[ obj ];
			var origin = object.getCurrentAnimation().getOrigin();
			var size = object.getSize();
            //var P1 = [object.x - Math.floor(object.image.spriteSize.x / 2), object.x + Math.floor(object.image.spriteSize.x / 2), 
            //          object.y - Math.floor(object.image.spriteSize.y / 2), object.y + Math.floor(object.image.spriteSize.y / 2)];
            var P1 =   [origin.x, origin.x + size.x, 
                        origin.y, origin.y + size.y];
            var P2 = [a.x, a.x + a.gx, a.y, a.y + a.gy];
			if ( overlap(P1,P2)){
				object.isSelected = true;
				this.updateSelectedItem(object);
			}
			else{
				object.isSelected = false;
				this.updateSelectedItem(object);
			};
		};
	};
	
	this.updateSelectedItem = function(item){
		if (item.isSelected){
			this.removeSelection(item);
			this.addSelection(item);
		}
		else{
			this.removeSelection(item);
		}
	}
	
	this.onclick = function(evt){
		// Let's see the target distribution
		var num = this.selection.length;
		var finalTargets = new Array(num);
		finalTargets[ 0 ] = camera.localPosition({x: evt.x, y: evt.y});
		// Let's draw a circle and distribute it randomly (one target will be the original one)
		var starting = Math.random() * (2 * Math.PI); 
		var radious = num * 25;
		var each = (2 * Math.PI) / (num - 1);
		for (var i = 1; i < num; i++){
			finalTargets[ i ] = {x: Math.floor( finalTargets[ 0 ].x + (radious * Math.cos(starting + (each * (i - 1))))),
								 y: Math.floor( finalTargets[ 0 ].y + ((radious * Math.sin(starting + (each * (i - 1)))) / 2) )};
		};
		// Lets shuffle the destination array to not seem predictable...
		finalTargets = shuffle( finalTargets );
		for (var i = 0; i < this.selection.length; i++){
			var object = this.selection[ i ];
			var target = finalTargets[ i ];
			var position = object.getPosition();
			object.setPath( findPath([position.x,position.y],[target.x,target.y],terrainProps,40) );
			object.setTarget( undefined );
		};
		return false;
	};
	
	this.endMouseSelection = function(){
		this.squareSelection = [];
	};
	
	this.updateLogic = function(){
		if (this.selection.length > 0){
			this.refreshAveragePoint(); // Refresh avg point of current selection
		}
	};
	
	this.paint = function(ctx, menuCtx){
		if (this.squareSelection.length == 4){
            ctx.strokeStyle="blue";
            //var point = camera.localPosition({x: this.squareSelection[0], y: this.squareSelection[1]});
			ctx.strokeRect(this.squareSelection[0] , this.squareSelection[1], this.squareSelection[2], this.squareSelection[3]);
		}
		
		// Clear the GUI window
		/*guiCtx.clearRect(0, 0, guiCanvas.width, guiCanvas.height);
		var w = guiCanvas.width;
		guiCanvas.width = 1;
		guiCanvas.width = w;
		
		guiCtx.fillStyle = "yellow";
		guiCtx.font = "bold 12px Arial";
		guiCtx.fillText("Selection", 10, 10);
		
		/*if (this.selection.length > 0){ // If there is something selected we display info
			for (var i in this.selection){
				var obj = this.selection[ i ];
				guiCtx.fillStyle = "red";
				guiCtx.font = "bold 12px Arial";
				guiCtx.fillText(obj.name, 12, 22 + (i * 12));
			}
		}*/
	};
};

selector = new Selector();

