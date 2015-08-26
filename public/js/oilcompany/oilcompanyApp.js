var oilcompanyApp = angular.module('oilcompanyApp',['ui.router','ui.bootstrap','oilcompanyDirectives','oilcompanyServices','oilcompanyControllers','ngAnimate','appModals','sharedDirectives']);

oilcompanyApp.run(['$rootScope','$state','SessionExpired',function($rootScope,$state,SessionExpired){
    //Idle.watch();
    $rootScope.$state = $state;
}]);

oilcompanyApp.config(['$stateProvider','$urlRouterProvider','$locationProvider',function($stateProvider,$urlRouterProvider,$locationProvider){
    $locationProvider.html5Mode(true);//remove the hash sign from url
    $urlRouterProvider.otherwise('/');
    //IdleProvider.idle(5);
    //IdleProvider.timeout(5);

    $stateProvider
        .state('home',{
            url:'/',
            templateUrl:'/oilcompany/partials/home',
            controller:['$rootScope','$scope',function($rootScope,$scope){
                $rootScope.emptyPageArrays();
                //$rootScope.nonIEPageCSSArray.push('/libs/responsiveTable.css');
                $scope.format = 'MM/d/yy HH:mm:ss';
                $rootScope.setTitle('home');//set page header title
            }]
        })
        .state('my-account',{
            url:'/my-account',
            templateUrl:'/oilcompany/partials/myaccount',
            controller:['$rootScope',function($rootScope){
                $rootScope.emptyPageArrays();
                $rootScope.pageCSSArray.push('/css/oilcompany/oilcompanyMyAccount.css');
                $rootScope.setTitle('my-account');//set page header title
            }]
        })
        .state('merchants',{
            url:'/merchants',
            templateUrl:'/oilcompany/partials/merchants',
            controller:['$rootScope',function($rootScope){
                $rootScope.emptyPageArrays();
                $rootScope.nonIEPageCSSArray.push('/libs/responsiveTable.css');
                $rootScope.setTitle('merchants');//set page header title
            }]
        })
        .state('inflows',{
            url:'/inflows',
            template:'<div ui-view></div>',
            abstract:true
        })
        .state('inflows.list',{
            url:'',
            templateUrl:'/oilcompany/partials/inflows',
            controller:['$rootScope',function($rootScope){
                $rootScope.emptyPageArrays();
                $rootScope.nonIEPageCSSArray.push('/libs/responsiveTable.css');
                $rootScope.pageCSSArray.push('/css/oilcompany/oilcompanyInflows.css');
                $rootScope.setTitle('inflows');//set page header title
            }]
        })
        .state('inflows.inflowDetails',{
            url:'/{inflowID:[0-9]{1,}-[0-9]{1,}}',
            templateUrl:'/oilcompany/partials/inflowDetails',
            resolve:{
                inflowExists: ['Oilcompany_Inflows','$stateParams',function(Oilcompany_Inflows,$stateParams){
                    return Oilcompany_Inflows.getContents({inflowID:$stateParams.inflowID, includeStatus:true}).$promise;
                }]
            },
            controller:['$rootScope','$scope','$stateParams','$state','inflowExists',function($rootScope,$scope,$stateParams,$state,inflowExists){
                $rootScope.emptyPageArrays();
                $rootScope.pageCSSArray.push('/css/oilcompany/oilcompanyInflowDetails.css');
                $rootScope.setTitle('inflowDetails',$stateParams.inflowID);//set page header title
                if (inflowExists.hasOwnProperty('status')&&!inflowExists.status){
                    //something went wrong with outflow ID
                    console.log('Something went wrong. Inflow ID not found or not unique in oilcompany');
                    $state.go('inflows.list');
                }
                else{
                    $scope.inflow = inflowExists;
                }

            }]
        })
}]);