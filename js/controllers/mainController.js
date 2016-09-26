/**
 * Main Controller
 * The controller to run sets up configuration, etc.
 **/

(function() {
    'use strict';
    angular.module("vertoControllers").controller("mainController",
        function($scope, $rootScope, $location, $timeout, $q, verto, storage, $state, prompt, ngToast, callHistory, ngAudio) {
            console.debug("Executing Main Controller");
            if(storage.data.language && storage.data.language !== 'browse') {
                storage.data.language = 'browser';
            }
            $scope.verto = verto;
            $scope.storage = storage;

            /**
             * The number that will be called.
             * @type {String}
             */
            $rootScope.dialpadNumber = "";
            //Logout the user from the server and redirect to login page.
            $rootScope.logout = function() {
                var disconnect = function() {
                    var disconnectCallback = function(v, connected) {
                        console.debug("Logging out..");
                        storage.reset();
                        storage.factoryReset();
                        $state.go("login");
                    };
                    verto.disconnect(disconnectCallback);
                    verto.hangup();
                };
                disconnect();
                ngToast.create("<p>Successfully logged out!</p>");
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
                });
                storage.data.calling = false;
                storage.data.cur_call = 1;
            };

            /**
             * Event handlers
             */
            $rootScope.$on("call.hangup", function(event, data) {
                //Reset the timer
                $scope.$broadcast("timer-reset");
                //Reset dialpad number
                storage.data.numOfCalls += 1;
                callHistory.addCall(storage.data.called_number, 'Outbound', true);
                $scope.call_history = storage.data.call_history;
                $rootScope.dialpadNumber = "";
                console.debug("Going back to dialer..");
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

            $scope.hold = function() {
                storage.data.onHold = !storage.data.onHold;
                verto.data.call.toggleHold();
            };

            $scope.hangup = function() {
                if (!verto.data.call) {
                    $state.go("dialer");
                    return;
                }
                if ($rootScope.watcher) {
                    window.close();
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
            console.log(verto.data);
        });
})();
