var vertoControllers = angular.module("vertoControllers", [
    'ui.bootstrap',
    'vertoService',
    'storageService'
]);


var mainController = angular.module("vertoControllers").controller("mainController", ["$scope", "$rootScope", "$http", "$location", "$timeout", "$q", "verto", "storage", "$state", "prompt", "ngToast", "callHistory", "ngAudio", "$uibModal", "moment", function ($scope, $rootScope, $http, $location, $timeout, $q, verto, storage, $state, prompt, ngToast, callHistory, ngAudio, $uibModal, moment) {
    if (storage.data.language && storage.data.language !== 'browse') {
        storage.data.language = 'browser';
    }
    $scope.verto = verto;
    $scope.storage = storage;
    $scope.showReconnect = true;
    $rootScope.dialpad = {};
    $scope.callHistory = [];

    /**
     * IMPORTANT: Set the url which points to the location of your helper library script to obtain an access token.
     * This should be the location of the script on your web server, for example: 'https://www.yourdomain.com/accessToken.php'
     */
    var tokenUrl = 'lib/access-token.php';
    var fundUrl = 'lib/check-funds.php';

    function checkFunds() {
        $http.post(fundUrl).then(function (response) {
            if (response.data.Message360.ResponseStatus != 1) {
                $scope.logout();
                ngToast.create({
                    className: 'danger',
                    content: "<p class='toast-text'><i class='fa fa-info-circle'></i>" + response.data.Message360.Errors.Error[0].Message + "</p>"
                });
            } else {
                console.debug("Account has funds: TRUE");
            }
        });
    }

    $scope.timerRunning = false;
    $scope.startTimer = function () {
        $scope.$broadcast('timer-start');
        $scope.timerRunning = true;
    }
    $scope.stopTimer = function () {
        console.log("stopTimer function");
        $scope.$broadcast('timer-reset');
        $scope.timerRunning = false;
    }

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
            console.log(response);
            if (response.data.Message360.Errors) {
                ngToast.create({
                    className: 'danger',
                    content: "<p class='toast-text'><i class='fa fa-info-circle'></i>" + response.data.Message360.Errors.Error[0].Message + "</p>"
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
                console.log(err);
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
            options.templateUrl = "views/modals/videoSettingsModal.html";
        }
        if (type == "audio") {
            options.templateUrl = "views/modals/audioSettingsModal.html";
        }
        if (type == "speaker") {
            options.templateUrl = "views/modals/speakerSettingsModal.html";
        }
        settingsInstance = $uibModal.open(options);
    };

    $rootScope.openSettingsModal = function () {
        if (!verto.data.audioDevices.length || !verto.data.speakerDevices.length || !verto.data.audioDevices.length) {
            verto.refreshDevices();
        }
        var options = {
            animation: true,
            controller: "sidemenuController",
            size: "md",
            templateUrl: "views/modals/settingsModal.html"
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

    $rootScope.backspace = function () {
        var number = $rootScope.dialpad.number;
        var length = number.length;
        $rootScope.dialpad.number = number.substring(0, length - 1);
    };

    /**
     * Updates the display adding the number pressed.
     *
     * @param {String} number - Number touched on dialer.
     */
    $rootScope.dtmf = function (number) {
        if (number == '*') {
            ngAudio.play('public/sounds/dtmf/dtmf-star.mp3');
        } else if (number == '#') {
            ngAudio.play('public/sounds/dtmf/dtmf-hash.mp3');
        } else {
            ngAudio.play('public/sounds/dtmf/dtmf-' + number + '.mp3');
        }
        if ($rootScope.dialpad.number !== undefined && $rootScope.dialpad.number !== null) {
            //Added "" just to make sure the number is treated like a string
            $rootScope.dialpad.number = "" + $rootScope.dialpad.number + number;
        } else {
            $rootScope.dialpad.number = "" + number;
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
        storage.data.numOfCalls += 1;

        callHistory.addCall(storage.data.called_number, 'Outbound', true, $rootScope.start_time);
        $rootScope.start_time = "";
        $scope.callHistory = storage.data.call_history;
        $rootScope.dialpad.number = "";
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
        $timeout(function () {
            if (!verto.data.call) {
                return;
            }
            verto.hangup();
        }, 1000);
    };

    var modalInstance;
    $scope.openChModal = function () {
        var options = {
            animation: true,
            controller: "chModalController",
            size: "md",
            templateUrl: "views/modals/callHistoryModal.html"
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
            wsInstance = $scope.openModal("public/views/partials/websocket_error.html", "wsReconnectController", options);
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
}]);
mainController.$inject = ['$scope', '$rootScope', '$http', '$location', '$timeout', '$q', 'verto', 'storage', '$state', 'prompt', 'ngToast', 'callHistory', 'ngAudio', '$uibModal', 'moment'];
var loginController = angular.module("vertoControllers")
    .controller("loginController", ["preRoute", function (preRoute) {
        preRoute.checkLogin();
    }]);

loginController.$inject = ['preRoute'];

var loadScreenController = angular.module("vertoControllers")
    .controller("loadScreenController", ["$scope", "$location", "$rootScope", "$state", "$timeout", "storage", "loadScreen", "preRoute", function ($scope, $location, $rootScope, $state, $timeout, storage, loadScreen, preRoute) {
        preRoute.checkLogin();
        $scope.progressPercentage = loadScreen.progressPercentage;
        $scope.message = '';
        $scope.interruptNext = false;
        $scope.errors = [];

        var redirectTo = function (link, activity) {
            if (activity) {
                if (activity == 'initialize') {
                    link = activity;
                }
            }
            $location.path(link);
        };

        var checkProgressState = function (currentProgress, status, promise, activity, soft, interruptNext, message) {
            $scope.progressPercentage = loadScreen.calculate(currentProgress);
            $scope.message = message;

            if (interruptNext && status == 'error') {
                $scope.errors.push(message);
                if (!soft) {
                    redirectTo('', activity);
                    return;
                } else {
                    message = message + '. Continue?';
                }
                if (!confirm(message)) {
                    $scope.interruptNext = true;
                }
            }
            if ($scope.interruptNext) {
                return;
            }
            $scope.message = loadScreen.getProgressMessage(currentProgress + 1);
            return true;
        };

        $rootScope.$on('progress.next', function (ev, currentProgress, status, promise, activity, soft, interrupt, message) {
            $timeout(function () {
                if (promise) {
                    promise.then(function (response) {
                        message = response['message'];
                        status = response['status'];
                        if (checkProgressState(currentProgress, status, promise, activity, soft, interrupt, message)) {
                            loadScreen.next();
                        }
                    });
                    return;
                }
                if (!checkProgressState(currentProgress, status, promise, activity, soft, interrupt, message)) {
                    return;
                }
                loadScreen.next();
            }, 600);
        });

        $rootScope.$on("progress.complete", function (ev, currentProgress) {
            $scope.message = "Done configuring, going to login.";
            $timeout(function () {
                $state.go("login");
            }, 500);
        });
        loadScreen.next();
    }]);
    
loadScreenController.$inject = ['$scope', '$location', '$rootScope', '$state', '$timeout', 'storage', 'loadScreen', 'preRoute'];

var dialpadController = angular.module("vertoControllers")
    .controller("dialpadController", ["$rootScope", "$scope", "$http", "$state", "verto", "storage", "ngToast", "preRoute", function ($rootScope, $scope, $http, $state, verto, storage, ngToast, preRoute) {
        storage.data.notifications = true;
        storage.data.videoCall = false;
        storage.data.userStatus = 'connecting';
        storage.data.calling = false;

        function call(extension) {
            storage.data.cur_call = 0;
            storage.data.onHold = false;
            $rootScope.dialpad.number = extension;
            if (!$rootScope.dialpad.number) {
                ngToast.create({
                    className: 'danger',
                    content: "<p class='toast-text'><i class='fa fa-times-circle'></i> Please enter an extension.</p>"
                });
                return false;
            }
            if (verto.data.call) {
                ngToast.create({
                    className: 'danger',
                    content: "<p class='toast-text'><i class='fa fa-times-circle'></i> A call is already in progress.</p>"
                });
                return false;
            }
            if (storage.data.cid_number == null) {
                ngToast.create({
                    className: "danger",
                    content: "<p class='toast-text'><i class='fa fa-times-circle'></i> You have not yet set a Caller ID Number.</p>"
                });
                return false;
            }
            storage.data.mutedVideo = false;
            storage.data.mutedMic = false;
            storage.data.videoCall = false;
            var code = "wrtc";
            var countryCode = "1";
            verto.call(code + countryCode + $rootScope.dialpad.number);
            storage.data.called_number = extension;
        }

        /**
         * Call to the number in $rootScope.dialpadNumber
         */
        $scope.loading = false;
        $scope.cancelled = false;

        $scope.call = function (extension) {
            $scope.loading = true;
            call(extension);
        };
        $scope.cancel = function () {
            $scope.cancelled = true;
        };
    }]);
dialpadController.$inject['$rootScope', '$scope', '$http', '$state', 'verto', 'storage', 'ngToast', 'preRoute'];

var wsReconnectController = function($scope, storage, verto) {
    console.log("Executing Websocket Controller.");
}

wsReconnectController.$inject = ['$scope', 'storage', 'verto'];

angular.module('vertoControllers').controller('wsReconnectController', wsReconnectController);
var sidemenuController = angular.module("vertoControllers")
	.controller("sidemenuController", ["$scope", "$rootScope", "storage", "verto", "ngToast", "preRoute", function ($scope, $rootScope, storage, verto, ngToast, preRoute) {
		preRoute.checkVerto();
		console.debug("Side Menu Controller => Preparing side menu for usage.");
		$scope.verto = verto;
		$scope.storage = storage;
		$scope.userData = {};
		$scope.update = function () {
			if ($scope.userData != {}) {
				if ($scope.userData.video) {
					storage.data.selectedVideo = $scope.userData.video.id;
					storage.data.selectedVideoLabel = $scope.userData.video.label;
				}
				if ($scope.userData.audio) {
					storage.data.selectedAudio = $scope.userData.audio.id;
					storage.data.selectedAudioLabel = $scope.userData.audio.label;
				}
				if ($scope.userData.speaker) {
					storage.data.selectedSpeaker = $scope.userData.speaker.id;
					storage.data.selectedSpeakerLabel = $scope.userData.speaker.label;
				}
				ngToast.create({
					className: "primary",
					content: "<p class='toast-text'><i class='fa fa-cogs'></i> Settings updated.</p>"
				});
				$scope.closeSettings();
			} else {
				$scope.closeSettings();
			}
		};
	}]);

sidemenuController.$inject = ['$scope', '$rootScope', 'storage', 'verto', 'ngToast', 'preRoute'];


var chModalController = angular.module("vertoControllers")
    .controller("chModalController", ["$scope", "$rootScope", "storage", "vertoService", "$uibModal", "ngToast", function ($scope, $rootScope, storage, vertoService, $uibModal, ngToast) {
        $scope.storage = storage;
        $scope.callHistory = storage.data.call_history;
        $scope.chCall = function (extension) {
            storage.data.cur_call = 0;
            storage.data.onHold = false;
            if (vertoService.data.call) {
                ngToast.create({
                    className: 'danger',
                    content: "<p class='toast-text'><i class='fa fa-times-circle'></i> A call is already in progress.</p>"
                });
                return false;
            }
            storage.data.mutedVideo = false;
            storage.data.mutedMic = false;
            storage.data.videoCall = false;
            vertoService.call("##1" + extension);
            storage.data.called_number = extension;
        }
    }]);

chModalController.$inject = ['$scope', '$rootScope', 'storage', 'vertoService', '$uibModal', 'ngToast'];
