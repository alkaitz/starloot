
function GameLogic(){
    this.logicTime = 0;

    this.logicTick = function(elapsedTime){
        // Start timing
        var time1 = new Date().getTime();

        //  DELETE ME
        for (var i = 0; i < entityArray.length; i++){
            entityArray[i].update( elapsedTime );
        };

        //console.log(timer.percentageCovered(), "%");
        /////////////

        // Event tick every logictick
        Game.eventManager.update( elapsedTime );

        this.logicTime = new Date().getTime() - time1;
    };
    
};