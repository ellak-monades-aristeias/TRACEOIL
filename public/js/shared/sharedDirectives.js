var sharedDirs = angular.module('sharedDirectives',['ngResource']);

sharedDirs.directive('afmExists',['$resource',function($resource){//custom directive for making sure entity afm exists
    return {
        restrict: 'A',
        scope:{
            active:'@afmExists',
            userType: '@',
            initValue:'@'
        },
        require:'ngModel',
        link:function(scope,elem,attrs,ctrl){
            if (scope.active === 'false') return;//do not operate if not selected activation of directive
            var initValue = scope.initValue;
            elem.on('blur',function(){//create on blur event
                scope.$apply(doValitation);
            });
            function doValitation(){
                var table;
                switch (scope.userType){
                    case '1':
                        table='producers';
                        break;
                    case '2':
                        table = 'oilpresses';
                        break;
                    default:
                        table = null;//not accepted user type
                }
                if (table === null){
                    ctrl.$setValidity('afmExists',false);
                    return;
                }
                var resURL = '/api/'+table;
                var dbRes = $resource(resURL);
                //make request to see if it is unique
                dbRes.get({afm:elem.val()}).$promise
                    .then(function(result){
                        if (result.rows.length>0){
                            //there is a entity with the same afm, so ok
                            console.log('Entity '+table+' with same afm number already exists');
                            ctrl.$setValidity('afmExists',true);
                        }
                        else{
                            //no entity with same afm exists..., reject
                            ctrl.$setValidity('afmExists',false);
                        }
                    })
                    .catch(function(err){
                        //error, reject promise
                        console.error('Error while checking if db entity '+table+' afm already exists,\nERROR:'+JSON.stringify(err));
                        ctrl.$setValidity('afmExists',false);
                    });
            }
        }
    }
}]);

sharedDirs.directive('afmUnique',['$resource',function($resource){//custom directive for making sure entity afm is unique
    return {
        restrict: 'A',
        scope:{
            table: '@',
            initValue:'@'
        },
        require:'ngModel',
        link:function(scope,elem,attrs,ctrl){
            if (scope.table !== 'producers' && scope.table !== 'oilpresses'){
                //invalid table name passed so reject it,
                return;
            }
            var resURL = '/api/'+scope.table;
            var dbRes = $resource(resURL);
            var initValue = scope.initValue;
            elem.on('blur',function(){//create on blur event
                scope.$apply(doValitation);
            });
            function doValitation(){
                //check to see if it has the initial value of the entity's afm
                if (elem.val() === initValue){
                    //no check needed
                    return;
                }
                //make request to see if it is unique
                dbRes.get({afm:elem.val()}).$promise
                    .then(function(result){
                        if (result.rows.length>0){
                            //there is a entity with the same afm, so reject
                            console.log('Entity '+scope.table+' with same afm number already exists');
                            ctrl.$setValidity('uniqueAfm',false);
                        }
                        else{
                            //no entity with same afm exists..., we're ok
                            ctrl.$setValidity('uniqueAfm',true);
                        }
                    })
                    .catch(function(err){
                        //error, reject promise
                        console.error('Error while checking if db entity '+scope.table+' afm already exists,\nERROR:'+JSON.stringify(err));
                        ctrl.$setValidity('uniqueAfm',false);
                    });
            }
        }
    }
}]);

sharedDirs.directive('myCurrentTime', ['$interval', 'dateFilter', function($interval, dateFilter) {

    function link(scope, element, attrs) {
        var format,
            timeoutId;

        function updateTime() {
            element.val(dateFilter(new Date(), format));
        }

        scope.$watch('format', function(value) {
            format = value;
            updateTime();
        });

        element.on('$destroy', function() {
            $interval.cancel(timeoutId);
        });

        // start the UI update process; save the timeoutId for canceling
        timeoutId = $interval(function() {
            updateTime(); // update DOM
        }, 1000);
    }

    return {
        link: link
    };
}]);

sharedDirs.directive('dateTimePicker',[function(){
    return {
        restrict: 'E',
        scope:{
            dateModel: '=',
            elementName: '@',
            dateFormat: '@',
            maxDate: '=',
            dateLabelText: '@',
            timeLabelText: '@',
            isRequired: '@',
            formName: '=',
            missingDateText: '@'
        },
        templateUrl:'/helpers/dateTimePicker',
        link:function(scope){
            if(typeof scope.dateModel === "undefined") scope.dateModel = new Date();

            //if maxDate not ok just set it to now
            if (!scope.maxDate) scope.maxDate = new Date();
            //set initial binding of timepicker to date passed
            if (!(scope.dateModel instanceof Date)){
                scope.dateModel = new Date(scope.dateModel);
            }

            scope.timePart = scope.dateModel?new Date(scope.dateModel):new Date();
            //set initial variables for picker functions
            scope.datePopupOpen = false;
            scope.dateOptions = {datepickermode:'dd/MM/yyyy',startingDay:1};
            scope.openDatePopup = function($event){
                $event.preventDefault();
                $event.stopPropagation();
                scope.datePopupOpen = true;
            };
            scope.updateDateTime = function(){
                if (scope.dateModel === null) return; //skip if inflow_date not instantiated yet
                scope.dateModel.setHours(scope.timePart.getHours());
                scope.dateModel.setMinutes(scope.timePart.getMinutes());
                //scope.dateModel.setSeconds(scope.timePart.getSeconds());
            };
        }
    }
}]);

sharedDirs.directive('spinner',['$timeout',function($timeout){
    return {
        restrict: 'A',
        scope:{
            fn: '&spinner'
        },
        link:function(scope,element,attrs){
            if (!scope.fn) return;//empty spinner attribute,,,cannot continue
            element.addClass('ladda-button');//add ladda class to button
            element.attr('data-style','zoom-in');//add lada spinner style
            var button = element[0];//get dom element
            var l = Ladda.create(button);
            var startDateTime;
            element.click(function(e){
                e.preventDefault();
                //attrs.disabled = true;
                startDateTime = new Date();
                l.start();
                scope.fn()
                    .finally(function(){
                        l.stop();
                        //operations completed
                        //attrs.disabled = false;
                        //var timePassed = (new Date()) - startDateTime;
                        //if (timePassed>1000){//animation shown for at least one second
                        //    l.stop();
                        //}
                        //else{
                        //    $timeout(l.stop,1000-timePassed);
                        //}
                    });
            });
        }
    }
}]);

sharedDirs.directive('datepickerPopup', function (){
    return {
        restrict: 'EAC',
        require: 'ngModel',
        link: function(scope, element, attr, controller) {
            //remove the default formatter from the input directive to prevent conflict
            controller.$formatters.shift();
        }
    }
});

//----Logout Service.... Not really the greatest place to add a service but bored to create whole other folder structure for one file...
sharedDirs.service('SessionExpired',['$document','$interval','$window',function($document,$interval,$window){
    function checkCookie(){
        if ($document[0].cookie === '')//cookie expired...
            $window.location.assign('logout');
    }
    var intervalPeriod = 60000;//1 minute interval...
    this.intervalID = $interval(checkCookie,intervalPeriod);
}]);