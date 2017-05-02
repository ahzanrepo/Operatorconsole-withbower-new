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

        var saveNewEndUser = function(euData)
        {
            return $http({
                method: 'POST',
                url: baseUrls.clusterConfigurationBaseURL +"CloudConfiguration/CloudEndUserTenant",
                data:euData

            }).then(function(response)
            {
                return response.data;
            });
        };

        var updateEndUser = function(euData)
        {
            return $http({
                method: 'PUT',
                url: baseUrls.clusterConfigurationBaseURL + "CloudConfiguration/CloudEndUserTenant/" + euData.id,
                data:euData

            }).then(function(response)
            {
                return response.data;
            });
        };

        var getCloudEndUser = function(clientCompany)
        {
            return $http({
                method: 'GET',
                url:baseUrls.clusterConfigurationBaseURL +"CloudConfiguration/CloudEndUsersTenant/" + clientCompany
            }).then(function(response)
            {
                return response.data;
            });
        };


        return {
            getClusters: getClusters,
            getProfiles: getProfiles,
            saveNewEndUser: saveNewEndUser,
            updateEndUser: updateEndUser,
            getCloudEndUser: getCloudEndUser
        };


    };



    var module = angular.module("opConsoleApp");
    module.factory("clusterConfigurationService", clusterConfigurationService);

}());