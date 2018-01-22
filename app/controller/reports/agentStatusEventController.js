/**
 * Created by Waruna on 1/16/2018.
 */


opConsoleApp.controller("agentStatusEventController", function ($scope,$anchorScroll , $filter, $q, cdrApiHandler, resourceProductivityService, companyConfigBackendService) {

    $anchorScroll();
    $scope.showAlert = function (tittle, type, content) {

        new PNotify({
            title: tittle,
            text: content,
            type: type,
            styling: 'bootstrap3'
        });
    };

    $scope.moment = moment;


    $scope.agentStatuses = [
        {DisplayName: 'Register', Status: 'Register'},
        {DisplayName: 'Inbound', Status: 'Inbound'},
        {DisplayName: 'Outbound', Status: 'Outbound'},
        {DisplayName: 'ACW', Status: 'AfterWork'},
        {DisplayName: 'Offline', Status: 'Offline'},
        {DisplayName: 'Call', Status: 'CALL'},
        {DisplayName: 'Chat', Status: 'CHAT'}
        /*{DisplayName: 'Training Break', Status: 'TrainingBreak'},
         {DisplayName: 'Meal Break', Status: 'MealBreak'},
         {DisplayName: 'Tea Break', Status: 'TeaBreak'},
         {DisplayName: 'Official Break', Status: 'OfficialBreak'},
         {DisplayName: 'AUX Break', Status: 'AUXBreak'},
         {DisplayName: 'Process Related Break', Status: 'ProcessRelatedBreak'},
         {DisplayName: 'Meeting Break', Status: 'MeetingBreak'}*/
    ];



    $scope.getBreakTypes = function () {
        companyConfigBackendService.getAllActiveBreakTypes().then(function (response) {
            if(response.IsSuccess)
            {
                response.Result.forEach(function(bType){
                    $scope.agentStatuses.push(
                        {
                            DisplayName: bType.BreakType,
                            Status: bType.BreakType
                        }
                    );
                });
            }
            else
            {
                var errMsg = response.CustomMessage;

                if(response.Exception)
                {
                    errMsg = response.Exception.Message;
                }
                $scope.showAlert('Agent List', errMsg, 'error');
            }
        }, function(err){
            var errMsg = "Error occurred while receiving Break Types";
            if(err.statusText)
            {
                errMsg = err.statusText;
            }
            $scope.showAlert('Agent List', errMsg, 'error');
        });
    };

    $scope.getBreakTypes();



    $scope.obj = {
        startDay: moment().format("YYYY-MM-DD"),
        endDay: moment().format("YYYY-MM-DD")
    };

    $scope.startTime = '12:00 AM';
    $scope.endTime = '12:00 AM';
    $scope.endDtTm='';

    $scope.timeEnabled = 'Date Only';
    $scope.timeEnabledStatus = false;

    $scope.changeTimeAvailability = function () {
        if ($scope.timeEnabled === 'Date Only') {
            $scope.timeEnabled = 'Date & Time';
            $scope.timeEnabledStatus = true;
        }
        else {
            $scope.timeEnabled = 'Date Only';
            $scope.timeEnabledStatus = false;
        }
    };


    var isEmpty = function (map) {
        for (var key in map) {
            if (map.hasOwnProperty(key)) {
                return false;
            }
        }
        return true;
    };

    var emptyArr = [];

    $scope.querySearch = function (query) {
        if (query === "*" || query === "") {
            if ($scope.resList) {
                return $scope.resList;
            }
            else {
                return emptyArr;
            }

        }
        else {
            if ($scope.resList) {
                var filteredArr = $scope.resList.filter(function (item) {
                    var regEx = "^(" + query + ")";

                    if (item.ResourceName) {
                        return item.ResourceName.match(regEx);
                    }
                    else {
                        return false;
                    }

                });

                return filteredArr;
            }
            else {
                return emptyArr;
            }
        }

    };

    $scope.querySearchStatus = function (query) {
        if (query === "*" || query === "") {
            if ($scope.agentStatuses) {
                return $scope.agentStatuses;
            }
            else {
                return emptyArr;
            }

        }
        else {
            if ($scope.agentStatuses) {
                var filteredArr = $scope.agentStatuses.filter(function (item) {
                    var regEx = "^(" + query + ")";

                    if (item.Status) {
                        return item.Status.match(regEx);
                    }
                    else {
                        return false;
                    }

                });

                return filteredArr;
            }
            else {
                return emptyArr;
            }
        }

    };

    $scope.resList = [];
    $scope.loadAgentList = function () {
        resourceProductivityService.GetConsolidateAgentDetails().then(function (response) {
            if (response) {

                $scope.uniqAgentNameWithResourceIds = {};
                $scope.comapnyWiseAgents = response.map(function (item) {
                    if($scope.uniqAgentNameWithResourceIds[item.ResourceName]){
                        $scope.uniqAgentNameWithResourceIds[item.ResourceName].ResourceIds.push(item.ResourceId.toString())
                    }
                    else{
                        $scope.uniqAgentNameWithResourceIds[item.ResourceName] = {
                            ResourceIds: [item.ResourceId.toString()],
                            ResourceName: item.ResourceName
                        };
                        $scope.resList.push({
                            ResourceId: item.ResourceId.toString(),
                            ResourceName: item.ResourceName
                        })
                    }
                    return {
                        ResourceId: item.ResourceId.toString(),
                        ResourceName: item.ResourceName
                    };
                });
                /*
                 $scope.resList = response.map(function (item) {
                 return {
                 ResourceId: item.ResourceId.toString(),
                 ResourceName: item.ResourceName
                 }
                 });*/
                $scope.resList.splice(0, 0, {
                    ResourceId: "-999",
                    ResourceName: "Select"
                });

            }

           // $scope.resList = resList;

        }).catch(function (err) {
            
            $scope.showAlert('Agent List', 'error', 'Failed to bind agent auto complete list');

        })
    };

    $scope.loadAgentList();




    $scope.getAgentStatusList = function () {
        var st = moment($scope.startTime, ["h:mm A"]).format("HH:mm");
        var et = moment($scope.endTime, ["h:mm A"]).format("HH:mm");
        $scope.obj.isTableLoading = 0;
        var momentTz = moment.parseZone(new Date()).format('Z');
        momentTz = momentTz.replace("+", "%2B");

        var startDate = $scope.obj.startDay + ' ' + st + ':00' + momentTz;
        var endDate = $scope.obj.endDay + ' ' + et + ':59' + momentTz;

        if (!$scope.timeEnabledStatus) {
            startDate = $scope.obj.startDay + ' 00:00:00' + momentTz;
            endDate = $scope.obj.endDay + ' 23:59:59' + momentTz;
            $scope.endDtTm = moment($scope.obj.endDay + ' 23:59:59');
        }
        else
        {
            $scope.endDtTm = moment($scope.obj.endDay + ' ' + et + ':59');
        }


        try {

            var statusList = [];

            if($scope.statusFilter)
            {

                $scope.statusFilter.forEach(function (item) {

                    statusList.push(item);
                    if(item.DisplayName=="Register" && item.Status=="Register")
                    {
                        statusList.push({DisplayName: "UnRegister", Status: "UnRegister"});
                    }
                    else if(item.DisplayName=="Un-Register" && item.Status=="UnRegister")
                    {
                        statusList.push({DisplayName: "Register", Status: "Register"});
                    }
                    else if(item.DisplayName.indexOf("Break")>=0 && item.Status.indexOf("Break")>=0)
                    {
                        statusList.push({DisplayName: "EndBreak", Status: "EndBreak"});

                    }

                    else
                    {

                        statusList.push({DisplayName: "end"+item.DisplayName, Status: "end"+item.Status});
                    }


                });
            }




            cdrApiHandler.getAgentStatusRecords(startDate, endDate, statusList, $scope.agentFilter).then(function (agentListResp) {
                $scope.agentStatusList = {};
                if (agentListResp && agentListResp.Result) {
                    for (var resource in agentListResp.Result) {
                        if (agentListResp.Result[resource] && agentListResp.Result[resource].length > 0 && agentListResp.Result[resource][0].ResResource && agentListResp.Result[resource][0].ResResource.ResourceName) {
                            var caption = agentListResp.Result[resource][0].ResResource.ResourceName;
                            if(!$scope.agentStatusList[caption]){
                                $scope.agentStatusList[caption] = agentListResp.Result[resource];
                            }
                            else{
                                $scope.agentStatusList[caption] = $scope.agentStatusList[caption].concat(agentListResp.Result[resource]);
                            }

                        }

                    }


                }

                $scope.obj.isTableLoading = 1;

            }).catch(function (err) {
                
                $scope.showAlert('Error', 'error', 'Error occurred while loading agent status events');
                $scope.obj.isTableLoading = 1;
            });


        }
        catch (ex) {
            $scope.showAlert('Error', 'error', 'Error occurred while loading agent status events');
            $scope.obj.isTableLoading = 1;
        }

    };



    $scope.agentStatusListCSV ={};
    $scope.statusData=[];
    $scope.isDowloading=false;
    $scope.getAgentStatusListCSV = function () {
        $scope.isDowloading=true;
        $scope.agentStatusListCSV ={};
        $scope.statusData=[];
        var st = moment($scope.startTime, ["h:mm A"]).format("HH:mm");
        var et = moment($scope.endTime, ["h:mm A"]).format("HH:mm");
        var momentTz = moment.parseZone(new Date()).format('Z');
        momentTz = momentTz.replace("+", "%2B");

        var startDate = $scope.obj.startDay + ' ' + st + ':00' + momentTz;
        var endDate = $scope.obj.endDay + ' ' + et + ':59' + momentTz;

        if (!$scope.timeEnabledStatus) {
            startDate = $scope.obj.startDay + ' 00:00:00' + momentTz;
            endDate = $scope.obj.endDay + ' 23:59:59' + momentTz;
            $scope.endDtTm = moment($scope.obj.endDay + ' 23:59:59');
        }
        else
        {
            $scope.endDtTm = moment($scope.obj.endDay + ' ' + et + ':59');
        }

        $scope.DownloadFileName = 'AGENT_STATUS_LIST' + $scope.obj.startDay + '_' + $scope.obj.endDay;
        var deferred = $q.defer();


        try {

            var statusList = [];

            if($scope.statusFilter)
            {

                $scope.statusFilter.forEach(function (item) {

                    statusList.push(item);
                    if(item.DisplayName=="Register" && item.Status=="Register")
                    {
                        statusList.push({DisplayName: "UnRegister", Status: "UnRegister"});
                    }
                    else if(item.DisplayName=="Un-Register" && item.Status=="UnRegister")
                    {
                        statusList.push({DisplayName: "Register", Status: "Register"});
                    }
                    else if(item.DisplayName.indexOf("Break")>=0 && item.Status.indexOf("Break")>=0)
                    {
                        statusList.push({DisplayName: "EndBreak", Status: "EndBreak"});

                    }

                    else
                    {

                        statusList.push({DisplayName: "end"+item.DisplayName, Status: "end"+item.Status});
                    }


                });
            }

            cdrApiHandler.getAgentStatusRecords(startDate, endDate, $scope.statusFilter, $scope.agentFilter).then(function (agentListResp) {
                if (agentListResp && agentListResp.Result) {
                    for (var resource in agentListResp.Result) {
                        if (agentListResp.Result[resource] && agentListResp.Result[resource].length > 0 && agentListResp.Result[resource][0].ResResource && agentListResp.Result[resource][0].ResResource.ResourceName) {
                            var caption = agentListResp.Result[resource][0].ResResource.ResourceName;
                            $scope.agentStatusListCSV [caption] = agentListResp.Result[resource];



                            /*agentListResp.Result[resource].forEach(function (evtItem) {
                             evtItem.Agent = caption;
                             evtItem.Date = moment(evtItem.createdAt).local().format("YYYY-MM-DD HH:mm:ss");
                             agentStatusList.push(evtItem);
                             });*/
                        }

                    }

                    if($scope.agentStatusListCSV)
                    {
                        for (var key in $scope.agentStatusListCSV)
                        {
                            $scope.recordMaker($scope.agentStatusListCSV[key]);
                        }
                        $scope.isDowloading=false;
                        deferred.resolve($scope.statusData);
                    }

                }
                /* if ($scope.agentStatusListCSV) {
                 var eventLength = Object.keys($scope.agentStatusListCSV).length;

                 while (eventLength > 0) {
                 $scope.recordMaker($scope.agentStatusListCSV[Object.keys($scope.agentStatusListCSV)[0]]);
                 eventLength = Object.keys($scope.agentStatusListCSV).length;
                 if(eventLength==0)
                 {
                 deferred.resolve($scope.statusData);
                 }

                 }

                 }*/





            }).catch(function (err) {
                
                $scope.showAlert('Error', 'error', 'Error occurred while loading agent status events');
                deferred.reject($scope.statusData);
            });


        }
        catch (ex) {
            $scope.showAlert('Error', 'error', 'Error occurred while loading agent status events');
            deferred.reject($scope.statusData);
        }

        return deferred.promise;

    };








    $scope.recordMaker = function (events) {


        try {
            var eventLength = events.length;

            while (eventLength > 0) {
                var event = events[0];
                var stEventName = event.Reason;
                var endEventName = "";

                var isACW = false;
                var isCALL = false;
                var isCHAT = false;
                var isSlotEndEvent = false;

                if (event.Reason == "Register") {
                    endEventName = "Un" + stEventName;

                }
                else if (event.Reason != "EndBreak" && event.Reason.indexOf("Break") >= 0) {
                    endEventName = "EndBreak";

                }
                else if (event.Reason == "AfterWork") {
                    if (event.Status == "Completed") {
                        isACW = true;
                    }
                    else
                    {
                        isSlotEndEvent=true;
                    }
                }
                else if (event.Reason == "CALL") {
                    if (event.Status == "Connected") {
                        isCALL = true;
                    }else
                    {
                        isSlotEndEvent=true;
                    }
                }
                else if (event.Reason == "CHAT") {
                    if (event.Status == "Connected") {
                        isCHAT = true;
                    }
                    else
                    {
                        isSlotEndEvent=true;
                    }
                }
                else {
                    endEventName = "end" + stEventName;
                }


                var index = -1;



                if (isACW) {
                    isACW = false;

                    index = events.map(function (el) {
                        return el.Status;
                    }).indexOf("Available");


                }
                else if (isCALL) {



                    index = events.map(function (el) {
                        return el.Status;
                    }).indexOf("Completed");




                }
                else if (isCHAT) {



                    index = events.map(function (el) {
                        return el.Status;
                    }).indexOf("Completed");




                }
                else  {

                    if(!isSlotEndEvent)
                    {
                        index = events.map(function (el) {
                            return el.Reason;
                        }).indexOf(endEventName);
                    }



                }



                if (index >= 0) {

                    var eventObj = {

                        Agent: event.ResResource.ResourceName,
                        Event: stEventName,
                        From: moment(event.createdAt).local().format("YYYY-MM-DD HH:mm:ss"),
                        To: moment(events[index].createdAt).local().format("YYYY-MM-DD HH:mm:ss")

                    };


                    events.splice(index, 1);
                    events.splice(events.indexOf(event), 1);
                    $scope.statusData.push(eventObj);

                }
                else {


                    if(moment($scope.endDtTm).diff(moment())>=0)
                    {
                        $scope.endDtTm=moment();
                    }

                    if(stEventName=="Register")
                    {
                        var
                            eventObj = {
                                Agent: event.ResResource.ResourceName,
                                Event: stEventName,
                                From: moment(event.createdAt).local().format("YYYY-MM-DD HH:mm:ss"),
                                To:  moment($scope.endDtTm).local().format("YYYY-MM-DD HH:mm:ss")
                            }

                        $scope.statusData.push(eventObj);
                    }
                    else if(stEventName. indexOf ("end")==-1 && stEventName!="UnRegister")
                    {
                        if(!isSlotEndEvent)
                        {
                            var
                                eventObj = {
                                    Agent: event.ResResource.ResourceName,
                                    Event: stEventName,
                                    From: moment(event.createdAt).local().format("YYYY-MM-DD HH:mm:ss"),
                                    To:  moment($scope.endDtTm).local().format("YYYY-MM-DD HH:mm:ss")
                                };
                            $scope.statusData.push(eventObj);
                        }

                    }
                    events.splice(events.indexOf (event),1);

                }
                eventLength = events.length;

                if (eventLength == 0) {
                    $scope.statusData;
                }

            }
        } catch (e) {
            console.log("Error in Making CSV")
        }






    }



});