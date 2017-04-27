/**
 * Created by dinusha on 4/24/2017.
 */

opConsoleApp.controller('trunkConfigurationCtrl', function ($scope, ngNotify, sipUserService, ruleService, phnNumTrunkService, companyInfoServices, userProfileServices) {

    $scope.currentTrunk = {
        IpAddressList: []
    };

    $scope.ipRangeData = {};

    $scope.phoneNumberList = [];

    $scope.companyList = [];

    $scope.phnNum = {};

    $scope.appState = 'TRUNKLIST';

    $scope.status = 'Save';


    $scope.trunkList = [];

    $scope.collapsedButton = 'Create Trunk';

    $scope.resetForm = function()
    {
        $scope.currentTrunk = {
            IpAddressList: []
        };
    };

    $scope.resetPhoneForm = function()
    {
        $scope.phnNum = {};
    };



    $scope.onClickCollapsed = function ()
    {
        if($scope.appState === 'TRUNKLIST')
        {
            $scope.appState = 'TRUNKSAVE';
            $scope.resetForm();
            $scope.collapsedButton = 'Back To Trunk List';
            $scope.status = 'Save';
        }
        else if($scope.appState === 'TRUNKSAVE' || $scope.appState === 'TRUNKUPDATE')
        {
            $scope.appState = 'TRUNKLIST';
            $scope.collapsedButton = 'Create Trunk';
            $scope.status = 'Save';
        }
        else if($scope.appState === 'PHONESAVE' || $scope.appState === 'PHONEUPDATE')
        {
            $scope.appState = 'PHONELIST';
            $scope.collapsedButton = 'Back To Trunk List';
            $scope.status = 'Save';
        }
        else if($scope.appState === 'PHONELIST')
        {
            $scope.appState = 'TRUNKLIST';
            $scope.collapsedButton = 'Create Trunk';
            $scope.status = 'Save';
        }
    };

    $scope.ipAddressDelete = function (trunkIpObj) {
        phnNumTrunkService.removeTrunkIpAddress($scope.currentTrunk.id, trunkIpObj.id).then(function (data) {
            if (data.IsSuccess) {
                ngNotify.set('Ip address removed successfully', {
                    position: 'top',
                    sticky: false,
                    duration: 3000,
                    type: 'success'
                });

                loadIpAddresses($scope.currentTrunk);

                $scope.ipRangeData = {};
            }
            else {
                var errMsg = "";
                if (data.Exception && data.Exception.Message) {
                    errMsg = data.Exception.Message;
                }

                if (data.CustomMessage) {
                    errMsg = data.CustomMessage;
                }
                ngNotify.set(errMsg, {
                    position: 'top',
                    sticky: false,
                    duration: 3000,
                    type: 'error'
                });
                loadIpAddresses($scope.currentTrunk);
            }

        }, function (err) {
            var errMsg = "Error adding ip address";
            if (err.statusText) {
                errMsg = err.statusText;
            }
            ngNotify.set(errMsg, {
                position: 'top',
                sticky: false,
                duration: 3000,
                type: 'error'
            });
            loadIpAddresses($scope.currentTrunk);
        });

        return false;
    };

    $scope.tagAdding = function (tag) {
        return false;
    };

    var loadTranslations = function () {
        ruleService.getTranslations().then(function (data) {
            if (data.IsSuccess)
            {
                $scope.transList = data.Result;
            }
            else
            {
                var errMsg = data.CustomMessage;

                if (data.Exception) {
                    errMsg = data.Exception.Message;
                }
                ngNotify.set(errMsg, {
                    position: 'top',
                    sticky: false,
                    duration: 3000,
                    type: 'error'
                });

            }

        }, function (err) {
            var errMsg = "Error occurred while loading translations";
            if (err.statusText) {
                errMsg = err.statusText;
            }
            ngNotify.set(errMsg, {
                position: 'top',
                sticky: false,
                duration: 3000,
                type: 'error'
            });
        });
    };

    $scope.addNewTrunk = function ()
    {
        if($scope.appState === '')
        phnNumTrunkService.addNewTrunk($scope.currentTrunk).then(function (data)
        {
            if (data.IsSuccess) {
                ngNotify.set('Trunk configuration saved successfully', {
                    position: 'top',
                    sticky: false,
                    duration: 3000,
                    type: 'success'
                });

                $scope.resetForm();

                loadTrunks();
            }
            else
            {
                var errMsg = "";
                if (data.Exception && data.Exception.Message) {
                    errMsg = data.Exception.Message;
                }

                if (data.CustomMessage) {
                    errMsg = data.CustomMessage;
                }
                ngNotify.set(errMsg, {
                    position: 'top',
                    sticky: false,
                    duration: 3000,
                    type: 'error'
                });
            }

        }, function (err) {
            var errMsg = "Error saving trunk";
            if (err.statusText) {
                errMsg = err.statusText;
            }
            ngNotify.set(errMsg, {
                position: 'top',
                sticky: false,
                duration: 3000,
                type: 'error'
            });
        });
    };

    var getLimits = function () {
        phnNumTrunkService.getLimits().then(function (data)
        {
            if (data.IsSuccess)
            {
                $scope.limitList = data.Result;
            }
            else
            {
                var errMsg = data.CustomMessage;

                if (data.Exception)
                {
                    errMsg = data.Exception.Message;
                }
                ngNotify.set(errMsg, {
                    position: 'top',
                    sticky: false,
                    duration: 3000,
                    type: 'error'
                });

            }

        }, function (err) {
            var errMsg = "Error occurred while loading limits";
            if (err.statusText) {
                errMsg = err.statusText;
            }
            ngNotify.set(errMsg, {
                position: 'top',
                sticky: false,
                duration: 3000,
                type: 'error'
            });
        });
    };

    $scope.addIpAddress = function () {
        phnNumTrunkService.addTrunkIpAddress($scope.currentTrunk.id, $scope.ipRangeData).then(function (data) {
            if (data.IsSuccess)
            {
                ngNotify.set('Ip address added successfully', {
                    position: 'top',
                    sticky: false,
                    duration: 3000,
                    type: 'success'
                });

                loadIpAddresses($scope.currentTrunk);

                $scope.ipRangeData = {};
            }
            else
            {
                var errMsg = "";
                if (data.Exception && data.Exception.Message) {
                    errMsg = data.Exception.Message;
                }

                if (data.CustomMessage) {
                    errMsg = data.CustomMessage;
                }
                ngNotify.set(errMsg, {
                    position: 'top',
                    sticky: false,
                    duration: 3000,
                    type: 'error'
                });
            }

        }, function (err)
        {
            var errMsg = "Error adding ip address";
            if (err.statusText) {
                errMsg = err.statusText;
            }
            ngNotify.set(errMsg, {
                position: 'top',
                sticky: false,
                duration: 3000,
                type: 'error'
            });
        });
    };

    $scope.addPhoneNumber = function ()
    {
        $scope.phnNum.TrunkId = $scope.currentTrunk.id;

        if($scope.appState === 'PHONEUPDATE')
        {
            phnNumTrunkService.updatePhoneNumberTenant($scope.phnNum).then(function (data) {
                if (data.IsSuccess)
                {
                    ngNotify.set('Phone number updated successfully', {
                        position: 'top',
                        sticky: false,
                        duration: 3000,
                        type: 'success'
                    });
                }
                else
                {
                    var errMsg = "";
                    if (data.Exception && data.Exception.Message) {
                        errMsg = data.Exception.Message;
                    }

                    if (data.CustomMessage) {
                        errMsg = data.CustomMessage;
                    }
                    ngNotify.set(errMsg, {
                        position: 'top',
                        sticky: false,
                        duration: 3000,
                        type: 'error'
                    });
                }

            }, function (err)
            {
                var errMsg = "Error updating phone number";
                if (err.statusText) {
                    errMsg = err.statusText;
                }
                ngNotify.set(errMsg, {
                    position: 'top',
                    sticky: false,
                    duration: 3000,
                    type: 'error'
                });
            });
        }
        else
        {
            phnNumTrunkService.addPhoneNumberTenant($scope.phnNum).then(function (data) {
                if (data.IsSuccess)
                {
                    ngNotify.set('Phone number added successfully', {
                        position: 'top',
                        sticky: false,
                        duration: 3000,
                        type: 'success'
                    });
                }
                else
                {
                    var errMsg = "";
                    if (data.Exception && data.Exception.Message) {
                        errMsg = data.Exception.Message;
                    }

                    if (data.CustomMessage) {
                        errMsg = data.CustomMessage;
                    }
                    ngNotify.set(errMsg, {
                        position: 'top',
                        sticky: false,
                        duration: 3000,
                        type: 'error'
                    });
                }

            }, function (err)
            {
                var errMsg = "Error adding phone number";
                if (err.statusText) {
                    errMsg = err.statusText;
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

    var loadCompanyList = function()
    {
        companyInfoServices.getAllCompanyDetails().then(function(compListResp)
        {
            if (compListResp.IsSuccess)
            {
                if (compListResp.Result)
                {
                    $scope.companyList = compListResp.Result;
                }
            }
            else
            {
                var errMsg = compListResp.CustomMessage;

                if (compListResp.Exception) {
                    errMsg = compListResp.Exception.Message;
                }
                ngNotify.set(errMsg, {
                    position: 'top',
                    sticky: false,
                    duration: 3000,
                    type: 'error'
                });

            }
        }).catch(function(ex)
        {
            var errMsg = "Error loading company details";
            if (ex.statusText) {
                errMsg = ex.statusText;
            }
            ngNotify.set(errMsg, {
                position: 'top',
                sticky: false,
                duration: 3000,
                type: 'error'
            });
        })
    }


    var loadIpAddresses = function (trunk) {
        $scope.currentTrunk.IpAddressList = [];
        phnNumTrunkService.getTrunkIpAddresses(trunk.id).then(function (data) {
            if (data.IsSuccess)
            {
                if (data.Result)
                {
                    $scope.currentTrunk.IpAddressList = data.Result.map(function (ip) {
                        var newIpAddressObj = ip;
                        newIpAddressObj.DisplayValue = ip.IpAddress + '/' + ip.Mask;
                        return newIpAddressObj;
                    });
                }

                //$scope.trunkList = data.Result;
            }
            else {
                var errMsg = data.CustomMessage;

                if (data.Exception) {
                    errMsg = data.Exception.Message;
                }
                ngNotify.set(errMsg, {
                    position: 'top',
                    sticky: false,
                    duration: 3000,
                    type: 'error'
                });

            }

        }, function (err) {
            var errMsg = "Error occurred while loading trunk ip addresses";
            if (err.statusText) {
                errMsg = err.statusText;
            }
            ngNotify.set(errMsg, {
                position: 'top',
                sticky: false,
                duration: 3000,
                type: 'error'
            });
        });
    };



    $scope.editPhone = function(phn)
    {
        angular.copy(phn, $scope.phnNum);

        if(phn.LimitInfoInbound)
        {
            $scope.phnNum.InboundLimit = phn.LimitInfoInbound.MaxCount;
        }

        if(phn.LimitInfoOutbound)
        {
            $scope.phnNum.OutboundLimit = phn.LimitInfoOutbound.MaxCount;
        }

        if(phn.LimitInfoBoth)
        {
            $scope.phnNum.BothLimit = phn.LimitInfoBoth.MaxCount;
        }

        $scope.phnNum.ClientCompany = phn.CompanyId.toString();

        $scope.appState = 'PHONEUPDATE';

        $scope.collapsedButton = 'Back To Trunk List';
        $scope.status = 'Update';

    };


    $scope.editTrunk = function(trunk)
    {
        angular.copy(trunk, $scope.currentTrunk);

        if($scope.currentTrunk.TranslationId)
        {
            $scope.currentTrunk.TranslationId = $scope.currentTrunk.TranslationId.toString();
        }

        loadIpAddresses(trunk);

        $scope.appState = 'TRUNKUPDATE';

        $scope.collapsedButton = 'Back To Trunk List';
        $scope.status = 'Update';

    };

    $scope.onClickAddNewNumber = function()
    {
        $scope.appState = 'PHONESAVE';
        $scope.collapsedButton = 'Back To Phone Number List';

        $scope.resetPhoneForm();
    };

    $scope.showNumberList = function(trunk)
    {
        getLimits();
        loadCompanyList();

        angular.copy(trunk, $scope.currentTrunk);

        if($scope.currentTrunk.TranslationId)
        {
            $scope.currentTrunk.TranslationId = $scope.currentTrunk.TranslationId.toString();
        }

        phnNumTrunkService.getPhoneNumbersByTrunk(trunk.id).then(function(numberListResp)
        {
            if(numberListResp && numberListResp.IsSuccess)
            {
                $scope.phoneNumberList = numberListResp.Result;

                $scope.appState = 'PHONELIST';

                $scope.collapsedButton = 'Back To Trunk List';
            }
            else
            {
                //error
                if(numberListResp.Exception)
                {
                    ngNotify.set(numberListResp.Exception.Message, {
                        position: 'top',
                        sticky: false,
                        duration: 3000,
                        type: 'error'
                    });
                }
                else
                {
                    ngNotify.set('Error occurred while loading trunk list', {
                        position: 'top',
                        sticky: false,
                        duration: 3000,
                        type: 'error'
                    });
                }

            }

        }).catch(function(err)
        {
            ngNotify.set('Error occurred while loading trunk list', {
                position: 'top',
                sticky: false,
                duration: 3000,
                type: 'error'
            });

        })



    };

    var loadTrunks = function()
    {
        phnNumTrunkService.getTrunks().then(function(trunkListResp)
        {
            if(trunkListResp && trunkListResp.IsSuccess)
            {
                $scope.trunkList = trunkListResp.Result;
            }
            else
            {
                //error
                if(trunkListResp.Exception)
                {
                    ngNotify.set(trunkListResp.Exception.Message, {
                        position: 'top',
                        sticky: false,
                        duration: 3000,
                        type: 'error'
                    });
                }
                else
                {
                    ngNotify.set('Error occurred while loading trunk list', {
                        position: 'top',
                        sticky: false,
                        duration: 3000,
                        type: 'error'
                    });
                }

            }

        }).catch(function(err)
        {
            ngNotify.set('Error occurred while loading trunk list', {
                position: 'top',
                sticky: false,
                duration: 3000,
                type: 'error'
            });

        })
    };



    loadTrunks();

    loadTranslations();


});
