/**
 * Created by Heshan.i on 4/17/2017.
 */

(function () {

    opConsoleApp.controller('createCompanyController', function ($scope, ngNotify, $anchorScroll, userService) {

        $anchorScroll();

        $scope.packageDetails = [];
        $scope.packageData = {};
        $scope.companyData = {};

        $scope.currentWizard = 1;

        $scope.wizard_1_Style = 'selected';
        $scope.wizard_2_Style = 'disabled';
        $scope.wizard_1_isDone = 1;
        $scope.wizard_2_isDone = 0;

        $scope.nextWizard = function () {
            if($scope.currentWizard === 1) {
                $scope.currentWizard++;
                $scope.wizard_2_isDone = 1;
                $scope.wizard_1_Style = 'done';
                $scope.wizard_2_Style = 'selected';
            }
        };

        $scope.previousWizard = function () {
            if($scope.currentWizard === 2) {
                $scope.currentWizard--;
                $scope.wizard_1_Style = 'selected';
                $scope.wizard_2_Style = 'done';
            }
        };

        //-----------------External methods------------------------
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