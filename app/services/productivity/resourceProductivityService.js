/**
 * Created by Rajinda on 12/31/2015.
 */

opConsoleApp.factory("resourceProductivityService", function ($http, $log, baseUrls) {

    var consolidatedDailySummary = function (fromDate, toDate, resourceId) {

        var urlTemp = baseUrls.resourceServiceBaseUrl + "Resources/Productivity/ConsolidatedSummary/from/" + fromDate + "/to/" + toDate;

       /* if (resourceId) {
            urlTemp = baseUrls.resourceServiceBaseUrl + "Resources/Productivity/ConsolidatedSummary/from/" + fromDate + "/to/" + toDate + "?resourceId=" + resourceId;
        }*/

        var postData = {
            method: 'GET',
            url: urlTemp
        };

        if (resourceId) {
            postData.params = {
                resourceId: JSON.stringify(resourceId)
            }
        }
        return $http(postData).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return null;
            }
        });
    };

    var getProductivity = function () {

        return $http.get(baseUrls.resourceServiceBaseUrl + "Resources/Productivity").then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return {};
            }
        });
    };

    var getOnlineAgents = function () {

        /*return $http.get(baseUrls.ardsmonitoringBaseUrl + "MONITORING/resources").then(function (response) {
         if (response.data && response.data.IsSuccess) {
         return response.data.Result;
         } else {
         return {};
         }
         });*/

        return $http.get(baseUrls.resourceServiceBaseUrl + "Resources").then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return {};
            }
        });
    };

    var getConsolidateAgentDetails = function () {
        return $http({
            method: 'GET',
            url: baseUrls.resourceServiceBaseUrl + "consolidatedResources?consolidated=true"
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return [];
            }
        });
    };
    var getAgentDetails = function () {
        return $http({
            method: 'GET',
            url: baseUrls.resourceServiceBaseUrl + "Resources"
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return [];
            }
        });
    };
    return {
        GetProductivity: getProductivity,
        GetOnlineAgents: getOnlineAgents,
        ConsolidatedDailySummary: consolidatedDailySummary,
        GetAgentDetails: getAgentDetails,
        GetConsolidateAgentDetails: getConsolidateAgentDetails

    }

});
