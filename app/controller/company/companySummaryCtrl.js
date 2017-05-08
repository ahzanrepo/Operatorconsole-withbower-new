/**
 * Created by damith on 4/7/17.
 */

opConsoleApp.controller('companySummaryCtrl', function ($scope, $location, $anchorScroll, companyInfoServices, clusterConfigurationService, ngNotify, userService, $state) {
    $anchorScroll();

    var param = {};
    $scope.isDataNotFound = false;
    $scope.isLoadingAll = false;
    $scope.companyObj = null;
    $scope.cloudEndUser = {};

    //update package save obj
    var _updatePackage = {};

    // get current company details
    var getCompanySummary = function (param) {
        $scope.isLoadingAll = true;
        $scope.isUpdatePackage = false;
        companyInfoServices.getCurrentCompanyById(param).then(function (data) {
            $scope.isLoadingAll = false;
            if (data.IsSuccess) {
                $scope.companyObj = data.Result;
                //check company package
                $scope.currentPage = 'companyProfile';

                // if ($scope.companyObj) {
                //     if ($scope.companyObj.packageDetails) {
                //         if ($scope.companyObj.packageDetails.length == 0) {
                //             $scope.currentPage = 'companyPackage';
                //             onLoadCompanyPackage($scope.companyObj);
                //             $scope.isUpdatePackage = true;
                //         }
                //     }
                // }
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

    //on load company details
    var nowDate = new Date();
    nowDate = moment.utc(nowDate).format();
    var onLoadCompanyPackage = function (companyObj) {
        $scope.packageData.companyId = companyObj.id;
        $scope.packageDetails = companyObj.packageDetails.map(function (item) {
            var buyDate = moment(item.buyDate);
            var currentDate = moment(nowDate);
            item.renewdate = buyDate.diff(currentDate, 'days');
            return item;
        });


    };

    var loadEndUser = function () {
        clusterConfigurationService.getCloudEndUser($scope.companyObj.id).then(function (response) {
            if (response.IsSuccess) {
                if (response.Result.length > 0) {
                    $scope.isNewEndUser = false;
                    $scope.cloudEndUser = response.Result[0];

                    $scope.cloudEndUser.SIPConnectivityProvision = $scope.cloudEndUser.SIPConnectivityProvision.toString();
                }
                else {
                    $scope.isNewEndUser = true;
                }
            }
            else {
                var errMsg = "";
                if (response.Exception && response.Exception.Message) {
                    errMsg = response.Exception.Message;
                }

                if (response.CustomMessage) {
                    errMsg = response.CustomMessage;
                }
                ngNotify.set(errMsg, {
                    position: 'top',
                    sticky: false,
                    duration: 3000,
                    type: 'error'
                });
            }


        }).catch(function (ex) {
            $scope.isNewEndUser = null;

            var errMsg = "Error loading provision data";
            if (ex.statusText) {
                errMsg = ex.statusText;
            }
            ngNotify.set(errMsg, {
                position: 'top',
                sticky: false,
                duration: 3000,
                type: 'error'
            });

        });
    };

    //go to summary inside page
    $scope.goToCompanySummaryPage = function (page) {
        $scope.currentPage = page;
        switch (page) {
            case 'consoleAccess':
                onLoadConsoleAccess($scope.companyObj);
                break;
            case 'companyProvision':
                loadEndUser();
                break;
            case 'companyProfile':
                onLoadCompanyInfo($scope.companyObj);
                break;
            case 'companyPackage':
                onLoadCompanyPackage($scope.companyObj);
                break;

        }
    };

    var getCluster = function () {
        $scope.cluster = null;
        clusterConfigurationService.getClusters().then(function (response) {
            if (response.IsSuccess) {
                if (response.Result.length > 0) {
                    $scope.cluster = response.Result[0];
                }

            }

        });
    };


    getCluster();

    $scope.saveEndUser = function () {

        if ($scope.isNewEndUser) {
            if ($scope.cluster) {
                $scope.cloudEndUser.ClusterID = $scope.cluster.id;
                $scope.cloudEndUser.ClientCompany = $scope.companyObj.id;

                clusterConfigurationService.saveNewEndUser($scope.cloudEndUser).then(function (response) {
                    if (response.IsSuccess) {
                        ngNotify.set('End user provisioning saved successfully', {
                            position: 'top',
                            sticky: false,
                            duration: 3000,
                            type: 'success'
                        });
                    }
                    else {
                        var errMsg = "";
                        if (response.Exception && response.Exception.Message) {
                            errMsg = response.Exception.Message;
                        }

                        if (response.CustomMessage) {
                            errMsg = response.CustomMessage;
                        }
                        ngNotify.set(errMsg, {
                            position: 'top',
                            sticky: false,
                            duration: 3000,
                            type: 'error'
                        });

                    }
                }).catch(function (ex) {
                    var errMsg = "Error adding company provision data";
                    if (ex.statusText) {
                        errMsg = ex.statusText;
                    }
                    ngNotify.set(errMsg, {
                        position: 'top',
                        sticky: false,
                        duration: 3000,
                        type: 'error'
                    });

                });
            }
            else {
                ngNotify.set('Cluster not found', {
                    position: 'top',
                    sticky: false,
                    duration: 3000,
                    type: 'error'
                });
            }

        }
        else {
            $scope.cloudEndUser.ClientCompany = $scope.companyObj.id;
            clusterConfigurationService.updateEndUser($scope.cloudEndUser).then(function (response) {
                if (response.IsSuccess) {
                    ngNotify.set('End user provisioning updated successfully', {
                        position: 'top',
                        sticky: false,
                        duration: 3000,
                        type: 'success'
                    });
                }
                else {
                    var errMsg = "";
                    if (response.Exception && response.Exception.Message) {
                        errMsg = response.Exception.Message;
                    }

                    if (response.CustomMessage) {
                        errMsg = response.CustomMessage;
                    }
                    ngNotify.set(errMsg, {
                        position: 'top',
                        sticky: false,
                        duration: 3000,
                        type: 'error'
                    });

                }
            }).catch(function (ex) {
                var errMsg = "Error adding company provision data";
                if (ex.statusText) {
                    errMsg = ex.statusText;
                }
                ngNotify.set(errMsg, {
                    position: 'top',
                    sticky: false,
                    duration: 3000,
                    type: 'error'
                });
            });
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
                $scope.companyObj.companyEnabled = state;
                ngNotify.set('Company state update successfully...', {
                    position: 'top',
                    sticky: true,
                    duration: 3000,
                    type: 'success'
                });
            }

        }, function (err) {
            console.log(err);
        });
    }

    //update company current package
    $scope.packageData = {};

    $scope.isUpdateNewPackage = false;
    $scope.showAddMyPackage = function () {
        $scope.isUpdateNewPackage = !$scope.isUpdateNewPackage;
    };

    //-----------------External methods------------------------
    $scope.loadPackageDetails = function () {
        try {
            userService.GetAllPackages().then(function (response) {
                if (response && response.IsSuccess) {
                    $scope.packageObj = response.Result;
                } else {
                    $scope.notify('Load Package Details Failed', 'error');
                }
            });
        } catch (ex) {
            //$scope.notify('Load Package Details Failed', 'error');
        }
    };

    $scope.loadUnitDetails = function () {
        try {
            userService.GetAllUnits().then(function (response) {
                if (response && response.IsSuccess) {
                    $scope.unitDetails = response.Result;
                } else {
                    $scope.notify('Load Unit Details Failed', 'error');
                }
            });
        } catch (ex) {
            //$scope.notify('Load Unit Details Failed', 'error');
        }
    };

    $scope.getCompanyDetail = function (companyId) {
        $scope.searchStatus = undefined;
        try {
            userService.GetCompanyData(companyId).then(function (response) {
                if (response && response.IsSuccess && response.Result) {
                    $scope.companyDetail = response.Result;
                    $scope.searchStatus = 'true';
                    $scope.searchBoxStaus = $scope.companyDetail;
                } else {
                    $scope.searchStatus = 'false';
                }
            });
        } catch (ex) {
            $scope.searchStatus = 'false';
        }
    };

    var assignPackage = function (param) {
        $scope.isupdatePackage = true;
        try {
            userService.AssignPackage(param).then(function (response) {
                $scope.isupdatePackage = false;
                if (response && response.IsSuccess) {
                    ngNotify.set('Package Update Successfully...', {
                        position: 'top',
                        sticky: true,
                        duration: 3000,
                        type: 'success'
                    });
                } else {
                    ngNotify.set('Package Update Error...', {
                        position: 'top',
                        sticky: true,
                        duration: 3000,
                        type: 'error'
                    });
                }
            });
        } catch (ex) {
            $scope.isupdatePackage = false;
            console.error((ex));
        }
    };

    var assignUnit = function (_updatePackage) {
        $scope.isupdatePackage = true;
        try {
            _updatePackage.topUpCount = $scope.packageData.topUpCount ? $scope.packageData.topUpCount : 0;
            userService.AssignUnit(_updatePackage).then(function (response) {
                $scope.isupdatePackage = false;
                if (response && response.IsSuccess) {
                    //$scope.notify('Load Package Success', 'success');
                    ngNotify.set('Package Update Successfully...', {
                        position: 'top',
                        sticky: true,
                        duration: 3000,
                        type: 'success'
                    });

                } else {
                    // $scope.notify('Assign Package Failed', 'error');
                    ngNotify.set('Package Update Error...', {
                        position: 'top',
                        sticky: true,
                        duration: 3000,
                        type: 'error'
                    });
                }
            });
        } catch (ex) {
            $scope.isupdatePackage = false;
            console.error((ex));
        }
    };

    $scope.updatePackage = function () {
        if ($scope.packageData.assignType && $scope.packageData.assignType === 'unit') {
            assignUnit();
        } else {
            assignPackage();
        }
    };

    $scope.loadPackageDetails();
    $scope.loadUnitDetails();

    //
    $scope.packageData.assignType = 'package';
    $scope.changePackageType = function (type) {
        $scope.packageData.assignType = type;
    };

    $scope.unitChange = function (unit) {
        _updatePackage = {};
        _updatePackage.unit = $scope.unitDetails[$scope.packageData.unitIndex];

        $scope.selectedUnitType = _updatePackage.unit.unitType;
    };


    //choose package
    $scope.choosePackage = function (package, type, $index) {

        $('.new-package-wrp').removeClass('none selected');
        if (type == 'package') {
            $('#package' + $index).addClass('selected');
            _updatePackage.packageName = package.packageName;
        } else if (type == 'unit') {
            $('#unit' + $index).addClass('selected');
            _updatePackage.packageName = package;

        }
    };


    //update company package
    $scope.updatePackage = function () {

        _updatePackage.companyId = $scope.companyObj.id;
        console.log(_updatePackage);

        if ($scope.packageData.assignType && $scope.packageData.assignType === 'unit') {
            assignUnit(_updatePackage);
        } else {
            assignPackage(_updatePackage);
        }
    };


    $scope.backToPage = function () {
        $state.go('op-console.all-company-information');
    };


    //update company profile
    $scope.showUpdatePanel = function () {
        var $edit_widget = $('#profileEditWidget');
        if ($edit_widget) {
            $edit_widget.removeClass('hidden-widget');
        }
    };

    $scope.hiddenEditPanel = function () {
        var $edit_widget = $('#profileEditWidget');
        if ($edit_widget) {
            $('#profileEditWidget').animate()
        }
    };
});