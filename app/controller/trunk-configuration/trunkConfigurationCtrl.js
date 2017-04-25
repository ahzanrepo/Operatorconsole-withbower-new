/**
 * Created by dinusha on 4/24/2017.
 */

opConsoleApp.controller('trunkConfigurationCtrl', function ($scope, ngNotify, sipUserService, ruleService, phnNumTrunkService, userProfileServices) {

    $scope.currentTrunk = {
        IpAddressList: []
    };

    $scope.ipRangeData = {};

    $scope.appState = 'TRUNKLIST';

    $scope.status = 'Save';


    $scope.trunkList = [];

    $scope.collapsedButton = 'Create Trunk';

    var resetForm = function()
    {
        $scope.currentTrunk = {};
    };

    $scope.onClickCollapsed = function ()
    {
        if($scope.appState === 'TRUNKLIST')
        {
            $scope.appState = 'TRUNKSAVE';
            $scope.resetForm();
            $scope.collapsedButton = 'Back';
            $scope.status = 'Save';
        }
        else if($scope.appState === 'TRUNKSAVE' || $scope.appState === 'TRUNKUPDATE')
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

                resetForm();

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




    $scope.editTrunk = function(trunk)
    {
        angular.copy(trunk, $scope.currentTrunk);

        if($scope.currentTrunk.TranslationId)
        {
            $scope.currentTrunk.TranslationId = $scope.currentTrunk.TranslationId.toString();
        }

        loadIpAddresses(trunk);

        $scope.appState = 'TRUNKUPDATE';

        $scope.collapsedButton = 'Back';
        $scope.status = 'Update';

    };

    var loadContexts = function()
    {
        $scope.contextList = [{Context: 'public'}];
        sipUserService.getContexts().then(function(contextRes)
        {
            if(contextRes && contextRes.IsSuccess)
            {
                $scope.contextList.push.apply($scope.contextList, contextRes.Result);
            }
            else
            {
                //error
                if(contextRes.Exception)
                {
                    ngNotify.set(contextRes.Exception.Message, {
                        position: 'top',
                        sticky: false,
                        duration: 3000,
                        type: 'error'
                    });
                }
                else
                {
                    ngNotify.set('Error occurred while loading contexts', {
                        position: 'top',
                        sticky: false,
                        duration: 3000,
                        type: 'error'
                    });
                }

            }

        }).catch(function(err)
        {
            ngNotify.set('Error occurred while loading organization codecs', {
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
