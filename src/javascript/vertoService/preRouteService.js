'use strict';

angular.module("vertoService")
    .service('preRoute', ['$rootScope', 'verto', '$state', 'ngToast',
        function($rootScope, verto, $state, ngToast) {
            /**
             * Event queue functionality? What is this going to be used for..
             */
            var checkVerto = function() {
                console.debug("Checking if connected to verto.. "+verto.data.connected);
                if(!verto.data.connected) {
                    ngToast.create({
                        className: 'warning',
                        content: "<p class='toast-text'><i class='fa fa-times-circle'></i> Reloading the page disconnects you from verto, please" +
                        " reauthenticate</p>"
                    });
                    $state.go("login");
                }
            };
            var checkCallActive = function() {

            };
            return {
                "checkVerto" : checkVerto,
            };
        }]);
