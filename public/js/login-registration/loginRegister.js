var loginApp = angular.module('loginRegister',['ui.router','authenticate','ngResource']);

loginApp.config(['$stateProvider','$urlRouterProvider','$locationProvider',function($stateProvider,$urlRouterProvider,$locationProvider){
    $locationProvider.html5Mode(true);//remove the hash sign from url

    $urlRouterProvider.otherwise('/login');

    $stateProvider
        .state('login',{
            url:'/login',
            templateUrl:'/loginPartial',
            resolve:{
                getStats: ['GetStats', function(GetStats){
                    return GetStats.get().$promise;
                }]
            },
            controller:['$rootScope','authentication','$window','getStats',function($rootScope,authentication,$window,getStats){
                //set pageCSS on root Scope
                $rootScope.pageCSS = '/css/login-registration/login.css';
                if ($rootScope.hasOwnProperty('loginRegistered')){
                    this.errorMessage = $rootScope.loginRegistered;//assign message from root scope
                    this.hasError = true;
                    delete $rootScope.loginRegistered;//stop polluting the root scope
                }
                else{
                    this.errorMessage = '';
                    this.hasError = false;
                }
                this.username='';
                this.password='';
                this.showRegisterOptions = false;
                this.toggleRegisterOptions = function(){
                    this.showRegisterOptions = !this.showRegisterOptions;
                };
                this.submitLogin = function(){
                    //use login service for user authentication
                    var formData = {};
                    formData.username = this.username;
                    formData.password = this.password;
                    var loginScope = this;
                    authentication.login(formData)
                        .success(function(result){
                            //check for successful or not authentication
                            if (!result.status){
                                loginScope.hasError = true;
                                loginScope.errorMessage = result.message;
                            }
                            else{
                                //successful login
                                //redirect to user home page
                                $window.location.href='/';
                                $window.localStorage.setItem('traceoilToken', result.token);

                            }
                        })
                        .error(function(error){
                            //server error... log it
                            console.log(error);
                        });
                };
                this.total_sum = getStats.total_sum;
                this.lastTransaction = getStats.lastTransaction;
            }],
            controllerAs:'login'
        })
        .state('register',{
            abstract:true,
            url:'/register',
            template:'<ui-view/>',
            controller:['$rootScope',function($rootScope){
                $rootScope.pageCSS = '/css/login-registration/registration.css';
            }]
        })
        .state('register.producer',{
            url:'/producer',
            templateUrl:'/registerProducerPartial',
            controller:function(){
                //model initialization
                this.formData = {};
                this.formData.userTypeID=1;
            },
            controllerAs:'register'
        })
        .state('register.oilpress',{
            url:'/oilpress',
            templateUrl:'/registerOilpressPartial',
            controller:function(){
                //model initialization
                this.formData = {};
                this.formData.userTypeID=2;
                this.getMessages = function(messages){
                    this.messages = {};
                    for (var head in messages){
                        this.messages[head] = messages[head];
                    }
                }
            },
            controllerAs:'register'
        })
        .state('register.merchant',{
            url:'/merchant',
            templateUrl:'/registerMerchantPartial',
            controller:function(){
                //model initialization
                this.formData = {};
                this.formData.userTypeID=3;
                this.getMessages = function(messages){
                    this.messages = {};
                    for (var head in messages){
                        this.messages[head] = messages[head];
                    }
                }
            },
            controllerAs:'register'
        })
        .state('register.oilcompany',{
            url:'/oilcompany',
            templateUrl:'/registerOilcompanyPartial',
            //resolve:{
            //    OilCompany:['Oilcompany',function(Oilcompany){
            //        return Oilcompany.query().$promise;
            //    }]
            //},
            controller:[function(){
                var register = this;
                //register.oilcompanies = OilCompany;
                //model initialization
                this.formData = {};
                this.formData.userTypeID = 4;

            }],
            controllerAs:'register'
        })
}]);

loginApp.controller('mainController',['$rootScope',function($rootScope){
    //initialize pageCSS model
    $rootScope.pageCSS = '';
}])
    .directive('registerUser',['authentication','$state','$rootScope',function(authentication,$state,$rootScope){
        return {
            restrict:'A',
            link: function(scope,element,attrs){
                element.on('click',function(e){
                    element.attr('disabled',true);//disable the button to avoid re-registering
                    //get form data when clicked and submit it to server to check if it is acceptable and create the user
                    authentication.register(scope.register.formData)
                        .success(function(data){
                            //check for successful or not registration.
                            if (!data.status){
                                //false registration... show the message
                                scope.register.registrationError = true;
                                scope.register.errorMessage = data.message;
                                //go to top
                                $('html, body').animate({ scrollTop: 0 }, 'fast');
                            }
                            else{
                                //registration ok!
                                console.log('User Registered');
                                var loginData = {};
                                loginData.username = scope.register.formData.username;
                                loginData.password = scope.register.formData.password;
                                //TODO: check if autologin wanted or redirect to homepage
                                $rootScope.loginRegistered = data.message;//assign this so the next state can see we are coming from a successful registration(can't find an other efficient way to pass an object right now)
                                $state.go('login');
                            }
                            element.attr('disabled',false);//enable the button to avoid re-registering
                        })
                        .error(function(data){
                            //something went wrong here with the server request.... let's log
                            console.log('Error in server request: '+data);
                            element.attr('disabled',false);//enable the button to avoid re-registering
                        })

                });
            }
        }
    }]);
//loginApp.factory('Oilcompany',['$resource', function($resource){
//    return $resource('/api/oilcompanies/:oilcompanyID',{
//        oilcompanyID:'@oilcompany_id'
//    });
//}]);

loginApp.factory('GetStats',['$resource', function($resource){
    return $resource('/getStats');
}]);

