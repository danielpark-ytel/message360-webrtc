/**
 * Created by danielpark on 8/4/16.
 */
'use strict';

angular.module("vertoControllers").controller("modalController", function($scope, $uibModal, ngToast) {

    $scope.callHistory = {};
    $scope.animationsEnabled = true;

    /**
     * Opens a modal so user can set Caller ID.
     */
    $scope.setCallerId = function() {
        var modalInstance = $uibModal.open({
            animation : $scope.animationsEnabled,
            templateUrl : "setCallerId.html",
            controller : "callerIdController"
        });
    };

    /**
     * Opens modal so user can view call history
     */
    $scope.viewCallHistory = function() {
        var modalInstance = $uibModal.open({
            animation : $scope.animationsEnabled,
            templateUrl : "callHistory.html",
            controller : "callHistoryController"
        })
    }
});

angular.module("vertoControllers").controller("callerIdController", function($scope, $uibModalInstance, storage, ngToast, ngAudio) {
    storage.data.notifications = true;
    $scope.user = {};
    //If there is a Caller ID number in storage, use that number.
    (function getCallerId() {
        if (storage.data.cid_number) {
            $scope.user.cid = storage.data.cid_number;
        }
    })();

    $scope.updateCallerId = function() {
        if ($scope.user.cid.length == 10) {
            storage.data.cid_number = $scope.user.cid;
        }
        $uibModalInstance.dismiss("cancel");
        ngAudio.play("../../assets/sounds/notification.mp3");
        ngToast.create("<p class='toast-text'><i class='ion-android-notifications'></i> Caller ID updated.</p>");
    };

    // $scope.setCallerID = function() {
    //
    //     /**
    //      * TODO: We need to write a function that will authenticate if this number is a valid phone number and if it is voice enabled
    //      * @params {string}
    //      */
    //     //Ex.) $http.post() request to Message360 API
    //     (function getCidNumber() {
    //         if (storage.data.cid_number) {
    //             $scope.user.caller_id = storage.data.cid_number;
    //         }
    //     })();
    //
    //     $scope.authenticateNumber = function () {
    //         //TODO: Implement this functionality later
    //         // $http.post("/auth/authenticateNumber", $scope.cid_number).then(function (response) {
    //         //     //Check if the status of the response is 0 or 1
    //         //     if (response.status == 1) {
    //         //         storage.data.cid_number = $scope.cid_number;
    //         //         ngToast.create("<p>Successfully authenticated! Number has been set</p>")
    //         //         //Create a toast saying the number is authenticated and update was successful.
    //         //     }
    //         // });
    //         storage.data.cid_number = $scope.user_caller_id;
    //         ngToast.create("<p>Caller ID updated.</p>")
    //     };
    $scope.cancel = function() {
        $uibModalInstance.dismiss("cancel");
    }
});

angular.module("vertoControllers").controller("callHistoryController", function($scope, $uibModalInstance, storage, ngToast) {
    $scope.callHistory = {};
});