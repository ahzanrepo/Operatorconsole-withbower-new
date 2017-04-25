/**
 * Created by dinusha on 4/25/2017.
 */

(function() {

    var ruleService = function($http, baseUrls)
    {
        var getTranslations = function()
        {
            return $http({
                method: 'GET',
                url: baseUrls.ruleServiceBaseURL + 'CallRuleApi/Translations'
            }).then(function(resp)
            {
                return resp.data;
            })
        };

        return {
            getTranslations: getTranslations
        };

    };



    var module = angular.module("opConsoleApp");
    module.factory("ruleService", ruleService);

}());
