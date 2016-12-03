/**
 * @author alkaitz
*/
function ResourceManager(){
    var elements = new Array;
    
    /**
     * Looks for an image in the table
     */
    this.getImage = function( id ){
        if ( id ){
            if (elements[ id ]) {
                return elements[ id ];
            }
            else {
                elements[ id ] = new Image();
                elements[ id ].src = ImagesList[ id ];
                return elements[ id ];
            };        
        };
    };
};

resourceManager = new ResourceManager();