var merchantServices = angular.module('merchantServices',['ngResource']);

//DB RESOURCES ***********************
merchantServices.factory('User',['$resource',function($resource){
    return $resource('/api/user',undefined,{
        'changePassword': {method:'POST',url:'/api/user/password'}
    });
}]);

merchantServices.factory('Oilpresses',['$resource',function($resource){
    return  $resource('/api/oilpresses/:oilpressID',{
        oilpressID: '@oilpress_id'
    },{
        'update': {method:'PUT'}
    });
}]);

merchantServices.factory('Merchant_Inflows',['$resource',function($resource){
    return $resource('/api/merchant/inflows/:inflowID',{},{
        'update': {method:'PUT'},
        'getDetails': {method:'GET',params:{includeDetails:true}},
        'getContents':{method:'GET',params:{includeContents:true}}
    });
}]);


merchantServices.factory('Merchant_Outflows',['$resource',function($resource){
    return $resource('api/merchant/outflows/:outflowID',{},{
        'update': {method:'PUT'},
        'getStatus': {method:'GET',params:{includeStatus:true}},
        'getContents': {method:'GET', params:{includeContents:true}}
    });
}]);

merchantServices.factory('Producers',['$resource',function($resource){
    //create producer resource with custom put method
    return $resource('/api/producers/:producerID',
        {
            producerID:'@producer_id'
        },
        {
            'update': {method:'PUT'}
        });

}]);

merchantServices.factory('Tanks',['$resource',function($resource){
    //create tanks resource with custom put method
    return $resource('/api/merchant/tanks/:tankID',
        {
            tankID:'@tank_id'
        },{
            'update': {method:'PUT'},
            'getStatus': {method:'GET',params:{includeStatus:true}},
            'getContents': {method:'GET', params:{includeContents:true}}
        });
}]);

merchantServices.factory('Reports',['$window','$location','$http',function($window,$location,$http){
    return function(reportType,queryData){
        var initialUrl = $location.url();//store initial url for later restore
        $location.path('/api/merchant/report/'+reportType);//use $location service to properly construct url string
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

merchantServices.factory('Producer_Lands',['$resource',function($resource){
    return $resource('/api/producer_lands/:landID',{landID:'@land_id'});
}]);


//merchantServices.factory('Oilcompanies', ['$resource',function($resource){
//    //create tanks resource with custom put method
//    return $resource('/api/oilcompanies/:oilcompanyID',
//        {
//            oilcompanyID:'@oilcompany_user_id'
//        });
//}]);