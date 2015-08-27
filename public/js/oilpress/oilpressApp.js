var oilpressApp = angular.module('oilpressApp',['ui.router','ui.bootstrap','oilpressDirectives','sharedDirectives','oilpressServices','oilpressControllers','ngAnimate','appModals']);

oilpressApp.run(['$rootScope','$state','SessionExpired',function($rootScope,$state,SessionExpired){
    $rootScope.$state = $state;
    //Idle.watch();
}]);

oilpressApp.config(['$stateProvider','$urlRouterProvider','$locationProvider',function($stateProvider,$urlRouterProvider,$locationProvider){
    $locationProvider.html5Mode(true);//remove the hash sign from url
    $urlRouterProvider.otherwise('/');
    //IdleProvider.idle(1600);
    //IdleProvider.timeout(5);
    $stateProvider
        .state('home',{
            url:'/',
            templateUrl:'/oilpress/partials/home',
            controller:['$rootScope','$scope',function($rootScope,$scope){
                $rootScope.emptyPageArrays();
                $rootScope.nonIEPageCSSArray.push('/bs/css/responsiveTable.css');
                $rootScope.pageCSSArray.push('/css/oilpress/oilpressHome.css');
                $scope.format = 'MM/d/yy HH:mm:ss';
                $rootScope.setTitle('home');//set page header title
            }]
        })
        .state('inflows',{
            url:'/inflows',
            templateUrl:'/oilpress/partials/inflows',
            controller:['$rootScope',function($rootScope){
                $rootScope.emptyPageArrays();
                $rootScope.pageCSSArray.push('/datepicker/css/datepicker3.css','/css/oilpress/oilpressInflow.css');
                $rootScope.nonIEPageCSSArray.push('/bs/css/responsiveTable.css');
                $rootScope.setTitle('inflows');//set page header title
            }]
        })
        .state('outflows',{
            url:'/outflows',
            template:'<div ui-view></div>',
            abstract:true
        })
        .state('outflows.list',{
            url:'',
            templateUrl:'/oilpress/partials/outflows',
            controller:['$rootScope',function($rootScope){
                $rootScope.emptyPageArrays();
                $rootScope.nonIEPageCSSArray.push('/bs/css/responsiveTable.css');
                $rootScope.pageCSSArray.push('/css/oilpress/oilPressOutflows.css');
                $rootScope.setTitle('outflows');//set page header title
            }]
        })
        .state('outflows.outflowDetails',{
            url:'/{outflowID:[0-9]{1,}}',
            templateUrl:'/oilpress/partials/outflowDetails',
            resolve:{
                outflowExists: ['Outflows','$stateParams',function(Outflows,$stateParams){
                    return Outflows.get({outflowID:$stateParams.outflowID}).$promise;
                }]
            },
            controller:['$rootScope','$scope','$stateParams','$state','outflowExists',function($rootScope,$scope,$stateParams,$state,outflowExists){
                $rootScope.emptyPageArrays();
                $rootScope.pageCSSArray.push('/css/oilpress/oilPressOutflowDetails.css');
                $rootScope.setTitle('outflowDetails',$stateParams.outflowID);//set page header title
                if (outflowExists.hasOwnProperty('status')&&!outflowExists.status){
                    //something went wrong with outflow ID
                    console.error('Something went wrong. Outflow ID not found or not unique in oilpress');
                    $state.go('outflows.list');
                }
                else{
                    $scope.outflow = outflowExists;
                }

            }]
        })
        .state('my-account',{
            url:'/my-account',
            templateUrl:'/oilpress/partials/myaccount',
            controller:['$rootScope',function($rootScope){
                $rootScope.emptyPageArrays();
                $rootScope.pageCSSArray.push('/css/oilpress/oilPressMyAccount.css');
                $rootScope.setTitle('my-account');//set page header title
            }]
        })
        .state('tanks',{
            url:'/tanks',
            template:'<div ui-view></div>',
            abstract:true
        })
        .state('tanks.list',{
            url:'',
            templateUrl:'/oilpress/partials/tanks',
            controller:['$rootScope',function($rootScope){
                $rootScope.emptyPageArrays();
                $rootScope.nonIEPageCSSArray.push('/bs/css/responsiveTable.css');
                $rootScope.setTitle('tanks');//set page header title
            }]
        })
        .state('tanks.tankDetails',{
            url:'/{tankNo:[0-9]{1,}}',
            templateUrl:'/oilpress/partials/tankDetails',
            resolve:{
                tankExists: ['Tanks','$stateParams',function(Tanks,$stateParams){
                    return Tanks.query({tank_no:$stateParams.tankNo}).$promise;
                }]
            },
            controller:['$rootScope','$scope','$stateParams','$state','tankExists',function($rootScope,$scope,$stateParams,$state,tankExists){
                $rootScope.emptyPageArrays();
                $rootScope.nonIEPageCSSArray.push('/bs/css/responsiveTable.css');
                $rootScope.pageCSSArray.push('/css/oilpress/oilPressTankDetails.css');
                $rootScope.setTitle('tankDetails',$stateParams.tankNo);//set page header title
                if (tankExists.length !== 1){
                    //something went wrong with tank number
                    console.error('Something went wrong. Tank Number not found or not unique in oilpress');
                    $state.go('tanks.list');
                }
                else{
                    $scope.tank = tankExists[0];
                }

            }]
        })
        .state('producers',{
            url:'/producers',
            template:'<div ui-view></div>',
            abstract:true
        })
        .state('producers.list',{
            url:'',
            templateUrl:'/oilpress/partials/producers',
            controller:['$rootScope',function($rootScope){
                $rootScope.emptyPageArrays();
                $rootScope.nonIEPageCSSArray.push('/bs/css/responsiveTable.css');
                $rootScope.setTitle('producers');//set page header title
            }]
        })
        .state('producers.producerDetails',{
            url:'/{producerID:[0-9]{1,}}',
            templateUrl:'/oilpress/partials/producerDetails',
            resolve:{
                producerInflows:['Inflows','$stateParams', function(Inflows, $stateParams){
                    return Inflows.get({producer_id:$stateParams.producerID}).$promise;
                }],
                producerExists: ['Producers','$stateParams',function(Producers,$stateParams){
                    return Producers.get({producerID:$stateParams.producerID}).$promise;
                }]
            },
            controller:['$rootScope','$scope','$stateParams','$state','producerExists','producerInflows',function($rootScope,$scope,$stateParams,$state,producerExists,producerInflows){
                $rootScope.emptyPageArrays();
                $rootScope.nonIEPageCSSArray.push('/bs/css/responsiveTable.css');
                //$rootScope.pageCSSArray.push('/css/oilpress/oilPressProducerDetails.css');
                $rootScope.setTitle('producerDetails',$stateParams.producerID);//set page header title
                if ((producerExists.hasOwnProperty('status') && !producerExists.status) || (producerInflows.hasOwnProperty('status')&&!producerInflows.status)){
                    //something went wrong with producer id
                    console.error('Something went wrong. Producer or his inflows not found');
                    $state.go('producers.list');
                }
                else{
                    $scope.producer = producerExists;
                    $scope.currentInflows = producerInflows.rows;
                }

            }]
        })

}]);



