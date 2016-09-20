'use strict';

angular.module("vertoService").factory("callHistory", function(storage) {
    var history = storage.data.call_history;
    var history_control = storage.data.history_control;

    var addCallToHistory = function(number, direction, status) {
        if (history[number] == undefined) {
            history[number] = [];
        }

        history[number].unshift({
            'number' : number,
            'direction' : direction,
            'status' : status,
            'call_start' : Date()
        });

        var index = history_control.indexOf(number);
        if (index > -1) { history_control.splice(index, 1); }
        history_control.unshift(number);
    };

    var getCalls = function (number) { return history[number]; };

    return {
        all : function() { return history; },
        all_control : function() { return history_control; },
        get : function(number) { return getCalls(number); },
        add : function(number, direction, status) { return addCallToHistory(number, direction, status); },
        clear : function() {
            storage.data.call_history = {};
            storage.data.history_control = [];
            history = storage.data.call_history;
            history_control = storage.data.history_control;
            return history_control;
        }
    }
});
