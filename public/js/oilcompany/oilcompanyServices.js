var oilcompanyServices = angular.module('oilcompanyServices',['ngResource']);

//DB RESOURCES ***********************
oilcompanyServices.factory('User',['$resource',function($resource){
    return $resource('/api/user',undefined,{
        'changePassword': {method:'POST',url:'/api/user/password'}
    });
}]);

oilcompanyServices.factory('Merchants',['$resource',function($resource){
    //create merchant resource with custom put method
    return $resource('/api/merchants/:merchantID',
        {
            merchantID:'@merchant_id'
        });

}]);

oilcompanyServices.factory('Oilcompany_Inflows',['$resource',function($resource){
    return $resource('/api/oilcompany/inflows/:inflowID',
        {
            inflowID:'@inflow_id'
        },
        {
            'update': {method:'PUT'},
            'getStatus': {method:'GET',params:{includeStatus:true}},
            'getContents': {method:'GET', params:{includeContents:true}},
            'export':{method:'GET', params:{export:true} }
        });

}]);

oilcompanyServices.factory('Oilpresses',['$resource',function($resource){
    return  $resource('/api/oilpresses/:oilpressID',{
        oilpressID: '@oilpress_id'
    });
}]);

oilcompanyServices.factory('Producers',['$resource',function($resource){
    //create producer resource with custom put method
    return $resource('/api/producers/:producerID',
        {
            producerID:'@producer_id'
        });

}]);

oilcompanyServices.factory('ProducersSustainability',['$resource',function($resource){
    //get producers sustainability
    return $resource('/api/producers-sustainability');
}]);

oilcompanyServices.factory('Reports',['$window','$location',function($window,$location){
    return function(queryData){
        var initialUrl = $location.url();//store initial url for later restore
        $location.path('/api/oilcompany/report');//use $location service to properly construct url string
        $location.search(queryData);
        var windowUrl = $location.url();//get new constructed url
        $location.url(initialUrl);//restore initial window url
        var popup = $window.open('',"_blank", "width=1000, height=1000, left=300, top=200, resizable=0, scrollbars=1");
        $http.get(windowUrl)
            .then(function(responseHTML){
                popup.document.write(responseHTML.data);
                popup.history.pushState(null, null, windowUrl);
            }, function(err){
                console.error('Error with HTTP request');
                console.error(err);
                popup.close();//close the popup on failure
            });
    }
}]);
