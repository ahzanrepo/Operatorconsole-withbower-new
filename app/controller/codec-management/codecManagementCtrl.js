/**
 * Created by dinusha on 4/6/2017.
 */

opConsoleApp.controller('codecManagementCtrl', function ($scope, ngNotify, sipUserService, userProfileServices) {

    $scope.contextList = [{Context: 'public'}];
    $scope.context1 = 'public';
    $scope.context2 = 'public';

    /*$scope.sortableList = [
        {
            id : "id-000",
            title : "item 000"
        },
        {
            id : "id-001",
            title : "item 001"
        },
        {
            id : "id-002",
            title : "item 002"
        }

    ];

    $scope.sortableList2 = [
        {
            id : "id-000",
            title : "item 000"
        },
        {
            id : "id-001",
            title : "item 001"
        },
        {
            id : "id-002",
            title : "item 002"
        }

    ];*/

    $scope.availableCodecs = [];
    $scope.currentCodecs = [];

    $scope.collapsedStyle = 'fa fa-chevron-down';

    $scope.onClickCollapsed = function ()
    {
        if($scope.collapsedStyle === 'fa fa-chevron-down')
        {
            $scope.collapsedStyle = 'fa fa-chevron-up';
        }
        else
        {
            $scope.collapsedStyle = 'fa fa-chevron-down';
        }
    };

    var loadAvailableCodecs = function()
    {
        $scope.availableCodecs = [];
        userProfileServices.getOrganization().then(function(orgRes)
        {
            if(orgRes && orgRes.IsSuccess)
            {
                if(orgRes.Result && orgRes.Result.codecAccessLimits)
                {
                    $scope.availableCodecs.push.apply($scope.availableCodecs, orgRes.Result.codecAccessLimits);
                }
            }
            else
            {
                //error
                if(orgRes.Exception)
                {
                    ngNotify.set(contextRes.Exception.Message, {
                        position: 'top',
                        sticky: true,
                        duration: 3000,
                        type: 'error'
                    });
                }
                else
                {
                    ngNotify.set('Error occurred while loading organization codecs', {
                        position: 'top',
                        sticky: true,
                        duration: 3000,
                        type: 'error'
                    });
                }

            }

        }).catch(function(err)
        {
            ngNotify.set('Error occurred while loading organization codecs', {
                position: 'top',
                sticky: true,
                duration: 3000,
                type: 'error'
            });

        })
    }



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
                        sticky: true,
                        duration: 3000,
                        type: 'error'
                    });
                }
                else
                {
                    ngNotify.set('Error occurred while loading contexts', {
                        position: 'top',
                        sticky: true,
                        duration: 3000,
                        type: 'error'
                    });
                }

            }

        }).catch(function(err)
        {
            ngNotify.set('Error occurred while loading organization codecs', {
                position: 'top',
                sticky: true,
                duration: 3000,
                type: 'error'
            });

        })
    };

    loadContexts();

    loadAvailableCodecs();


});
