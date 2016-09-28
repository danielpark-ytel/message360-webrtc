(function () {
    'use strict';
    angular.module("vertoControllers").controller("incallController", function ($rootScope, $scope, $http, $state, $timeout, verto, storage, preRoute, $uibModal) {
        console.debug("Executing InCall Controller.");
        preRoute.checkVerto();
        $scope.incall = true;
        $scope.cbMuteMic = function (event, data) {
            storage.data.mutedMic = !storage.data.mutedMic;
        };
        $scope.muteMic = verto.muteMic;
        $scope.showMinipad = function() {
            $uibModal.open({
                templateUrl : "minipad.tmpl.html",
                animation : true,
                size : 'sm'
            });
        }
    });
})();