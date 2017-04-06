/**
 * Created by damith on 4/6/17.
 */

opConsoleApp.controller('companyInfoCtrl', function ($scope, companyInfoServices) {


    $scope.companyObj = null;
    $scope.isLoadingCompany = false;
    var getAllCompanyInfo = function () {
        $scope.isLoadingCompany = true;
        companyInfoServices.getAllCompanyDetails().then(function (data) {
            $scope.isLoadingCompany = false;
            if (data.IsSuccess) {
                $scope.companyObj = data.Result;
                console.log($scope.companyObj);
            }
        }, function (err) {
            console.log(err);
        });
    };
    getAllCompanyInfo();
});
