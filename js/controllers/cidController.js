(function() {
	angular.module("vertoControllers")
	.controller("cidController", function($scope, $rootScope, storage, verto, $http, ngToast, ngAudio) {
		$scope.callerIdNumber = "";
		$scope.updateCid = function() {
            var url = window.location.origin + "/webrtc_client/lib/authenticateNumber.php";
            $http({
                method: "POST",
                url: url,
                data: {
                    phone_number: $scope.callerIdNumber
                }
            }).then(function(response) {
                if (response.data.Message360.ResponseStatus == 1) {
                    storage.data.cid_number = $scope.callerIdNumber;
                    ngAudio.play("assets/sounds/notification.mp3");
                    ngToast.create("<p class='toast-text'><i class='ion-android-notifications'></i> Caller ID updated.</p>");
                }
                else {
                    ngToast.create({
                        className : 'danger',
                        content: "<p class='toast-text'><i class='fa fa-times-circle'></i> "+response.data.Message360.Errors+"</p>"
                    });
                }
            });
        };
	});
})();