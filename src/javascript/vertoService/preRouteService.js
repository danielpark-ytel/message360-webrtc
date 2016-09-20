'use strict';

angular.module("vertoService")
    .service('preRoute', ['$rootScope', 'verto', '$state',
        function($rootScope, verto, $state) {
            /**
             * Event queue functionality? What is this going to be used for..
             */
            var checkVerto = function() {
                console.debug("Checking if connected to verto.. "+verto.data.connected);
                if(!verto.data.connected) {
                    $state.go("login");
                }
                else if(verto.data.connected) {
                    console.debug("Connected to verto, going to dialer.");
                    $state.go("dialer");
                }
            };
            return {
                "checkVerto" : checkVerto,
            };
        }]);
