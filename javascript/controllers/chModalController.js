/**
 * Created by danielpark on 10/13/16.
 */
(function() {
    angular.module("vertoControllers")
        .controller("chModalController", function($scope, $rootScope, storage, verto, $uibModal, ngToast) {
            $scope.storage = storage;
            $scope.callHistory = storage.data.call_history;
            $scope.chCall = function(extension) {
                storage.data.cur_call = 0;
                storage.data.onHold = false;
                if (verto.data.call) {
                    ngToast.create({
                        className : 'danger',
                        content: "<p class='toast-text'><i class='fa fa-times-circle'></i> A call is already in progress.</p>"
                    });
                    return false;
                }
                storage.data.mutedVideo = false;
                storage.data.mutedMic = false;
                storage.data.videoCall = false;
                verto.call("##1"+extension);
                storage.data.called_number = extension;
            }
        });
})();