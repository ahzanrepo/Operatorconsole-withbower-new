/**
 * Created by dinusha on 4/7/2017.
 */
(function() {

    var sipUserService = function($http, baseUrls)
    {
        var getContexts = function(companyId)
        {
            return $http({
                method: 'GET',
                url: baseUrls.sipUserEndpointService + 'Contexts/ClientCompany/' + companyId
            }).then(function(resp)
            {
                return resp.data;
            })
        };

        var saveCodecPreferenses = function(codecInfo, companyId)
        {

            return $http({
                method: 'POST',
                url: baseUrls.sipUserEndpointService + 'ContextCodecPreferences/ClientCompany/' + companyId,
                data: codecInfo
            }).then(function(resp)
            {
                return resp.data;
            })
        };

        var updateCodecPreferenses = function(context1, context2, codecInfo, companyId)
        {

            return $http({
                method: 'PUT',
                url: baseUrls.sipUserEndpointService + 'ContextCodecPreferences/Context1/' + context1 + '/Context2/' + context2 + '/ClientCompany/' + companyId,
                data: codecInfo
            }).then(function(resp)
            {
                return resp.data;
            })
        };

        var removeCodecPreferences = function(id, companyId)
        {

            return $http({
                method: 'DELETE',
                url: baseUrls.sipUserEndpointService + 'ContextCodecPreferences/' + id + '/ClientCompany/' + companyId
            }).then(function(resp)
            {
                return resp.data;
            })
        };

        var getCodecPreferenses = function(companyId)
        {
            return $http({
                method: 'GET',
                url: baseUrls.sipUserEndpointService + 'ContextCodecPreferences/ClientCompany/' + companyId
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