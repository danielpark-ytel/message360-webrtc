angular.module("vertoService")
    .service('preRoute', ['$rootScope', 'verto', '$state', 'ngToast', '$cookies',
        function($rootScope, verto, $state, ngToast, $cookies) {
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

            var checkLogin = function() {
                if(verto.data.connected) {
                    $state.go('dashboard');
                    console.debug("User logged in. Redirecting to dialer.");
                }
            };
            return {
                "checkVerto" : checkVerto,
                "checkLogin" : checkLogin
            };
        }]);
