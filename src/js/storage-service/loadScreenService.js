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
                    function checkBrowser() {
                        var ua= navigator.userAgent, tem,
                            M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
                        if(/trident/i.test(M[1])){
                            tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
                            return 'IE '+(tem[1] || '');
                        }
                        if(M[1]=== 'Chrome'){
                            tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
                            if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
                        }
                        M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
                        if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
                        return M.join(' ');
                    }

                    var x = checkBrowser();
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
                        result['message'] = $translate.instant(x + " does not support WebRTC. Please use Firefox" +
                            " or Chrome.");
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
