var Game = {};

Game.fps = 60;

Game.eventManager = new EventManager;
Game.logic = new GameLogic;

Game.nodeComparison = function(node1, node2){
    var z1 = node1.getPosition().z;
    var z2 = node2.getPosition().z;
    return z1 == z1 ? 0 : z1 < z2 ? -1 : 1;
};

// Limit painting frames with the number of screen refreshes per second 
Game.initialize = (function() {
    var onEachFrame;
    if (window.webkitRequestAnimationFrame) {
        onEachFrame = function(cb) {
            var _cb = function() { cb(); webkitRequestAnimationFrame(_cb); }
            _cb();
        };
    } else if (window.mozRequestAnimationFrame) {
        onEachFrame = function(cb) {
            var _cb = function() { cb(); mozRequestAnimationFrame(_cb); }
            _cb();
        };
    } else {
        onEachFrame = function(cb) {
            setInterval(cb, 1000 / 60);
        }
    }

    window.onEachFrame = onEachFrame;
})();
      
Game.loop = (function() {
    var loops = 0, skipTicks = 1000 / Game.fps,
        maxFrameSkip = 10,
        nextLogicTick = (new Date).getTime(),
		timeBefore = (new Date).getTime();

    return function() {
        loops = 0;

        while ((new Date).getTime() > nextLogicTick) {
            Game.logic.logicTick((new Date).getTime() - timeBefore); // Logic tick
			timeBefore = (new Date).getTime();
            //stats.update(); // Update statistics...
            nextLogicTick += skipTicks;
            loops++;
        }

        if (loops){
            Renderer.getInstance().renderFrame(); // Render tick if there's been any logic tick
        }
    };
})();

//  DELETE ME
var entityArray = [];

for (var j = 0; j < 10; j++){
    for (var i = 0; i < 14; i++){
        var node = new XMLNode('scout' + i + '-' + j, new Coordinate2D((i * 128) + 64, (j * 128) + 16, 0), "reconnInfo");
        node.play();
        var entity = new Entity();
        entity.addNode( node );
        Renderer.getInstance().addNode(node);
        entityArray.push(node);
    };
}
/////////////



