/**
 * @author khanser
*/
XMLReader = (function(){
    function XMLReader(){
        var readFiles = new Array();

        /**
         * Parse xml DOM into node data
         */
        this.getNodeInfo = function( fileName ){
            var retVal = {};
            // Checking for already parsed files stored in the cache
            if (!(fileName in readFiles)){
                xmlDoc = ResourceManager.getInstance().getXmlResource(fileName);

                node = xmlDoc.firstChild;
                // Looping xml nodes
                for(var prop in node.childNodes){
                    prop = node.childNodes[prop];
                    
                    // Accepting only element nodes (there are text nodes with newline chars and we don't want that)
                    if (prop.nodeType == 1){
                        name = prop.localName;
                        var nameValue;
                        
                        // Switching for acceptable node types (with the exact same name as the Node properties)
                        switch(name){
                            case 'files':
                                // Files node contains N "file" nodes with image Id's in the "value" attribute
                                nameValue = new Array();
                                for(var child in prop.childNodes){
                                    child = prop.childNodes[child];
                                    if (child.nodeType == 1){
                                        nameValue.push(child.attributes.getNamedItem('value').nodeValue);
                                    }
                                }
                            break;

                            case 'numFrames':
                            case 'sizeOfSprites': 
                                nameValue = {};
                                // Childrenless element nodes, mapping the xml node attributes as object properties
                                for(var i = 0; i < prop.attributes.length;i++){
                                    var attr = prop.attributes[i];
                                    nameValue[attr.localName] =  attr.nodeValue;
                                }
                            break;

                            default: 
                                // Default childrenless element node with the value in the xml node attribute "value"
                                nameValue = prop.attributes.getNamedItem('value').nodeValue;
                            break;
                        }

                        retVal[name] = nameValue;

                    }
                    
                }
                readFiles[fileName] = retVal;
            }else{
                retVal = readFiles[fileName];
            }

            return retVal;

        };
    }
    var instance;
  

    return {
        getInstance : function (){
            if (instance == null){
                instance = new XMLReader();
                // This way the constructor can not be called
                instance.constructor = null;
            }
            return instance;
        }
    };
})();