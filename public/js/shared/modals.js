var appModals = angular.module('appModals',[]);

appModals.factory('genericModal',['$modal',function($modal){
    //create the function to accept the model type, size and input
    return function(modalDefinitionObj,size,input){
        if (size) modalDefinitionObj.size = size; //same for all types
        var inputData = {};//create the required object for input
        if (typeof input !== 'undefined') inputData = input;//assign the input to input data to be passed to the model resolve function
        if (!modalDefinitionObj.hasOwnProperty('resolve')) modalDefinitionObj.resolve = {};
        modalDefinitionObj.resolve.entries = function(){return inputData};
        //now open the modal
        var modalInstance = $modal.open(modalDefinitionObj);
        return modalInstance.result;//return the promise object
    }
}]);

//MODALS *****************************

appModals.factory('oilpressInflowModal',['$modal',function($modal){
    return function(inflow){
        var modalInstance = $modal.open({
            templateUrl:'/helpers/oilpressInflowModal',
            controller:'oilpressInflowModalCtrl',
            resolve:{
                inflow: function(){
                    return inflow; }
            }
        });
        return modalInstance.result;
    }
}]);

appModals.factory('producerModal',['genericModal',function(genericModal){
    //call generic function for displaying modals with correct input and types
    return function(size,input){
        var modalDefinitionObj = {};
        modalDefinitionObj.templateUrl = '/helpers/producerModal';
        modalDefinitionObj.controller = 'producerModalCtrl';
        return genericModal(modalDefinitionObj,size,input);
    }
}]);

appModals.factory('oilpressTankModal',['genericModal',function(genericModal){
    //call generic function for displaying modals with correct input and types
    return function(size,input){
        var modalDefinitionObj = {};
        modalDefinitionObj.templateUrl = '/helpers/oilpressTankModal';
        modalDefinitionObj.controller = 'oilpressTankModalCtrl';
        return genericModal(modalDefinitionObj,size,input);
    }
}]);

appModals.factory('oilpressOutflowModal',['genericModal',function(genericModal){
    return function(size,input){
        var modalDefinitionObj = {};
        modalDefinitionObj.templateUrl = '/helpers/oilpressOutflowModal';
        modalDefinitionObj.controller = 'oilpressOutflowModalCtrl';
        return genericModal(modalDefinitionObj,size,input);
    }
}]);

appModals.factory('oilpressModal',['genericModal',function(genericModal){
    return function(size,input){
        var modalDefinitionObj = {};
        modalDefinitionObj.templateUrl = '/helpers/oilpressModal';
        modalDefinitionObj.controller = 'oilpressModalCtrl';
        return genericModal(modalDefinitionObj,size,input);
    }
}]);

appModals.factory('merchantInflowModal',['genericModal',function(genericModal){
    return function(size,input){
        var modalDefinitionObj = {};
        modalDefinitionObj.templateUrl = '/helpers/merchantInflowModal';
        modalDefinitionObj.controller = 'merchantInflowModalCtrl';
        return genericModal(modalDefinitionObj,size,input);
    }
}]);

appModals.factory('merchantModal',['genericModal',function(genericModal){
    //call generic function for displaying modals with correct input and types
    return function(size,input){
        var modalDefinitionObj = {};
        modalDefinitionObj.templateUrl = '/helpers/merchantModal';
        modalDefinitionObj.controller = 'merchantModalCtrl';
        return genericModal(modalDefinitionObj,size,input);
    }
}]);

appModals.factory('merchantOutflowModal',['genericModal',function(genericModal){
    return function(size,input){
        var modalDefinitionObj = {};
        modalDefinitionObj.templateUrl = '/helpers/merchantOutflowModal';
        modalDefinitionObj.controller = 'merchantOutflowModalCtrl';
        return genericModal(modalDefinitionObj,size,input);
    }
}]);

appModals.factory('merchantTankModal',['genericModal',function(genericModal){
    //call generic function for displaying modals with correct input and types
    return function(size,input){
        var modalDefinitionObj = {};
        modalDefinitionObj.templateUrl = '/helpers/merchantTankModal';
        modalDefinitionObj.controller = 'merchantTankModalCtrl';
        return genericModal(modalDefinitionObj,size,input);
    }
}]);

appModals.factory('emptyTankModal',['genericModal',function(genericModal){
    //call generic function for displaying modals with correct input and types
    return function(size,input,OutflowServiceType){
        var modalDefinitionObj = {};
        modalDefinitionObj.templateUrl = '/helpers/emptyTankModal';
        modalDefinitionObj.controller = 'emptyTankModalCtrl';
        modalDefinitionObj.resolve = {
            OutflowService:function(){return OutflowServiceType;}
        };
        return genericModal(modalDefinitionObj,size,input);
    }
}]);

appModals.factory('scanProducerCardModal',['genericModal',function(genericModal){
    return function(size,producer_id){
        var modalDefinitionObj = {};
        modalDefinitionObj.templateUrl = '/helpers/scanProducerModal';
        modalDefinitionObj.controller = 'scanProducerCardModalCtrl';
        modalDefinitionObj.windowClass = 'center-modal';
        modalDefinitionObj.resolve = {
            producerID:function(){return producer_id;}
        };
        return genericModal(modalDefinitionObj,size);
    }
}]);

//MODAL CONTROLLERS*************
appModals.controller('merchantInflowModalCtrl',['$scope','$rootScope','entries','$modalInstance','Merchant_Inflows','$window',function($scope,$rootScope,entries,$modalInstance,Merchant_Inflows,$window){
    //get text messages to display
    $scope.getMessages = function(messages){
        $rootScope.getScopeMessages($scope,messages);
    };
    //input initialization
    $scope.inflow = entries;
    $scope.inflowForm = {};//form variable to keep track of the form status inside the inflow directive to be passed
    //modal functions
    $scope.close = function(){
        $modalInstance.dismiss('cancel');
    };
    $scope.save = function(){
        Merchant_Inflows.save().$promise
            .then(function(result){
                if (result.hasOwnProperty('status') && !result.status){
                    //error
                    if(result.message = 'notValidUserType'){
                        $window.alert($scope.messages[result.message]);
                    }
                    else if (result.message = 'traderNotFound'){
                        //not existing trader
                        var confirmTraderCreation = $window.confirm($scope.messages['confirmTraderCreation']);
                    }
                }
            })
            .catch(function(err){
                //error with request to save new merchant inflow
                console.error('Error with request to create new merchant inflow. ERROR:'+JSON.stringify(err));
            });
    };
}]);

appModals.controller('oilpressModalCtrl',['$scope','entries','$modalInstance','Oilpresses','$rootScope','$window',function($scope,entries,$modalInstance,Oilpresses,$rootScope,$window){
    //get text messages to display
    $scope.getMessages = function(messages){
        $rootScope.getScopeMessages($scope,messages);
    };
    //input initialization
    $scope.oilpress = entries;
    //enable cancel button
    $scope.close = function(){
        $modalInstance.dismiss('cancel');
    };
    $scope.save = function(){
        var mode;
        //check if we are dealing with an update or a new oilpress creation
        if ($scope.oilpress.hasOwnProperty('oilpress_id')) mode = 'update';
        else mode = 'create';
        var promiseToExecute;//helper variable to hold promise to execute depending on mode selection
        if (mode === 'create'){
            //create mode
            promiseToExecute = Oilpresses.save($scope.oilpress).$promise;
        }
        else{
            //update mode
            promiseToExecute = Oilpresses.update({oilpressID:$scope.oilpress.oilpress_id},$scope.oilpress).$promise;
        }
        return promiseToExecute
            .then(function(result){
                if (result.status){
                    //succesful save
                    console.log('Succesful oilpress save');
                    $window.alert($scope.messages['successfulSave']);
                    $rootScope.$broadcast('refreshOilpresses');//signal controller to update oilpresses
                    $modalInstance.close('ok');//close the modal
                }
                else{
                    //error with save
                    console.error('Error saving oilpress');
                    if (result.hasOwnProperty('message') && result.message){
                        //check for predefined message existence
                        var message = $scope.messages.hasOwnProperty(result.message)?$scope.messages[result.message]:$scope.messages['unknownError'];
                        $window.alert(message);
                    }
                }
            })
            .catch(function(err){
                //error with api request
                console.error('Error with api request. ERROR: '+JSON.stringify(err));
            });
    };

}]);

appModals.controller('oilpressInflowModalCtrl',['$filter','$scope','$modalInstance','inflow','Tanks','Inflows','$window',function($filter,$scope,$modalInstance,inflow,Tanks,Inflows,$window){
    $scope.tanks = [];
    $scope.getMessages = function(messages){
        $scope.messages = messages;
    };
    Tanks.query().$promise
        .then(function(tanks){
            $scope.tanks = tanks;
        })
        .catch(function(err){
            console.error('Error while getting oilpress tanks:'+JSON.stringify(err));
            $scope.close();
        });
    inflow.inflow_date = new Date(inflow.inflow_date);//convert inflow_date to date object to be able to manipulate it correctly
    $scope.inflow = inflow;
    $scope.inflowProducerFullName = function(){
        if (inflow.hasOwnProperty('Producer')){
            return inflow.Producer.first_name+' '+inflow.Producer.last_name;
        }
        else return null;
    };
//    $scope.inflowDate = function(){
//        return $filter('date')($scope.inflow.inflow_date,'dd/MM/yyyy HH:mm:ss');
//    };
    $scope.close = function(){
        $modalInstance.close();
    };
    $scope.save = function(){//function to update the inflow
        return Inflows.update($scope.inflow).$promise
            .then(function(result){
                if (result.hasOwnProperty('status')){
                    if (result.status){
                        //successful update
                        $window.alert($scope.messages.successfulUpdate);
                        $scope.close();
                    }
                    else{
                        //error
                        var message = $scope.messages.hasOwnProperty(result.message)?$scope.messages[result.message]:result.message;
                        $window.alert(message);
                    }
                }
            })
            .catch(function(err){
                //something went wrong
                console.error('Error while trying to update inflow... :'+JSON.stringify(err));
                $window.alert(JSON.stringify(err));
            });
    };
}]);

appModals.controller('oilpressTankModalCtrl',['$scope','$rootScope','$modalInstance','entries','Tanks','$window',function($scope,$rootScope,$modalInstance,entries,Tanks,$window){
    //get text messages to display
    $scope.getMessages = function(messages){
        $rootScope.getScopeMessages($scope,messages);
    };
    $scope.tank = {};
    //fill the predefined values for the tank
    for (var head in entries){
        $scope.tank[head] = entries[head];
    }
    //enable cancel button
    $scope.close = function(){
        $modalInstance.dismiss('cancel');
    };

    //save function
    $scope.save = function(){
        //check if we are editing an existing or creating a new tank
        if ($scope.tank.hasOwnProperty('tank_id')){
            //existing tank update
            return Tanks.update($scope.tank,successfulSave,unsuccessfulSave).$promise;
        }
        else{
            //new Tank
            return Tanks.save($scope.tank,successfulSave,unsuccessfulSave).$promise;
        }

        function successfulSave(result){
            //check if add was successful or display the message
            if(result.hasOwnProperty('status') && !result.status){
                //bad bad response
                console.error('Error in save request, ERROR: '+JSON.stringify(result.error));
                // display the message
                var message = $scope.messages.hasOwnProperty(result.error)?$scope.messages[result.error]:JSON.stringify(result.error);
                $window.alert(message);
            }
            else{
                //we're all set!
                //display success message and close modal returning the newly added tank
                $window.alert($scope.messages.succesfulSave);
                $modalInstance.close(result);
            }
        }

        function unsuccessfulSave(err){
            //something went wrong with the request...
            console.error('Error with  Tank request: \n'+JSON.stringify(err));
        }
    };

}]);

appModals.controller('producerModalCtrl',['$rootScope','$scope','entries','$modalInstance','Producers','$window',function($rootScope,$scope,entries,$modalInstance,Producers,$window){
    //get text messages to display
    $scope.getMessages = function(messages){
        $rootScope.getScopeMessages($scope,messages);
    };
    $scope.producer = {};
    //fill the predefined values for the new producer
    for (var head in entries){
        $scope.producer[head] = entries[head];
    }
    //enable cancel button
    $scope.close = function(){
        $modalInstance.dismiss('cancel');
    };

    $scope.save = function(){
        //check if we are editing an existing or creating a new producer
        if ($scope.producer.hasOwnProperty('producer_id')){
            //existing producer update
            return Producers.update($scope.producer,successfulSave,unsuccessfulSave).$promise;
        }
        else{
            //new Producer
            return Producers.save($scope.producer,successfulSave,unsuccessfulSave).$promise;
        }

        function successfulSave(result){
            //check if add was successful or display the message
            if(result.hasOwnProperty('status') && !result.status){
                //bad bad response
                var message;
                if (result.hasOwnProperty('custom') && result.custom) message = $scope.messages[result.message]; //check for custom message to translate it
                else message = result.message;
                // display the message
                $window.alert(message);
            }
            else{
                //we're all set!
                //display success message and close modal returning the newly added producer....
                $window.alert($scope.messages.succesfulSave);
                $modalInstance.close(result);
            }
        }

        function unsuccessfulSave(err){
            //something went wrong with the request...
            console.error('Error with  Producer request: \n'+JSON.stringify(err));
        }
    };

}]);

appModals.controller('oilpressOutflowModalCtrl',['$rootScope','$scope','entries','$modalInstance','Outflows','$window','Tanks',function($rootScope,$scope,entries,$modalInstance,Outflows,$window,Tanks){
    //get text messages to display
    $scope.getMessages = function(messages){
        $rootScope.getScopeMessages($scope,messages);
    };
    $scope.outflow = {};//initialize scope outflow object
    $scope.saveButtonDisabled = false;//enable the button by default
    $scope.outflow.outflow_date = new Date();//initialize date
    $scope.maxDate = new Date();
    //get oilPress Tanks to enumerate contents for outflow
    $scope.oilpressTanks = [];//initialize tanks array
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
    //save - close functions
    $scope.close = function(){
        $modalInstance.dismiss('cancel');
    };
    $scope.save = function(){
        $scope.saveButtonDisabled = true;//disable save button
        return Outflows.save($scope.outflow).$promise
            .then(function(result){
                if (result.hasOwnProperty('status')){
                    if (!result.status){//something went wrong
                        //check to see if there is a predefined message for alert
                        var message = ($scope.messages.hasOwnProperty(result.message)?$scope.messages[result.message]:JSON.stringify(result.message));
                        $window.alert($scope.messages.errorHappened+message);
                    }
                    else{
                        //everything ok.. display confirmation
                        $window.alert($scope.messages.confirmSave);
                        $modalInstance.close(result);
                    }
                }
                $scope.saveButtonDisabled = false;//enable save button
            })
            .catch(function(err){
                //something went wrong with the request...
                console.error('Error with  outflow request: \n'+JSON.stringify(err));
                $scope.saveButtonDisabled = false;//enable save button
            });
    };
}]);

//HELPER FUNCTIONS **********
appModals.factory('viewProducer',['Producers','producerModal',function(Producers,producerModal){
    //service to provide it with a producer ID and displays a modal with the producer info and the ability to edit and save the producer
    return function(producerID){
        //first get Producer
        return Producers.get({producerID:producerID}).$promise
            .then(function(producer){
                return producerModal(null,producer);
            })
            .then(function(){
                //all good
                console.log('Successful modal operation');
            })
            .catch(function(err){
                //error in view Producer function
                console.log(JSON.stringify(err));
            });
    }

}]);


appModals.controller('merchantTankModalCtrl',['$scope','$rootScope','$modalInstance','entries','Tanks','$window',function($scope,$rootScope,$modalInstance,entries,Tanks,$window){
    //get text messages to display
    $scope.getMessages = function(messages){
        $rootScope.getScopeMessages($scope,messages);
    };
    $scope.tank = {};
    //fill the predefined values for the tank
    for (var head in entries){
        $scope.tank[head] = entries[head];
    }
    //enable cancel button
    $scope.close = function(){
        $modalInstance.dismiss('cancel');
    };

    //save function
    $scope.save = function(){
        //check if we are editing an existing or creating a new tank
        if ($scope.tank.hasOwnProperty('tank_id')){
            //existing tank update
            return Tanks.update($scope.tank,successfulSave,unsuccessfulSave).$promise;
        }
        else{
            //new Tank
            return Tanks.save($scope.tank,successfulSave,unsuccessfulSave).$promise;
        }

        function successfulSave(result){
            //check if add was successful or display the message
            if(result.hasOwnProperty('status') && !result.status){
                //bad bad response
                console.error('Error in save request, ERROR: '+JSON.stringify(result.error));
                // display the message
                var message = $scope.messages.hasOwnProperty(result.error)?$scope.messages[result.error]:JSON.stringify(result.error);
                $window.alert(message);
            }
            else{
                //we're all set!
                //display success message and close modal returning the newly added tank
                $window.alert($scope.messages.succesfulSave);
                $modalInstance.close(result);
            }
        }

        function unsuccessfulSave(err){
            //something went wrong with the request...
            console.error('Error with  Tank request: \n'+JSON.stringify(err));
        }
    };

}]);

appModals.controller('merchantOutflowModalCtrl',['$rootScope','$scope','entries','$modalInstance','$window','Tanks','Merchant_Outflows',function($rootScope,$scope,entries,$modalInstance,$window,Tanks,Merchant_Outflows){
    //get text messages to display
    $scope.getMessages = function(messages){
        $rootScope.getScopeMessages($scope,messages);
    };
    //$scope.oilCompanies=[];
    $scope.outflow = {};//initialize scope outflow object
    $scope.outflow.outflow_date = new Date();//initialize date
    $scope.maxDate = new Date();
    //get Merchant Tanks to enumerate contents for outflow
    $scope.merchantTanks = [];//initialize tanks array
    $scope.getMerchantTank = function(){
        Tanks.query().$promise//request tanks with totals
            .then(function(tankTotals){
                $scope.merchantTanks = tankTotals;
            })
            .catch(function(err){
                //something went wrong with the tank totals request
                console.error('Error with tank totals request.. ERROR:'+JSON.stringify(err));
            });
    };
    $scope.getMerchantTank();//actually make the call to get tank totals

    //$scope.getOilcompanies = function(){
    //    Oilcompanies.query().$promise
    //        .then(function(oilcompanies){
    //            $scope.oilCompanies = oilcompanies;
    //        })
    //        .catch(function(err){
    //            console.error('Error while trying to get oilcompanies' + err);
    //        });
    //};
    //$scope.getOilcompanies();
    //save - close functions
    $scope.close = function(){
        $modalInstance.dismiss('cancel');
    };
    $scope.saveOutflow = function(){
        $scope.outflow.oilcompany_id=1;//for now hardcoded to oilcompany "ELAIS"
        return Merchant_Outflows.save($scope.outflow).$promise
            .then(function(result){
                if (result.hasOwnProperty('status')){
                    if (!result.status){//something went wrong
                        //check to see if there is a predefined message for alert
                        var message = ($scope.messages.hasOwnProperty(result.message)?$scope.messages[result.message]:JSON.stringify(result.message));
                        $window.alert($scope.messages.errorHappened+message);
                    }
                    else{
                        //everything ok.. display confirmation
                        $window.alert($scope.messages.confirmSave);
                        $modalInstance.close(result);
                    }
                }
            })
            .catch(function(err){
                //something went wrong with the request...
                console.error('Error with  outflow request: \n'+JSON.stringify(err));
            });
    };
}]);

appModals.controller('merchantModalCtrl',['$rootScope','$scope','entries','$modalInstance','Merchants','$window',function($rootScope,$scope,entries,$modalInstance,Merchants,$window){
    //get text messages to display
    $scope.getMessages = function(messages){
        $rootScope.getScopeMessages($scope,messages);
    };
    $scope.merchant = entries;
    //enable cancel button
    $scope.close = function(){
        $modalInstance.dismiss('cancel');
    };


}]);

appModals.controller('emptyTankModalCtrl',['$rootScope','$scope','entries','$modalInstance','$window','OutflowService','User','$q',function($rootScope,$scope,entries,$modalInstance, $window, OutflowService, User, $q){
    //get text messages to display
    $scope.outflow ={};
    $scope.getMessages = function(messages){
        $rootScope.getScopeMessages($scope,messages);
    };
    $scope.tank =entries;
    //enable cancel button
    $scope.close = function(){
        $modalInstance.dismiss('cancel');
    };
    $scope.save = function(){
        User.get().$promise
            .then(function(user){
                $scope.user_type_id = user.type_id;
            })
            .catch(function(err){
                console.error("Error while trying to get user type id" + "\nError: " + JSON.stringify(err));
            });
        $scope.outflow.quantity = $scope.tank.total_quantity;
        $scope.outflow.tank_id = $scope.tank.tank_id;
        return OutflowService.save($scope.outflow).$promise
            .then(function(result){
                if (result.hasOwnProperty('status')){
                    if (!result.status){//something went wrong
                        //check to see if there is a predefined message for alert
                        var message = ($scope.messages.hasOwnProperty(result.message)?$scope.messages[result.message]:JSON.stringify(result.message));
                        $window.alert($scope.messages.errorHappened+message);
                    }
                    else{
                        //everything ok.. display confirmation
                        $window.alert($scope.messages.confirmSave);
                        $modalInstance.close(result);
                        $rootScope.$broadcast('refreshTanks');
                    }
                }
            })
            .catch(function(err){
                //something went wrong with the request...
                console.error('Error with  outflow request: \n'+JSON.stringify(err));
            });

    }

}]);

appModals.controller('scanProducerCardModalCtrl',['$scope','$rootScope','producerID','Producers','$modalInstance', '$window','$state','$q', function($scope, $rootScope, producerID, Producers, $modalInstance, $window,$state,$q){
    $scope.getMessages = function(messages){
        $rootScope.getScopeMessages($scope,messages);
    };
    $scope.producer_id = producerID;
    window.getUID = function(uid){
        if (producerID === 0){
            //scan card to find producer
            Producers.get({uid:uid}).$promise
                .then(function(result){
                    if(result.count >0){
                        $state.go('producers.producerDetails',{producerID:result.rows[0].producer_id});
                        $modalInstance.close('ok');
                    }
                    else{
                        $window.alert($scope.messages.producerNotFound);
                    }

                })
                .catch(function(err){
                    $window.alert($scope.messages.undefinedError);
                    console.error(err);
                })
        }
        else{
            //assign producer to card
            var updateData = {
                uid: uid
            };
            Producers.get({uid:uid}).$promise
                .then(function(result){
                    if (result.count > 0){
                        var confirmChange = $window.confirm($scope.messages.confirmProducersCardChange);
                        if (confirmChange) return result.rows[0];//the producer that needs uid emptied
                        else return $q.reject('canceled');
                    }
                    return null;//nothing else selected
                })
                .then(function(producerToBeNulled){
                    if (producerToBeNulled === null) return;//justcontinue since no producer needed to be updated with null uid
                    return Producers.update({producerID:producerToBeNulled.producer_id},{uid:null}).$promise;
                })
                .then(function(){
                    return Producers.update({producerID:producerID},updateData).$promise;
                })
                .then(function(result){
                    if(result.hasOwnProperty('status')&&!result.status){
                        $window.alert($scope.messages.undefinedError);
                        $modalInstance.dismiss('error');
                    }
                    else{
                        $window.alert($scope.messages.confirmSave);
                        $modalInstance.close('ok');
                    }
                })
                .catch(function(err){
                    console.log(err);
                });

        }
    }
}]);