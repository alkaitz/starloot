// Encapsulating inheritance
/**
    For ES5 compliant browsers we must define new properties to Object class
    this way, or any object in the code will have it as a new visible property,
    making all the for..in loops end with a undefined behaviour
    The other solution is to check, in every loop, Object.prototype.hasOwnProperty(object, key),
    which is not as good as this solution, hiding the new property
*/
Object.defineProperty(Object.prototype, "inherits", {
    value: function inherits( parent ) {
        // Apply parent's constructor to this object
        if( arguments.length > 1 ){
            // Note: 'arguments' is an Object, not an Array
            parent.apply( this, Array.prototype.slice.call( arguments, 1 ) );
        }
        else{
            parent.call( this );
        }
    },
    enumerable: false
});

// Encapsulating inheritance
Function.prototype.inherits = function( parent ){
    this.prototype = new parent();
    this.prototype.constructor = this;
};