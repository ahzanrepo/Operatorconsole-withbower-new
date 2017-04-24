/**
 * Created by damith on 4/6/17.
 */

opConsoleApp.controller('companyInfoCtrl', function ($scope, companyInfoServices,
                                                     $state, $anchorScroll, userService) {


    $anchorScroll();

    $scope.companyData = {}

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


    //go to view company summary
    $scope.goToCompany = function (company) {
        $state.go('op-console.company-summary', {
            "id": company.companyId
        });
    };

    //create new company
    $scope.isCreateNewCompany = false;
    $scope.createNewCompany = function () {
        $scope.isCreateNewCompany = !$scope.isCreateNewCompany;
        // if ($scope.isCreateNewCompany) {
        //     $('.blur-this').addClass('blur-me');
        // } else {
        //     $('.blur-this').removeClass('blur-me');
        // }
    };


    //form
    $scope.isLoadingNextForm = false;
    var formWizard = function () {
        return {
            next: function () {
                $scope.isLoadingNextForm = true;
                userService.CreateNewCompany($scope.companyData).then(function (response) {
                    $scope.isLoadingNextForm = false;
                    if (response) {
                        // $scope.getCompanyDetail(response.companyId);
                        $scope.createNewCompany();
                        $state.go('op-console.company-summary', {
                            "id": response.companyId
                        });
                    } else {
                        $scope.notify('Save Company Failed', 'error');
                    }
                });
            }
        }
    }();

    $scope.nextWizard = function () {
        formWizard.next();
    };

});
