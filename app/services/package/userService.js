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

        var createNewPackage = function (veeryPackage) {
            return $http({
                method: 'POST',
                url: baseUrls.userServiceBaseUrl + 'Package',
                data: veeryPackage
            }).then(function (resp) {
                return resp.data;
            });
        };

        var updatePackage = function (veeryPackage) {
            return $http({
                method: 'PUT',
                url: baseUrls.userServiceBaseUrl + 'Package/'+veeryPackage.packageName,
                data: veeryPackage
            }).then(function (resp) {
                return resp.data;
            });
        };

        var removePackage = function (veeryPackageName) {
            return $http({
                method: 'DELETE',
                url: baseUrls.userServiceBaseUrl + 'Package/'+veeryPackageName
            }).then(function (resp) {
                return resp.data;
            });
        };

        return{
            GetAllPackages: getAllPackages,
            CreateNewPackage: createNewPackage,
            UpdatePackage: updatePackage,
            RemovePackage: removePackage
        }
    });
}());