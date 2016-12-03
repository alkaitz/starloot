var Game = {};

Game.fps = 60;

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
            logic.logicTick((new Date).getTime() - timeBefore); // Logic tick
			timeBefore = (new Date).getTime();
            stats.update(); // Update statistics...
            nextLogicTick += skipTicks;
            loops++;
        }

        if (loops)
            renderer.renderFrame(); // Render tick if there's been any logic tick
    };
})();



