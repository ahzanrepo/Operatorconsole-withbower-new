/**
 * Created by dinusha on 4/6/2017.
 */

opConsoleApp.controller('codecManagementCtrl', function ($scope, ngNotify, sipUserService) {

    $scope.contextList = [{Context: 'public'}];
    $scope.context1 = 'public';
    $scope.context2 = 'public';

    Array.prototype.move = function (old_index, new_index) {
        if (new_index >= this.length) {
            var k = new_index - this.length;
            while ((k--) + 1) {
                this.push(undefined);
            }
        }
        this.splice(new_index, 0, this.splice(old_index, 1)[0]);
        return this; // for testing purposes
    };

    $scope.sortableList = [
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

    ];



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
            ngNotify.set('Error occurred while loading contexts', {
                position: 'top',
                sticky: true,
                duration: 3000,
                type: 'error'
            });

        })
    };

    loadContexts();


});
