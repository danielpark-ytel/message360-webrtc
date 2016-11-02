/**
 * Main Controller
 * The controller to run sets up configuration, etc.
 **/

(function () {
    'use strict';
    angular.module("vertoControllers").controller("mainController", function ($scope, $rootScope, $http, $location, $timeout, $q, verto, storage, $state, prompt, ngToast, callHistory, ngAudio, $uibModal) {
        if (storage.data.language && storage.data.language !== 'browse') {
            storage.data.language = 'browser';
        }
        $scope.verto = verto;
        $scope.storage = storage;
        $scope.showReconnect = true;
        $rootScope.dialpadNumber = "";
        $scope.callHistory = [];

        /**
         * IMPORTANT: Set the url which points to the location of your helper library script to obtain an access token.
         * This should be the location of the script on your web server, for example: 'https://www.yourdomain.com/accessToken.php'
         */
        var tokenUrl = "";

        /**
         * Request to server for accessToken
         **/
        $scope.login = function () {
            var connectCallback = function (v, connected) {
                $scope.$apply(function () {
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
                    if (verto.data.connected == true) {
                        $state.go("dashboard");
                    } else {
                        ngToast.create({
                            className: 'danger',
                            content: "<p class='toast-text'><i class='fa fa-times-circle'></i> There was an error connecting to the server.</p>"
                        });
                    }
                });
            };
            $http.post(tokenUrl).then(function (response) {
                if (response.data.Message360.Error) {
                    ngToast.create({
                        className: 'danger',
                        content: "<p class='toast-text'><i class='fa fa-info-circle'></i>" + response.data.Message360.Error + "</p>"
                    });
                    return false;
                } else if (response.data.Message360.Message['token']) {
                    var token = response.data.Message360.Message['token'];
                    verto.data.login = token;
                    verto.data.passwd = token;
                }
                verto.data.connecting = true;
                verto.connect(connectCallback);
            }, function (err) {
                if (err) {
                    ngToast.create({
                        className: 'warning',
                        content: "<p class='toast-text'><i class='fa fa-info-circle'></i> The Message360 SDK for authentication is not set up properly.</p>"
                    });
                }
            });
        };

        //Logout the user from the server and redirect to login page.
        $rootScope.logout = function () {
            var disconnectCallback = function () {
                storage.factoryReset();
                $state.go("login");
            };
            if (verto.data.call) {
                verto.hangup();
            }
            $scope.showReconnect = false;
            verto.disconnect(disconnectCallback);
            verto.hangup();
            ngToast.create("<p class='toast-text'><i class='ion-android-notifications'></i> Successfully logged out!</p>");
        };

        $rootScope.openModal = function (templateUrl, controller, _opts) {
            var opts = {
                animation: true,
                templateUrl: templateUrl,
                controller: "wsReconnectController",
                size: 'sm'
            };
            angular.extend(opts, _opts);
            var modalInstance = $uibModal.open(opts);
            modalInstance.result.then(function (result) {}, function () {})
        };

        var settingsInstance;
        $rootScope.openSettings = function (type) {
            var options = {
                animation: true,
                controller: "sidemenuController",
                size: "sm"
            };
            if (type == "video") {
                options.templateUrl = "src/modals/videoSettingsModal.html";
            }
            if (type == "audio") {
                options.templateUrl = "src/modals/audioSettingsModal.html";
            }
            if (type == "speaker") {
                options.templateUrl = "src/modals/speakerSettingsModal.html";
            }
            settingsInstance = $uibModal.open(options);
        };

        $rootScope.openSettingsModal = function () {
            var options = {
                animation: true,
                controller: "sidemenuController",
                size: "md",
                templateUrl: "src/modals/settingsModal.html"
            };
            settingsInstance = $uibModal.open(options);
        };

        $rootScope.closeSettings = function () {
            if (settingsInstance == null) {
                return;
            } else {
                settingsInstance.close();
                settingsInstance = null;
            }
        };

        /**
         * Updates the display adding the number pressed.
         *
         * @param {String} number - Number touched on dialer.
         */
        $rootScope.dtmf = function (number) {
            if (number == '*') {
                ngAudio.play('assets/sounds/dtmf/dtmf-star.mp3');
            } else if (number == '#') {
                ngAudio.play('assets/sounds/dtmf/dtmf-hash.mp3');
            } else {
                ngAudio.play('assets/sounds/dtmf/dtmf-' + number + '.mp3');
            }
            $rootScope.dialpadNumber = $scope.dialpadNumber + number;
            if (verto.data.call) {
                verto.dtmf(number);
            }
        };

        $rootScope.callActive = function (data, params) {
            verto.data.mutedMic = storage.data.mutedMic;
            if (!storage.data.cur_call) {
                storage.data.call_start = new Date();
            }
            storage.data.userStatus = "connected";
            var call_start = new Date(storage.data.call_start);
            $rootScope.start_time = call_start;
            $timeout(function () {
                $scope.$broadcast("timer-start");
                $scope.incall = true;
            });
            storage.data.calling = false;
            storage.data.cur_call = 1;
        };

        /**
         * Event handlers
         */
        $rootScope.$on("call.hangup", function (event, data) {
            $timeout(function () {
                $scope.$broadcast('timer-clear');
                $scope.$broadcast('timer-stop');
                $scope.$broadcast('timer-reset');
            });
            $scope.incall = false;
            storage.data.numOfCalls += 1;
            callHistory.addCall(storage.data.called_number, 'Outbound', true);
            $scope.callHistory = storage.data.call_history;
            $rootScope.dialpadNumber = "";
            try {
                $rootScope.$digest();
            } catch (e) {}
        });

        $rootScope.$on("call.active", function (event, data, params) {
            $rootScope.callActive(data, params);
        });

        $rootScope.$on("call.calling", function (event, data) {
            storage.data.calling = true;
        });

        $rootScope.$on("call.incoming", function (event, data) {
            storage.data.cur_call = 0;
            $scope.incomingCall = true;
            storage.data.videoCall = false;
            storage.data.mutedMic = false;
            storage.data.mutedVideo = false;

            prompt({
                title: "Incoming call from " + data,
            }).then(function () {
                var call_start = new Date(storage, data.call_start);
                $rootScope.start_time = call_start;
                $scope.answerCall();
                storage.data.called_number = data;
                $state.go('incall');
            }, function () {
                $scope.declineCall();
            });
        });


        $scope.hold = function () {
            storage.data.onHold = !storage.data.onHold;
            verto.data.call.toggleHold();
        };

        $scope.cbMuteMic = function (event, data) {
            storage.data.mutedMic = !storage.data.mutedMic;
        };
        $scope.muteMic = verto.muteMic;

        $scope.hangup = function () {
            if (!verto.data.call) {
                return;
            }
            verto.hangup();
            $rootScope.$broadcast('stop-timer');
        };

        var modalInstance;
        $scope.openChModal = function () {
            var options = {
                animation: true,
                controller: "chModalController",
                size: "md",
                templateUrl: "src/modals/callHistoryModal.html"
            };
            modalInstance = $uibModal.open(options);
        };

        /**
         * Handling multiple websockets errors.
         */
        $rootScope.$on('ws.close', onWSClose);
        $rootScope.$on('ws.login', onWSLogin);

        var wsInstance;

        function onWSClose(event, data) {
            if (wsInstance) {
                return;
            };
            var options = {
                backdrop: 'static',
                keyboard: false
            };
            if ($scope.showReconnect) {
                wsInstance = $scope.openModal("src/partials/websocket_error.html", "wsReconnectController", options);
            };
            if (verto.data.call) {
                verto.hangup();
            }
        };

        function onWSLogin(event, data) {
            if (!wsInstance) {
                return;
            }
            wsInstance.close();
            wsInstance = null;
        }

        //End websocket errors.

        $scope.answerCall = function () {
            storage.data.onHold = false;
            verto.data.call.answer({
                useStereo: storage.data.useStereo,
                useCamera: storage.data.selectedVideo,
                useVideo: storage.data.useVideo,
                useMic: storage.data.useMic,
                callee_id_name: verto.data.name,
                callee_id_number: verto.data.login
            });
        };
    });
})();