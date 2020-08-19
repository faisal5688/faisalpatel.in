var EventManager = function() {
    //trace(":: Event Manager Loaded ::");

    this.dispatchCustomEvent = function(controlName, eventName, isBubbling, dataObj) {
        //	trace("***** Event Dispatched *****");
        try {
            $(eval(controlName)).trigger({
                type: eventName,
                obj: dataObj
            }, isBubbling);
        } catch (err) {
            console.error(err)
        }
    }

    this.addControlEventListener = function(controlName, eventName, callBackFn) {
        //	trace("***** Event Added *****");
        //	trace(controlName + " : " + eventName);
        try {
            $(controlName).bind(eventName, callBackFn);
        } catch (err) {
            console.error(err)
        }
    }

    this.removeControlEventListener = function(controlName, eventName, callBackFn) {
        //	trace("***** Event Removed *****");
        try {
            $(controlName).unbind(eventName, callBackFn);
        } catch (err) {
            console.error(err)
        }
    }
}