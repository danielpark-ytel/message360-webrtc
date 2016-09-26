(function() {
    'use strict';

    angular.module("vertoControllers")
        .controller("dialpadController", function($rootScope, $scope, $http, $state, verto, storage, ngToast, ngAudio, callHistory, preRoute) {
            console.debug("Executing Dialpad Controller...");
            preRoute.checkVerto();
            $scope.user = {};
            storage.data.notifications = true;
            storage.data.videoCall = false;
            storage.data.userStatus = 'connecting';
            storage.data.calling = false;
            $scope.listSize = 8;
            $scope.numberAuthenticated = false;

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
                if (storage.data.cid_number == null) {
                    ngToast.create({
                        className : "danger",
                        content: "<p class='toast-text'><i class='fa fa-times-circle'></i> You have not yet set a Caller ID Number.</p>"
                    });
                    return false;
                }
                storage.data.mutedVideo = false;
                storage.data.mutedMic = false;
                storage.data.videoCall = false;
                verto.call("##1"+$rootScope.dialpadNumber);
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

            $scope.updateCallerId = function() {
                var url = window.location.origin + "/webrtc_client/lib/authenticateNumber.php";
                $http({
                    method: "POST",
                    url: url,
                    data: {
                        phone_number: $scope.user.phoneNumber
                    }
                }).then(function(response) {
                    if (response.data.Message360.ResponseStatus == 1) {
                        storage.data.cid_number = $scope.user.phoneNumber;
                        ngAudio.play("assets/sounds/notification.mp3");
                        ngToast.create("<p class='toast-text'><i class='ion-android-notifications'></i> Caller ID updated.</p>");
                    }
                    else {
                        ngToast.create({
                            className : 'danger',
                            content: "<p class='toast-text'><i class='fa fa-times-circle'></i> "+response.data.Message360.Errors+"</p>"
                        });
                    }
                });
            };

        });
})();
