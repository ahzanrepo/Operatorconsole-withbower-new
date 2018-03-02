/**
 * Created by Waruna on 1/22/2018.
 */

opConsoleApp.factory('companyConfigBackendService', function ($http, baseUrls) {

   var  getAllActiveBreakTypes = function(){
        return $http({
            method: 'GET',
            url: baseUrls.resourceServiceBaseUrl +"BreakTypes/Active"

        }).then(function(response)
        {
            return response.data;
        });
    };

    return {
        getAllActiveBreakTypes:getAllActiveBreakTypes
    }

});