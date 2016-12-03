function sleep(milliseconds) {
	var start = new Date().getTime();
	while ((new Date().getTime() - start) < milliseconds){}
};

function indexPair(pair, list) {
    for (var idx in list){
        if (list[ idx ] [ 0 ] == pair [ 0 ] &&
            list[ idx ] [ 1 ] == pair [ 1 ])
            return idx;
    };
    return -1;
};

function valueInRange(value, min, max){
	return (value <= max) && (value >= min);
};

function overlap(P1, P2){ // P = [x0, xn, y0, yn] Element coords
	var xOverlap = 	valueInRange(P1[0], P2[0], P2[1]) || valueInRange(P2[0], P1[0], P1[1]);	
	var yOverlap = valueInRange(P1[2], P2[2], P2[3]) || valueInRange(P2[2], P1[2], P1[3]);
	return xOverlap && yOverlap;
};

var AngleDirection = {
    COUNTER: 0,
    CLOCK: 1
};
function direction(angleStart, angleEnd){ // Returns shortest direcction between two angles
    if (((angleEnd - angleStart +(2 * Math.PI)) % (2 * Math.PI)) > Math.PI)
        return AngleDirection.COUNTER;
    else return AngleDirection.CLOCK;
};

function zfill(num, len) {
    return (Array(len).join("0") + num).slice(-len);
}

/**
 * Shuffles elements from current array
 */
function shuffle(array) {
	for (var j, x, i = array.length; i; j = Math.floor( Math.random() * i ), x = array[--i], array[ i ] = array[ j ], array[ j ] = x);
	return array;
};