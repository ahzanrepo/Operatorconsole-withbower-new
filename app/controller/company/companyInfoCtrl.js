/**
 * Created by damith on 4/6/17.
 */

opConsoleApp.directive('companyInfoEnterPress', function () {
    return function (scope, element, attrs) {
        element.bind("keyup", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.companyInfoEnterPress);
                });

                event.preventDefault();
            }
        });
    };
});

opConsoleApp.directive('companyInfoOtherPress', function () {
    return function (scope, element, attrs) {
        element.bind("keyup", function (event) {
            if(event.which !== 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.companyInfoOtherPress);
                });

                event.preventDefault();
            }
        });
    };
});

opConsoleApp.controller('companyInfoCtrl', function ($scope, companyInfoServices, phnNumTrunkService,
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

    $scope.refreshPage = function () {
        getAllCompanyInfo();
    };

    $scope.searchByNumber = function(){
        $scope.setToSearchString();
    }

    $scope.setToSearchString = function()
    {
        phnNumTrunkService.getTenantNumber($scope.searchCompanyInfo).then(function(phnNumInfo)
        {
            if(phnNumInfo && phnNumInfo.Result)
            {
                var comp = $scope.companyObj.filter(function(comp)
                {
                    if(comp.companyId === phnNumInfo.Result.CompanyId)
                    {
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                });

                if(comp)
                {
                    $scope.searchByNum = comp[0].companyName;
                }

            }

        }).catch(function(err)
        {

        })

    };

    $scope.resetSearch = function()
    {
        $scope.searchByNum = angular.copy($scope.searchCompanyInfo);
    };

    $scope.filterFunction = function(searchVal)
    {
        return searchVal === $scope.searchCompanyInfo || searchVal === $scope.searchByNum;
    };


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
