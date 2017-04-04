/**
 * Created by damith on 4/3/17.
 */


opConsoleApp.controller('monitorServerPctrl', function ($scope, dashboardServices) {


    //get server performance

    $scope.monitorPerObj = null;
    var getServerPerformance = function () {
        dashboardServices.getServerPerformance().then(function (res) {
            console.log(res);
            $scope.monitorPerObj = res.Result.map(function (item) {
                item.IdleCpu = parseInt(item.IdleCpu);
                item.cpuProcess = 100 - item.IdleCpu;
                item.UpTimeMSec = moment().utc(item.UpTimeMSec).format('hh:ss');
                return item;
            });
        });
    };
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