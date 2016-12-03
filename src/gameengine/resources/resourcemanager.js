/**
 * @author alkaitz
*/
ResourceManager = (function(){
    function ResourceManager(){
        var elements = {};
        var xmlElements = {};

        /**
         * Looks for an image in the table
         */
        this.getImage = function( id ){
            if ( id && id in ImagesList){
                if (elements[ id ]) {
                    return elements[ id ];
                }
                else {
                    elements[ id ] = new Image();
                    elements[ id ].src = ImagesList[ id ];
                    elements[ id ].loaded = false;
                    elements[ id ].onload = function() {
                        elements[ id ].loaded = true;
                    };
                    return elements[ id ];
                };        
            };
        };

        this.getXmlResource = function(id){
             if ( id && id in XmlsList ){
                if (xmlElements[ id ]) {
                    return xmlElements[ id ];
                }else {
                    xmlhttp = new XMLHttpRequest();
                    xmlhttp.open("GET",XmlsList[id],false);
                    xmlhttp.send();
                    xmlElements[ id ] = xmlhttp.responseXML;
                    return xmlElements[ id ];
                };        
            };
        };
    }
    var instance;
  

    return {
        getInstance : function (){
            if (instance == null){
                instance = new ResourceManager();
                // This way the constructor can not be called
                instance.constructor = null;
            }
            return instance;
        }
    };
})();