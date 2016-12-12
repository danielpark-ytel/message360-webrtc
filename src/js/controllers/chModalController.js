var chModalController = angular.module("vertoControllers")
    .controller("chModalController", function ($scope, $rootScope, storage, verto, $uibModal, ngToast) {
        $scope.storage = storage;
        $scope.callHistory = storage.data.call_history;
        $scope.quickCall = function(number) {
            storage.data.cur_call = 0;
            storage.data.onHold = false;
            if(verto.data.call) {
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
            verto.call(code + countryCode + number);
            storage.data.called_number = number;
        };
    });

chModalController.$inject = ['$scope', '$rootScope', 'storage', 'verto', '$uibModal', 'ngToast'];
