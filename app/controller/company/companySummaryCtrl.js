/**
 * Created by damith on 4/7/17.
 */

opConsoleApp.controller('companySummaryCtrl', function ($scope, $location, $anchorScroll, companyInfoServices, ngNotify) {
    $anchorScroll();

    var param = {};
    $scope.isDataNotFound = false;
    $scope.isLoadingAll = false;
    $scope.companyObj = null;

    // get current company details
    var getCompanySummary = function (param) {
        $scope.isLoadingAll = true;
        companyInfoServices.getCurrentCompanyById(param).then(function (data) {
            $scope.isLoadingAll = false;
            if (data.IsSuccess) {
                $scope.companyObj = data.Result;
                $scope.currentPage = 'companyProfile';
                onLoadCompanyInfo($scope.companyObj);
            }
        }, function (err) {
            console.log(err);
        });
    };

    //query string value
    param.companyId = $location.search()['id'];
    if (param.companyId) {
        getCompanySummary(param);
    } else {
        //TODO
        //invalid company ID
    }


    $scope.consoleAccessTabs = [];
    var onLoadConsoleAccess = function (companyObj) {
        $scope.consoleAccessTabs = companyObj.consoleAccessLimits.map(function (item) {
            var _consoleTab = {};
            _consoleTab.item = item;
            return _consoleTab;
        });
    };

    $scope.widgetScopeNotFound = false;
    var onLoadCompanyInfo = function (companyObj) {
        $scope.widgetScopeNotFound = false;
        if (companyObj && companyObj.ownerRef) {
            $scope.ownerRef = companyObj.ownerRef;
            $scope.ownerRef.user_scopes = $scope.ownerRef.user_scopes.map(function (item) {
                var _scope = {
                    read: (item.read) ? true : false,
                    write: (item.write) ? true : false,
                    delete: (item.delete) ? true : false,
                    scope: item.scope
                };
                return _scope;
            });
        } else {
            $scope.widgetScopeNotFound = true;
        }
    };
    var nowDate = new Date();
    nowDate = moment.utc(nowDate).format();
    var onLoadCompanyPackage = function (companyObj) {
        $scope.packageDetails = companyObj.packageDetails.map(function (item) {

            var buyDate = moment(item.buyDate);
            var currentDate = moment(nowDate);
            item.renewdate = buyDate.diff(currentDate, 'days');
            return item;
        });


    };

    //go to summary inside page
    $scope.goToCompanySummaryPage = function (page) {
        $scope.currentPage = page;
        switch (page) {
            case 'consoleAccess':
                onLoadConsoleAccess($scope.companyObj);
                break;
            case 'companyProfile':
                onLoadCompanyInfo($scope.companyObj);
                break;
            case 'companyPackage':
                onLoadCompanyPackage($scope.companyObj);
                break;

        }
    };

    //change company activation

    $scope.isChangeCompanySatate = false;
    $scope.changeCompanyActivation = function (state) {
        var param = {
            state: state,
            companyId: $scope.companyObj.id
        };
        $scope.isChangeCompanySatate = true;
        companyInfoServices.changeCompanyActivation(param).then(function (data) {
            $scope.isChangeCompanySatate = false;
            if (data.IsSuccess) {
                ngNotify.set('Company state update successfully...', {
                    position: 'top',
                    sticky: true,
                    duration: 3000,
                    type: 'success'
                });
                getCompanySummary(param);
            }

        }, function (err) {
            console.log(err);
        });
    }


});