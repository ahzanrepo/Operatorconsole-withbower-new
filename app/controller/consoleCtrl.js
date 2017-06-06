/**
 * Created by damith on 3/31/17.
 */

'use strict';
opConsoleApp.controller('consoleCtrl', function ($scope, $filter, $state,
                                                 userProfileServices,
                                                 loginService,
                                                 subscribeServices) {

    $scope.showAlert = function (tittle, type, msg) {
        new PNotify({
            title: tittle,
            text: msg,
            type: type,
            styling: 'bootstrap3',
            icon: false
        });
    };

    //get current login user
    //02.get current profile data
    $scope.CurrentProfile = {};
    var loadCurrentProfile = function (username) {
        userProfileServices.getMyProfile().then(function (data) {
            if (data.IsSuccess) {
                $scope.CurrentProfile = data.Result;
                console.log($scope.CurrentProfile);
            }
            else {
                console.log(data);
            }

        }, function (err) {
            console.log(err);
        });
    };
    loadCurrentProfile();

    //go to navigation
    $scope.goToNavigation = function (nav) {
        switch (nav) {
            case 'serverPerformance':
                $state.go('op-console.monitor-server-performance');
                break;
            case 'codecManagement':
                $state.go('op-console.codec-management');
                break;
            case 'trunkConfiguration':
                $state.go('op-console.trunk-configuration');
                break;
            case 'companyInfo':
                $state.go('op-console.all-company-information');
                break;
            case 'package':
                $state.go('op-console.package');
                break;
            case 'unit':
                $state.go('op-console.unit');
                break;
            case 'createCompany':
                $state.go('op-console.create-company');
                break;
        }
    };

    //logout
    $scope.isLogingOut = false;
    $scope.logOut = function () {
        $scope.isLogingOut = true;
        loginService.Logoff(function () {
            $scope.isLogingOut = false;
            $state.go('sign-in');
        });
    };

    //-------------------- Notifications ------------------------ \\
    $scope.unredNotifications = 0;
    $scope.notifications = [];
    $scope.OnMessage = function (data) {

        if (data.From) {
            data.avatar = "assets/img/avatar/profileAvatar.png";
            if($scope.users && $scope.users.length){
                var sender = $filter('filter')($scope.users, {username: data.From})[0];
                console.log("Sender ", sender);

                if (sender.avatar) {
                    data.avatar = sender.avatar;
                }
            }

            data.resv_time = new Date();
            data.read = false;


            $scope.$apply(function () {
                $scope.notifications.push(data);
                $scope.unredNotifications = $scope.notifications.length;
            });
        }
    };

    subscribeServices.SubscribeEvents(function (event, data) {
        switch (event) {

            /*case 'agent_connected':

             $scope.agentConnected(data);

             break;

             case 'agent_disconnected':

             $scope.agentDisconnected(data);

             break;

             case 'agent_found':

             $scope.agentFound(data);

             break;

             case 'agent_rejected':
             $scope.agentRejected(data);
             break;

             case 'todo_reminder':

             $scope.todoRemind(data);

             break;

             case 'notice':

             $scope.OnMessage(data);

             break;
             */
            case 'notice_message':

                $scope.OnMessage(data);

                break;
        }
    });

    $scope.isSocketRegistered = false;
    $scope.veeryNotification = function () {

        subscribeServices.connectSubscribeServer(function (isConnected) {

            if (isConnected) {
                $scope.isSocketRegistered = true;
                /*$('#regNotificationLoading').addClass('display-none').removeClass('display-block');
                 $('#regNotification').addClass('display-block').removeClass('display-none');*/
            } else {
                $scope.isSocketRegistered = false;
                $scope.showAlert("Registration failed", "error", "Disconnected from notifications, Please re-register")
            }
        });
    };

   $scope.veeryNotification();

    $scope.checkAndRegister = function () {

        if (!$scope.isSocketRegistered) {
            $('#regNotification').addClass('display-none').removeClass('display-block');
            $('#regNotificationLoading').addClass('display-block').removeClass('display-none');
            $scope.isLoadingNotifiReg = true;
            $scope.veeryNotification();
        }
    };
    //-------------------- Notifications End------------------------ \\
});