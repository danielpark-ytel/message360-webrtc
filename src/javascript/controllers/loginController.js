(function () {
    'use strict';

    angular.module("vertoControllers")
        .controller("loginController", function ($scope, $http, $state, $rootScope, storage, verto, $timeout) {
            console.debug("Executing Login Controller...");
            $scope.login = function() {
                console.log("User is connecting as: " + verto.data.login);
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
                        }
                        //Go to the dialer if verto successfully connects
                        if(verto.data.connected == true) {
                            $state.go('dialer');
                        } else {
                            return false;
                        }
                    });
                };
                //Imitating the action token functionality
                $http.post("https://park-dev.message360.com/api/v2/fs/createToken").then(function(response) {
                    if(response.data) {
                        verto.data.passwd = response.data;
                        console.debug("Access Token Acquired: " + verto.data.passwd);
                    }
                    verto.data.connecting = true;
                    verto.connect(connectCallback);
                }, function(err) {
                    console.error(err);
                });
            };
            console.log(verto.data);
        });
})();
