var sidemenuController = angular.module("vertoControllers")
	.controller("sidemenuController", function ($scope, $rootScope, storage, verto, ngToast, preRoute) {
		preRoute.checkVerto();
		console.debug("Side Menu Controller => Preparing side menu for usage.");
		$scope.verto = verto;
		$scope.storage = storage;
		$scope.userData = {};
		$scope.update = function () {
			if ($scope.userData != {}) {
				if ($scope.userData.video) {
					storage.data.selectedVideo = $scope.userData.video.id;
					storage.data.selectedVideoLabel = $scope.userData.video.label;
				}
				if ($scope.userData.audio) {
					storage.data.selectedAudio = $scope.userData.audio.id;
					storage.data.selectedAudioLabel = $scope.userData.audio.label;
				}
				if ($scope.userData.speaker) {
					storage.data.selectedSpeaker = $scope.userData.speaker.id;
					storage.data.selectedSpeakerLabel = $scope.userData.speaker.label;
				}
				ngToast.create({
					className: "primary",
					content: "<p class='toast-text'><i class='fa fa-cogs'></i> Settings updated.</p>"
				});
				$scope.closeSettings();
			} else {
				$scope.closeSettings();
			}
		};
	});

sidemenuController.$inject = ['$scope', '$rootScope', 'storage', 'verto', 'ngToast', 'preRoute'];

