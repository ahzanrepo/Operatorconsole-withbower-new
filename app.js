/**
 * Created by damith on 3/31/17.
 */

var opConsoleApp = angular.module('opConsoleApp', ['ngRoute', 'ui.bootstrap',
    'ui.router', 'angular-jwt', 'angular.filter', 'satellizer',
    'LocalStorageModule', 'base64', 'easypiechart', 'ngNotify', 'checklist-model']);


//app router
opConsoleApp.config(["$httpProvider", "$stateProvider", "$urlRouterProvider", "$authProvider",
    function ($httpProvider, $stateProvider, $urlRouterProvider, $authProvider) {

        //auth URL
        var authProviderUrl = 'http://userservice.app.veery.cloud/';
        $authProvider.loginUrl = authProviderUrl + 'auth/login';
        $authProvider.signupUrl = authProviderUrl + 'auth/signup';

        $urlRouterProvider.otherwise('/sign-in');
        $stateProvider.state("op-console", {
            url: "/op-console",
            templateUrl: "app/views/main-op-console.html",
            data: {
                requireLogin: true
            }
        }).state('op-console.test', {
            url: "/test",
            templateUrl: "app/views/template/test.html",
            data: {
                requireLogin: true
            }
        }).state('op-console.monitor-server-performance', {
            url: "/monitor-server-performance",
            templateUrl: "app/views/template/monitor-server-performance.html",
            data: {
                requireLogin: true
            }
        }).state('op-console.codec-management', {
            url: "/codec-management",
            templateUrl: "app/views/codec-management/codec-management.html",
            data: {
                requireLogin: true
            }
        }).state('op-console.all-company-information', {
            url: "/all-company-information",
            templateUrl: "app/views/template/all-company-information.html",
            data: {
                requireLogin: true
            }
        }).state('sign-in', {
            url: "/sign-in",
            templateUrl: "app/auth/app/views/sign-in.html",
            data: {
                requireLogin: false
            }
        }).state('op-console.package', {
            url: "/package",
            templateUrl: "app/views/template/package/package.html",
            controller: "packageController",
            data: {
                requireLogin: true
            }
        })
    }], function () {

});


//app base URL
var baseUrls = {
    'userServiceBaseUrl': 'http://userservice.app.veery.cloud/DVP/API/1.0.0.0/',
    'monitorServerUrl': 'http://monitorrestapi.app.veery.cloud/DVP/API/1.0.0.0/MonitorRestAPI/'
};

opConsoleApp.constant('baseUrls', baseUrls);

opConsoleApp.constant('config', {
    Auth_API: 'http://userservice.162.243.230.46.xip.io/',
    appVersion: 1.0,
    client_Id_secret: 'ae849240-2c6d-11e6-b274-a9eec7dab26b:6145813102144258048'
});


//authentication
//Authentication
opConsoleApp.run(function ($rootScope, loginService, $location, $state) {
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
        var requireLogin = toState.data.requireLogin;
        if (requireLogin) {
            if (!loginService.getToken()) {
                event.preventDefault();
                $state.go('sign-in');
            }
            // get me a login modal!
        }
    });
    var decodeToken = loginService.getTokenDecode();
    if (!decodeToken) {
        $state.go('sign-in');
        return
    }
});