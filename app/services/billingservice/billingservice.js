/**
 * Created by Rajinda on 6/6/17.
 */
'use strict';

opConsoleApp.factory("billingservice", function ($http, baseUrls, config) {


    var validateToken = function (token) {
        var postData = {
            "billToken": token
        };
        return $http({
            method: 'POST',
            url: baseUrls.billingserviceURL + "validateToken",
            data: postData
        }).then(function (response) {
            if (response && response.data) {
                return response.data;
            } else {
                return undefined;
            }
        })
    };


    return {
        ValidateToken: validateToken
    };
});