(function () {
    'use strict';

    angular.module("vertoControllers")
        .controller("loginController", function ($scope, $http, preRoute, $state, $rootScope, storage, verto, callHistory, ngToast) {
            console.debug("Executing Login Controller...");
            preRoute.checkLogin();
            
        });
})();
