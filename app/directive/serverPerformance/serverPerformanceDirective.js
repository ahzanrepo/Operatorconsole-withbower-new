/**
 * Created by damith on 4/5/17.
 */
/**
 * Created by Damith on 10/21/2016.
 */

opConsoleApp.directive("serverPerformanceDirective", function (dashboardServices, $timeout) {
    return {
        restrict: "EA",
        scope: {
            serverItem: "=",
            pieoption: "="
        },
        templateUrl: 'app/directive/serverPerformance/temp/server-performance-temp.html',
        link: function (scope, element, attributes) {

            //scope.serverItem = null;
            var getServerPerformance = function () {
                dashboardServices.getCurrentServerPerformance(scope.serverItem)
                    .then(function (res) {
                        var nowDate = new Date();
                        nowDate = moment.utc(nowDate).format();
                        // scope.currentServerItem =
                        var mapSeverDetails = function (item) {
                            item.IdleCpu = parseInt(item.IdleCpu);
                            item.cpuProcess = 100 - item.IdleCpu;
                            item.UpTimeMSec = moment.utc(parseInt(item.UpTimeMSec)).format('HH:mm:ss');
                            var diff = moment(nowDate).diff(moment(item.EventTime));
                            //item.upTimeDiff = moment(diff).format("hh:mm:ss");
                            item.ServiceStatus = true;
                            item.EventTime = moment(item.EventTime).format('hh:mm:ss');

                            if (diff > 1000 * 60) {
                                item.ServiceStatus = false;
                            }
                            return item;
                        };
                        scope.currentServerItem = mapSeverDetails(res.Result);
                    });

            };

            var getServerPerformanceRealTime = function () {
                getServerPerformance();
                serverPerformance = $timeout(getServerPerformanceRealTime, 5000);
            };
            var serverPerformance = $timeout(getServerPerformanceRealTime, 5000);

            scope.$on("$destroy", function () {
                if (getServerPerformanceRealTime) {
                    $timeout.cancel(getServerPerformanceRealTime);
                }
            });

        }
    }
});
