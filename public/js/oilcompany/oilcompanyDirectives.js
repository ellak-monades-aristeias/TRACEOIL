var oilcompanyDir = angular.module('oilcompanyDirectives',[]);

oilcompanyDir.directive('oilcompanyMenu',['$rootScope',function ($rootScope){
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
        templateUrl:'/oilcompany/partials/menu'
    }
}]);


oilcompanyDir.directive('compareTo',[function(){
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