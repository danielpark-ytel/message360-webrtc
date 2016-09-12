(function() {
    'use strict';

    angular.module("vertoControllers")
        .controller("incallController", function($rootScope, $scope, $http, $state, $timeout, verto, storage) {
            console.debug("Executing InCall Controller.");
            $rootScope.dialpadNumber = "";
            $scope.incall = true;

            $scope.cbMuteMic = function(event, data) {
                storage.data.mutedMic = !storage.data.mutedMic;
            };

            $scope.muteMic = verto.muteMic;

        });
})();