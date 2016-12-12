var cidController = angular.module("vertoControllers")
    .controller("cidController", function ($scope, $rootScope, storage, verto, $http, ngToast, ngAudio) {
        $scope.callerIdNumber = "";

        $scope.updateCid = function () {
            $http({
                method: "POST",
                url: $rootScope.numberUrl,
                data: {
                    phone_number: $scope.callerIdNumber
                }
            }).then(function (response) {
                console.log(response);
                if (response.data.Message360.ResponseStatus == 1) {
                    storage.data.cid_number = $scope.callerIdNumber;
                    ngAudio.play("src/sounds/notification.mp3");
                    ngToast.create("<p class='toast-text'><i class='fa fa-info-circle'></i> Caller ID updated.</p>");
                } else {
                    ngToast.create({
                        className: 'danger',
                        content: "<p class='toast-text'><i class='fa fa-times-circle'></i> " + response.data.Message360.Errors.Error[0].Code + ": " + response.data.Message360.Errors.Error[0].Message + "</p>"
                    });
                }
            });
        };
    });

cidController.$inject = ['$scope', '$rootScope', 'storage', 'verto', '$http', 'ngToast', 'ngAudio'];