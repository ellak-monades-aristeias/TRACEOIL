var merchantApp = angular.module('merchantApp',['ui.router','ui.bootstrap','merchantDirectives','merchantServices','merchantControllers','ngAnimate','sharedDirectives','appModals', 'angular-jwt']);

merchantApp.run(['$rootScope','$state','SessionExpired',function($rootScope,$state,SessionExpired){
    //Idle.watch();
    $rootScope.$state = $state;
    //load shared dependencies
//    $ocLazyLoad.load([{
//        name: 'spinnerDirective',
//        files: ['/js/shared/spinner.js','/libs/ladda.js','/libs/ladda.css']
//    },{
//        name: 'afmUniqueDirective',
//        files:['/js/shared/afmUnique.js']
//    },{
//        name: 'afmExistsDirective',
//        files:['/js/shared/afmExists.js']
//    },{
//        name: 'dateTimePicker',
//        files: ['/js/shared/dateTimePicker.js']
//    }]);
}]);

merchantApp.config(['$stateProvider','$urlRouterProvider','$locationProvider','jwtInterceptorProvider','$httpProvider',function($stateProvider, $urlRouterProvider, $locationProvider, jwtInterceptorProvider, $httpProvider){
    $locationProvider.html5Mode(true);//remove the hash sign from url
    $urlRouterProvider.otherwise('/');
    //IdleProvider.idle(1800);
    //IdleProvider.timeout(5);
    //create interceptor for assigning token to http requests
    jwtInterceptorProvider.tokenGetter = function(){
        return window.localStorage.getItem('traceoilToken');
    };
    $httpProvider.interceptors.push('jwtInterceptor');
    $stateProvider
        .state('home',{
            url:'/',
            templateUrl:'/merchant/partials/home',
            controller:['$rootScope','$scope',function($rootScope,$scope){
                $rootScope.emptyPageArrays();
                //$rootScope.nonIEPageCSSArray.push('/libs/responsiveTable.css');
                //$rootScope.pageCSSArray.push('/css/oilpress/oilpressHome.css');
                $scope.format = 'MM/d/yy HH:mm:ss';
                $rootScope.setTitle('home');//set page header title
            }]
        })
        .state('my-account',{
            url:'/my-account',
            templateUrl:'/merchant/partials/myaccount',
            controller:['$rootScope',function($rootScope){
                $rootScope.emptyPageArrays();
                $rootScope.pageCSSArray.push('/css/merchant/merchantMyAccount.css');
                $rootScope.setTitle('my-account');//set page header title
            }]
        })
        .state('producers',{
            url:'/producers',
            templateUrl:'/merchant/partials/producers',
            controller:['$rootScope',function($rootScope){
                $rootScope.emptyPageArrays();
                $rootScope.nonIEPageCSSArray.push('/bs/css/responsiveTable.css');
                $rootScope.setTitle('producers');//set page header title
            }]
        })
        .state('oilpresses',{
            url:'/oilpresses',
            templateUrl:'/merchant/partials/oilpresses',
            controller:['$rootScope',function($rootScope){
                $rootScope.emptyPageArrays();
                $rootScope.nonIEPageCSSArray.push('/bs/css/responsiveTable.css');
                $rootScope.setTitle('oilpresses');//set page header title
            }]
        })
        .state('tanks',{
            url:'/tanks',
            template:'<div ui-view></div>',
            abstract:true
        })
        .state('tanks.list',{
            url:'',
            templateUrl:'/merchant/partials/tanks',
            controller:['$rootScope',function($rootScope){
                $rootScope.emptyPageArrays();
                $rootScope.nonIEPageCSSArray.push('/bs/css/responsiveTable.css');
                $rootScope.setTitle('tanks');//set page header title
            }]
        })
        .state('tanks.tankDetails',{
            url:'/{tankNo:[0-9]{1,}}',
            templateUrl:'/merchant/partials/tankDetails',
            resolve:{
                tankExists: ['Tanks','$stateParams',function(Tanks,$stateParams){
                    return Tanks.query({tank_no:$stateParams.tankNo}).$promise;
                }]
            },
            controller:['$rootScope','$scope','$stateParams','$state','tankExists',function($rootScope,$scope,$stateParams,$state,tankExists){
                $rootScope.emptyPageArrays();
                $rootScope.nonIEPageCSSArray.push('/bs/css/responsiveTable.css');
                $rootScope.pageCSSArray.push('/css/merchant/merchantTankDetails.css');
                $rootScope.setTitle('tankDetails',$stateParams.tankNo);//set page header title
                if (tankExists.length !== 1){
                    //something went wrong with tank number
                    console.error('Something went wrong. Tank Number not found or not unique in merchant');
                    $state.go('tanks.list');
                }
                else{
                    $scope.tank = tankExists[0];
                }

            }]
        })
        .state('inflows',{
            url:'/inflows',
            template:'<div ui-view></div>',
            abstract:true
        })
        .state('inflows.list',{
            url:'',
            templateUrl:'/merchant/partials/inflows',
            controller:['$rootScope',function($rootScope){
                $rootScope.emptyPageArrays();
                $rootScope.nonIEPageCSSArray.push('/bs/css/responsiveTable.css');
                $rootScope.pageCSSArray.push('/css/merchant/merchantInflows.css');
                $rootScope.setTitle('inflows');//set page header title
            }]
        })
        .state('inflows.inflowDetails',{
            url:'/{inflowID:[0-9]{1,}-[0-9]{1,}-[0-9]{1,}}',
            templateUrl:'/merchant/partials/inflowDetails',
            resolve:{
                inflowExists: ['Merchant_Inflows','$stateParams',function(Merchant_Inflows,$stateParams){
                    return Merchant_Inflows.getDetails({inflowID:$stateParams.inflowID}).$promise;
                }]
            },
            controller:['$rootScope','$scope','$stateParams','$state','inflowExists',function($rootScope,$scope,$stateParams,$state,inflowExists){
                $rootScope.emptyPageArrays();
                $rootScope.pageCSSArray.push('/css/merchants/merchantInflowDetails.css');
                $rootScope.setTitle('inflowDetails',$stateParams.inflowID);//set page header title
                if (inflowExists.hasOwnProperty('status')&&!inflowExists.status){
                    //something went wrong with inflow ID
                    console.error('Something went wrong. Inflow ID not found or not unique in merchant');
                    $state.go('inflows.list');
                }
                else{
                    $scope.inflow = inflowExists;
                    if (inflowExists.trader_type_id === 1){//producer inflow, so update the text field of landOSDE to be able to edit
                        $scope.inflow['landOSDE'] = inflowExists.contents.rows[0].Producer_Land?inflowExists.contents.rows[0].Producer_Land.osde:null;
                    }
                }

            }]
        })
        .state('outflows',{
            url:'/outflows',
            template:'<div ui-view></div>',
            abstract:true
        })
        .state('outflows.list',{
            url:'',
            templateUrl:'/merchant/partials/outflows',
            controller:['$rootScope',function($rootScope){
                $rootScope.emptyPageArrays();
                $rootScope.nonIEPageCSSArray.push('/bs/css/responsiveTable.css');
                $rootScope.pageCSSArray.push('/css/merchant/merchantOutflows.css');
                $rootScope.setTitle('outflows');//set page header title
            }]
        })
        .state('outflows.outflowDetails',{
            url:'/{outflowID:[0-9]{1,}}',
            templateUrl:'/merchant/partials/outflowDetails',
            resolve:{
                outflowExists: ['Merchant_Outflows','$stateParams',function(Merchant_Outflows,$stateParams){
                    return Merchant_Outflows.getContents({outflowID:$stateParams.outflowID, includeStatus:true}).$promise;
                }]
            },
            controller:['$rootScope','$scope','$stateParams','$state','outflowExists',function($rootScope,$scope,$stateParams,$state,outflowExists){
                $rootScope.emptyPageArrays();
                $rootScope.pageCSSArray.push('/css/merchant/merchantOutflowDetails.css');
                $rootScope.setTitle('outflowDetails',$stateParams.outflowID);//set page header title
                if (outflowExists.hasOwnProperty('status')&&!outflowExists.status){
                    //something went wrong with outflow ID
                    console.error('Something went wrong. Outflow ID not found or not unique in merchant');
                    $state.go('outflows.list');
                }
                else{
                    $scope.outflow = outflowExists;
                }

            }]
        })
}]);