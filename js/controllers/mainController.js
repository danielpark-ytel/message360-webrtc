/**
 * Main Controller
 * The controller to run sets up configuration, etc.
 **/

(function() {
	'use strict';
	angular.module("vertoControllers").controller("mainController", function($scope, $rootScope, $http, $location, $timeout, $q, verto, storage, $state, prompt, ngToast, callHistory, ngAudio) {
		console.debug("Executing Main Controller");
		if(storage.data.language && storage.data.language !== 'browse') {
			storage.data.language = 'browser';
		}
		$scope.verto = verto;
		$scope.storage = storage;
		$rootScope.dialpadNumber = "";

        /**
        * Request to server for accessToken
        * Should have server side configured with
        * @param String account_sid
        * @param String auth_token
        **/
        $scope.login = function() {
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
            var url = window.location.origin + "/lib/accessToken.php";
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

		//Logout the user from the server and redirect to login page.
		$rootScope.logout = function() {
			var disconnectCallback = function() {
				console.debug("Logging out froms server.");
				storage.factoryReset();
				$state.go("login");
			};
			if(verto.data.call) {
				verto.hangup();
			}
			verto.disconnect(disconnectCallback);
			verto.hangup();
			ngToast.create("<p class='toast-text'><i class='ion-android-notifications'></i> Successfully logged out!</p>");
		};
		/**
        * Updates the display adding the number pressed.
        *
        * @param {String} number - Number touched on dialer.
        */
		$rootScope.dtmf = function(number) {
			if(number=='*') {
				ngAudio.play('assets/sounds/dtmf/dtmf-star.mp3');
			}
			else if(number=='#') {
				ngAudio.play('assets/sounds/dtmf/dtmf-hash.mp3');
			}
			else {
				ngAudio.play('assets/sounds/dtmf/dtmf-'+number+'.mp3');
			}
			$rootScope.dialpadNumber = $scope.dialpadNumber + number;
			if (verto.data.call) {
				verto.dtmf(number);
			}
		};

		$rootScope.backspace = function() {
			var number = $rootScope.dialpadNumber;
			var length = number.length;
			$rootScope.dialpadNumber = number.substring(0, length - 1);
		}

		$rootScope.callActive = function(data, params) {
			verto.data.mutedMic = storage.data.mutedMic;
			if (!storage.data.cur_call) {
				storage.data.call_start = new Date();
			}
			storage.data.userStatus = "connected";
			var call_start = new Date(storage.data.call_start);
			$rootScope.start_time = call_start;
			$timeout(function() {
				$scope.$broadcast("timer-start");
				$scope.timerRunning = true;
			});
			storage.data.calling = false;
			storage.data.cur_call = 1;
		};

		/**
        * Event handlers
        */
		$rootScope.$on("call.hangup", function(event, data) {
			//Reset the timer
			$scope.$broadcast("timer-stop");
			$scope.timerRunning = false;
			//Reset dialpad number
			storage.data.numOfCalls += 1;
			callHistory.addCall(storage.data.called_number, 'Outbound', true);
			$scope.call_history = storage.data.call_history;
			$rootScope.dialpadNumber = "";
			console.debug("Going back to dialer..");
			$scope.$broadcast("timer-reset");
			$state.go("dialer");
			try {
				$rootScope.$digest();
			} catch (e) {
				console.log("Not digested.");
			}
		});

		$rootScope.$on("call.active", function (event, data, params) {
			$rootScope.callActive(data, params);
		});

		$rootScope.$on("call.calling", function(event, data) {
			storage.data.calling = true;
		});

		$rootScope.$on("call.incoming", function(event, data) {
			console.log("Incoming call from "+data);
			storage.data.cur_call = 0;
			$scope.incomingCall = true;
			storage.data.videoCall = false;
			storage.data.mutedMic = false;
			storage.data.mutedVideo = false;

			prompt({
				title : "Incoming call from " + data,
			}).then(function() {
				var call_start = new Date(storage, data.call_start);
				$rootScope.start_time = call_start;
				console.log($rootScope.start_time);
				$scope.answerCall();
				storage.data.called_number = data;
				$state.go('incall');
			}, function() {
				$scope.declineCall();
			});
		});

		$rootScope.$on('ws.close', onWSClose);
		$rootScope.$on('ws.login', onWSLogin);

		function onWSClose(event, data) {
			//Function to add reconnection later.
			console.log(onWSClose);
		}

		function onWSLogin(event, data) {
			console.log(onWSLogin);
		}

		$scope.hold = function() {
			storage.data.onHold = !storage.data.onHold;
			verto.data.call.toggleHold();
		};

		$scope.hangup = function() {
			if (!verto.data.call) {
				$state.go("dialer");
				return;
			}
			verto.hangup();
		};

		$scope.answerCall = function() {
			storage.data.onHold = false;
			verto.data.call.answer({
				useStereo: storage.data.useStereo,
				useCamera: storage.data.selectedVideo,
				useVideo: storage.data.useVideo,
				useMic: storage.data.useMic,
				callee_id_name: verto.data.name,
				callee_id_number: verto.data.login
			});
			$state.go("incall");
		};

	});
})();
