/**
 * Created by danielpark on 8/26/16.
 */

(function() {
    'use strict';
    angular.module('vertoControllers').controller('wsReconnectController', wsReconnectController);
    wsReconnectController.$inject = [
        '$scope', 'storage', 'verto'
    ];
    function wsReconnectController($scope, storage, verto) {
        console.debug('Executing wsReconnectController');
    }
});