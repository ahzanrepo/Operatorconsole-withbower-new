/**
 * Created by Heshan.i on 4/6/2017.
 */

(function () {

    opConsoleApp.controller('packageController', function ($scope, ngNotify, $anchorScroll, userService) {
        $anchorScroll();

        $scope.isCollapsed = true;
        $scope.isSubCollapsed = true;
        $scope.collapsedStyle = 'fa fa-chevron-down';
        $scope.subCollapsButton = '+';
        $scope.tempSpaceLimit = {};
        $scope.packageDetails = [];

        $scope.packageObj = {
            spaceLimit: []
        };


        $scope.notify = function (message, type) {
            ngNotify.set(message, {
                position: 'top',
                sticky: true,
                duration: 3000,
                type: type
            });
        };


        $scope.onClickCollapsed = function () {
            $scope.isCollapsed = !$scope.isCollapsed;
            $scope.collapsedStyle = $scope.isCollapsed? 'fa fa-chevron-down': 'fa fa-chevron-up';
        };

        $scope.onClickSubCollapsed = function () {
            $scope.isSubCollapsed = !$scope.isSubCollapsed;
            $scope.subCollapsButton = $scope.isSubCollapsed? '+': '-';
        };

        $scope.addSpaceLimit = function () {
            if($scope.tempSpaceLimit && $scope.tempSpaceLimit.spaceType) {
                var isSpaceLimitExist = $scope.packageObj.spaceLimit.filter(function (sLimit) {
                    if(sLimit.spaceType === $scope.tempSpaceLimit.spaceType){
                        return sLimit;
                    }
                });
                if(isSpaceLimitExist && isSpaceLimitExist.length > 0){
                    $scope.notify('Space Limit Already Added', 'warn');
                }else {
                    $scope.packageObj.spaceLimit.push($scope.tempSpaceLimit);
                    $scope.tempSpaceLimit = {};
                }
            }
        };

        $scope.removeSpaceLimit = function (index) {
            $scope.packageObj.spaceLimit.splice(index, 1);
        };


        $scope.loadPackageDetails = function () {
            try{
                userService.GetAllPackages().then(function (response) {
                    if(response && response.IsSuccess){
                        $scope.packageDetails = response.Result;
                    }else{
                        $scope.notify('Load Package Details Failed', 'error');
                    }
                });
            }catch(ex){
                $scope.notify('Load Package Details Failed', 'error');
            }
        };




        $scope.loadPackageDetails();

    });
    
}());