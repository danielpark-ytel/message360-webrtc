angular.module("vertoControllers")
    .controller("loadScreenController", function ($scope, $location, $rootScope, $state, $timeout, storage, loadScreen, preRoute) {
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
    });
    
loadScreenController.$inject = ['$scope', '$location', '$rootScope', '$state', '$timeout', 'storage', 'loadScreen', 'preRoute'];
