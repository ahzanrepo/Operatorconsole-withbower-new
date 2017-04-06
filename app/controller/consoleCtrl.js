/**
 * Created by damith on 3/31/17.
 */

'use strict';
opConsoleApp.controller('consoleCtrl', function ($scope,
                                                 userProfileServices,
                                                 loginService,
                                                 $state) {

    //get current login user
    //02.get current profile data
    $scope.CurrentProfile = {};
    var loadCurrentProfile = function (username) {
        userProfileServices.getMyProfile().then(function (data) {
            if (data.IsSuccess) {
                $scope.CurrentProfile = data.Result;
                console.log($scope.CurrentProfile);
            }
            else {
                console.log(data);
            }

        }, function (err) {
            console.log(err);
        });
    };
    loadCurrentProfile();

    //go to navigation
    $scope.goToNavigation = function (nav) {
        switch (nav) {
            case 'serverPerformance':
                $state.go('op-console.monitor-server-performance');
                break;
            case 'companyInfo':
                $state.go('op-console.all-company-information');
                break;
            case 'package':
                $state.go('op-console.package');
                break;
        }
    };

    //logout
    $scope.isLogingOut = false;
    $scope.logOut = function () {
        $scope.isLogingOut = true;
        loginService.Logoff(function () {
            $scope.isLogingOut = false;
            $state.go('sign-in');
        });
    };
});