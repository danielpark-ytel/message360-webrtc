angular.module("vertoControllers")
    .controller("cidController", function ($scope, $rootScope, storage, verto, $http, ngToast, ngAudio) {
        $scope.callerIdNumber = "";

        /**
         * IMPORTANT: Set the url which points to the location of your helper library script to authenticate your caller ID number.
         * This should be the location of the script on your web server, for example: 'https://www.yourdomain.com/authenticateNumber.php'
         */
        var numberUrl = "lib/authenticate-number.php";

        $scope.updateCid = function () {
            $http({
                method: "POST",
                url: numberUrl,
                data: {
                    phone_number: $scope.callerIdNumber
                }
            }).then(function (response) {
                console.log(response);
                if (response.data.Message360.ResponseStatus == 1) {
                    storage.data.cid_number = $scope.callerIdNumber;
                    ngAudio.play("assets/sounds/notification.mp3");
                    ngToast.create("<p class='toast-text'><i class='ion-android-notifications'></i> Caller ID updated.</p>");
                } else {
                    ngToast.create({
                        className: 'danger',
                        content: "<p class='toast-text'><i class='fa fa-times-circle'></i> " + response.data.Message360.Errors.Error[0].Message + "</p>"
                    });
                }
            });
        };
    });

cidController.$inject = ['$scope', '$rootScope', 'storage', 'verto', '$http', 'ngToast', 'ngAudio'];
