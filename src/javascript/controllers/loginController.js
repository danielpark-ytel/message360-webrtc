(function () {
    'use strict';

    angular.module("vertoControllers")
        .controller("loginController", function ($scope, $http, preRoute, $state, $rootScope, storage, verto, callHistory, ngToast) {
            console.debug("Executing Login Controller...");
            preRoute.checkLogin();
            var connectCallback = function(v, connected) {
                $scope.$apply(function() {
                    verto.data.connecting = false;
                    if (connected) {
                        storage.data.ui_connected = verto.data.connected;
                        storage.data.ws_connected = verto.data.connected;
                        storage.data.name = verto.data.name;
                        storage.data.email = verto.data.email;
                        storage.data.login = verto.data.login;
                        storage.data.accessToken = verto.data.passwd;
                        storage.data.numOfCalls = 0;
                        callHistory.clear();
                    }
                    if(verto.data.connected == true) {
                        $state.go("dialer");
                    } else {
                        console.error("Couldn't connect to verto.");
                    }
                });
            };

            $scope.login = function() {
                /**
                * Request to server for accessToken
                * Should have server side configured with
                * @param String account_sid
                * @param String auth_token
                **/
                var url = window.location.origin + "/webrtc_client/accessToken.php";
                $http.post(url).then(function(response) {
                    console.log(response);
                    if(response.data.Message360.Error) {
                        ngToast.create({
                            className: 'danger',
                            content: "<p class='toast-text'><i class='fa fa-info-circle'></i>" + response.data.Message360.Error + "</p>"
                        });
                        return false;
                    }
                    else if(response.data.Message360.Message['token']) {
                        var token = response.data.Message360.Message['token'];
                        verto.data.login = token;
                        verto.data.passwd = token;
                    }
                    verto.data.connecting = true;
                    verto.connect(connectCallback);
                }, function(err) {
                    if(err) {
                        ngToast.create({
                            className : 'warning',
                            content: "<p class='toast-text'><i class='fa fa-info-circle'></i> The Message360 SDK for authentication is not set up properly.</p>"
                        });
                    }
                });
            };
        });
})();
