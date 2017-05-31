/**
 * Created by Heshan.i on 4/17/2017.
 */

(function () {

    opConsoleApp.controller('createCompanyController', function ($scope, ngNotify, $anchorScroll, userService) {

        $anchorScroll();

        $scope.notify = function (message, type) {
            ngNotify.set(message, {
                position: 'top',
                sticky: false,
                duration: 3000,
                type: type
            });
        };

        $scope.packageDetails = [];
        $scope.unitDetails = [];
        $scope.companyDetail = undefined;
        $scope.packageData = {};
        $scope.companyData = {};

        $scope.currentWizard = 1;
        $scope.searchStatus = undefined;

        $scope.wizard_1_Style = 'selected';
        $scope.wizard_2_Style = 'disabled';
        $scope.wizard_1_isDone = 1;
        $scope.wizard_2_isDone = 0;

        $scope.resetForm = function () {
            $scope.packageDetails = [];
            $scope.unitDetails = [];
            $scope.companyDetail = undefined;
            $scope.packageData = {};
            $scope.companyData = {};

            $scope.currentWizard = 1;
            $scope.searchStatus = undefined;

            $scope.wizard_1_Style = 'selected';
            $scope.wizard_2_Style = 'disabled';
            $scope.wizard_1_isDone = 1;
            $scope.wizard_2_isDone = 0;
        };

        $scope.nextWizard = function () {
            if($scope.currentWizard === 1) {
                if($scope.wizard_2_Style === 'disabled'){
                    if($scope.companyData.companyname && $scope.companyData.mail && $scope.companyData.password && $scope.companyData.confirm){
                        if($scope.companyData.password === $scope.companyData.confirm) {
                            $scope.companyData.timeZone = {tz:moment.tz.guess(), utcOffset: ""};
                            userService.CreateNewCompany($scope.companyData).then(function (response) {
                                if (response) {

                                    $scope.getCompanyDetail(response.companyId);

                                    $scope.currentWizard++;
                                    $scope.wizard_2_isDone = 1;
                                    $scope.wizard_1_Style = 'done';
                                    $scope.wizard_2_Style = 'selected';

                                } else {

                                    $scope.notify('Save Company Failed', 'error');

                                }
                            });
                        }else{
                            $scope.notify('Password is not matched', 'warn');
                        }
                    }else {
                        //TODO : add confirm box
                        $scope.searchBoxStaus = undefined;
                        $scope.currentWizard++;
                        $scope.wizard_2_isDone = 1;
                        $scope.wizard_1_Style = 'done';
                        $scope.wizard_2_Style = 'selected';
                    }
                }else {
                    $scope.currentWizard++;
                    $scope.wizard_2_isDone = 1;
                    $scope.wizard_1_Style = 'done';
                    $scope.wizard_2_Style = 'selected';
                }
            }
        };

        $scope.previousWizard = function () {
            if($scope.currentWizard === 2) {
                $scope.currentWizard--;
                $scope.wizard_1_Style = 'selected';
                $scope.wizard_2_Style = 'done';
            }
        };

        $scope.unitChange = function () {
            $scope.packageData.unit = $scope.unitDetails[$scope.packageData.unitIndex];
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

        $scope.loadUnitDetails = function () {
            try{
                userService.GetAllUnits().then(function (response) {
                    if(response && response.IsSuccess){
                        $scope.unitDetails = response.Result;
                    }else{
                        $scope.notify('Load Unit Details Failed', 'error');
                    }
                });
            }catch(ex){
                $scope.notify('Load Unit Details Failed', 'error');
            }
        };

        $scope.getCompanyDetail = function (companyId) {
            $scope.searchStatus = undefined;
            try{
                userService.GetCompanyData(companyId).then(function (response) {
                    if(response && response.IsSuccess && response.Result){
                        $scope.companyDetail = response.Result;
                        $scope.searchStatus = 'true';
                        $scope.searchBoxStaus = $scope.companyDetail;
                    }else{
                        $scope.searchStatus = 'false';
                    }
                });
            }catch(ex){
                $scope.searchStatus = 'false';
                $scope.notify('Load Company Detail Failed', 'error');
            }
        };

        var assignPackage = function () {
            try{
                userService.AssignPackage($scope.companyDetail.id, $scope.packageData.packageName).then(function (response) {
                    if(response && response.IsSuccess){
                        $scope.notify('Load Package Success', 'success');
                    }else{
                        $scope.notify('Assign Package Failed', 'error');
                    }
                });
            }catch(ex){
                $scope.notify('Assign Package Failed', 'error');
            }
        };

        var assignUnit = function () {
            try{
                var topUpCount = $scope.packageData.topUpCount? $scope.packageData.topUpCount: 0;
                userService.AssignUnit($scope.companyDetail.id, $scope.packageData.packageName,
                    $scope.packageData.unit.unitName, topUpCount).then(function (response) {
                    if(response && response.IsSuccess){
                        $scope.notify('Load Package Success', 'success');
                    }else{
                        $scope.notify('Assign Package Failed', 'error');
                    }
                });
            }catch(ex){
                $scope.notify('Assign Package Failed', 'error');
            }
        };

        $scope.updatePackage = function () {
            if($scope.packageData.assignType && $scope.packageData.assignType === 'unit'){
                assignUnit();
            }else{
                assignPackage();
            }
        };

        $scope.loadPackageDetails();
        $scope.loadUnitDetails();
    });

}());