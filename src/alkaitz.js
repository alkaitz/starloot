function Circle(x, y, radius){
    var origin = {x: x, y: y};
    var r = radius;
    
    this.inside = function(x, y){
        var dx = x - origin.x;
        var dy = y - origin.y;
        dx *= dx;
        dy *= dy;
        return (dx + dy <= (r * r)); 
    };
};

function Test(){
    var elementsFixed = new Array;
    var elements = new Array;
    
    this.addFixedElement = function(x, y, size){
        elementsFixed.push(new Circle(x, y, size / 2));
    };
    
    this.addElement = function(x, y, size){
        elements.push(new Circle(x, y, size / 2));
    };
    
    this.moveMe = function(x, y){
        var direction = {x: 0.0, y: 0.0};
        for (var i in elementsFixed){
            var fixed = elementsFixed[ i ];
            if (fixed.inside(x, y)){
                console.log("DENTRO!!!");
            }
            else {
                console.log("FUERA!!!");
            };
        };
        return direction;
    };
};

t = new Test();
t.addFixedElement(5, 5, 2.0);
t.moveMe(5, 4.5)
t.moveMe(4, 5)
t.moveMe(8, 6)