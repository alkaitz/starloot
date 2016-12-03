/**
 * @author alkaitz
 * @param durationMs duration of the timer in milliseconds
 * @param callback callback function to call when timer finishes
 */
function Timer( durationMs, callback ){
    var _initialDuration = durationMs;
    var _remaining = durationMs;
    var _callback = callback;
    var _completed = false;

    /**
     * Returns the percentage of the timer covered
     */
    this.percentageCovered = function(){
        return Math.min (( (_initialDuration - _remaining) * 100.) / _initialDuration, 100.0);
    };

    /**
     * Returns if the timer has already finished
     */
    this.hasFinished = function(){
        return _completed;
    };

    /**
     * Update logic function
     */
    this.update = function( timeElapsed ){
        if ( _completed == false && _remaining <= timeElapsed ){
            _completed = true;
            callback();
        }
        else {
            _remaining -= timeElapsed;
        };
    };
}; 

