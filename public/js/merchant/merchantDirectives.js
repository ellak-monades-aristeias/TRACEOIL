var merchantDir = angular.module('merchantDirectives',[]);

merchantDir.directive('merchantMenu',['$rootScope',function ($rootScope){
    return {
        restrict:'E',
        scope:{},
        link:function(scope,element,attrs){
            if ($rootScope.hasOwnProperty('$state')){
                scope.$state = $rootScope.$state;
            }
            scope.menuCollapsed = true;
            scope.collapseMenu = function(){
                scope.menuCollapsed = !scope.menuCollapsed;
            };
            //monitor that when clicking on links that it closes the menu
            element.find("a").on('click',function(){
                if (!scope.menuCollapsed) scope.collapseMenu();
            });
        },
        templateUrl:'/merchant/partials/menu'
    }
}]);

merchantDir.directive('merchantInflow',['Tanks','Producers', 'Producer_Lands',function(Tanks, Producers, Producer_Lands){
    return {
        restrict: 'E',
        scope:{
            inflow:'=',
            merchantInflowForm: '=form'
        },
        templateUrl:'/merchant/partials/inflowDirective',
        link:function(scope){
            //initialize tanks array to fill the options of destination tank select
            scope.merchantTanks = [];
            Tanks.query().$promise
                .then(function(result){
                    scope.merchantTanks = result;
                    //also add the empty tank for choice
                    scope.merchantTanks.push({tank_id:null,tank_no:0,description:'Καμμία'})
                })
                .catch(function(err){
                    //error with request
                    console.error('Error requesting merchant tanks.. ERROR: '+JSON.stringify(err));
                });
            scope.maxDate = new Date();//set date to pass to datetime directive
            if (!scope.inflow.inflow_date) scope.inflow.inflow_date = new Date();

            scope.showProducerLands = false;
            scope.producer_lands = [];
            scope.searchOSDE = function(){//search for available producer lands
                scope.producer_lands = [];
                return Producers.get({afm:scope.inflow.trader_afm}).$promise
                    .then(function(results){
                        if (results.rows.length <= 0) return;
                        return Producer_Lands.get({producer_id:results.rows[0].producer_id}).$promise
                            .then(function(results){
                                for(var i = 0, len = results.rows.length;i<len;i++)
                                    scope.producer_lands.push(results.rows[i].osde);
                            })
                            .catch(function(err){
                                console.error("Error trying to get producer lands \nError: " + err);
                            });
                    })
                    .catch(function(err){
                        console.error("Error trying to get producer \nError: " + err);
                    });
            };
        }
    }
}]);

merchantDir.directive('compareTo',[function(){
    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            otherModelValue: "=compareTo"
        },
        link: function(scope,elem,attrs,ctrl) {
            ctrl.$validators.compareTo = function(modelValue){
                return modelValue === scope.otherModelValue;
            };
            scope.$watch("otherModelValue",function(){
                ctrl.$validate();
            });
        }
    }
}]);


merchantDir.directive('newTankButton',['merchantTankModal','$rootScope',function(merchantTankModal,$rootScope){
    return {
        restrict:'A',
        link:function(scope,element){
            //declare function for displaying the new tank modal
            function displayModal(){
                return merchantTankModal()
                    .then(function(){
                        //ok....
                        console.log('Successfully created new tank');
                        $rootScope.$broadcast('refreshTanks');
                    })
                    .catch(function(err){
                        //something went wrong....
                        console.log('Error while trying to create new Tank\nERROR: '+JSON.stringify(err));
                    });
            }
            //bind function run to button click
            element.on('click',displayModal);
        }
    }
}]);

merchantDir.directive('tank',[function(){
    return {
        restrict:'E',
        templateUrl:'/merchant/partials/tankDirective',
        link:function(scope){
            //datepicker options and settings

            scope.maxDate = new Date();//initialize tank init_date to today
            scope.initDatePopupOpen = false;//closed by default
            scope.openInitDatePopup = function($event){
                $event.preventDefault();
                $event.stopPropagation();
                scope.initDatePopupOpen = true;
            };
        }
    }
}]);

merchantDir.directive('tankOutflowButton',['merchantOutflowModal','$rootScope',function(merchantOutflowModal,$rootScope){
    return {
        restrict:'A',
        link:function(scope,element,attrs){
            //declare function for creating the new outflow
            function createNewOutflow(){
                return merchantOutflowModal()
                    .then(function(){
                        //we're ok...do something
                        console.log('Successfully created new outflow');
                        $rootScope.$broadcast('refreshOutflows');
                    })
                    .catch(function(err){
                        //something went wrong, show error
                        console.log('Error while trying to create outflow\nERROR: '+JSON.stringify(err));
                    });
            }

            //bind function run to button click
            element.on('click',createNewOutflow);
        }
    }
}]);

merchantDir.directive('outflow',['$rootScope','$window','Merchant_Outflows',function($rootScope,$window, Merchant_Outflows){
    return {
        restrict:'E',
        templateUrl:'/merchant/partials/outflowDirective',
        scope:{
            outflow:'=',
            merchantTanks:'=',
            outflowForm:'='
        },
        link:function(scope){
            scope.maxDate = new Date();//initiate date to pass to datetime picker
            scope.isNewOutflow = function(){
                return !scope.outflow.hasOwnProperty('outflow_id')||scope.outflow.outflow_id===null;
            };
            scope.isDirectOutflow = function(){
                return scope.outflow.tank_id === null&&scope.outflow.outflow_id!==null;
            };
            scope.save = function(){
                return Merchant_Outflows.update({outflowID:scope.outflow.outflow_id},scope.outflow).$promise
                    .then(function(result){
                        if (result.status){//successful update
                            $rootScope.$broadcast('outflowUpdated');
                        }
                        else{//error with update
                            console.error(result.message);
                            $window.alert('ERROR: '+JSON.stringify(result.message));
                        }
                    })
                    .catch(function(err){
                        //error with request
                        console.error('Error while trying to update outflow: '+JSON.stringify(err));
                    });
            };
        }
    }
}]);

merchantDir.directive('tankStatus',[function(){
    return {
        restrict: 'E',
        scope:{
            tank:'='
        },
        templateUrl:'/merchant/partials/tankStatusDirective'
    }
}]);

merchantDir.directive('tankNumberUnique',['$q','Tanks',function($q,Tanks){//custom directive for making sure tank number is unique in current oilpress
    return {
        restrict: 'A',
        require:'ngModel',
        link:function(scope,elem,attrs,ctrl){
            elem.on('blur',function(){//create on blur event
                scope.$apply(doValitation);
            });
            function doValitation(){
                //make request to see if it is unique
                Tanks.query({tank_no:elem.val()},function(result){
                    //successful db request, check if there is a result
                    if (result.length>0){
                        //there is a tank with the same number, so reject
                        console.log('Tank with same tank number in merchant, already exists');
                        ctrl.$setValidity('unique',false);
                    }
                    else{
                        //no tank with same number exists..., we're ok
                        ctrl.$setValidity('unique',true);
                    }
                },function(err){
                    //error, reject promise
                    console.error('Error while checking if tank number is unique,\nERROR:'+JSON.stringify(err));
                    ctrl.$setValidity('unique',false);
                });
            }
        }
    }
}]);

merchantDir.directive('newProducerButton',['producerModal','$rootScope',function(producerModal,$rootScope){
    return {
        restrict:'A',
        link:function(scope,element,attrs){
            //declare function for creating the new producer
            function createNewProducer(){
                return producerModal()
                    .then(function(){
                        //we're ok...do something
                        console.log('Successfully created new producer');
                        $rootScope.$broadcast('refreshProducers');
                    })
                    .catch(function(err){
                        //something went wrong, show error
                        console.error('Error while trying to create producer\nERROR: '+JSON.stringify(err));
                    });
            }

            //bind function run to button click
            element.on('click',createNewProducer);
        }
    }
}]);
