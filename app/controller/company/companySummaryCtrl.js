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
                $scope.companyObj = data.Result;
                console.log($scope.companyObj);
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


});