var callHistory = angular.module("vertoService").factory("callHistory", function(storage) {
    var addCall = function(number, direction, status, call_start) {
        console.log("Adding call to call_history");
        var callInfo = {
            'dialedNumber': number,
            'direction' : direction,
            'status' : status,
            'call_start' : call_start
        };
        for(var i = 0; i < 10; i++) {
            storage.data.call_history.push(callInfo);
        }
    };
    return {
        'addCall' : addCall,
        clear : function() {
            storage.data.call_history = [];
            return storage.data.call_history;
        }
    }
});

callHistory.$inject = ['storage'];