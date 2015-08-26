var oilcompanyCtrls = angular.module('oilcompanyControllers',[]);

oilcompanyCtrls.controller('mainController',['$rootScope',function($rootScope){
    //$scope.$on('IdleTimeout', function() {
    //    $window.location.assign('/logout');
    //});
    $rootScope.pageCSSArray = [];
    $rootScope.nonIEPageCSSArray = [];
    $rootScope.pageJSArray = [];

    $rootScope.emptyPageArrays = function(){
        $rootScope.pageCSSArray = [];
        $rootScope.nonIEPageCSSArray = [];
        $rootScope.pageJSArray = [];
    };

    $rootScope.pageTitle = null;//initiate page title model

    $rootScope.getScopeMessages = function(scope,messages){//function to get the messages from the language file
        scope.messages = {};
        for (var head in messages){
            scope.messages[head] = messages[head];
        }
    };

    $rootScope.setPageHeaders = function(headers){//function to get the page titles from the html
        $rootScope.headers = headers;
    };

    $rootScope.setTitle = function(title,extraText){//helper function to set the title
        if (typeof extraText === 'undefined'){
            $rootScope.pageTitle = $rootScope.headers[title];
        }
        else{
            $rootScope.pageTitle = $rootScope.headers[title]+' '+extraText;
        }

    }
}]);

oilcompanyCtrls.controller('myAccountCtrl',['$scope','User','$timeout',function($scope,User,$timeout){
    //scope variables and functions
    //change password form
    $scope.showChangePassword = false;
    $scope.toggleChangePassword = function(state){
        $scope.showChangePassword = (typeof state === 'undefined'?!$scope.showChangePassword:state);
    };
    $scope.getUserInfo = function(){
        User.get().$promise
            .then(function(user){
                $scope.profile = user;//enumerate scope variable
            });
    };
    $scope.getUserInfo();
    //alert variables
    $scope.showSuccessAlert = $scope.showErrorAlert = $scope.passwordChangeSuccess = $scope.passwordChangeError = $scope.wrongPasswordError = false;
    function showAlert(type){
        var alertToToggle;
        $('html, body').animate({ scrollTop: 0 }, 'fast');//scoll to top
        switch (type){
            case 'profileSuccess':
                alertToToggle = 'showSuccessAlert';
                break;
            case 'profileError':
                alertToToggle = 'showErrorAlert';
                break;
            case 'passwordSuccess':
                alertToToggle = 'passwordChangeSuccess';
                break;
            case 'passwordError':
                alertToToggle = 'passwordChangeError';
                break;
            case 'wrongPasswordError':
                alertToToggle = 'wrongPasswordError';
                break;
        }
        $scope[alertToToggle] = true;
        $timeout(function(){$scope[alertToToggle] = false;},3000);
    }
    //user info
    $scope.saveUserInfo = function(){
        User.save($scope.profile).$promise
            .then(function(result){
                if (result.hasOwnProperty('status')){
                    if (result.status){
                        //successful save
                        showAlert('profileSuccess');
                    }
                    else{
                        //problem
                        showAlert('profileError');
                    }
                }
            })
            .catch(function(err){
                console.error('Error with request to save... ERROR: '+JSON.stringify(err));
            });
    };

    //change user password
    $scope.changePassword = function(){
        User.changePassword($scope.changePass).$promise
            .then(function(result){
                if (result.hasOwnProperty('status')){
                    if (result.status){
                        //succesful password change
                        showAlert('passwordSuccess');
                        $scope.changePass = {};//reset password Form
                        $scope.toggleChangePassword(false);
                    }
                    else{
                        //error
                        if (result.hasOwnProperty('message')){
                            if (result.message = 'wrongPassword'){
                                //wrong password
                                showAlert('wrongPasswordError');
                            }
                        }
                        else{
                            //unknown error
                            showAlert('passwordChangeError');
                        }
                    }
                }
            })
            .catch(function(err){
                console.error('Error with request to change user password... ERROR: '+JSON.stringify(err));
            });
    };

}]);


oilcompanyCtrls.controller('inflowsCtrl', ['$scope', '$rootScope', 'Oilcompany_Inflows', 'Reports','$window','$location', function($scope, $rootScope, Oilcompany_Inflows, Reports, $window, $location){
    $scope.queryData = {};
    $scope.getMessages = function(messages){
        $rootScope.getScopeMessages($scope,messages);
    };

    $scope.toggleSearch = function(state){
        $scope.searchLastName = $scope.searchFirstName = $scope.searchAFM = $scope.searchInvoiceNo = $scope.searchNotes = $scope.searchLot = $scope.searchFrom = $scope.searchTo = null;
        $scope.searchInflowFormActive = (typeof state === 'undefined'?!$scope.searchInflowFormActive:state);
    };

    //scope variables initialization
    $scope.currentInflowsCount = 0;
    $scope.currentInflowsCurrentPage = 1;
    $scope.currentInflows = [];
    $scope.searchIntflowFormActive = false;
    $scope.undefinedError = false;

    $scope.getMessages = function(messages){
        $rootScope.getScopeMessages($scope,messages);
    };

    $scope.getInflows = function(offset,limit){
        //if (typeof queryData === 'undefined') queryData = {};
        if (typeof offset !== 'undefined'&& !isNaN(offset)) $scope.queryData.offset = offset;
        if (typeof limit !== 'undefined'&&!isNaN(limit)) $scope.queryData.limit = limit;
        //make api request to get outflows
        delete $scope.queryData.export;
        return Oilcompany_Inflows.get($scope.queryData).$promise
            .then(function(result){
                if (!result.hasOwnProperty('status')|| !result.status){

                    $scope.currentInflows = result.rows;
                    $scope.currentInflowsCount = result.count;
                }
                else{
                    console.error('Something went wrong....');
                    console.error(result);
                }
            })
            .catch(function(err){
                //error with request to get outflows
                console.error('Error with request to get merchant outflows.ERROR: '+JSON.stringify(err));
            });
    };

    //enable function to page change
    $scope.pageChanged = function(){
        $scope.getInflows(10*($scope.currentInflowsCurrentPage-1));
    };
    $scope.pageChanged();//initial call

    $scope.searchInflows = function(){
        //var queryData = {};
        if ($scope.searchFirstName && $scope.searchFirstName.length>0) $scope.queryData.first_name = $scope.searchFirstName;
        if ($scope.searchLastName && $scope.searchLastName.length>0) $scope.queryData.last_name = $scope.searchLastName;
        if ($scope.searchAFM && $scope.searchAFM.length>0) $scope.queryData.afm = $scope.searchAFM;
        if ($scope.searchInvoiceNo && $scope.searchInvoiceNo.length>0) $scope.queryData.invoice_no = $scope.searchInvoiceNo;
        if ($scope.searchNotes && $scope.searchNotes.length>0) $scope.queryData.oilcompany_notes = $scope.searchNotes;
        if ($scope.searchLot && $scope.searchLot.length>0) $scope.queryData.oilcompany_lot = $scope.searchLot;
        if ($scope.searchFrom) $scope.queryData.from_date = $scope.searchFrom;
        if ($scope.searchTo) $scope.queryData.to_date = $scope.searchTo;
        $scope.getInflows();
        $scope.toggleSearch(false);//hide the form
    };
    $scope.restoreInflows = function(){//refresh Inflows
        $scope.currentInflowsCurrentPage = 1;
        $scope.queryData = {};
        $scope.getInflows();
    };
    $scope.printInflow = function(inflow_id){
        $scope.queryData.inflow_id = inflow_id;
        Reports($scope.queryData);

    };
    $scope.exportInflows = function(){
        var initialUrl = $location.url();
        $location.path('/api/oilcompany/inflows');//use $location service to properly construct url string
        $scope.queryData.export = "true";
        $location.search($scope.queryData);
        var exportURL = $location.url();
        $location.url(initialUrl);
        $window.open(exportURL,"_self");

    };
    //helper variables and fucntions for date picker
    $scope.datePopupOpenFrom = false;
    $scope.datePopupOpenTo = false;
    $scope.openDatePopupFrom = function($event){
        $event.preventDefault();
        $event.stopPropagation();
        $scope.datePopupOpenFrom = true;
    };
    $scope.openDatePopupTo = function($event){
        $event.preventDefault();
        $event.stopPropagation();
        $scope.datePopupOpenTo = true;
    };
}]);

oilcompanyCtrls.controller('inflowDetailsCtrl', ['$scope', '$rootScope','Merchants', 'Producers', 'producerModal', 'Oilpresses','oilpressModal','ProducersSustainability','Oilcompany_Inflows','$timeout', function($scope, $rootScope, Merchants, Producers, producerModal, Oilpresses, oilpressModal,ProducersSustainability, Oilcompany_Inflows, $timeout){
    var inflowID = $scope.inflow.merchant_id + '-' + $scope.inflow.inflow_id;
    $scope.merchant = {};
    $scope.inflowDetails ={};
    $scope.saveSuccess = false;
    $scope.undefinedError = false;

    $scope.viewOilpress = function($event, oilpress_id){
        $event.stopPropagation(); //preventing default behavior of accordion heading
        oilpress_id = parseInt(oilpress_id);
        if(oilpress_id ===0)
            return;
        return Oilpresses.get({oilpressID:oilpress_id}).$promise
            .then(function(oilpress){
                oilpressModal(null, oilpress);
            })
            .catch(function(err){
                console.error('Error with request to get oilpress... ERROR: '+JSON.stringify(err));
            });

    };
    $scope.viewProducer = function(producerID){
        if (producerID <=0) return;//exit if no producer passed
        Producers.get({producerID:producerID}).$promise
            .then(function(producer){
                return producerModal(null,producer)
                    .then(function(){
                        //all good
                        console.log('Successful modal operation');
                    })
                    .catch(function(err){
                        console.error(JSON.stringify(err));
                    });
            })
            .catch(function(err){
                console.error('Error with request to get producer... ERROR: '+JSON.stringify(err));
            });
    };
    $scope.getMerchant = function(){
        Merchants.get({merchantID:$scope.inflow.merchant_id}).$promise
            .then(function(merchant){
                $scope.merchant = merchant;
            })
            .catch(function(err){
                console.error("There was an error with request to get merchant with ID: " + $scope.inflow.merchant_id);
                console.error(err);
            });
    };
    $scope.getMerchant();
    $scope.getProducerSustainabilityScore = function(oilpressID,open){
        if (open) return;//if we are closing accordion no need to do anything
        var producerIDs = [];
        var oilpressInflows = $scope.inflow.contents[oilpressID];
        for (var i = 0, len = oilpressInflows.contents.length;i<len;i++){
            //check if found producer sustainability from earlier, so no need to do all this
            if (oilpressInflows.contents[i].producerSustainability) return;//exit function
            producerIDs.push(oilpressInflows.contents[i].producer_id);
        }
        //check if there were any producer IDs to get sustainability
        if (producerIDs.length<=0) return;//exit!
        ProducersSustainability.query({producer_ids:JSON.stringify(producerIDs)}).$promise
            .then(function(results){
                for (var i = 0, len = results.length; i<len;i++){
                    var producerID = results[i].producer_id;
                    var producerSustainability = results[i].sustainability;
                    for (var j = 0, len2 = oilpressInflows.contents.length;j<len2;j++){
                        if (oilpressInflows.contents[j].producer_id === producerID){
                            oilpressInflows.contents[j].producerSustainability = producerSustainability;
                            break;// found producer id and updated it so break this loop
                        }
                    }
                }
            })
            .catch(function(err){
                console.error('Error with request to get producer sustainabilities');
                console.error(err);
            });
    };
    $scope.saveInflow = function(){
        return Oilcompany_Inflows.update({inflowID:inflowID},{oilcompany_lot:$scope.inflow.oilcompany_lot, oilcompany_notes:$scope.inflow.oilcompany_notes}).$promise
            .then(function(){
                $scope.oilcompanyInflowForm.$setPristine();
                showAlert('saveSuccess');
            })
            .catch(function(err){
                console.error('Error with request to update inflow details. \nERROR:'+JSON.stringify(err));
                showAlert('undefinedError');
            });
    };
    $scope.restoreInflow = function(){
        $scope.inflow.oilcompany_lot = '';
        $scope.inflow.oilcompany_notes = '';
        return Oilcompany_Inflows.get({inflowID:inflowID}).$promise
            .then(function(inflow){
                $scope.inflow = inflow;
                $scope.oilcompanyInflowForm.$setPristine();
            })
            .catch(function(err){
                console.error('Error with request to restore inflow details. \nERROR:'+JSON.stringify(err));
                showAlert('undefinedError');
            });
    };

    function showAlert(selectedAlert){
        $scope[selectedAlert] = true;
        $timeout(function(){$scope[selectedAlert]=false;},3000);
    }
}]);

oilcompanyCtrls.controller('merchantsCtrl', ['$scope', '$rootScope','Merchants', 'merchantModal', function($scope, $rootScope, Merchants, merchantModal){
    //message initialization
    $scope.getMessages = function(messages){
        $rootScope.getScopeMessages($scope,messages);
    };

    //create initial page function and initializations
    $scope.currentMerchants = [];
    $scope.currentMerchantsCount = 0;
    $scope.currentMerchantsCurrentPage = 1;
    $scope.getMerchants = function(offset,limit,queryData){
        if (typeof queryData === 'undefined') queryData = {};
        if (typeof offset !== 'undefined'&& !isNaN(offset)) queryData.offset = offset;
        if (typeof limit !== 'undefined'&&!isNaN(limit)) queryData.limit = limit;
        //make api request to get Merchants
        Merchants.get(queryData,function(result){
            $scope.currentMerchants = result.rows;
            $scope.currentMerchantsCount = result.count;

        });
    };
    $scope.pageChanged = function(){
        //$scope.getMerchants(10*($scope.currentMerchantsCurrentPage-1));
        $scope.searchMerchant(10*($scope.currentMerchantsCurrentPage-1));
    };
    $scope.$on('refreshMerchants',$scope.getMerchants);//listen for refresh request
    //initialize page data with Merchants
    $scope.getMerchants();

    $scope.viewMerchant = function(Merchant){
        return merchantModal(null,Merchant)
            .then(function(){
                //all good
                console.log('Successful modal operation');
                $rootScope.$broadcast('refreshMerchants');
            })
            .catch(function(err){
                //error in modal function
                console.log(JSON.stringify(err));
            });
    };
    $scope.searchMerchant = function(offset, limit){
        var queryData = {};
        if ($scope.searchID) queryData.merchant_id = $scope.searchID;
        if ($scope.searchName && $scope.searchName.length>0) queryData.name = $scope.searchName;
        if ($scope.searchLastName && $scope.searchLastName.length>0) queryData.last_name = $scope.searchLastName;
        if ($scope.searchFirstName && $scope.searchFirstName.length>0) queryData.first_name = $scope.searchFirstName;
        if ($scope.searchAFM && $scope.searchAFM.length>0) queryData.afm = $scope.searchAFM;
        $scope.getMerchants(offset,limit,queryData);
    };
    $scope.clearSearch = function(){
        $scope.searchName = $scope.searchLastName = $scope.searchFirstName = $scope.searchAFM = $scope.searchID = null;
        $scope.getMerchants();
    };
}]);
