(function() {
    'use strict';

    angular.module("vertoControllers")
        .controller("dialpadController", function($rootScope, $scope, $http, $state, verto, storage, ngToast) {

            var countryCode = "1";
            console.debug("Executing Dialpad Controller...");
            storage.data.videoCall = false;
            storage.data.userStatus = 'connecting';
            storage.data.calling = false;

            //TODO: call history, last call, call chat?

            function call(extension) {
                storage.data.cur_call = 0;
                storage.data.onHold = false;
                $rootScope.dialpadNumber = extension;
                if(!$rootScope.dialpadNumber) {
                    return false;
                }

                if (verto.data.call) {
                    console.debug("A call is already in progress.");
                    return false;
                }
                storage.data.mutedVideo = false;
                storage.data.mutedMic = false;
                storage.data.videoCall = false;
                verto.call("##"+countryCode+$rootScope.dialpadNumber);
                storage.data.called_number = extension;
                $state.go("incall");
            };

            //TODO : validating caller_id_number for outbound calls, making sure they have funds.

            /**
             * Call to the number in $rootScope.dialpadNumber
             */
            $scope.loading = false;
            $scope.cancelled = false;

            $rootScope.call = function(extension) {
                $scope.loading = true;
                call(extension);
            };

            $rootScope.cancel = function() {
                $scope.cancelled = true;
            };

        });
})();