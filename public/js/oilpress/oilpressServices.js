var oilpressServices = angular.module('oilpressServices',['ngResource']);

//DB RESOURCES ***********************
oilpressServices.factory('User',['$resource',function($resource){
    return $resource('/api/user',undefined,{
        'changePassword': {method:'POST',url:'/api/user/password'}
    });
}]);

oilpressServices.factory('Merchants',['$resource',function($resource){
    return $resource('/api/merchants/:merchantID',{
        merchantID:'@merchant_id'
    });
}]);

oilpressServices.factory('Inflows',['$resource',function($resource){
    return $resource('/api/oilpress/inflows/:inflowID',{
            inflowID:'@inflow_id'
        },
        {
            'update': {method:'PUT'}
        }
    );
}]);

oilpressServices.factory('Outflows',['$resource',function($resource){
    return $resource('/api/oilpress/outflows/:outflowID',{
            outflowID:'@outflow_id'
        },{
            'update': {method:'PUT'},
            'getContents':{method:'GET',params:{'includeContents':true}}
        }
    );
}]);

oilpressServices.factory('Producers',['$resource',function($resource){
    //create producer resource with custom put method
    return $resource('/api/producers/:producerID',
        {
            producerID:'@producer_id'
        },
        {
            'update': {method:'PUT'}
        });

}]);

oilpressServices.factory('Tanks',['$resource',function($resource){
    //create tanks resource with custom put method
    return $resource('/api/oilpress/tanks/:tankID',
        {
            tankID:'@tank_id'
        },{
            'update': {method:'PUT'},
            'getStatus': {method:'GET',params:{includeStatus:true}},
            'getContents': {method:'GET', params:{includeContents:true}}
        });
}]);

oilpressServices.factory('Producer_Lands',['$resource',function($resource){
    return $resource('/api/producer_lands/:landID',{landID:'@land_id'});
}]);

oilpressServices.factory('OilPressTank_Totals',['$resource',function($resource){
    return $resource('/api/oilpress/tankTotals/:tankID',{tankID:'@tank_id'});
}]);

oilpressServices.factory('OilPressTank_Sums',['$resource',function($resource){
    return $resource('/api/oilpress/tankSums/:tankID',{tankID:'@tank_id'});
}]);

oilpressServices.factory('OilPressTank_Transactions',['$resource',function($resource){
    return $resource('/api/oilpress/tankTransactions/:tankID',{tankID:'@tank_id'});
}]);

oilpressServices.factory('OilPressTank_Actions',['$resource',function($resource){
    return $resource('/api/oilpress/tankActions/:tankID',{tankID:'@tank_id'});
}]);



//HELPER FUNCTIONS ****
//oilpressServices.factory('viewProducer',['Producers','producerModal',function(Producers,producerModal){
//    //service to provide it with a producer ID and displays a modal with the producer info and the ability to edit and save the producer
//        return function(producerID){
//            //first get Producer
//            return Producers.get({producerID:producerID}).$promise
//                .then(function(producer){
//                    return producerModal(null,producer)
//                })
//                .then(function(){
//                    //all good
//                    console.log('Successful modal operation');
//                })
//                .catch(function(err){
//                    //error in view Producer function
//                    console.log(JSON.stringify(err));
//                });
//        }
//
//}]);

oilpressServices.factory('viewInflow',['oilpressInflowModal','Inflows',function(oilpressInflowModal,Inflows){
    //service to provide it with an inflow ID and display a modal showing the inflow details
    return function(inflowID){
        //first get inflow
        return Inflows.get({inflowID:inflowID}).$promise
            .then(function(inflow){
                if (inflow !== null){
                    return oilpressInflowModal(inflow);
                }
            })
            .catch(function(err){
               //error in view Inflow modal function
                console.log(JSON.stringify(err));
            });
    }
}]);

oilpressServices.factory('Reports',['$window','$location','$http',function($window,$location,$http){
    return function(queryData){
        var initialUrl = $location.url();//store initial url for later restore
        $location.path('/api/oilpress/report');//use $location service to properly construct url string
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


