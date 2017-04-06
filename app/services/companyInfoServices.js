/**
 * Created by damith on 4/6/17.
 */

'use strict';

opConsoleApp.factory('companyInfoServices', function ($http, baseUrls) {


        //get all company info
        var getAllCompanyDetails = function () {
            return $http({
                method: 'GET',
                url: baseUrls.userServiceBaseUrl + 'Tenant/Company/BasicInfo'
            }).then(function (resp) {
                return resp.data;

            });
        };

        return {
            getAllCompanyDetails: getAllCompanyDetails
        }


    }
)
;