/**
 * Created by damith on 3/31/17.
 */

var opConsoleApp = angular.module('opConsoleApp', ['ngRoute', 'ui.bootstrap',
    'ui.router', 'angular-jwt', 'satellizer', 'LocalStorageModule', 'base64']);


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
        }).state('sign-in', {
            url: "/sign-in",
            templateUrl: "app/auth/app/views/sign-in.html",
            data: {
                requireLogin: false
            }
        })
    }], function () {
});


//app base URL
var baseUrls = {};

opConsoleApp.constant('baseUrls', baseUrls);

opConsoleApp.constant('config', {
    Auth_API: 'http://userservice.162.243.230.46.xip.io/',
    appVersion: 1.0,
    client_Id_secret: 'ae849240-2c6d-11e6-b274-a9eec7dab26b:6145813102144258048'
});


//authentication
//Authentication
// opConsoleApp.run(function ($rootScope, loginService, $location, $state) {
//     $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
//         var requireLogin = toState.data.requireLogin;
//         if (requireLogin) {
//             if (!loginService.getToken()) {
//                 event.preventDefault();
//                // $state.go('sign-in');
//             }
//             // get me a login modal!
//         }
//     });
//     var decodeToken = loginService.getTokenDecode();
//     if (!decodeToken) {
//        /// $state.go('sign-in');
//         return
//     }
// });