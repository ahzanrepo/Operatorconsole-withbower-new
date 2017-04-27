/**
 * Created by dinusha on 4/27/2017.
 */
(function() {

    var clusterConfigurationService = function($http, baseUrls)
    {

        var getClusters = function()
        {
            return $http({
                method: 'GET',
                url: baseUrls.clusterConfigurationBaseURL + 'CloudConfiguration/Clouds'
            }).then(function(resp)
            {
                return resp.data;
            })
        };

        var getProfiles = function()
        {
            return $http({
                method: 'GET',
                url: baseUrls.clusterConfigurationBaseURL + 'CloudConfiguration/Profiles'
            }).then(function(resp)
            {
                return resp.data;
            })
        };


        return {
            getClusters: getClusters,
            getProfiles: getProfiles
        };


    };



    var module = angular.module("opConsoleApp");
    module.factory("clusterConfigurationService", clusterConfigurationService);

}());