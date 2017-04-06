/**
 * Created by damith on 4/3/17.
 */


opConsoleApp.controller('monitorServerPctrl', function ($scope, dashboardServices, $timeout) {


    //get server performance

    $scope.monitorPerObj = null;
    var getServerPerformance = function () {
        dashboardServices.getServerPerformance().then(function (res) {
            var nowDate = new Date();
            nowDate = moment.utc(nowDate).format();
            $scope.monitorPerObj = res.Result.map(function (item) {
                item.IdleCpu = parseInt(item.IdleCpu);
                item.cpuProcess = 100 - item.IdleCpu;
                item.UpTimeMSec = moment.utc(parseInt(item.UpTimeMSec)).format('HH:mm:ss');
                var diff = moment(nowDate).diff(moment(item.EventTime));
                //item.upTimeDiff = moment(diff).format("hh:mm:ss");
                item.serverStatus = true;
                item.isLoading = true;
                item.EventTime = moment(item.EventTime).format('hh:mm:ss');
                if (diff > 1000 * 60) {
                    item.serverStatus = false;
                }
                return item;
            });
        });
    };

    //get real time performance
    getServerPerformance();

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