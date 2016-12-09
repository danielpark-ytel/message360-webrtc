var widgetController = angular.module("vertoControllers")
    .controller('widgetController', function ($scope, $rootScope, $http, $location, $timeout, $q, verto, storage, ngAudio) {
        //Initialize the widget content
        console.debug("widgetcontroller load");
        $scope.content = {};
        $scope.user = {};
        $scope.errors = {};
        $scope.dialpad = {};
        $scope.authenticatedNumber = false;
        function init() {
            $scope.content.showLogin = true;
            $scope.content.showDialer = false;
            $scope.content.showInCall = false;
        }

        init();
        function clearErrors() {
            $scope.errors = {};
            console.log("errors cleared");
        }

        function checkFunds() {
            $http.post($rootScope.fundUrl).then(function (response) {
                if (response.data.Message360.ResponseStatus != 1) {
                    $scope.logout();
                    $scope.errors.fundError = response.data.Message360.Errors.Error.Code + ": " + response.data.Message360.Errors.Error.Message + ".";
                    $rootScope.$broadcast('addError');
                    init();
                } else {
                    $scope.content.showInCall = false;
                    $scope.content.showDialer = true;
                }
            });
        }

        $scope.logout = function () {
            var disconnectCallback = function () {
                storage.factoryReset();
            };
            if (verto.data.call) {
                verto.hangup();
            }
            $scope.showReconnect = false;
            verto.disconnect(disconnectCallback);
            verto.hangup();
        };

        $scope.$on('addError', function () {
            $timeout(clearErrors, 4000);
        });

        $scope.authenticateNumber = function () {
            var data = {
                phone_number: $scope.user.cid
            };
            $http.post($rootScope.numberUrl, data).then(function (response) {
                if (response.data.Message360.Errors) {
                    console.log(response.data.Message360);
                    $scope.errors.cidError = response.data.Message360.Errors.Error.Code + ": " + response.data.Message360.Errors.Error.Message;
                    $rootScope.$broadcast('addError');
                    return $scope.authenticatedNumber = false;
                } else {
                    storage.data.cid_number = $scope.user.cid;
                    return $scope.authenticatedNumber = true;
                }
            });
        };

        $scope.requestToken = function () {
            var connectCallback = function (v, connected) {
                $scope.$apply(function () {
                    verto.data.connecting = false;
                    if (connected) {
                        storage.data.ui_connected = verto.data.connected;
                        storage.data.ws_connected = verto.data.connected;
                        storage.data.name = $scope.user.username;
                        storage.data.email = verto.data.email;
                        storage.data.login = verto.data.login;
                        storage.data.accessToken = verto.data.passwd;
                    }
                    if (verto.data.connected == true) {
                        $scope.content.showLogin = false;
                        $scope.content.showDialer = true;
                        console.debug("connected");
                    } else {
                        $scope.errors.serverError = "Error connecting with the server.";
                        $rootScope.$broadcast('addError');
                    }
                });
            };

            $http.post($rootScope.tokenUrl).then(function (response) {
                if (response.data.Message360.Errors) {
                    $scope.errors.authError = response.data.Message360.Errors.Error.Code + ": " + response.data.Message360.Errors.Error.Message;
                    $rootScope.$broadcast('addError');
                    return false;
                }
                else if (response.data.Message360.Message['token']) {
                    var token = response.data.Message360.Message['token'];
                    console.log("token set");
                    verto.data.login = token;
                    verto.data.passwd = token;
                    verto.data.connecting = true;
                    verto.connect(connectCallback);
                }
            }, function (err) {
                console.error(err);
            });

        };

        //Login functionality
        $scope.login = function () {
            $scope.authenticateNumber();
            $timeout(function() {
                console.log($scope.authenticatedNumber);
                if ($scope.authenticatedNumber == true) {
                    $scope.requestToken();
                } else {
                    return false;
                }
            }, 1000);
        };

        //Dialer functionality
        storage.data.notifications = true;
        storage.data.videoCall = false;
        storage.data.userStatus = 'connecting';
        storage.data.calling = false;

        $scope.call = function () {
            storage.data.cur_call = 0;
            storage.data.onHold = false;
            if (!$scope.dialpad.number) {
                $scope.errors.callError = "Please enter a ten digit number.";
                return false;
            }
            if (verto.data.call) {
                $scope.errors.callError = "There is a call in progress.";
                return false;
            }
            storage.data.mutedVideo = false;
            storage.data.mutedMic = false;
            storage.data.videoCall = false;
            var code = "wrtc";
            var countryCode = "1";
            verto.call(code + countryCode + $scope.dialpad.number);
            storage.data.called_number = $scope.dialpad.number;
            console.log(storage.data.called_number);
            $scope.content.showDialer = false;
            $scope.content.showInCall = true;
        };

        $scope.dtmf = function (number) {
            if (number == '*') {
                ngAudio.play('src/sounds/dtmf/dtmf-star.mp3');
            } else if (number == '#') {
                ngAudio.play('src/sounds/dtmf/dtmf-hash.mp3');
            } else {
                ngAudio.play('src/sounds/dtmf/dtmf-' + number + '.mp3');
            }
            if ($scope.dialpad.number !== undefined && $scope.dialpad.number !== null) {
                //Added "" just to make sure the number is treated like a string
                $scope.dialpad.number = "" + $scope.dialpad.number + number;
            } else {
                $scope.dialpad.number = "" + number;
            }
        };

        $scope.backspace = function () {
            var number = $scope.dialpad.number;
            var length = number.length;
            $scope.dialpad.number = number.substring(0, length - 1);
        };

        //In call functionality
        $scope.hold = function () {
            storage.data.onHold = !storage.data.onHold;
            verto.data.call.toggleHold();
        };

        $scope.cbMuteMic = function (event, data) {
            storage.data.mutedMic = !storage.data.mutedMic;
        };
        $scope.muteMic = verto.muteMic;

        $scope.hangup = function () {
            $timeout(function () {
                if (!verto.data.call) {
                    return;
                }
                verto.hangup();
            }, 1000);
        };

        $scope.timerRunning = false;
        $scope.startTimer = function () {
            $scope.$broadcast('timer-start');
            $scope.timerRunning = true;
        };
        $scope.stopTimer = function () {
            console.log("stopTimer function");
            $scope.$broadcast('timer-stop');
            $scope.timerRunning = false;
        };

        $rootScope.callActive = function (data, params) {
            verto.data.mutedMic = storage.data.mutedMic;
            storage.data.userStatus = "connected";
            $timeout(function () {
                $scope.startTimer();
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
                console.log("Hangup");
                $scope.stopTimer();
            });
            checkFunds();
            $scope.incall = false;
            $scope.dialpad.number = "";
            try {
                $rootScope.$digest();
            } catch (e) {
            }
        });

        $rootScope.$on("call.active", function (event, data, params) {
            $rootScope.callActive(data, params);
        });

        $rootScope.$on("call.calling", function (event, data) {
            storage.data.calling = true;
        });

    });

widgetController.$inject = ['$scope', '$rootScope', '$http', '$location', '$timeout', '$q', 'verto', 'storage', 'ngAudio'];