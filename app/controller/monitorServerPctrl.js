/**
 * Created by damith on 4/3/17.
 */


opConsoleApp.controller('monitorServerPctrl', function ($scope, dashboardServices, $timeout) {


    //get server performance

    $scope.monitorPerObj = null;
    var getServerPerformance = function () {
        dashboardServices.getServerPerformance().then(function (res) {
            console.log(res);
            var nowDate = new Date();
            nowDate = moment.utc(nowDate).format();
            $scope.monitorPerObj = res.Result.map(function (item) {
                item.IdleCpu = parseInt(item.IdleCpu);
                item.cpuProcess = 100 - item.IdleCpu;
                item.UpTimeMSec = moment().utc(item.UpTimeMSec).format('hh:mm:ss');
                var diff = moment(nowDate).diff(moment(item.EventTime));
                item.upTimeDiff = moment(diff).format("hh:mm:ss");
                return item;
            });
        });
    };


    //get real time performance

    var getServerPerformanceRealTime = function () {
        getServerPerformance();
        serverPerformance = $timeout(getServerPerformanceRealTime, 5000);
    };
    var serverPerformance = $timeout(getServerPerformanceRealTime, 5000);

    $scope.$on("$destroy", function () {
        if (getServerPerformanceRealTime) {
            $timeout.cancel(getServerPerformanceRealTime);
        }
    });


    //widget option
    $scope.pieoption = {
        animate: {
            duration: 1000,
            enabled: true
        },
        barColor: '#04A1D0',
        scaleColor: false,
        lineWidth: 20,
        lineCap: 'circle',
        size: 180
    };
});