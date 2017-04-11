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

        return {
            getContexts: getContexts
        };
    };

    var module = angular.module("opConsoleApp");
    module.factory("sipUserService", sipUserService);

}());