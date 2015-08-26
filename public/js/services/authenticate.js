angular.module('authenticate',[])
    .factory('authentication',['$http',function authenticationFactory($http){
        var service = {};
        service.login = function(formData){
            return $http.post('/login',formData);
        };
        service.register = function(formData){
            return $http.post('/register',formData);
        };


        return service;

    }]);
