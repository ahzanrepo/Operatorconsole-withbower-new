/**
 * Created by dinusha on 4/7/2017.
 */
(function() {

    var sipUserService = function($http, baseUrls)
    {
        var getContexts = function()
        {
            return $http({
                method: 'GET',
                url: baseUrls.sipUserEndpointService + 'Context'
            }).then(function(resp)
            {
                return resp.data;
            })
        };

        var saveCodecPreferenses = function(codecInfo)
        {

            return $http({
                method: 'POST',
                url: baseUrls.sipUserEndpointService + 'ContextCodecPreferences',
                data: codecInfo
            }).then(function(resp)
            {
                return resp.data;
            })
        };

        var updateCodecPreferenses = function(context1, context2, codecInfo)
        {

            return $http({
                method: 'PUT',
                url: baseUrls.sipUserEndpointService + 'ContextCodecPreferences/Context1/' + context1 + '/Context2/' + context2,
                data: codecInfo
            }).then(function(resp)
            {
                return resp.data;
            })
        };

        var removeCodecPreferences = function(id)
        {

            return $http({
                method: 'DELETE',
                url: baseUrls.sipUserEndpointService + 'ContextCodecPreferences/' + id
            }).then(function(resp)
            {
                return resp.data;
            })
        };

        var getCodecPreferenses = function()
        {
            return $http({
                method: 'GET',
                url: baseUrls.sipUserEndpointService + 'ContextCodecPreferences'
            }).then(function(resp)
            {
                return resp.data;
            })
        };

        return {
            getContexts: getContexts,
            saveCodecPreferenses: saveCodecPreferenses,
            getCodecPreferenses: getCodecPreferenses,
            updateCodecPreferenses: updateCodecPreferenses,
            removeCodecPreferences: removeCodecPreferences
        };
    };

    var module = angular.module("opConsoleApp");
    module.factory("sipUserService", sipUserService);

}());