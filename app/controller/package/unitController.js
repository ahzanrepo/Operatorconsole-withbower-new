/**
 * Created by Heshan.i on 4/11/2017.
 */

(function () {

    opConsoleApp.controller('unitController', function ($scope, ngNotify, $anchorScroll, userService) {

        $anchorScroll();

        $scope.isCollapsed = true;
        $scope.isSubCollapsed = true;
        $scope.unitAccessViewCollapsed = true;
        $scope.unitSpaceViewCollapsed = true;
        $scope.unitCodecViewCollapsed = true;
        $scope.unitAccessViewStyle = 'fa fa-chevron-down';
        $scope.unitSpaceViewStyle = 'fa fa-chevron-down';
        $scope.unitCodecViewStyle = 'fa fa-chevron-down';
        $scope.collapsedButton = 'New Unit';
        $scope.tempSpaceLimit = {};
        $scope.tempCodecLimit = {codecLimit: 0};
        $scope.agentUnitDetails = [];
        $scope.spaceUnitDetails = [];
        $scope.codecUnitDetails = [];
        $scope.searchCriteria = "";
        $scope.unitTitle = 'Create New';

        $scope.unitObj = {};


        $scope.notify = function (message, type) {
            ngNotify.set(message, {
                position: 'top',
                sticky: false,
                duration: 3000,
                type: type
            });
        };


        //-----------------Internal methods------------------------
        $scope.onClickCollapsed = function (type) {
            if(type && type === 'Update') {
                $scope.unitTitle = 'Update';
            }else{
                $scope.unitTitle = 'Create New';
            }
            $scope.isCollapsed = !$scope.isCollapsed;
            $scope.collapsedButton = $scope.isCollapsed? 'New Unit': 'Back';
        };

        $scope.onClickUnitViewCollapsed = function (type) {
            switch (type){
                case 'access':
                    $scope.unitAccessViewCollapsed = !$scope.unitAccessViewCollapsed;
                    $scope.unitSpaceViewCollapsed = true;
                    $scope.unitCodecViewCollapsed = true;
                    $scope.unitAccessViewStyle = $scope.unitAccessViewCollapsed? 'fa fa-chevron-down':'fa fa-chevron-up';
                    $scope.unitSpaceViewStyle = 'fa fa-chevron-down';
                    $scope.unitCodecViewStyle = 'fa fa-chevron-down';
                    break;
                case 'space':
                    $scope.unitAccessViewCollapsed = true;
                    $scope.unitSpaceViewCollapsed = !$scope.unitSpaceViewCollapsed;
                    $scope.unitCodecViewCollapsed = true;
                    $scope.unitAccessViewStyle = 'fa fa-chevron-down';
                    $scope.unitSpaceViewStyle = $scope.unitSpaceViewCollapsed? 'fa fa-chevron-down':'fa fa-chevron-up';
                    $scope.unitCodecViewStyle = 'fa fa-chevron-down';
                    break;
                case 'codec':
                    $scope.unitAccessViewCollapsed = true;
                    $scope.unitSpaceViewCollapsed = true;
                    $scope.unitCodecViewCollapsed = !$scope.unitCodecViewCollapsed;
                    $scope.unitAccessViewStyle = 'fa fa-chevron-down';
                    $scope.unitSpaceViewStyle = 'fa fa-chevron-down';
                    $scope.unitCodecViewStyle = $scope.unitCodecViewCollapsed? 'fa fa-chevron-down':'fa fa-chevron-up';
                    break;

                default :
                    $scope.unitAccessViewCollapsed = true;
                    $scope.unitSpaceViewCollapsed = true;
                    $scope.unitCodecViewCollapsed = true;
                    $scope.unitAccessViewStyle = 'fa fa-chevron-down';
                    $scope.unitSpaceViewStyle = 'fa fa-chevron-down';
                    $scope.unitCodecViewStyle = 'fa fa-chevron-down';
                    break;
            }
        };

        $scope.resetSubForm = function () {
            switch ($scope.unitObj.unitType){
                case 'accessLimit':
                    $scope.tempSpaceLimit = {};
                    $scope.tempCodecLimit = {codecLimit: 0};
                    $scope.unitObj.unitData = {
                        consoleAccessLimit: {
                            accessLimit: 0
                        },
                        resources: []
                    };

                    break;

                case 'spaceLimit':
                    $scope.tempSpaceLimit = {};
                    $scope.tempCodecLimit = {codecLimit: 0};
                    $scope.unitObj.unitData = {
                        spaceLimit: []
                    };

                    break;

                case 'codec':
                    $scope.tempSpaceLimit = {};
                    $scope.tempCodecLimit = {codecLimit: 0};
                    $scope.unitObj.unitData = {
                        codecLimit: []
                    };

                    break;

                default :
                    $scope.tempSpaceLimit = {};
                    $scope.tempCodecLimit = {};
                    $scope.unitObj.unitData = {};

                    break;
            }
        };

        $scope.resetForm = function () {
            $scope.unitObj = {};
        };

        $scope.cancelForm = function () {
            $scope.resetForm();
            $scope.onClickCollapsed();
        };

        $scope.editUnitData = function (unitData) {
            $scope.unitObj = unitData;
            $scope.onClickCollapsed('Update');
        };

        $scope.addSpaceLimit = function () {
            if($scope.tempSpaceLimit && $scope.tempSpaceLimit.spaceType) {
                var isSpaceLimitExist = $scope.unitObj.unitData.spaceLimit.filter(function (sLimit) {
                    if(sLimit.spaceType === $scope.tempSpaceLimit.spaceType){
                        return sLimit;
                    }
                });
                if(isSpaceLimitExist && isSpaceLimitExist.length > 0){
                    $scope.notify('Space Limit Already Added', 'warn');
                }else {
                    $scope.unitObj.unitData.spaceLimit.push($scope.tempSpaceLimit);
                    $scope.tempSpaceLimit = {};
                }
            }
        };

        $scope.removeSpaceLimit = function (index) {
            $scope.unitObj.unitData.spaceLimit.splice(index, 1);
        };

        $scope.addCodecLimit = function () {
            if($scope.tempCodecLimit && $scope.tempCodecLimit.codec) {
                var isCodecLimitExist = $scope.unitObj.unitData.codecLimit.filter(function (cLimit) {
                    if(cLimit.codec === $scope.tempCodecLimit.codec){
                        return cLimit;
                    }
                });
                if(isCodecLimitExist && isCodecLimitExist.length > 0){
                    $scope.notify('Codec Limit Already Added', 'warn');
                }else {
                    $scope.unitObj.unitData.codecLimit.push($scope.tempCodecLimit);
                    $scope.tempCodecLimit = {codecLimit: 0};
                }
            }
        };

        $scope.removeCodecLimit = function (index) {
            $scope.unitObj.unitData.codecLimit.splice(index, 1);
        };


        //-----------------External methods------------------------
        $scope.loadUnitDetails = function () {
            try{
                userService.GetAllUnits().then(function (response) {
                    if(response && response.IsSuccess){
                        response.Result.forEach(function (unit) {

                            switch (unit.unitType){
                                case 'accessLimit':
                                    $scope.agentUnitDetails.push(unit);
                                    break;
                                case 'spaceLimit':
                                    $scope.spaceUnitDetails.push(unit);
                                    break;
                                case 'codec':
                                    $scope.codecUnitDetails.push(unit);
                                    break;
                                default :
                                    break;
                            }

                        });
                    }else{
                        $scope.notify('Load Package Units Failed', 'error');
                    }
                });
            }catch(ex){
                $scope.notify('Load Package Units Failed', 'error');
            }
        };

        $scope.saveUnit = function () {
            try{
                if($scope.packageTitle === 'Update'){
                    userService.UpdateUnit($scope.unitObj).then(function (response) {
                        if (response && response.IsSuccess) {
                            $scope.loadUnitDetails();
                            $scope.notify('Update Unit Success', 'success');
                            $scope.cancelForm();
                        } else {
                            $scope.notify('Update Unit Failed', 'error');
                        }
                    });
                }else {
                    userService.CreateNewUnit($scope.unitObj).then(function (response) {
                        if (response && response.IsSuccess) {
                            $scope.loadUnitDetails();
                            $scope.notify('Create New Unit Success', 'success');
                            $scope.cancelForm();
                        } else {
                            $scope.notify('Create New Unit Failed', 'error');
                        }
                    });
                }
            }catch(ex){
                $scope.notify('Save Unit Failed', 'error');
            }
        };

        $scope.removeUnit = function (unitData) {
            try{
                userService.RemoveUnit(unitData.unitName).then(function (response) {
                    if(response && response.IsSuccess){
                        $scope.loadUnitDetails();
                        $scope.notify('Remove Unit Details Success', 'success');
                    }else{
                        $scope.notify('Remove Unit Details Failed', 'error');
                    }
                });
            }catch(ex){
                $scope.notify('Remove Unit Details Failed', 'error');
            }
        };



        $scope.loadUnitDetails();

    });

}());