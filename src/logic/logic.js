function GameLogic(){
    this.logicTime = 0;

    this.logicTick = function(elapsedTime){
        // Start timing
        var time1 = new Date().getTime();
        
        // Let's apply limits to movement
        camera.updateLogic();
        // Update logic
        board.updateLogic();
        // Update GUI logic
        selector.updateLogic();
		// Test logic of animations
		//animTest.updateCurrentFrame(elapsedTime);
        
        this.logicTime = new Date().getTime() - time1;
    };
    
}; 

logic = new GameLogic;