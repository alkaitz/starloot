/*
* @author khanser
*/
Config = (function(){
    
    
    function ConfigObj(){

        /**
         * Returns the context of the main canvas
         */
        this.getContext = function(id){
            var elemId = id || Config.CANVAS_ID;
            var canvas = document.getElementById(elemId);
            return canvas.getContext(Config.CONTEXT_TYPE);
        };
    }
    var instance;
  

    return {
        CANVAS_ID : "canvas",
        CONTEXT_TYPE : "2d",
        getInstance : function (){
            if (instance == null){
                instance = new ConfigObj();
                // This way the constructor can not be called
                instance.constructor = null;
            }
            return instance;
        }
    };
})();
