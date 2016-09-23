'use strict';

angular.module("vertoService").factory("callHistory", function(storage) {
    var addCall = function(number, direction, status) {
        var callInfo = {
            'dialedNumber': number,
            'direction' : direction,
            'status' : status,
            'call_start' : Date()
        };
        if(storage.data.call_history.length <= 7) {
            storage.data.call_history.push(callInfo);
        } else {
            storage.data.call_history.shift();
            storage.data.call_history.push(callInfo);
        }
    }
    return {
        'addCall' : addCall,
        clear : function() {
            storage.data.call_history = [];
            return storage.data.call_history;
        }
    }
});
