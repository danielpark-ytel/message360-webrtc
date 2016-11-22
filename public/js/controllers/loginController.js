angular.module("vertoControllers")
    .controller("loginController", function (preRoute) {
        preRoute.checkLogin();
    });

loginController.$inject = ['preRoute'];
