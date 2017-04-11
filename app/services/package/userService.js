/**
 * Created by Heshan.i on 4/7/2017.
 */
'use strict';
(function () {

    opConsoleApp.factory('userService', function ($http, baseUrls) {

        var getAllPackages = function () {
            return $http({
                method: 'GET',
                url: baseUrls.userServiceBaseUrl + 'Packages'
            }).then(function (resp) {
                return resp.data;
            });
        };

        return{
            GetAllPackages: getAllPackages
        }
    });
}());