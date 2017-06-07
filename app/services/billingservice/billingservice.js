/**
 * Created by Rajinda on 6/6/17.
 */
'use strict';

opConsoleApp.factory("billingservice", function ($http, baseUrls, config) {


    var validateToken = function (token) {
        var postData ={
            "billToken":token
        };
        return $http({
            method: 'POST',
            url: baseUrls.billingserviceURL + "validateToken",
            data: postData
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.IsSuccess;
            } else {
                return false;
            }
        })
    };


    return {
        ValidateToken: validateToken
    };
});