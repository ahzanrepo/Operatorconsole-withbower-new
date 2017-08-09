/**
 * Created by dinusha on 4/24/2017.
 */

(function() {

    var monitorRestApi = function($http, baseUrls)
    {
        var getMonitorTrunks = function()
        {
            return $http({
                method: 'GET',
                url: baseUrls.monitorServerUrl + 'TrunkMonitoring/Trunks'
            }).then(function(resp)
            {
                return resp.data;
            })
        };


        return {
            getMonitorTrunks: getMonitorTrunks
        };

    };


    var module = angular.module("opConsoleApp");
    module.factory("monitorRestApi", monitorRestApi);

}());
