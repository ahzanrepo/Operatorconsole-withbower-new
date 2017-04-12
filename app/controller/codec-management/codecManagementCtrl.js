/**
 * Created by dinusha on 4/6/2017.
 */

opConsoleApp.controller('codecManagementCtrl', function ($scope, ngNotify, sipUserService, userProfileServices) {

    $scope.contextList = [{Context: 'public'}];

    $scope.context ={
        context1: 'public',
        context2: 'public'
    };

    $scope.status = 'Save';

    $scope.tempArr = ['fff','fffff','ssdsds'];

    $scope.cachedAvailableCodecs = [];


    $scope.availableCodecs = [];
    $scope.currentCodecs = [];

    $scope.currentCodecPrefs = [];

    $scope.collapsedButton = 'Assign New Codec';

    $scope.onClickCollapsed = function ()
    {
        if($scope.collapsedButton === 'Assign New Codec')
        {
            $scope.resetForm();
            $scope.collapsedButton = 'Back';
            $scope.status = 'Save';
        }
        else
        {
            $scope.collapsedButton = 'Assign New Codec';
        }
    };

    var loadAvailableCodecs = function()
    {
        $scope.availableCodecs = [];

        if($scope.cachedAvailableCodecs.length > 0)
        {
            angular.copy($scope.cachedAvailableCodecs, $scope.availableCodecs);
        }
        else
        {
            userProfileServices.getOrganization().then(function(orgRes)
            {
                if(orgRes && orgRes.IsSuccess)
                {
                    if(orgRes.Result && orgRes.Result.codecAccessLimits && orgRes.Result.codecAccessLimits.length > 0)
                    {
                        var codecs = _.map(orgRes.Result.codecAccessLimits, 'codec');
                        $scope.availableCodecs.push.apply($scope.availableCodecs, codecs);
                        angular.copy($scope.availableCodecs, $scope.cachedAvailableCodecs);
                    }
                }
                else
                {
                    //error
                    if(orgRes.Exception)
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
                        ngNotify.set('Error occurred while loading organization codecs', {
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
        }

    };

    $scope.removeCodecPreference = function(id)
    {
        sipUserService.removeCodecPreferences(id).then(function(codecRemRes)
        {
            if(codecRemRes && codecRemRes.IsSuccess)
            {
                ngNotify.set('Codec preference removed successfully', {
                    position: 'top',
                    sticky: false,
                    duration: 3000,
                    type: 'success'
                });

                loadCodecPreferences();
            }
            else
            {
                //error
                if(codecRemRes.Exception)
                {
                    ngNotify.set(codecRemRes.Exception.Message, {
                        position: 'top',
                        sticky: false,
                        duration: 3000,
                        type: 'error'
                    });
                }
                else
                {
                    ngNotify.set('Error occurred while removing codec preference', {
                        position: 'top',
                        sticky: false,
                        duration: 3000,
                        type: 'error'
                    });
                }

            }

        }).catch(function(err)
        {
            ngNotify.set('Error occurred while removing codec preference', {
                position: 'top',
                sticky: false,
                duration: 3000,
                type: 'error'
            });

        })
    }

    $scope.addUpdateCodecPreference = function()
    {
        if(!$scope.currentCodecs || $scope.currentCodecs.length === 0)
        {
            ngNotify.set('Empty codec list, please drag and drop codecs to current codec list', {
                position: 'top',
                sticky: false,
                duration: 3000,
                type: 'warn'
            });
        }
        else
        {
            var codecInfo = {
                Context1: $scope.context.context1,
                Context2: $scope.context.context2,
                Codecs: $scope.currentCodecs
            };

            if($scope.status === 'Update')
            {
                sipUserService.updateCodecPreferenses($scope.context.context1, $scope.context.context2, codecInfo).then(function(codecUpdateRes)
                {
                    if(codecUpdateRes && codecUpdateRes.IsSuccess)
                    {
                        ngNotify.set('Codec preferences updated successfully', {
                            position: 'top',
                            sticky: false,
                            duration: 3000,
                            type: 'success'
                        });

                        loadCodecPreferences();
                    }
                    else
                    {
                        //error
                        if(codecUpdateRes.Exception)
                        {
                            ngNotify.set(codecUpdateRes.Exception.Message, {
                                position: 'top',
                                sticky: false,
                                duration: 3000,
                                type: 'error'
                            });
                        }
                        else
                        {
                            ngNotify.set('Error occurred while updating codec preferences', {
                                position: 'top',
                                sticky: false,
                                duration: 3000,
                                type: 'error'
                            });
                        }

                    }

                }).catch(function(err)
                {
                    ngNotify.set('Error occurred while updating codec preferences', {
                        position: 'top',
                        sticky: false,
                        duration: 3000,
                        type: 'error'
                    });

                })

            }
            else
            {
                sipUserService.saveCodecPreferenses(codecInfo).then(function(codecSaveRes)
                {
                    if(codecSaveRes && codecSaveRes.IsSuccess)
                    {
                        ngNotify.set('Codec preferences saved successfully', {
                            position: 'top',
                            sticky: false,
                            duration: 3000,
                            type: 'success'
                        });

                        $scope.resetForm();
                        loadCodecPreferences();
                    }
                    else
                    {
                        //error
                        if(codecSaveRes.Exception)
                        {
                            ngNotify.set(codecSaveRes.Exception.Message, {
                                position: 'top',
                                sticky: false,
                                duration: 3000,
                                type: 'error'
                            });
                        }
                        else
                        {
                            ngNotify.set('Error occurred while saving codec preferences', {
                                position: 'top',
                                sticky: false,
                                duration: 3000,
                                type: 'error'
                            });
                        }

                    }

                }).catch(function(err)
                {
                    ngNotify.set('Error occurred while saving codec preferences', {
                        position: 'top',
                        sticky: false,
                        duration: 3000,
                        type: 'error'
                    });

                })

            }


        }

    };

    $scope.resetForm = function()
    {

        $scope.context ={
            context1: 'public',
            context2: 'public'
        };


        $scope.availableCodecs = [];
        $scope.currentCodecs = [];

        loadAvailableCodecs();
    };

    $scope.editCodecPreference = function(codecPref)
    {
        angular.copy($scope.cachedAvailableCodecs, $scope.availableCodecs);
        $scope.context.context1 = codecPref.Context1;
        $scope.context.context2 = codecPref.Context2;

        var arrayDiff = _.difference($scope.availableCodecs, codecPref.Codecs);

        angular.copy(arrayDiff, $scope.availableCodecs);
        angular.copy(codecPref.Codecs, $scope.currentCodecs);

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

    var loadCodecPreferences = function()
    {
        sipUserService.getCodecPreferenses().then(function(codecPrefRes)
        {
            if(codecPrefRes && codecPrefRes.IsSuccess)
            {
                $scope.currentCodecPrefs = codecPrefRes.Result;
            }
            else
            {
                //error
                if(codecPrefRes.Exception)
                {
                    ngNotify.set(codecPrefRes.Exception.Message, {
                        position: 'top',
                        sticky: false,
                        duration: 3000,
                        type: 'error'
                    });
                }
                else
                {
                    ngNotify.set('Error occurred while loading codec preferences', {
                        position: 'top',
                        sticky: false,
                        duration: 3000,
                        type: 'error'
                    });
                }

            }

        }).catch(function(err)
        {
            ngNotify.set('Error occurred while loading codec preferences', {
                position: 'top',
                sticky: false,
                duration: 3000,
                type: 'error'
            });

        })
    };

    loadContexts();

    loadAvailableCodecs();

    loadCodecPreferences();


});
