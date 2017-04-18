/**
 * Created by damith on 4/7/17.
 */

opConsoleApp.controller('companySummaryCtrl', function ($scope, $location, $anchorScroll, companyInfoServices) {
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
                console.log($scope.companyObj);
                $scope.companyObj = data.Result;
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

    }


    $scope.consoleAccessTabs = [];
    var onLoadConsoleAccess = function (companyObj) {
        $scope.consoleAccessTabs = companyObj.consoleAccessLimits.map(function (item) {
            var _consoleTab = {};
            _consoleTab.title = item.accessType + ' console';
            return _consoleTab;
        });
    };

    //go to summary inside page
    $scope.goToCompanySummaryPage = function (page) {
        switch (page) {
            case 'consoleAccess':
                onLoadConsoleAccess($scope.companyObj);
                break;

        }
    };


});