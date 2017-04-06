/**
 * Created by damith on 4/3/17.
 */
'use strict';

opConsoleApp.factory("dashboardServices", function ($http, baseUrls) {

    //get server performance
    var getServerPerformance = function (user) {
        return $http({
            method: 'GET',
            url: baseUrls.monitorServerUrl + 'Cluster/2/ResourceUtilization'
        }).then(function (resp) {
            return resp.data;
        })
    };

    var getCurrentServerPerformance = function (param) {
        return $http({
            method: 'GET',
            url: baseUrls.monitorServerUrl + 'FSInstance/' + param.FSInstanceId + '/ResourceUtilization'
        }).then(function (resp) {
            return resp.data;
        })
    };


    return {
        getServerPerformance: getServerPerformance,
        getCurrentServerPerformance: getCurrentServerPerformance
    };
});