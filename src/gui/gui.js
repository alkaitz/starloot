function GUI(){
	var writeInfo = function(selection){
		var ul = document.getElementById('selectionList');
		if (ul == undefined) return;
		if ( ul.hasChildNodes() )
		{
			while ( ul.childNodes.length >= 1 )
			{
				ul.removeChild( ul.firstChild );       
			} 
		}
		var li;
		for(var i = 0; i < selection.length; i++){
			li = document.createElement('li');
			li.innerHTML = selection[i].getName();
			ul.appendChild(li);
		}
	}
	this.initEvents = function(group){
		group.addNode({
		onSelection:function(event){
			writeInfo(event.selected);
		},
		onUnSelection:function(event){
			writeInfo(event.selected);
		}
		});
	}
	this.paint = function(ctx, menuCtx){
        // Minimap
        minimap.paint(menuCtx);
        // Menu
        menu.paint(menuCtx);
        // Selection rectangle
		selector.paint(ctx, menuCtx);
	};
};

gui = new GUI();