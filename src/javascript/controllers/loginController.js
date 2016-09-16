(function () {
    'use strict';

    angular.module("vertoControllers")
        .controller("loginController", function ($scope, $http, $state, $rootScope, storage, verto, $timeout) {
            console.debug("Executing Login Controller...");
            $scope.login = function() {
                console.log("User is connecting as: " + verto.data.login);
                var connectCallback = function(v, connected) {
                    console.log(verto.data);
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
                            console.error("Couldn't connect to verto.");
                        }
                    });
                };
                /**
                * Request to server for accessToken
                * Should have server side configured with
                * @param String account_sid
                * @param String auth_token
                **/
                $http.post("/accessToken.php").then(function(response) {
                    if(response.data.Message360['AccessToken'] != "") {
                        verto.data.passwd = response.data.Message360['AccessToken'];
                        console.debug("Token Acquired: "+storage.data.accessToken);
                    }
                    verto.data.connecting = true;
                    verto.connect(connectCallback);
                }, function(err) {
                    console.error(err);
                });
            };
        });
})();
