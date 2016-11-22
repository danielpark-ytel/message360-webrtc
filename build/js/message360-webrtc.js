var app = angular.module("vertoApp", [
    "ngStorage",
    "ui.bootstrap",
    "ngAnimate",
    "ui.router",
    "vertoControllers",
    'pascalprecht.translate',
    'timer',
    "cgPrompt",
    'ngToast',
    'ngAudio',
    'ngCookies',
    'angularMoment'
]);

app.config(["$stateProvider", "$urlRouterProvider", "$translateProvider", function ($stateProvider, $urlRouterProvider, $translateProvider) {
    $stateProvider
        .state("loading", {
            url: '/',
            templateUrl: 'public/views/partials/load_screen.html',
            controller: "loadScreenController",
            title: "Loading..."
        })
        .state("login", {
            url: "/login",
            templateUrl: "public/views/partials/login.html",
            controller: "loginController",
            title: "Welcome!"
        })
        .state("dashboard", {
            url: "/dashboard",
            templateUrl: "public/views/partials/dashboard.html",
            title: "Dashboard"
        });
    $urlRouterProvider.otherwise("/");
    $translateProvider
        .preferredLanguage('en')
        .determinePreferredLanguage()
        .fallbackLanguage('en')
        .useSanitizeValueStrategy(null);
}]);

app.config(["ngToastProvider", function (ngToastProvider) {
    ngToastProvider.configure({
        additionalClasses: "animated zoomInRight",
    });
}]);

/**
 * Customer filter to display formatted phone number
 * Returns a modified string
 */
app.filter("phoneFilter", function () {

    return function (tel) {
        if (!tel) {
            return '';
        }

        var value = tel.toString().trim().replace(/^\+/, '');

        if (value.match(/[^0-9]/)) {
            return tel;
        }

        var country, city, number;

        switch (value.length) {
            case 10: // +1PPP####### -> C (PPP) ###-####
                country = 1;
                city = value.slice(0, 3);
                number = value.slice(3);
                break;

            case 11: // +CPPP####### -> CCC (PP) ###-####
                country = value[0];
                city = value.slice(1, 4);
                number = value.slice(4);
                break;

            case 12: // +CCCPP####### -> CCC (PP) ###-####
                country = value.slice(0, 3);
                city = value.slice(3, 5);
                number = value.slice(5);
                break;

            default:
                return tel;
        }

        number = number.slice(0, 3) + '-' + number.slice(3);

        return (country + " (" + city + ") " + number).trim();
    };
});
app.run(["$rootScope", "$location", function ($rootScope, $location) {
    window.onbeforeunload = function (e) {
        window.location.ref = "/";
    }
}]);;
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
;
var vertoService = angular.module("vertoService", []);

/* Controllers */
var videoQuality = [];
var videoQualitySource = [
    {id: 'qvga', label: 'QVGA 320x240', width: 320, height: 240},
    {id: 'vga', label: 'VGA 640x480', width: 640, height: 480},
    {id: 'qvga_wide', label: 'QVGA WIDE 320x180', width: 320, height: 180},
    {id: 'vga_wide', label: 'VGA WIDE 640x360', width: 640, height: 360},
    {id: 'hd', label: 'HD 1280x720', width: 1280, height: 720},
    {id: 'hhd', label: 'HHD 1920x1080', width: 1920, height: 1080}
];
var videoResolution = {
    qvga: {width: 320, height: 240},
    vga: {width: 640, height: 480},
    qvga_wide: {width: 320, height: 180},
    vga_wide: {width: 640, height: 360},
    hd: {width: 1280, height: 720},
    hhd: {width: 1920, height: 1080}
};
var bandwidth = [
    {id: '250', label: '250kb'},
    {id: '500', label: '500kb'},
    {id: '1024', label: '1mb'},
    {id: '1536', label: '1.5mb'},
    {id: '2048', label: '2mb'},
    {id: '3196', label: '3mb'},
    {id: '4192', label: '4mb'},
    {id: '5120', label: '5mb'},
    {id: '0', label: 'No Limit'},
    {id: 'default', label: 'Server Default'}
];
var framerate = [
    {id: '15', label: '15 FPS'},
    {id: '20', label: '20 FPS'},
    {id: '30', label: '30 FPS'}
];

var vertoService = angular.module('vertoService', []);

vertoService.service('verto', ['$rootScope', '$state', 'storage', '$location', function ($rootScope, $state, storage, $location) {
    var data = {
        // Connection data.
        instance: null,
        connected: false, // Call data.
        call: null,
        shareCall: null,
        callState: null,
        conf: null,
        confLayouts: [],
        confRole: null,
        chattingWith: null,
        liveArray: null, // Settings data.
        videoDevices: [],
        audioDevices: [],
        shareDevices: [],
        speakerDevices: [],
        videoQuality: [],
        extension: null,
        name: storage.data.name || null,
        cid: storage.data.cid || null,
        textTo: null,
        login: null,
        passwd: null,
        hostname: "message360.com",
        wsURL: "wss://id953la.message360.com:8082"
    };

    function cleanCall() {
        data.call = null;
        data.callState = null;
        data.conf = null;
        data.confLayouts = [];
        data.confRole = null;
        data.chattingWith = null;
        $rootScope.$emit('call.hangup', 'hangup');
    }

    function inCall() {
        $rootScope.$emit('page.incall', 'call');
    }

    function callActive(last_state, params) {
        $rootScope.$emit('call.active', last_state, params);
    }

    function calling() {
        $rootScope.$emit('call.calling', 'calling');
    }

    function incomingCall(number) {
        $rootScope.$emit('call.incoming', number);
    }

    function updateResolutions(supportedResolutions) {
        console.debug('Attempting to sync supported and available resolutions');
        //var removed = 0;
        console.debug("VQ length: " + videoQualitySource.length);
        console.debug(supportedResolutions);
        angular.forEach(videoQualitySource, function (resolution, id) {
            angular.forEach(supportedResolutions, function (res) {
                var width = res[0];
                var height = res[1];
                if (resolution.width == width && resolution.height == height) {
                    videoQuality.push(resolution);
                }
            });
        });
        // videoQuality.length = videoQuality.length - removed;
        console.debug("VQ length 2: " + videoQuality.length);
        data.videoQuality = videoQuality;
        console.debug(videoQuality);
        data.vidQual = (videoQuality.length > 0) ? videoQuality[videoQuality.length - 1].id : null;
        console.debug(data.vidQual);
        return videoQuality;
    }

    var callState = {
        muteMic: false,
        muteVideo: false
    };
    return {
        data: data,
        callState: callState, // Options to compose the interface.
        videoQuality: videoQuality,
        videoResolution: videoResolution,
        bandwidth: bandwidth,
        framerate: framerate,
        refreshDevicesCallback: function refreshDevicesCallback(callback) {
            data.videoDevices = [
                {id: 'none', label: 'No Camera'}
            ];
            data.shareDevices = [
                {id: 'screen', label: 'Screen'}
            ];
            data.audioDevices = [];
            data.speakerDevices = [];
            if (!storage.data.selectedShare) {
                storage.data.selectedShare = data.shareDevices[0]['id'];
            }
            for (var i in jQuery.verto.videoDevices) {
                var device = jQuery.verto.videoDevices[i];
                if (!device.label) {
                    data.videoDevices.push({id: 'Camera ' + i, label: 'Camera ' + i});
                }
                else {
                    data.videoDevices.push({id: device.id, label: device.label || device.id});
                }
                // Selecting the first source.
                if (i == 0 && !storage.data.selectedVideo) {
                    storage.data.selectedVideo = device.id;
                    storage.data.selectedVideoLabel = device.label;
                }
                if (!device.label) {
                    data.shareDevices.push(
                        {id: 'Share Device ' + i, label: 'Share Device ' + i});
                    continue;
                }
                data.shareDevices.push({id: device.id, label: device.label || device.id});
            }
            for (var i in jQuery.verto.audioInDevices) {
                var device = jQuery.verto.audioInDevices[i];
                // Selecting the first source.
                if (i == 0 && !storage.data.selectedAudio) {
                    storage.data.selectedAudio = device.id;
                    storage.data.selectedAudioLabel = device.label;
                }
                if (!device.label) {
                    data.audioDevices.push({id: 'Microphone ' + i, label: 'Microphone ' + i});
                    continue;
                }
                data.audioDevices.push({id: device.id, label: device.label || device.id});
            }
            for (var i in jQuery.verto.audioOutDevices) {
                var device = jQuery.verto.audioOutDevices[i];
                // Selecting the first source.
                if (i == 0 && !storage.data.selectedSpeaker) {
                    storage.data.selectedSpeaker = device.id;
                    storage.data.selectedSpeakerLabel = device.label;
                }
                if (!device.label) {
                    data.speakerDevices.push({id: 'Speaker ' + i, label: 'Speaker ' + i});
                    continue;
                }
                data.speakerDevices.push({id: device.id, label: device.label || device.id});
            }
            console.debug('Devices were refreshed, checking that we have cameras.');
            // Verify if selected devices are valid
            var videoFlag = data.videoDevices.some(function (device) {
                return device.id == storage.data.selectedVideo;
            });
            var shareFlag = data.shareDevices.some(function (device) {
                return device.id == storage.data.selectedShare;
            });
            var audioFlag = data.audioDevices.some(function (device) {
                return device.id == storage.data.selectedAudio;
            });
            var speakerFlag = data.speakerDevices.some(function (device) {
                return device.id == storage.data.selectedSpeaker;
            });
            if (!videoFlag) storage.data.selectedVideo = data.videoDevices[0].id;
            if (!shareFlag) storage.data.selectedShare = data.shareDevices[0].id;
            if (!audioFlag) storage.data.selectedAudio = data.audioDevices[0].id;
            if (!speakerFlag && data.speakerDevices.length > 0) storage.data.selectedSpeaker = data.speakerDevices[0].id;
            // This means that we cannot use video!
            if (data.videoDevices.length === 0) {
                console.log('No camera, disabling video.');
                data.canVideo = false;
                data.videoDevices.push({id: 'none', label: 'No camera'});
            }
            else {
                data.canVideo = true;
            }
            if (angular.isFunction(callback)) {
                callback();
            }
        },

        refreshDevices: function (callback) {
            console.debug('Attempting to refresh the devices.');
            if (callback) {
                jQuery.verto.refreshDevices(callback);
            }
            else {
                jQuery.verto.refreshDevices(this.refreshDevicesCallback);
            }
        },

        /**
         * Updates the video resolutions based on settings.
         */
        refreshVideoResolution: function (resolutions) {
            console.debug('Attempting to refresh video resolutions.');
            if (data.instance) {
                var w = resolutions['bestResSupported'][0];
                var h = resolutions['bestResSupported'][1];
                if (h === 1080) {
                    w = 1280;
                    h = 720;
                }
                updateResolutions(resolutions['validRes']);
                data.instance.videoParams({
                    minWidth: w
                    , minHeight: h
                    , maxWidth: w
                    , maxHeight: h
                    , minFrameRate: 15
                    , vertoBestFrameRate: storage.data.bestFrameRate
                });
                videoQuality.forEach(function (qual) {
                    if (w === qual.width && h === qual.height) {
                        if (storage.data.vidQual !== qual.id || storage.data.vidQual === undefined) {
                            storage.data.vidQual = qual.id;
                        }
                    }
                });
            }
            else {
                console.debug('There is no instance of verto.');
            }
        },

        /**
         * Connects to the verto server. Automatically calls `onWSLogin`
         * callback set in the verto object.
         *
         * @param callback
         */
        connect: function (callback) {
            console.debug('Attempting to connect to verto.');
            var that = this;
            var callbacks = {
                onWSLogin: function (v, success) {
                    data.connected = success;
                    $rootScope.$emit('ws.login', success);
                    console.debug('Connected to verto server:', success);
                    if (angular.isFunction(callback)) {
                        callback(v, success);
                    }
                },
                onDialogState: function (d) {
                    if (!data.call) {
                        data.call = d;
                    }
                    console.debug('onDialogState:', d);
                    console.debug(storage.data.calling);
                    console.log(data.callState);
                    switch (d.state.name) {
                        case "ringing":
                            incomingCall(d.params.caller_id_number);
                            break;
                        case "trying":
                            console.debug('Calling:', d.cidString());
                            data.callState = 'trying';
                            break;
                        case "early":
                            calling();
                            console.debug('Talking to:', d.cidString());
                            data.callState = 'early';
                            break;
                        case "active":
                            console.debug('Talking to:', d.cidString());
                            data.callState = 'active';
                            callActive(d.lastState.name, d.params);
                            break;
                        case "hangup":
                            console.debug('Call ended with cause: ' + d.cause);
                            data.callState = 'hangup';
                            break;
                        case "destroy":
                            console.debug('Destroying: ' + d.cause);
                            cleanCall();
                            break;
                        default:
                            console.warn('Got a not implemented state:', d.state);
                            break;
                        case "requesting":
                            console.log(d);
                            data.callState = "requesting";
                            console.debug("Requesting: ");
                            break;
                    }
                },
                onWSClose: function (v, success) {
                    console.debug('onWSClose:', success);
                    $rootScope.$emit('ws.close', success);
                },
                onEvent: function (v, e) {
                    console.log(data.instance.handleMessage);
                }
            };

            var that = this;

            function ourBootstrap() {
                //Generating sessid
                var sessid = $location.search().sessid;
                if (sessid === 'random') {
                    sessid = $.verto.genUUID();
                    $location.search().sessid = sessid;
                }
                // Checking if we have a failed connection attempt before
                // connecting again.
                if (data.instance && !data.instance.rpcClient.socketReady()) {
                    clearTimeout(data.instance.rpcClient.to);
                    data.instance.logout();
                    data.instance.login();
                    return;
                }
                data.instance = new jQuery.verto({
                    login: data.login + '@' + data.hostname,
                    passwd: data.passwd,
                    socketUrl: data.wsURL,
                    tag: "webcam",
                    ringFile: "sounds/bellring.wav",
                    userVariables: {name: data.name},
                    audioParams: {
                        googEchoCancellation: storage.data.googEchoCancellation || true,
                        googNoiseSuppression: storage.data.googNoiseSuppression || true,
                        googHighpassFilter: storage.data.googHighpassFilter || true
                    },
                    sessid: sessid,
                    iceServers: storage.data.useSTUN
                }, callbacks);
                // We need to know when user reloaded page and not react to
                // verto events in order to not stop the reload and redirect user back
                // to the dialpad.
                that.reloaded = false;
                jQuery.verto.unloadJobs.push(function () {
                    that.reloaded = true;
                });
                data.instance.deviceParams({
                    useCamera: storage.data.selectedVideo,
                    useSpeak: storage.data.selectedSpeaker,
                    useMic: storage.data.selectedAudio,
                    onResCheck: that.refreshVideoResolution
                });
            }

            if (data.mediaPerm) {
                ourBootstrap();
            } else {
                $.FSRTC.checkPerms(ourBootstrap, true, true);
            }
        },

        mediaPerm: function (callback) {
            $.FSRTC.checkPerms(callback, true, true);
        },

        /**
         * Login the client.
         *
         * @param callback
         */
        login: function (callback) {
            data.instance.loginData({
                login: data.login + '@' + data.hostname,
                passwd: data.password
            });
            data.instance.login();
            if (angular.isFunction(callback)) {
                callback(data.instance, true);
            }
        },

        /**
         * Disconnects from the verto server. Automatically calls `onWSClose`
         * callback set in the verto object.
         *
         * @param callback
         */
        disconnect: function (callback) {
            console.debug('Attempting to disconnect to verto.');
            data.instance.logout();
            data.connected = false;
            console.debug('Disconnected from verto server.');
            if (angular.isFunction(callback)) {
                callback(data.instance, data.connected);
            }
        },

        /**
         * Make a call.
         *
         * @param callback
         */
        call: function (destination, callback, custom) {
            console.debug('Attempting to call destination ' + destination + '.');
            var call = data.instance.newCall(angular.extend({
                destination_number: destination,
                caller_id_name: storage.data.cid_number,
                caller_id_number: storage.data.cid_number,
                outgoingBandwidth: storage.data.outgoingBandwidth,
                incomingBandwidth: storage.data.incomingBandwidth,
                useVideo: storage.data.useVideo,
                useStereo: storage.data.useStereo,
                useCamera: storage.data.selectedVideo,
                useSpeak: storage.data.selectedSpeaker,
                useMic: storage.data.selectedAudio,
                dedEnc: storage.data.useDedenc,
                mirrorInput: storage.data.mirrorInput,
                userVariables: {name: storage.data.name}
            }, custom));
            data.call = call;
            data.mutedMic = false;
            data.mutedVideo = false;
            this.refreshDevices();
            if (angular.isFunction(callback)) {
                callback(data.instance, call);
            }
        },

        /**
         * Hangup the current call.
         *
         * @param callback
         */
        hangup: function (callback) {
            console.debug('Attempting to hangup the current call.');
            if (!data.call) {
                console.debug('There is no call to hangup.');
                return false;
            }
            data.call.hangup();
            if (data.conf) {
                data.conf.destroy();
                data.conf = null;
            }
            console.debug('Message: Call was hung up.');
            if (angular.isFunction(callback)) {
                callback(data.instance, true);
            }
        },

        /**
         * Send a DTMF to the current call.
         *
         * @param {string|integer} number
         * @param callback
         */
        makeCall: function (number, callback) {
            console.debug('Attempting to make a call to "' + number + '".');
            if (!data.call) {
                console.debug('There is no number to send.');
                return false;
            }
            data.call.makeCall(number);
            console.debug('The request was sent for the call.');
            if (angular.isFunction(callback)) {
                callback(data.instance, true);
            }
        },

        /**
         * Send a DTMF to the current call
         *
         * @param{string|integer} number
         * @param callback
         */
        dtmf: function (number, callback) {
            console.debug("DTMF: " + number);
            if (!data.call) {
                console.debug("No call to send the number to");
                return false;
            }
            data.call.dtmf(number);
            console.debug("The DTMF was sent for the call");
            if (angular.isFunction(callback)) {
                callback(data, instance);
            }
        },

        /**
         * Mute the microphone for the current call.
         *
         * @param callback
         */
        muteMic: function (callback) {
            if (!data.call) {
                return false;
            }
            console.debug("Toggling mute for the call.");
            data.call.setMute('toggle');
            data.mutedMic = !data.mutedMic;
            if (angular.isFunction(callback)) {
                callback(data.instance, true);
            }
        },

        /**
         * Mute the video for the current call.
         *
         * @param callback
         */
        muteVideo: function (callback) {
            console.debug('Attempting to mute video for the current call.');
            if (!data.call) {
                console.debug('There is no call to mute.');
                return false;
            }
            data.call.dtmf('*0');
            data.mutedVideo = !data.mutedVideo;
            console.debug('The video was muted for the call.');
            if (angular.isFunction(callback)) {
                callback(data.instance, true);
            }
        }

    }
}]);
angular.module("vertoService")
.service('eventQueue', ['$rootScope', '$q', 'storage', 'verto',
    function($rootScope, $q, storage, verto) {
        /**
         * Event queue functionality? What is this going to be used for..
         */
        var events = [];
        var next = function() {
            var fn;
            var fn_return;
            fn = events.shift();
            if (fn == undefined) {
                $rootScope.$emit("eventqueue.complete");
                return;
            }
            fn_return = fn();
            var emitNextProgress = function() {
                $rootScope.$emit("eventqueue.next");
            };
            fn_return.then(
                function() {
                    emitNextProgress();
                },
                function() {
                    emitNextProgress();
                });
        };

        var process = function() {
            $rootScope.$on("eventqueue.next", function(ev) {
                next();
            });
        };

        return {
            "next": next,
            "process": process,
            "events": events
        };
    }
]);
var callHistory = angular.module("vertoService").factory("callHistory", ["storage", function(storage) {
    var addCall = function(number, direction, status, call_start) {
        console.log("Adding call to call_history");
        var callInfo = {
            'dialedNumber': number,
            'direction' : direction,
            'status' : status,
            'call_start' : call_start
        };
        if(storage.data.call_history.length <= 7) {
            storage.data.call_history.push(callInfo);
        } else {
            storage.data.call_history.shift();
            storage.data.call_history.push(callInfo);
        }
    };
    return {
        'addCall' : addCall,
        clear : function() {
            storage.data.call_history = [];
            return storage.data.call_history;
        }
    }
}]);

callHistory.$inject = ['storage'];
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

var storageService = angular.module("storageService", ['ngStorage']);
angular.module('storageService')
    .service('loadScreen', ['$rootScope', '$q', 'storage', 'verto', '$translate',
        function($rootScope, $q, storage, verto, $translate) {

            var initializing = function() {
                return $q(function(resolve, reject) {
                    console.log("Initializing load scripts.");
                    var activity = "initialize";
                    var result = {
                        'activity' : activity,
                        'status' : 'success',
                        'soft' : false,
                        'message' : $translate.instant("Loading configuration scripts.")
                    };
                    resolve(result);
                });
            };

            var checkBrowser = function() {
                return $q(function(resolve, reject) {
                    console.log("Checking browser compatibility");
                    var activity = 'checkBrowser';
                    var result = {
                        'activity': activity,
                        'status': 'success',
                        'soft' : false,
                        'message': $translate.instant("Checking for browser compatibility.")
                    };
                    navigator.getUserMedia = navigator.getUserMedia ||
                        navigator.webkitGetUserMedia ||
                        navigator.mozGetUserMedia;

                    if (!navigator.getUserMedia) {
                        result['status'] = 'error';
                        result['message'] = $translate.instant("Something went wrong.");
                        reject(result);
                    }
                    resolve(result);
                });
            };

            var checkMediaPerm = function() {
                return $q(function(resolve, reject) {
                    console.log("Checking media permissions");
                    var activity = 'mediaPermissions';
                    var result = {
                        'activity': activity,
                        'status': 'success',
                        'soft' : false,
                        'message': $translate.instant("Configuring media permissions.")
                    };

                    verto.mediaPerm(function(status) {
                        if(!status) {
                            result['status'] = 'error';
                            result['message'] = $translate.instant("Something went wrong.");
                            verto.data.mediaPerm = false;
                            reject(result);
                        }
                        verto.data.mediaPerm = true;
                        resolve(result);
                    });
                });
            };

            var refreshMediaDevices = function() {
                return $q(function(resolve, reject) {
                    var activity = 'refreshingMedia';
                    var result = {
                        'status': 'success',
                        'activity': activity,
                        'soft' : true,
                        'message': $translate.instant("Re")
                    };

                    verto.refreshDevices(function(status) {
                        verto.refreshDevicesCallback(function() {
                            resolve(result);
                        });
                    });
                    console.log("Refreshing Media");

                });
            };

            var progress = [
                initializing,
                checkBrowser,
                checkMediaPerm,
                refreshMediaDevices
            ];

            var progressMessage = [
                $translate.instant("Loading configuration scripts."),
                $translate.instant("Checking for browser compatibility."),
                $translate.instant("Configuring media permissions."),
                $translate.instant("Refreshing media devices."),
            ];

            var getProgressMessage = function(currentProgress) {
                if(progressMessage[currentProgress] != undefined) {
                    return progressMessage[currentProgress];
                } else {
                    return $translate.instant("Hold on a second.");
                }
            };

            var currentProgress = -1;
            var progressPercentage = 0;

            var calculateProgress = function(index) {
                var _progress = index + 1;
                progressPercentage = (_progress / progress.length) * 100;
                return progressPercentage;
            };

            var nextProgress = function() {
                var fn, fn_return, status, interrupt, activity, soft, message, promise;
                interrupt = false;
                currentProgress++;

                if(currentProgress >= progress.length) {
                    $rootScope.$emit('progress.complete', currentProgress);
                    return;
                }

                fn = progress[currentProgress];
                fn_return = fn();

                var emitNextProgress = function(fn_return) {
                    if(fn_return['promise'] != undefined) {
                        promise = fn_return['promise'];
                    }

                    status = fn_return['status'];
                    activity = fn_return['activity'];
                    soft = fn_return['soft'];
                    message = fn_return['message'];

                    if(status != 'success') {
                        interrupt = true;
                    }

                    $rootScope.$emit('progress.next', currentProgress, status, promise, activity, soft, interrupt, message);

                };

                fn_return.then(
                    function(fn_return) {
                        emitNextProgress(fn_return);
                    },
                    function(fn_return) {
                        emitNextProgress(fn_return);
                    }
                );

            };

            return {
                'next': nextProgress,
                'getProgressMessage': getProgressMessage,
                'progress_percentage': progressPercentage,
                'calculate': calculateProgress
            };

        }]);

angular.module("storageService").service('storage', ['$rootScope', '$localStorage',
 function($rootScope, $localStorage) {
     //Declare the storage data and then the default settings we're going to use in the application.
     var data = $localStorage, defaultSettings = {
         ui_connected : false,
         ws_connected : false,
         cur_call : 0,
         called_number : '',
         useVideo : true,
         call_history : [],
         call_start : false,
         name : null,
         login : "",
         accessToken : "",
         cid_number : null,
         userStatus : 'disconnected',
         mutedVideo : true,
         mutedMic : false,
         preview : true,
         selectedVideo : null,
         selectedVideoLabel : null,
         selectedAudio : null,
         selectedAudioLabel : null,
         selectedShare : null,
         selectedSpeaker : null,
         selectedSpeakerLabel : null,
         useStereo : true,
         useSTUN : true,
         useDedenc : false,
         mirrorInput : false,
         outgoingBandwidth : 'default',
         incomingBandwidth : 'default',
         vidQual : undefined,
         askRecoverCall : false,
         googNoiseSuppression : true,
         googHighpassFilter : true,
         googEchoCancellation : true,
         autoBand : true,
         bestFrameRate : "30",
         numOfCalls : 0
     };

     data.$default(defaultSettings);

     function changeData(verto_data) {
         jQuery.extend(true, data, verto_data);
     }

     return {
         data : data,
         changeData : changeData,
         reset : function () {
             data.ui_connected = false;
             data.ws_connected = false;
             data.cur_call = 0;
             data.userStatus = 'disconnected';
         },
         factoryReset : function () {
             $localStorage.$reset();
             //Reset back to default settings
             data.$reset(defaultSettings);
         }
     }
 }]);
