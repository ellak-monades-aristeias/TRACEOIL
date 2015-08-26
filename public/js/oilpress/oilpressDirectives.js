var oilpressDir = angular.module('oilpressDirectives',[]);


oilpressDir.directive('oilPressMenu',['$rootScope',function ($rootScope){
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
        templateUrl:'/oilpress/partials/menu'
    }
}]);


oilpressDir.directive('newInflow',[function(){
    return {
        restrict:'E',
        templateUrl:'/oilpress/partials/newInflow'
    }
}]);


oilpressDir.directive('newProducerButton',['producerModal','$rootScope',function(producerModal,$rootScope){
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

oilpressDir.directive('newOutflowButton',['oilpressOutflowModal','$rootScope',function(oilpressOutflowModal,$rootScope){
    return {
        restrict:'A',
        link:function(scope,element,attrs){
            //declare function for creating the new outflow
            function createNewOutflow(){
                return oilpressOutflowModal()
                    .then(function(){
                        //we're ok...do something
                        console.log('Successfully created new outflow');
                        $rootScope.$broadcast('refreshOutflows');
                    })
                    .catch(function(err){
                        //something went wrong, show error
                        console.error('Error while trying to create outflow\nERROR: '+JSON.stringify(err));
                    });
            }

            //bind function run to button click
            element.on('click',createNewOutflow);
        }
    }
}]);

oilpressDir.directive('newTankButton',['oilpressTankModal','$rootScope',function(oilpressTankModal,$rootScope){
    return {
        restrict:'A',
        link:function(scope,element){
            //declare function for displaying the new tank modal
            function displayModal(){
                return oilpressTankModal()
                    .then(function(){
                        //ok....
                        console.log('Successfully created new tank');
                        $rootScope.$broadcast('refreshTanks');
                    })
                    .catch(function(err){
                        //something went wrong....
                        console.error('Error while trying to create new Tank\nERROR: '+JSON.stringify(err));
                    });
            }
            //bind function run to button click
            element.on('click',displayModal);
        }
    }
}]);

oilpressDir.directive('tankNumberUnique',['$q','Tanks',function($q,Tanks){//custom directive for making sure tank number is unique in current oilpress
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
                        console.log('Tank with same tank number in oilpress, already exists');
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

oilpressDir.directive('tank',[function(){
    return {
        restrict:'E',
        templateUrl:'/oilpress/partials/tankDirective',
        link:function(scope){
            //datepicker options and settings

            scope.maxDate = new Date();//initialize tank init_date to today
            scope.emptyDatePopupOpen = false;//closed by default
            scope.openEmptyDatePopup = function($event){
                $event.preventDefault();
                $event.stopPropagation();
                scope.emptyDatePopupOpen = true;
            };
        }
    }
}]);

oilpressDir.directive('producerAfmUnique',['$q','Producers',function($q,Producers){//custom directive for making sure producer afm does not already exist in producer creation
    return {
        restrict: 'A',
        require:'ngModel',
        link:function(scope,elem,attrs,ctrl){
            elem.on('blur',function(){//create on blur event
                scope.$apply(doValitation);
            });
            function doValitation(){
                //make request to see if it is unique
                Producers.get({afm:elem.val()},function(result){
                    //successful db request, check if there is a result
                    if (result.rows.length>0){
                        //there is a producer with the same afm, so reject
                        console.log('Producer with same afm number already exists');
                        ctrl.$setValidity('newAfm',false);
                    }
                    else{
                        //no producer with same afm exists..., we're ok
                        ctrl.$setValidity('newAfm',true);
                    }
                },function(err){
                    //error, reject promise
                    console.error('Error while checking if producer afm already exists,\nERROR:'+JSON.stringify(err));
                    ctrl.$setValidity('newAfm',false);
                });
            }
        }
    }
}]);

oilpressDir.directive('producerEmailUnique',['$q','Producers',function($q,Producers){//custom directive for making sure producer email does not already exist in producer creation
    return {
        restrict: 'A',
        require:'ngModel',
        link:function(scope,elem,attrs,ctrl){
            elem.on('blur',function(){//create on blur event
                scope.$apply(doValitation);
            });
            function doValitation(){
                //make request to see if it is unique
                Producers.get({email:elem.val()},function(result){
                    //successful db request, check if there is a result
                    if (result.rows.length>0){
                        //there is a producer with the same email, so reject
                        console.log('Producer with same email already exists');
                        ctrl.$setValidity('newEmail',false);
                    }
                    else{
                        //no producer with same email exists..., we're ok
                        ctrl.$setValidity('newEmail',true);
                    }
                },function(err){
                    //error, reject promise
                    console.error('Error while checking if producer email already exists,\nERROR:'+JSON.stringify(err));
                    ctrl.$setValidity('newEmail',false);
                });
            }
        }
    }
}]);



oilpressDir.directive('outflow',['Outflows','$rootScope','$window',function(Outflows,$rootScope,$window){
    return {
        restrict:'E',
        templateUrl:'/oilpress/partials/outflowDirective',
        scope:{
            outflow:'=',
            oilpressTanks:'='
        },
        link:function(scope){
            scope.maxDate = new Date();//initiate date to pass to datetime picker
            scope.isNewOutflow = function(){
                return !scope.outflow.hasOwnProperty('outflow_id')||scope.outflow.outflow_id===null;
            };
            scope.save = function(){
                return Outflows.update({outflowID:scope.outflow.outflow_id},scope.outflow).$promise
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

oilpressDir.directive('merchantAfmExists',['$q','Merchants',function($q,Merchants){//custom directive for making sure producer afm does not already exist in producer creation
    return {
        restrict: 'A',
        require:'ngModel',
        link:function(scope,elem,attrs,ctrl){
            elem.on('blur',function(){//create on blur event
                scope.$apply(doValitation);
            });
            function doValitation(){
                //make request to see if it is unique
                Merchants.get({afm:elem.val()},function(result){
                    //successful db request, check if there is a result
                    if (result.count>0){
                        //there is a merchant with the same afm, so resolve
                        console.log('merchant with same afm number exists');
                        ctrl.$setValidity('merchantExists',true);
                    }
                    else{
                        //no merchant with afm exists..., reject
                        ctrl.$setValidity('merchantExists',false);
                    }
                },function(err){
                    //error, reject promise
                    console.error('Error while checking if merchant afm exists,\nERROR:'+JSON.stringify(err));
                    ctrl.$setValidity('merchantExists',false);
                });
            }
        }
    }
}]);

oilpressDir.directive('compareTo',[function(){
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

oilpressDir.directive('tankStatus',[function(){
    return {
        restrict: 'E',
        scope:{
            tank:'='
        },
        templateUrl:'/oilpress/partials/tankStatusDirective'
    }
}]);