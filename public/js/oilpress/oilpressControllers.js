var oilpressCtrls = angular.module('oilpressControllers',[]);

function showConsole(uid){
    window.global_uid = uid;
    console.log(uid);
}
oilpressCtrls.controller('mainController',['$rootScope', '$scope',function($rootScope, $scope){
    //$scope.$on('IdleTimeout', function() {
    //    $window.location.assign('/logout');
    //});
    $scope.showContactWarning = true;
    $rootScope.pageCSSArray = [];
    $rootScope.nonIEPageCSSArray = [];

    $rootScope.emptyPageArrays = function(){
        $rootScope.pageCSSArray = [];
        $rootScope.nonIEPageCSSArray = [];
    };

    $rootScope.pageTitle = null;//initiate page title model

    $rootScope.getScopeMessages = function(scope,messages){//function to get the messages from the language file
        scope.messages = {};
        for (var head in messages){
            scope.messages[head] = messages[head];
        }
    };

    $rootScope.setPageHeaders = function(headers){//function to get the page titles from the html
        $rootScope.headers = headers;
    };

    $rootScope.setTitle = function(title,extraText){//helper function to set the title
        if (typeof extraText === 'undefined'){
            $rootScope.pageTitle = $rootScope.headers[title];
        }
        else{
            $rootScope.pageTitle = $rootScope.headers[title]+' '+extraText;
        }

    };
    $scope.closeAlert = function(){
        $scope.showContactWarning = false;
    }
}]);


oilpressCtrls.controller('currentProducersCtrl',['$scope','Producers','$window','producerModal','$rootScope','$q','scanProducerCardModal',function($scope,Producers,$window,producerModal, $rootScope, $q, scanProducerCardModal){
    //message initialization
    $scope.getMessages = function(messages){
        $rootScope.getScopeMessages($scope,messages);
    };
    //create initial page function and initializations
    $scope.uid = window.global_uid;
    $scope.currentProducers = [];
    $scope.currentProducersCount = 0;
    $scope.currentProducersCurrentPage = 1;

    $scope.getProducers = function(offset,limit,queryData){
        if (typeof queryData === 'undefined') queryData = {};
        if (typeof offset !== 'undefined'&& !isNaN(offset)) queryData.offset = offset;
        if (typeof limit !== 'undefined'&&!isNaN(limit)) queryData.limit = limit;
        //make api request to get producers
        Producers.get(queryData,function(result){
            $scope.currentProducers = result.rows;
            $scope.currentProducersCount = result.count;

        });
    };
    $scope.pageChanged = function(){
        //$scope.getProducers(10*($scope.currentProducersCurrentPage-1), undefined, $scope.queryData);
        $scope.searchProducer(10*($scope.currentProducersCurrentPage-1), undefined);
    };
    $scope.$on('refreshProducers',$scope.getProducers);//listen for refresh request
    //initialize page data with producers
    $scope.getProducers();
    $scope.deleteProducer = function(producerID){//delete producer functionality
        if (typeof producerID ==='undefined' || isNaN(producerID)) return;//check for invalid argument
        //confirm producer deletion
        var confirmDeletion = $window.confirm($scope.messages.confirmDeletion);
        if (!confirmDeletion) return $q.reject();//canceled deletion
        return Producers.delete({producerID:producerID}).$promise
            .then(function(result){
                if (result.hasOwnProperty('status')){
                    if (result.status){
                        //successful deletion
                        $window.alert($scope.messages.successfulDeletion);
                        $scope.getProducers();//refresh view
                    }
                    else{
                        $window.alert($scope.messages[result.message]);
                    }
                }
            })
            .catch(function(err){
                console.error('Error while deleting Producer. ERROR: '+JSON.stringify(err));
            });
    };
    $scope.viewProducer = function(producer){
        return producerModal(null,producer)
            .then(function(){
                //all good
                console.log('Successful modal operation');
                $rootScope.$broadcast('refreshProducers');
            })
            .catch(function(err){
                //error in modal function
                console.error(JSON.stringify(err));
            });
    };
    $scope.searchProducer = function(offset, limit){
        var queryData = {};
        if ($scope.searchID) queryData.producer_id = $scope.searchID;
        if ($scope.searchLastName && $scope.searchLastName.length>0) queryData.last_name = $scope.searchLastName;
        if ($scope.searchFirstName && $scope.searchFirstName.length>0) queryData.first_name = $scope.searchFirstName;
        if ($scope.searchAFM && $scope.searchAFM.length>0) queryData.afm = $scope.searchAFM;
        $scope.getProducers(offset,limit,queryData);
    };
    $scope.clearSearch = function(){
        $scope.currentInflowsCurrentPage = 1;
        $scope.searchLastName = $scope.searchFirstName = $scope.searchAFM = $scope.searchID = null;
        $scope.getProducers();
    };
    $scope.assignCard = function(producerID){
        return scanProducerCardModal('sm', producerID);
    };
    $scope.searchProducersCard = function(){
        return scanProducerCardModal('sm', 0);
    };
}]);

oilpressCtrls.controller('inflowsCtrl',['$scope','$rootScope','$window','$q','producerModal','Tanks','Inflows','oilpressInflowModal','viewProducer','Producers', 'Producer_Lands',function($scope,$rootScope,$window,$q,producerModal,Tanks,Inflows,oilpressInflowModal,viewProducer, Producers, Producer_Lands){
    //scope variable and function initialization
    $scope.queryData = {};
    $scope.currentInflows = [];//initialize currentInflows variable
    $scope.currentInflowsCount = 0;//initialize currentInflows count for pagination
    $scope.currentInflowsCurrentPage = 1;//number of current page
    $scope.getInflows = function(offset,limit){
        //if (typeof queryData === 'undefined') queryData = {};
        if (typeof offset !== 'undefined') $scope.queryData.offset = offset;
        if (typeof limit !== 'undefined') $scope.queryData.limit = limit;
        Inflows.get($scope.queryData,function(result){
            $scope.currentInflows = result.rows;
            $scope.currentInflowsCount = result.count;
        });
    };
    $scope.pageChanged = function(){
        $scope.getInflows(10*($scope.currentInflowsCurrentPage-1));
    };
    //search functions and properties
    $scope.searchVisible = false;
    $scope.toggleSearch = function(state){
        if (typeof state === 'undefined') $scope.searchVisible = !$scope.searchVisible;
        else {
            $scope.searchID = $scope.searchFirstName = $scope.searchAFM = $scope.searchLastName = $scope.searchInvoiceNo = $scope.searchDescription = $scope.searchTank = $scope.searchFrom = $scope.searchTo = null;
            $scope.searchVisible = state;
        }
    };
    $scope.searchInflows = function(){
        if ($scope.searchID) $scope.queryData.inflow_id = $scope.searchID;
        if ($scope.searchFirstName && $scope.searchFirstName.length>0) $scope.queryData.first_name = $scope.searchFirstName;
        if ($scope.searchLastName && $scope.searchLastName.length>0) $scope.queryData.last_name = $scope.searchLastName;
        if ($scope.searchAFM && $scope.searchAFM.length>0) $scope.queryData.afm = $scope.searchAFM;
        if ($scope.searchInvoiceNo && $scope.searchInvoiceNo.length>0) $scope.queryData.invoice_no = $scope.searchInvoiceNo;
        if ($scope.searchDescription && $scope.searchDescription.length>0) $scope.queryData.description = $scope.searchDescription;
        if ($scope.searchTank) $scope.queryData.tank_id = $scope.searchTank;
        if ($scope.searchFrom) $scope.queryData.from_date = $scope.searchFrom;
        if ($scope.searchTo) $scope.queryData.to_date = $scope.searchTo;
        $scope.getInflows();
        $scope.toggleSearch(false);//hide the form
    };
    $scope.restoreInflows = function(){//refresh inflows
        $scope.currentInflowsCurrentPage = 1;
        $scope.queryData = {};
        $scope.getInflows();
    };
    //register scope watch to update inflows on broadcasted event
    $scope.$on('refreshInflows',$scope.getInflows);
    //functionality to view inflow detail
    $scope.viewInflow = function(inflow){
        return Inflows.get({inflowID:inflow.inflow_id}).$promise
            .then(function(inflow){
                return oilpressInflowModal(inflow)
                    .then(function(){
                        //all ok
                        console.log('Successful inflow modal operations');
                        $scope.pageChanged();
                    })
            })
            .catch(function(err){
                //error with modal functions
                console.log(JSON.stringify(err));
            });

    };
    $scope.deleteInflow = function(inflowID){
        var confirmDelete = $window.confirm($scope.messages.confirmInflowDeletion);
        if (!confirmDelete) return $q.reject();//skip if not sure
        return Inflows.delete({inflowID:inflowID}).$promise
            .then(function(result){
                if (result.status){
                    //all ok show confirm
                    $window.alert($scope.messages.successfulInflowDeletion);
                    $scope.pageChanged();//refresh inflows in current page
                }
                else{
                    //something went wrong
                    console.log('Cannot delete inflow. ');
                    $window.alert($scope.messages[result.message]);
                }
            })
            .catch(function(err){
                //something went wrong with db request..
                console.error('Error with inflow deletion request..\nERROR: '+JSON.stringify(err));
            });
    };
    //functionality to directly view producer
    $scope.viewProducer = function(producerID){
        viewProducer(producerID)//service created for modular operation
            .then(function(){
                $scope.pageChanged();//refresh inflows in current page
            });
    };
    $scope.getInflows();//initialize scope.currentInflows with DB data
    $scope.newInflow = {};//initiate newInflow model
    //get oilpress tanks to use in select list of new inflow
    Tanks.query(function(tanks){
        $scope.oilpressTanks = tanks;
    });
    $scope.today = function(){return new Date();};
    $scope.maxDate = $scope.newInflow.inflow_date = new Date();
    $scope.dateOptions = {startingDay:1};
    $scope.dateFormat = 'dd/MM/yyyy';

    //initiate scope messages function for language input
    $scope.getMessages = function(messages){
        $rootScope.getScopeMessages($scope,messages);
    };
    $scope.newInflowFormActive = false;//show - hide state of new inflow form
    $scope.toggleNewInflowForm = function(state){//function to toggle form appearance
        $scope.newInflowFormActive = state;
    };
    $scope.inflowDatePopupOpen = false;//initiate control for showing date popup
    $scope.openInflowDatePopup = function($event){//fucntion to open date popup
        $event.preventDefault();
        $event.stopPropagation();
        $scope.inflowDatePopupOpen = true;
    };
    $scope.processNewInflow = function(){
        return Inflows.save($scope.newInflow).$promise
            .then(function(result){
                //check if everything was ok
                if (!result.hasOwnProperty('status') ||(result.hasOwnProperty('status') && result.status)) return true;//everything ok
                //else something went wrong, check to see what is it and display the correct message
                else if (result.message === 'invalidProducerAfm'){
                    var createProducer = $window.confirm($scope.messages.askForProducerCreation);
                    if (!createProducer) return $q.reject('Chose not to create producer so I can\'t continue');//aborted
                    //selected to continue to producer creation so display the new producer modal
                    return producerModal(null,{afm:$scope.newInflow.producer_afm})
                        .then(function(){
                            //successful modal trader creation, so save data again
                            return Inflows.save($scope.newInflow).$promise;
                        });
                }
                else{
                    return $q.reject('unknownError');
                }
            })
            .then(function(){
                //successful inflow save
                $window.alert($scope.messages.succesfullInflowCreation);
                //clear the form and hide it.
                $scope.newInflow = {};
                $scope.toggleNewInflowForm(false);
                //broadcast message to refresh the inflows
                $rootScope.$broadcast('refreshInflows');
                $scope.newInflowForm.$setPristine();
                $scope.maxDate = $scope.newInflow.inflow_date = new Date();
            })
            .catch(function(err){
                //something was not ok, so stop here
                var message;
                if (err.hasOwnProperty('message')) message = err.message;
                else message = err;
                console.error('Cancel new inflow\n'+message);
            });
    };
    $scope.producer_lands = [];
    $scope.showProducerLands = false;
    $scope.searchOSDE = function(){
        $scope.producer_lands = [];
        return Producers.get({afm:$scope.newInflow.producer_afm}).$promise
            .then(function(results){
                if (results.rows.length <= 0) return;
                return Producer_Lands.get({producer_id:results.rows[0].producer_id}).$promise
                    .then(function(results){
                        for(var i = 0, len = results.rows.length;i<len;i++)
                            $scope.producer_lands.push(results.rows[i].osde);
                    })
                    .catch(function(err){
                        console.error("Error trying to get producer lands \nError: " + err);
                    });
            })
            .catch(function(err){
                console.error("Error trying to get producer \nError: " + err);
            });
    };

    //helper variables and fucntions for date picker
    $scope.datePopupOpenFrom = false;
    $scope.datePopupOpenTo = false;
    $scope.openDatePopupFrom = function($event){
        $event.preventDefault();
        $event.stopPropagation();
        $scope.datePopupOpenFrom = true;
    };
    $scope.openDatePopupTo = function($event){
        $event.preventDefault();
        $event.stopPropagation();
        $scope.datePopupOpenTo = true;
    };
}]);


oilpressCtrls.controller('currentOilPressTanksCtrl',['$scope','Tanks','$window','$rootScope', '$q', 'emptyTankModal','Outflows',function($scope,Tanks,$window,$rootScope, $q, emptyTankModal,Outflows){
    $scope.currentTanks = [];//initialize tanks
    //get text messages to display
    $scope.getMessages = function(messages){
        $rootScope.getScopeMessages($scope,messages);
    };

    $scope.$on('refreshTanks',function(){
        $scope.refreshTanks();
    });//set listener for tank refresh
    $scope.deleteTank = function(tankID){//delete tank function
        //get confirmation
        var confirm = $window.confirm($scope.messages.deleteConfirm);
        if (!confirm){
            console.log('Canceled tank deletion...');
            return $q.reject();
        }
        return Tanks.delete({tankID:tankID}).$promise
            .then(function(result){
               if (result.status) {
                   //delete ok... show message
                   $window.alert($scope.messages.deleteSuccessful);
                   $scope.refreshTanks();
               }
               else if (result.hasOwnProperty('custom')&&result.custom){
                    //not deleted display correct message
                    $window.alert($scope.messages[result.message]);
               }
                else{
                   //unknown error
                   $window.alert($scope.messages[result.message]);
                   console.error(JSON.stringify(result));
               }
            })
            .catch(function(err){
                console.error('Error while deleting Tank. ERROR: '+JSON.stringify(err));
            });
    };
    ///initialize Tank instances
    //make the actual call to get tanks
    $scope.refreshTanks = function(){
        $scope.currentTanks = [];
        Tanks.query().$promise
            .then(function(tanks){
                for (var i = 0, len = tanks.length;i<len;i++){
                    tanks[i].$getStatus()
                        .then(function(tankStatus){
                            $scope.currentTanks.push(tankStatus);
                        });
                }
            })
            .catch(function(err){
                //something went wrong with the api request
                console.error(JSON.stringify(err));
            });
    };
    $scope.refreshTanks();

    $scope.initTank = function(tank_id){//empty tank
        //get confirmation
        var confirm = $window.confirm($scope.messages.initConfirm);
        if (!confirm){
            console.log('Canceled tank emptying...');
            return $q.reject();
        }
        return Tanks.update({tankID:tank_id},{empty_date:new Date()}).$promise
            .then(function(result){
                if (result.hasOwnProperty('status')){
                    if (result.status){
                        //successful tank update
                        $window.alert($scope.messages.emptySuccessful);
                    }
                    else {
                        $window.alert(result.messages.undefinedError);
                    }
                }
            })
            .catch(function(err){
                console.error('Error with request to update tank. \nERROR:'+JSON.stringify(err));
            });
    };

    $scope.emptyTank = function(tank_id){
        return Tanks.getStatus({tankID:tank_id}).$promise
            .then(function(tank){
                if(tank.total_quantity<=0) $window.alert($scope.messages.tankAlreadyEmpty);
                else emptyTankModal(null, tank,Outflows);
            })
            .catch(function(err){
                console.error("Error while trying to get tank with " + tank_id + "\nError:" + JSON.stringify(err))
            });

    };

}]);

oilpressCtrls.controller('tankDetailCtrl',['$rootScope','$scope','Tanks','producerModal','OilPressTank_Actions','viewInflow','$location','Producers',function($rootScope,$scope,Tanks,producerModal,OilPressTank_Actions,viewInflow,$location,Producers){
    //get the tank status to display in the picture together with the general tank details
    $scope.getStatus = function(){
        Tanks.getStatus({tankID:$scope.tank.tank_id}).$promise
            .then(function(tank){
                $scope.tank = tank;
                $scope.tank.empty_date = new Date($scope.tank.empty_date);
            })
            .catch(function(err){
                console.error('Something went wrong with tank status retrieval. ERROR: '+JSON.stringify(err));
            });
    };
    $scope.getStatus();//make the actual call
    //function to get the translated strings from the backend
    $scope.getActionTypes = function(actionTexts){
        $scope.actionTypes = {
            inflow:actionTexts.inflow,
            outflow:actionTexts.outflow,
            initialization:actionTexts.initialization
        }
    };
    $scope.getActionClass = function(action){//glue to display the span with images for tank actions
        var spanClass;
        switch (action){
            case 'inflow':
                spanClass = 'glyphicon glyphicon-arrow-left inflow';
                break;
            case 'outflow':
                spanClass = 'glyphicon glyphicon-arrow-right outflow';
                break;
            case 'initialization':
                spanClass = 'glyphicon glyphicon-exclamation-sign initialization';
                break;
        }
        return spanClass;
    };
    //scope variables initialization
    $scope.showSuccess = false;
    $scope.showWarning = false;
    $scope.tankContents = [];
    $scope.tankActions = [];
    $scope.hideAlert = function(type){
      switch (type){
          case 'success':
              $scope.showSuccess = false;
              break;
          case 'warning':
              $scope.showWarning = false;
              break;
      }
    };
    //pagination variables*************
    $scope.tankContentsCount = 0;
    //$scope.contentsCurrentPage = 1;
    $scope.contentsPageChanged = function(page){
        $scope.getTankContents(10*(page-1));
    };

    $scope.tankActionsCount = 0;
    $scope.actionsPageChanged = function(page){
        $scope.getTankActions(10*(page-1));
    };
    //*******************
    $scope.saveTank = function(){
        //create function to save tank...
       return Tanks.update({tankID:$scope.tank.tank_id},$scope.tank).$promise
            .then(function(result){
                if (result.hasOwnProperty('status')){
                    if (result.status){
                        //successful tank update
                        $scope.showSuccess = true;
                        $scope.getStatus();
                    }
                    else {
                        if (result.message === 'tankWithNoExists'){
                            $scope.showWarning = true;
                        }
                    }
                }
            })
            .catch(function(err){
                //error
                console.error('Error with request to update tank. \nERROR:'+JSON.stringify(err));
            });
    };
    $scope.getTankContents = function(offset,limit){//function to get tank contents to fill the table
        var queryData = {tankID:$scope.tank.tank_id};
        if (typeof offset !== 'undefined'&& !isNaN(offset)) queryData.offset = offset;
        if (typeof limit !== 'undefined'&&!isNaN(limit)) queryData.limit = limit;
        Tanks.getContents(queryData).$promise
            .then(function(tank){
                //$scope.tankContentsCount = tankSums.count;
                $scope.tankContents = tank.contents.rows;
                $scope.tankContentsCount = tank.contents.count;
            })
            .catch(function(err){
               //something went wrong with the request to the server... LOG IT NOW!
                console.error('Error with the request for the tank content.\nERROR: '+JSON.stringify(err));
            });
    };
    $scope.getTankActions = function(offset,limit){//function to get tank actions to fill the tab table
        var queryData = {tankID:$scope.tank.tank_id};
        if (typeof offset !== 'undefined'&& !isNaN(offset)) queryData.offset = offset;
        if (typeof limit !== 'undefined'&&!isNaN(limit)) queryData.limit = limit;
        OilPressTank_Actions.get(queryData).$promise
            .then(function(tankActions){
                $scope.tankActionsCount = tankActions.count;
                $scope.tankActions = tankActions.rows;
            })
            .catch(function(err){
                //something went wrong with the request to the server.. LOG...
                console.error('Error with the request for the tank actions.\nERROR: '+JSON.stringify(err));
            });
    };

    $scope.viewAction = function(actionType,actionID){
        if (actionType === 'inflow'){
            viewInflow(actionID)
                .then(function(){
                   console.log('Successful inflow modal action');
                })
                .catch(function(err){
                   console.error(JSON.stringify(err));
                });
        }
        else if (actionType === 'outflow'){
            //construct url to visit outflow details
            $location.path('/outflows/'+actionID);
        }
    };

    $scope.viewProducer = function(producerID){
        Producers.get({producerID:producerID}).$promise
            .then(function(producer){
                return producerModal(null,producer)
                    .then(function(){
                        //all good
                        $scope.getTankContents();//refresh view
                        console.log('Successful modal operation');
                    })
                    .catch(function(err){
                        console.error(JSON.stringify(err));
                    });
            })
            .catch(function(err){
                console.error('Error with request to get producer... ERROR: '+JSON.stringify(err));
            });
    };


}]);

oilpressCtrls.controller('outflowsCtrl',['$scope','Outflows','$window', 'Tanks', '$q', 'Reports', function($scope,Outflows,$window, Tanks, $q, Reports){
    $scope.currentOutflows = [];//initialize currentOutflows scope variable to hold the data to get from the server
    //pagination variables
    $scope.currentOutflowsCount = 0;
    $scope.currentOutflowsCurrentPage = 1;
    $scope.oilpressTanks = [];
    $scope.queryData = {};
    //JS text function
    $scope.getMessages = function(messages){
        $scope.messages = messages;
    };
    //search functions and properties
    $scope.searchVisible = false;
    $scope.toggleSearch = function(state){
        if (typeof state === 'undefined') $scope.searchVisible = !$scope.searchVisible;
        else {
            $scope.searchID = $scope.searchFirstName = $scope.searchAFM = $scope.searchLastName = $scope.searchInvoiceNo = $scope.searchDescription = $scope.searchTank = $scope.searchFrom = $scope.searchTo = null;
            $scope.searchVisible = state;
        }
    };
    $scope.searchOutflows = function(){
        //var queryData = {};
        if ($scope.searchID) $scope.queryData.outflow_id = $scope.searchID;
        if ($scope.searchFirstName && $scope.searchFirstName.length>0) $scope.queryData.first_name = $scope.searchFirstName;
        if ($scope.searchLastName && $scope.searchLastName.length>0) $scope.queryData.last_name = $scope.searchLastName;
        if ($scope.searchAFM && $scope.searchAFM.length>0) $scope.queryData.afm = $scope.searchAFM;
        if ($scope.searchInvoiceNo && $scope.searchInvoiceNo.length>0) $scope.queryData.invoice_no = $scope.searchInvoiceNo;
        if ($scope.searchDescription && $scope.searchDescription.length>0) $scope.queryData.description = $scope.searchDescription;
        if ($scope.searchTank) $scope.queryData.tank_id = $scope.searchTank;
        if ($scope.searchFrom) $scope.queryData.from_date = $scope.searchFrom;
        if ($scope.searchTo) $scope.queryData.to_date = $scope.searchTo;
        $scope.getOutflows();
        $scope.toggleSearch(false);//hide the form
    };

    //get Oilpress Tanks
    $scope.getOilPressTank = function(){
        Tanks.query().$promise//request tanks with totals
            .then(function(tankTotals){
                $scope.oilpressTanks = tankTotals;
            })
            .catch(function(err){
                //something went wrong with the tank totals request
                console.error('Error with tank totals request.. ERROR:'+JSON.stringify(err));
            });
    };

    $scope.getOilPressTank();//actually make the call to get tank totals

    //set how and get the current outflows
    $scope.getOutflows = function(offset,limit){
        //if (typeof queryData === 'undefined')queryData = {};
        if (typeof offset !== 'undefined'&& !isNaN(offset)) $scope.queryData.offset = offset;
        if (typeof limit !== 'undefined'&&!isNaN(limit)) $scope.queryData.limit = limit;
        //make api request to get producers
        Outflows.get($scope.queryData,function(result){
            $scope.currentOutflows = result.rows;
            $scope.currentOutflowsCount = result.count;
        });
    };
    $scope.restoreOutflows = function(){//refresh outflows
        $scope.currentOutflowsCurrentPage = 1;
        $scope.queryData = {};
        $scope.getOutflows();
    };
    //enable function to page change
    $scope.pageChanged = function(){
        $scope.getOutflows(10*($scope.currentOutflowsCurrentPage-1));
    };
    $scope.pageChanged();//initial call
    $scope.$on('refreshOutflows',$scope.pageChanged);//set up listener for refreshing outflows after outflows edit...
    $scope.deleteOutflow = function(outflowID){//function to delete outflow
        //first check to make sure we want to delete outflow
        var confirmDelete = $window.confirm($scope.messages.confirmDelete);
        if (!confirmDelete){//cancel
            console.log('Canceled outflow deletion...');
            return $q.reject();
        }
        //continue to deletion
        return Outflows.delete({outflowID:outflowID}).$promise
            .then(function(result){
                if (result.status){//success
                    $window.alert($scope.messages.succesfulDeletion);
                    $scope.pageChanged();//refresh Outflows
                }
                else{
                    //error with deletion
                    var message = $scope.messages.hasOwnProperty(result.message)?$scope.messages[result.message]:JSON.stringify(result.message);
                    $window.alert(message);
                }
            })
            .catch(function(err){
                console.error('Error with outflow deletion: '+JSON.stringify(err));
            });
    };
    $scope.printOutflow = function(outflow_id){
        //fillQueryData();
        $scope.queryData.outflow_id = outflow_id;
        Reports($scope.queryData);
        //$window.open("/outflowReport/" + outflow_id,"_blank", "width=1000, height=1000, left=200, top=200");

    };

    //helper variables and fucntions for date picker
    $scope.datePopupOpenFrom = false;
    $scope.datePopupOpenTo = false;
    $scope.openDatePopupFrom = function($event){
        $event.preventDefault();
        $event.stopPropagation();
        $scope.datePopupOpenFrom = true;
    };
    $scope.openDatePopupTo = function($event){
        $event.preventDefault();
        $event.stopPropagation();
        $scope.datePopupOpenTo = true;
    };
}]);

oilpressCtrls.controller('outflowDetailCtrl',['$scope','Outflows','Tanks','viewProducer',function($scope,Outflows,Tanks,viewProducer){
    $scope.oilpressTanks = [];//initialize array to hold oilpress Tanks
    $scope.outflowContents = [];//initialize array to hold outflow contents
    //pagination variables for contents
    $scope.outflowContentsCount = 0;
    $scope.outflowContentsCurrentPage = 1;
    $scope.getOutflowContents = function(offset,limit){
        var queryData = {};
        queryData.outflowID = $scope.outflow.outflow_id;
        if (typeof offset !== 'undefined'&& !isNaN(offset)) queryData.offset = offset;
        if (typeof limit !== 'undefined'&&!isNaN(limit)) queryData.limit = limit;
        Outflows.getContents(queryData).$promise
            .then(function(result){
                $scope.outflowContents = result.contents.rows;
                $scope.outflowContentsCount = result.contents.count;
            })
            .catch(function(err){
                //something was wrong...
                console.error('Error with request to get outflow contents...\nERROR:'+JSON.stringify(err));
            });
    };
    $scope.pageChanged = function(page){
        if (typeof page === 'undefined') page = 1;
        $scope.getOutflowContents(10*(page-1));
    };
    $scope.pageChanged();//call the function to get contents
    $scope.refreshOutflow = function(){
        Outflows.get({outflowID:$scope.outflow.outflow_id}).$promise
            .then(function(outflow){
                $scope.outflow = outflow;
                $scope.getOutflowContents();
            })
            .catch(function(err){
                console.error('Error with requesting outflow: '+JSON.stringify(err));
            });
    };
    Tanks.query().$promise
        .then(function(tanks){
            //got tanks ok
            $scope.oilpressTanks = tanks;
        })
        .catch(function(err){
           //error
            console.error('Error with request to get oilpress tanks.\nERROR: '+JSON.stringify(err));
        });

    //functionality to directly view producer
    $scope.viewProducer = function(producerID){
        viewProducer(producerID)//service created for modular operation
            .then(function(){
                $scope.refreshOutflow();//refresh outflows in current page
            });
    };
    $scope.$on('outflowUpdated',function(){
        $scope.showSuccess = true;
        $scope.refreshOutflow();//refresh page details
    });
    $scope.showSuccess = false;
    $scope.hideAlert = function(type){//function to hide alerts
        switch (type){
            case 'success':
                $scope.showSuccess = false;
                break;
        }
    };
}]);

oilpressCtrls.controller('myAccountCtrl',['$scope','User','$timeout',function($scope,User,$timeout){
    //scope variables and functions
    //change password form
    $scope.showChangePassword = false;
    $scope.toggleChangePassword = function(state){
        $scope.showChangePassword = (typeof state === 'undefined'?!$scope.showChangePassword:state);
    };
    $scope.getUserInfo = function(){
        User.get().$promise
            .then(function(user){
                $scope.profile = user;//enumerate scope variable
            });
    };
    $scope.getUserInfo();
    //alert variables
    $scope.showSuccessAlert = $scope.showErrorAlert = $scope.passwordChangeSuccess = $scope.passwordChangeError = $scope.wrongPasswordError = false;
    function showAlert(type){
        var alertToToggle;
        $('html, body').animate({ scrollTop: 0 }, 'fast');//scoll to top
        switch (type){
            case 'profileSuccess':
                alertToToggle = 'showSuccessAlert';
                break;
            case 'profileError':
                alertToToggle = 'showErrorAlert';
                break;
            case 'passwordSuccess':
                alertToToggle = 'passwordChangeSuccess';
                break;
            case 'passwordError':
                alertToToggle = 'passwordChangeError';
                break;
            case 'wrongPasswordError':
                alertToToggle = 'wrongPasswordError';
                break;
        }
        $scope[alertToToggle] = true;
        $timeout(function(){$scope[alertToToggle] = false;},3000);
    }
    //user info
    $scope.saveUserInfo = function(){
        User.save($scope.profile).$promise
            .then(function(result){
                if (result.hasOwnProperty('status')){
                    if (result.status){
                        //successful save
                        showAlert('profileSuccess');
                    }
                    else{
                        //problem
                        showAlert('profileError');
                    }
                }
            })
            .catch(function(err){
                console.error('Error with request to save... ERROR: '+JSON.stringify(err));
            });
    };

    //change user password
    $scope.changePassword = function(){
        User.changePassword($scope.changePass).$promise
            .then(function(result){
                if (result.hasOwnProperty('status')){
                    if (result.status){
                        //succesful password change
                        showAlert('passwordSuccess');
                        $scope.changePass = {};//reset password Form
                        $scope.toggleChangePassword(false);
                    }
                    else{
                        //error
                        if (result.hasOwnProperty('message')){
                            if (result.message = 'wrongPassword'){
                                //wrong password
                                showAlert('wrongPasswordError');
                            }
                        }
                        else{
                            //unknown error
                            showAlert('passwordChangeError');
                        }
                    }
                }
            })
            .catch(function(err){
                console.error('Error with request to change user password... ERROR: '+JSON.stringify(err));
            });
    };

}]);

oilpressCtrls.controller('homeLatestActionsCtrl',['$scope','OilPressTank_Actions',function($scope,OilPressTank_Actions){
    //variable initialization
    $scope.oilpressActions = [];
    $scope.getActionClass = function(action){//glue to display the span with images for tank actions
        var spanClass;
        switch (action){
            case 'inflow':
                spanClass = 'glyphicon glyphicon-arrow-left inflow';
                break;
            case 'outflow':
                spanClass = 'glyphicon glyphicon-arrow-right outflow';
                break;
            case 'initialization':
                spanClass = 'glyphicon glyphicon-exclamation-sign initialization';
                break;
        }
        return spanClass;
    };

    $scope.getOilPressActions = function(){
        OilPressTank_Actions.query().$promise
            .then(function(result){
                if (result.hasOwnProperty('status')){
                    if (!result.status) console.log('Error getting actions');
                }
                else{
                    //ok update scope actions
                    $scope.oilpressActions = result;
                }
            })
            .catch(function(err){
                console.error('Error with request... ERROR: '+JSON.stringify(err));
            });
    };
    $scope.getOilPressActions();
    $scope.getActionTypes = function(actionTexts){
        $scope.actionTypes = {
            inflow:actionTexts.inflow,
            outflow:actionTexts.outflow,
            initialization:actionTexts.initialization
        }
    };

}]);

oilpressCtrls.controller('homeTankStatusCtrl',['$scope','Tanks',function($scope,Tanks){
    //variables
    $scope.oilpressTanks = [];
    $scope.getOilPressTanks = function(){
        Tanks.query().$promise
            .then(function(tanks){
                for (var i = 0, len = tanks.length;i<len;i++){
                    tanks[i].$getStatus()
                        .then(function(tankStatus){
                            $scope.oilpressTanks.push(tankStatus);
                        });
                }
            })
            .catch(function(err){
                //error with request
                console.error('Error with request to get oilpress tank status... ERROR: '+JSON.stringify(err));
            });
    };
    $scope.getOilPressTanks();//actually make the call
}]);

oilpressCtrls.controller('producerDetailsCtrl',['$scope', 'Producers','Inflows','$timeout', function($scope, Producers, Inflows, $timeout){
    $scope.successfulSave = false;
    $scope.undefinedError = false;
    function showAlert(type){
        var selectedAlert;
        switch(type){
            case 'saveSuccess':
                selectedAlert = 'successfulSave';
                break;
            case 'undefinedError':
                selectedAlert = 'undefinedError';
                break;
            default:
                return;
        }
        $scope[selectedAlert] = true;
        $timeout(function(){$scope[selectedAlert]=false;},3000);
    }

    $scope.pageChanged = function(){
        $scope.getInflows = function(offset,limit){
            //if (typeof queryData === 'undefined') queryData = {};
            if (typeof offset !== 'undefined') $scope.queryData.offset = offset;
            if (typeof limit !== 'undefined') $scope.queryData.limit = limit;
            Inflows.get({producer_id:$scope.producer.producer_id},function(result){
                $scope.currentInflows = result.rows;
                $scope.currentInflowsCount = result.count;
            });
        };
        $scope.pageChanged = function(){
            $scope.getInflows(10*($scope.currentInflowsCurrentPage-1));
        };
    };
    $scope.save = function(){
        return Producers.update($scope.producer).$promise
            .then(function(result){
                if(result.hasOwnProperty('status') && result.status){
                    showAlert('saveSuccess');
                }
                else{
                    showAlert('undefinedError');
                }
            });
    }
}]);