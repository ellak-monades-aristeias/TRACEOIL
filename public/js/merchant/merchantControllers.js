var merchantCtrls = angular.module('merchantControllers',[]);

merchantCtrls.controller('mainController',['$rootScope','$scope',function($rootScope, $scope){
    //$scope.showTimer = false;
    //$scope.$on('IdleTimeout', function() {
    //    $window.location.assign('/logout');
    //});
    //$scope.$watch(function(scope) { return  $document[0].cookie},
    //    function() {$window.location.assign('/logout');}
    //);

    $scope.showContactWarning = true;
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

    };
    $scope.closeAlert = function(){
        $scope.showContactWarning = false;
    }
}]);

merchantCtrls.controller('myAccountCtrl',['$scope','User','$timeout',function($scope,User,$timeout){
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
                console.log('Error with request to save... ERROR: '+JSON.stringify(err));
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
                console.log('Error with request to change user password... ERROR: '+JSON.stringify(err));
            });
    };

}]);

merchantCtrls.controller('currentOilPressesCtrl',['$scope','$rootScope','Oilpresses','$window','$timeout','$q','oilpressModal',function($scope,$rootScope,Oilpresses,$window,$timeout,$q,oilpressModal){
    //message initialization
    $scope.getMessages = function(messages){
        $rootScope.getScopeMessages($scope,messages);
    };
    $scope.displayAlert = false;
    function showAlert(msg,type){
        var alertDiv = angular.element("#operationAlert");
        alertDiv.removeClass();//remove css classes
        switch (type){
            case 'success':
                alertDiv.addClass('alert alert-success');
                break;
            case 'alert':
                alertDiv.addClass('alert alert-warning');
                break;
        }
        alertDiv.text(msg);
        $scope.displayAlert = true;
        $timeout(function(){$scope.displayAlert=false;},5000);//set timeout to make alert dissapear
    }
    //create initial page function and initializations
    $scope.currentOilpresses = [];//array initialization to hold the oilpresses retrieved from the api
    $scope.currentOilpressesCount = 0;
    $scope.currentOilpressesCurrentPage = 1;

    $scope.getOilPresses = function(offset,limit,queryData){
        if (typeof queryData === 'undefined') queryData = {};
        if (typeof offset !== 'undefined'&& !isNaN(offset)) queryData.offset = offset;
        if (typeof limit !== 'undefined'&&!isNaN(limit)) queryData.limit = limit;
        //make api request to get oilpresses
        Oilpresses.get(queryData,function(result){
            $scope.currentOilpresses = result.rows;
            $scope.currentOilpressesCount = result.count;
        });
    };
    $scope.pageChanged = function(){
        //$scope.getOilPresses(10*($scope.currentOilpressesCurrentPage-1));
        $scope.searchOilpress(10*($scope.currentOilpressesCurrentPage-1), undefined);
    };
    $scope.$on('refreshOilpresses',$scope.getOilPresses());//listen for refresh request
    //initialize page data with producers
    $scope.getOilPresses();
    $scope.newOilpress = function(){
        oilpressModal()
            .then(function(){
                //we're ok...do something
                console.log('Successfully created new oilpress');
                $scope.getOilPresses();
            })
            .catch(function(err){
                //something went wrong, show error
                console.error('Error while trying to create oilpress\nERROR: '+JSON.stringify(err));
            });
    };
    $scope.deleteOilpress = function(oilpressID){//delete oilpress functionality
        if (typeof oilpressID ==='undefined' || isNaN(oilpressID)) return $q.reject();//check for invalid argument
        //confirm oilpress deletion
        var confirmDeletion = $window.confirm($scope.messages.confirmDeletion);
        if (!confirmDeletion) return $q.reject();//canceled deletion
        return Oilpresses.delete({oilpressID:oilpressID}).$promise
            .then(function(result){
                if (result.hasOwnProperty('status')){
                    if (result.status){
                        //successful deletion
                        if(!$scope.displayAlert) showAlert($scope.messages.succesfulDeletion,'success');
                        $scope.pageChanged();//refresh view
                    }
                    else{
                        var message = ($scope.messages.hasOwnProperty(result.message)?$scope.messages[result.message]:$scope.messages.undefinedError);
                        showAlert(message,'alert');
                    }
                }
                else{
                    console.log(result);
                }
            })
            .catch(function(err){
                console.error('Error with request to delete oilpress. ERROR: '+JSON.stringify(err));
            });
    };
    $scope.searchOilpress = function(offset, limit){
        var queryData = {};
        if ($scope.searchID) queryData.oilpress_id = $scope.searchID;
        if ($scope.searchName && $scope.searchName.length>0) queryData.name = $scope.searchName;
        if ($scope.searchCity && $scope.searchCity.length>0) queryData.city = $scope.searchCity;
        if ($scope.searchAFM && $scope.searchAFM.length>0) queryData.afm = $scope.searchAFM;
        $scope.getOilPresses(offset,limit,queryData);
    };
    $scope.clearSearch = function(){
        $scope.currentOilpressesCurrentPage = 1;
        $scope.searchName = $scope.searchAFM = $scope.searchCity = $scope.searchID = null;
        $scope.getOilPresses();
    };

    $scope.viewOilpress = function(oilpress){
        oilpressModal(null,oilpress)
            .finally(function(){
                $scope.getOilPresses();
            });
    };
}]);

merchantCtrls.controller('inflowsCtrl',['$scope','$rootScope','Merchant_Inflows','$window','$timeout','oilpressModal','producerModal','$q','Tanks','viewProducer','Oilpresses','Reports', function($scope,$rootScope,Merchant_Inflows,$window,$timeout,oilpressModal,producerModal,$q,Tanks, viewProducer, Oilpresses, Reports){
    //scope variables declaration
    $scope.currentInflows = [];
    $scope.newInflowFormActive = false;//variable to control the appearance of new inflow
    $scope.searchInflowFormActive = false;//variable to control the appearance of search inflow form
    $scope.newInflow = {};
    $scope.printInflowActive = false;
    $scope.queryData = {};
    $scope.newInflow = {trader_type_id:2};

    //message initialization
    $scope.getMessages = function(messages){
        $rootScope.getScopeMessages($scope,messages);
    };

    //alert variables
    $scope.successfulSave = false;
    $scope.successfulDelete = false;
    $scope.notCreatedByMerchant = false;
    $scope.undefinedError = false;
    function showAlert(type){
        var selectedAlert;
        switch(type){
            case 'saveSuccess':
                selectedAlert = 'successfulSave';
                break;
            case 'deleteSuccess':
                selectedAlert = 'successfulDelete';
                break;
            case 'notCreatedByMerchant':
                selectedAlert = 'notCreatedByMerchant';
                break;
            case 'inflowHasOutflows':
                selectedAlert = 'inflowHasOutflows';
                break;
            case 'undefinedError':
                selectedAlert = 'undefinedError';
                break;
            default:
                return;
        }
        $scope[selectedAlert] = true;
        $timeout(function(){$scope[selectedAlert]=false;},3000);
    }

    $scope.getTraderType = function(typeID){
        var type;
        switch (typeID){
            case 1:
                type = 'producer';
                break;
            case 2:
                type = 'oilpress';
                break;
        }
        return $scope.messages[type];
    };
    $scope.toggleNewInflowForm = function(state){
        $scope.newInflowFormActive = (typeof state === 'undefined'?!$scope.newInflowFormActive:state);
    };
    $scope.toggleSearch = function(state){
        $scope.searchName = $scope.searchAFM = $scope.searchInvoiceNo = $scope.searchNotes = $scope.searchFrom = $scope.searchTo = null;
        $scope.searchInflowFormActive = (typeof state === 'undefined'?!$scope.searchInflowFormActive:state);
        $scope.printInflowActive = false;
    };
    $scope.searchInflows = function(){
        fillQueryData();
        $scope.getInflows();
        $scope.toggleSearch(false);//hide the form
    };
    $scope.deleteInflow = function(inflowID){
        var deleteConfirmation = $window.confirm($scope.messages['confirmDelete']);
        if (!deleteConfirmation)
            return $q.reject();//skip if canceled
        return Merchant_Inflows.delete({inflowID:inflowID}).$promise
            .then(function(result){
                if (result.hasOwnProperty('status')){
                    if (result.status){
                        //successful deletion
                        if(!$scope['successfulDelete']) showAlert('deleteSuccess');
                        $scope.pageChanged();
                    }
                    else{
                        //error
                        if (result.message === 'notCreatedByMerchant' ) showAlert('notCreatedByMerchant');
                        else if(result.message === 'inflowHasOutflows') showAlert('inflowHasOutflows');
                        else showAlert('undefinedError');
                    }
                }
            })
            .catch(function(err){
                //something went wrong with request
                console.error('Error with request to delete inflow. ERROR: '+JSON.stringify(err));
            });
    };
    $scope.newInflowForm = {};//form variable to keep track of the form status inside the inflow directive to be passed
    $scope.saveNewInflow = function(){
        //if it is oilpress inflow with contents, check for correct content data...
        if ($scope.newInflow.hasOwnProperty('hasContents') && $scope.newInflow.hasContents && $scope.newInflow.trader_type_id === 2 && $scope.newInflow.hasOwnProperty('contents')){
            for (var i = 0, len = $scope.newInflow.contents.length; i<len; i++){
                var contentLine = $scope.newInflow.contents[i];
                if (!contentLine.producerAFM && (contentLine.producerName || contentLine.producerLastName || contentLine.landOSDE || contentLine.quantity)){
                    $window.alert($scope.messages['missingContentProducerAFM']);
                    return $q.reject();
                }

            }
            for (var i = $scope.newInflow.contents.length - 1; i>=0; i--){
                var contentLine = $scope.newInflow.contents[i];
                if (Object.keys(contentLine).length <= 1) $scope.newInflow.contents.splice(i,1);
            }

            //check if overall contents quantity matches inflow total quantity
            var totalContentsQuantity = 0;
            for(var i= 0,len = $scope.newInflow.contents.length;i<len;i++){
                totalContentsQuantity += $scope.newInflow.contents[i].quantity?$scope.newInflow.contents[i].quantity:0;
            }
            if (Math.abs(totalContentsQuantity-$scope.newInflow.quantity)>1){
                $window.alert($scope.messages['contentsQuantityNotMatchingOverall']);
                return $q.reject();
            }
        }

        //else we're ok...
        return Merchant_Inflows.save($scope.newInflow).$promise
            .then(function(result){
                if (result.hasOwnProperty('status') && !result.status){
                    //error
                    if(result.message === 'notValidUserType'){
                        $window.alert($scope.messages[result.message]);
                        return $q.reject();
                    }
                    else if (result.message === 'traderNotFound'){
                        //not existing trader
                        var confirmTraderCreation = $window.confirm($scope.messages['confirmTraderCreation']);
                        if (!confirmTraderCreation) return $q.reject();//cancel if trader creation not wanted
                        //find which modal will be needed in order to create the corresponding trader....
                        var modalToOpen;
                        switch($scope.newInflow.trader_type_id){
                            case 1:
                                modalToOpen = producerModal;
                                break;
                            case 2:
                                modalToOpen = oilpressModal;
                                break;
                            default:
                                return;
                        }
                        //open modal and check for trader creation
                        return modalToOpen(null,{afm:$scope.newInflow['trader_afm']})
                            .then(function(){
                                //successful modal trader creation, so save data again
                                return Merchant_Inflows.save($scope.newInflow).$promise;
                            });
                    }
                    else{
                        showAlert('undefinedError');
                        $scope.toggleNewInflowForm(false);//close inflow form
                        return $q.reject();
                    }
                }
            })
            .then(function(){
                //successful inflow save
                $scope.pageChanged();//refresh
                $scope.toggleNewInflowForm(false);//close inflow form
                $scope.newInflow = {};//reset new inflow form
                $scope.newInflowForm.$setPristine();
                $scope.maxDate = $scope.newInflow.inflow_date = new Date();
                showAlert('saveSuccess');
            })
            .catch(function(err){
                //error with request to save new merchant inflow
                console.error('Error with request to create new merchant inflow. ERROR:'+JSON.stringify(err));
            });
    };
    $scope.addContentLine = function(){
        if (!$scope.newInflow.hasOwnProperty('contents')) $scope.newInflow.contents = [];//initialize contents array if not already there
        $scope.newInflow.contents.push({});//push empty contentLine to inflow Contents
    };

    //pagination variables
    $scope.currentInflowsCount = 0;
    $scope.currentInflowsCurrentPage = 1;
    $scope.getInflows = function(offset,limit){
        //if (typeof queryData === 'undefined') queryData = {};
        if (typeof offset !== 'undefined'&& !isNaN(offset)) $scope.queryData.offset = offset;
        if (typeof limit !== 'undefined'&&!isNaN(limit)) $scope.queryData.limit = limit;
        //make api request to get inflows
        Merchant_Inflows.get($scope.queryData).$promise
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
               //error with request to get inflows
                console.error('Error with request to get merchant Inflows.ERROR: '+JSON.stringify(err));
            });
    };
    $scope.pageChanged = function(){
        $scope.getInflows(10*($scope.currentInflowsCurrentPage-1));
    };
    $scope.pageChanged();//make the call...

    $scope.restoreInflows = function(){//refresh inflows
        $scope.currentInflowsCurrentPage = 1;
        $scope.queryData = {};
        $scope.getInflows();
    };

    $scope.viewTrader = function(inflow){
        if(inflow.trader_type_id === 1)
            return viewProducer(inflow.trader_id);
        else
            return Oilpresses.get({oilpressID:inflow.trader_id}).$promise
                .then(function(oilpress){
                    oilpressModal(null, oilpress);
                });
    };

    $scope.togglePrintInflow = function(state){
        $scope.printInflowActive = (typeof state === 'undefined'?!$scope.printInflowActive:state);
        $scope.searchInflowFormActive = false;
    };

    $scope.printInflows = function(merchantInflowID){
        //fillQueryData();
        $scope.queryData.merchantInflowID = merchantInflowID;
        Reports('inflow',$scope.queryData);
    };

    function fillQueryData(){
        if ($scope.searchName && $scope.searchName.length>0) $scope.queryData.trader_name = $scope.searchName;
        if ($scope.searchAFM && $scope.searchAFM.length>0) $scope.queryData.afm = $scope.searchAFM;
        if ($scope.searchInvoiceNo && $scope.searchInvoiceNo.length>0) $scope.queryData.invoice_no = $scope.searchInvoiceNo;
        if ($scope.searchNotes && $scope.searchNotes.length>0) $scope.queryData.notes = $scope.searchNotes;
        if ($scope.searchFrom) $scope.queryData.from_date = $scope.searchFrom;
        if ($scope.searchTo) $scope.queryData.to_date = $scope.searchTo;
    }
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

merchantCtrls.controller('inflowDetailsCtrl',['$scope','Merchant_Inflows','$timeout','viewProducer','$q','$window','$rootScope',function($scope,Merchant_Inflows,$timeout,viewProducer, $q,$window,$rootScope){
    var inflowID = $scope.inflow.trader_type_id+'-'+$scope.inflow.trader_id+'-'+$scope.inflow.inflow_id;
    //pagination variables
    $scope.contentsCount = $scope.inflow.contents.count;
    $scope.currentContentsPage = 1;
    $scope.pageChanged = function(page){
        Merchant_Inflows.getContents({inflowID:inflowID,offset:10*(page-1)}).$promise
            .then(function(contents){
                $scope.contentsCount = contents.count;
                $scope.inflow.contents = contents;
            })
    };
    //scope variables initialization to pass to inflow directive
    $scope.inflowForm = {};//variable to keep track of the form status in the infow directive
    //$scope.getInflowDetails = function(offset,limit){
    //    Merchant_Inflows.getDetails({inflowID:inflowID}).$promise
    //        .then(function(inflowDetails){
    //            //TODO: implement request to get requested set of contents
    //        })
    //        .catch(function(err){
    //            console.error('Error with request to get inflow details.ERROR: '+JSON.stringify(err));
    //        });
    //};
   //$scope.getInflowDetails();//make the call to get the details
    //alert variables
    $scope.getMessages = function(messages){
        $rootScope.getScopeMessages($scope,messages);
    };
    $scope.inflowContentsQuantity =0;
    $scope.saveSuccessAlert = false;
    $scope.undefinedErrorAlert = false;
    $scope.notCreatedByMerchantAlert = false;
    $scope.tankCannotChangeAlert = false;
    function showAlert(type){
        var alert;
        switch(type){
            case 'saveSuccess':
                alert = 'saveSuccessAlert';
                break;
            case 'undefinedError':
                alert = 'undefinedErrorAlert';
                break;
            case 'notCreatedByMerchant':
                alert ='notCreatedByMerchantAlert';
                break;
            case 'tankCannotChange':
                alert ='tankCannotChangeAlert';
                break;
            default:
                return null;
        }
        //enable alert and activate timeout to hide it
        $scope[alert] = true;
        $timeout(function(){$scope[alert] = false;},3000);
    }

    $scope.saveInflow = function(){
        //check inflows total quantity to match with the sum of inflows contents quantity
        //if($scope.inflow.trader_type_id===2 && $scope.inflow.contents && $scope.inflow.contents.count>0){
        //    for(var i= 0, len=$scope.inflow.contents.rows.length; i<len; i++){
        //        $scope.inflowContentsQuantity += $scope.inflow.contents.rows[i].quantity;
        //    }
        //    if($scope.inflow.quantity !== $scope.inflowContentsQuantity){
        //        $window.alert($scope.messages['contentsQuantityNotMatchingOverall']);
        //        $scope.refreshInflow();
        //        return $q.reject();
        //    }
        //}

        //update the outflow if possible
        return Merchant_Inflows.update({inflowID:inflowID},$scope.inflow).$promise
            .then(function(result){
                if (result.hasOwnProperty('status')){
                    if (result.status){
                        //update ok!
                        showAlert('saveSuccess');
                    }
                    else{
                        //error with update
                        if (result.message === 'notCreatedByMerchant') showAlert(result.message);
                        else if(result.message === 'tankCannotChange') showAlert(result.message);
                        else showAlert('undefinedError');
                    }
                }
            })
            .catch(function(err){
                //error with request
                console.error('Error while trying to update merchant inflow...ERROR: '+JSON.stringify(err));
            });
    };
    $scope.refreshInflow = function(){
        Merchant_Inflows.getDetails({inflowID:$scope.inflow.trader_type_id+'-'+$scope.inflow.trader_id+'-'+$scope.inflow.inflow_id}).$promise
            .then(function(inflow){
                $scope.inflow = inflow;
            })
            .catch(function(err){
                console.error('Error with requesting inflow: '+JSON.stringify(err));
            });
    };

    //functionality to directly view producer
    $scope.viewProducer = function(producerID){
        viewProducer(producerID)//service created for modular operation
            .then(function(){
                $scope.refreshInflow();
            });
    };
    $scope.$on('inflowUpdated',function(){
        $scope.refreshInflow();//refresh inflow details
    });
}]);

merchantCtrls.controller('merchantOutflowsCtrl',['$scope','$rootScope','Merchant_Outflows','Merchant_Inflows','merchantOutflowModal','Tanks','$filter','$timeout','$window','$q','Reports', function($scope,$rootScope,Merchant_Outflows,Merchant_Inflows,merchantOutflowModal, Tanks, $filter, $timeout, $window, $q,Reports){
    //scope variables initialization
    $scope.newDirectOutflow = {};
    $scope.currentOutflowsCount = 0;
    $scope.currentOutflowsCurrentPage = 1;
    $scope.currentOutflows = [];
    $scope.directOutflowActive = false;
    $scope.outflowChoiseActive = false;
    $scope.printOutflowActive = false;
    $scope.searchOutflowFormActive = false;
    $scope.DirectOutflowSaveSuccess = false;
    $scope.successfulDelete = false;
    $scope.undefinedError = false;
    $scope.remainingInflows = [];
    $scope.outflowForm = {};
    $scope.inflowHasChecked = false;
    $scope.maxDate = new Date();
    $scope.dateOptions = {startingDay:1};
    $scope.dateFormat = 'dd/MM/yyyy';
    $scope.today = function(){return new Date();};
    $scope.queryData = {};
    //$scope.oilcompanies = [];
    $scope.getMessages = function(messages){
        $rootScope.getScopeMessages($scope,messages);
    };

    function showAlert(type){
        var selectedAlert;
        switch(type){
            case 'SaveSuccess':
                selectedAlert = 'DirectOutflowSaveSuccess';
                break;
            case 'deleteSuccess':
                selectedAlert = 'successfulDelete';
                break;
            case 'undefinedError':
                selectedAlert = 'undefinedError';
                break;
            default:
                return;
        }
        $scope[selectedAlert] = true;
        $timeout(function(){$scope[selectedAlert]=false;},3000);
    }

    $scope.toggleSearch = function(state){
        $scope.searchID = $scope.searchInvoiceNo = $scope.searchNotes = $scope.searchFrom = $scope.searchTo = null;
        $scope.searchOutflowFormActive = (typeof state === 'undefined'?!$scope.searchOutflowFormActive:state);
        $scope.printOutflowActive = false;
    };
    $scope.toggleOutflowChoice = function(){
        $scope.outflowChoiseActive = !$scope.outflowChoiseActive;
        $scope.directOutflowActive = false;
    };
    $scope.toggleNewOutflow = function(state){
        $scope.directOutflowActive = (typeof state === 'undefined'?!$scope.directOutflowActive:state);
        //check if outflow form is opened and also get the necessary content
        if (!$scope.directOutflowActive) {
            $scope.remainingInflows = [];
            return;
        }//closed so leave....
        //opened
        Merchant_Inflows.query({getRemaining:true}).$promise
            .then(function(inflows){
                $scope.remainingInflows = inflows;
            })
            .catch(function(err){
                $scope.remainingInflows = [];//reset inflows
                console.log('Error while getting remaining inflows. ERROR: '+JSON.stringify(err));
                $scope.directOutflowActive = false;
            });
    };

    $scope.getOutflows = function(offset,limit){
        if (typeof queryData === 'undefined') queryData = {};
        if (typeof offset !== 'undefined'&& !isNaN(offset)) $scope.queryData.offset = offset;
        if (typeof limit !== 'undefined'&&!isNaN(limit)) $scope.queryData.limit = limit;
        //make api request to get outflows
        return Merchant_Outflows.get($scope.queryData).$promise
            .then(function(result){
                if (!result.hasOwnProperty('status')|| !result.status){

                    $scope.currentOutflows = result.rows;
                    $scope.currentOutflowsCount = result.count;
                }
                else{
                    console.error('Something went wrong....');
                    console.error(result);
                }
            })
            .catch(function(err){
                //error with request to get outflows
                console.log('Error with request to get merchant outflows.ERROR: '+JSON.stringify(err));
            });
    };
    $scope.$on('refreshOutflows',$scope.getOutflows);
    //enable function to page change
    $scope.pageChanged = function(){
        $scope.getOutflows(10*($scope.currentOutflowsCurrentPage-1));
    };
    $scope.pageChanged();//initial call

    $scope.hasChecked = function() {
        for (var i = 0, len = $scope.remainingInflows.length;i<len;i++){
            if ($scope.remainingInflows[i].selected){
                $scope.inflowHasChecked = true;
                return;
            }
            $scope.inflowHasChecked = false;
        }
    };
    $scope.saveNewDirectOutflow = function(){
        var newOutflow = $scope.newDirectOutflow;
        //gather selected inflows to construct contents of outflow
        newOutflow.contents = [];//object array to hold the inflows that will make the outflow contents
        for (var i = 0, len = $scope.remainingInflows.length;i<len;i++){//br
            var remInflow = $scope.remainingInflows[i];//get current inflow browsed
            if (remInflow.selected) {
                newOutflow.contents.push({
                    inflow_id: remInflow.inflow_id,
                    trader_id: remInflow.trader_id,
                    trader_type_id: remInflow.trader_type_id
                    //normally here we would also need the merchant_id to identify the Producer Merchant Outflow (inflow) but since we are working with a single merchant, it will be determined and set on backend after request
                })
            }
        }
        //contents constructed
        newOutflow.oilcompany_id=1;//for now hardcoded to oilcompany "ELAIS"
        return Merchant_Outflows.save(newOutflow).$promise
            .then(function(result){
                showAlert('SaveSuccess');
                $scope.directOutflowActive = false;
                $scope.pageChanged();
            })
            .catch(function(err){
                console.error('Error with request to DB to save new Merchant Outflow. \nERROR: ');
                console.error(err);
            })
    };

    $scope.deleteOutflow = function(outflowID){
        var deleteConfirmation = $window.confirm($scope.messages['confirmDelete']);
        if (!deleteConfirmation)
            return $q.reject();//skip if canceled
        return Merchant_Outflows.delete({outflowID:outflowID}).$promise
            .then(function(result){
                if (result.hasOwnProperty('status')){
                    if (result.status){
                        //successful deletion
                        if(!$scope['successfulDelete']) showAlert('deleteSuccess');
                        $scope.pageChanged();
                    }
                    else{
                        showAlert('undefinedError');
                    }
                }
            })
            .catch(function(err){
                //something went wrong with request
                console.error('Error with request to delete outflow. ERROR: '+JSON.stringify(err));
            });
    };

    $scope.searchOutflows = function(){
        //var queryData = {};
        fillQueryData();
        $scope.getOutflows();
        $scope.toggleSearch(false);//hide the form
    };

    function fillQueryData(){
        if ($scope.searchID) $scope.queryData.outflow_id = $scope.searchID;
        if ($scope.searchInvoiceNo && $scope.searchInvoiceNo.length>0) $scope.queryData.invoice_no = $scope.searchInvoiceNo;
        if ($scope.searchNotes && $scope.searchNotes.length>0) $scope.queryData.notes = $scope.searchNotes;
        if ($scope.searchFrom) $scope.queryData.from_date = new Date($scope.searchFrom);
        if ($scope.searchTo) $scope.queryData.to_date = new Date($scope.searchTo);
    }

    $scope.restoreOutflows = function(){//refresh outflows
        $scope.currentOutflowsCurrentPage = 1;
        $scope.queryData = {};
        $scope.getOutflows();
    };

    //$scope.togglePrintOutflow = function(state){
    //    $scope.printOutflowActive = (typeof state === 'undefined'?!$scope.printOutflowActive:state);
    //    $scope.searchOutflowFormActive = false;
    //};

    $scope.printOutflow = function(outflow_id){
        //fillQueryData();
        $scope.queryData.outflow_id = outflow_id;
        Reports('outflow',$scope.queryData);
        //$window.open("/outflowReport/" + outflow_id,"_blank", "width=1000, height=1000, left=200, top=200");

    };
    //$scope.getOilcompanies = function(){
    //    Oilcompanies.query().$promise
    //        .then(function(oilcompanies){
    //            $scope.oilcompanies = oilcompanies;
    //        })
    //        .catch(function(err){
    //            console.error('Error while trying to get oilcompanies' + err);
    //        });
    //};
    //$scope.getOilcompanies();

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
merchantCtrls.controller('currentMerchantTankCtrl',['$scope', 'Tanks', '$window', '$rootScope', '$q', 'emptyTankModal','Merchant_Outflows', function($scope, Tanks, $window, $rootScope, $q, emptyTankModal, Merchant_Outflows){
    //scope variables and functions initialization
    $scope.currentTanks = [];//initialize tanks
    $scope.getTanks = function(){
        Tanks.query().$promise
            .then(function(tanks){
                $scope.currentTanks = tanks;
            })
            .catch(function(err){
                console.error('Error while requesting merchant tanks. ERROR:'+JSON.stringify(err));
            });
    };
    $scope.getTanks();//make the actual call to get tanks
    //get text messages to display
    $scope.getMessages = function(messages){
        $rootScope.getScopeMessages($scope,messages);
    };
    $scope.$on('refreshTanks',$scope.getTanks);//set listener for tank refresh
    $scope.deleteTank = function(tankID){//delete tank function
        //get confirmation
        var confirm = $window.confirm($scope.messages.deleteConfirm);
        if (!confirm){
            console.log('Canceled tank deletion...');
            return $q.reject();
        }
        return Tanks.delete({tankID:tankID}).$promise
            .then(function(result){
                if (result.status) {
                    //delete ok... show message
                    $window.alert($scope.messages.deleteSuccessful);
                    $scope.refreshTanks();
                }
                else if (result.hasOwnProperty('custom')&&result.custom){
                    //not deleted display correct message
                    $window.alert($scope.messages[result.message]);
                }
                else{
                    //unknown error
                    $window.alert($scope.messages[result.message]);
                    console.error(JSON.stringify(result));
                }
            })
            .catch(function(err){
                console.error('Error while deleting Tank. ERROR: '+JSON.stringify(err));

            });
    };

    $scope.refreshTanks = function(){
        $scope.currentTanks = [];
        Tanks.query().$promise
            .then(function(tanks){
                for (var i = 0, len = tanks.length;i<len;i++){
                    tanks[i].$getStatus()
                        .then(function(tankStatus){
                            $scope.currentTanks.push(tankStatus);
                        });
                }
            })
            .catch(function(err){
                //something went wrong with the api request
                console.error(JSON.stringify(err));
            });
    };
    $scope.initTank = function(tank_id){//empty tank
        //get confirmation
        var confirm = $window.confirm($scope.messages.initConfirm);
        if (!confirm){
            console.log('Canceled tank emptying...');
            return $q.reject();
        }
        return Tanks.update({tankID:tank_id},{empty_date:new Date()}).$promise
            .then(function(result){
                if (result.hasOwnProperty('status')){
                    if (result.status){
                        //successful tank update
                        $window.alert($scope.messages.emptySuccessful);
                        $scope.refreshTanks();
                    }
                    else {
                        $window.alert(result.messages.undefinedError);
                    }
                }
            })
            .catch(function(err){
                console.error('Error with request to update tank. \nERROR:'+JSON.stringify(err));
            });
    };

    $scope.emptyTank = function(tank_id){
        return Tanks.getStatus({tankID:tank_id}).$promise
            .then(function(tank){
                if(tank.total_quantity<=0) $window.alert($scope.messages.tankAlreadyEmpty);
                else emptyTankModal(null, tank, Merchant_Outflows);
            })
            .catch(function(err){
                console.error("Error while trying to get tank with " + tank_id + "\nError:" + JSON.stringify(err))
            });

    };


}]);

merchantCtrls.controller('tankDetailCtrl',['$rootScope','$scope','Tanks','producerModal','$location','Producers', 'oilpressModal','Oilpresses', function($rootScope,$scope,Tanks,producerModal,$location,Producers, oilpressModal, Oilpresses){
    //scope variables initialization
    $scope.showSuccess = false;
    $scope.showWarning = false;
    $scope.tankContents = {};
    $scope.tankActions = [];
    $scope.unknownQuantity = 0;
    $scope.hideAlert = function(type){
        switch (type){
            case 'success':
                $scope.showSuccess = false;
                break;
            case 'warning':
                $scope.showWarning = false;
                break;
        }
    };
    $scope.tank.$getContents({includeStatus:true})
        .then(function(){
            $scope.tank.empty_date = new Date($scope.tank.empty_date);
            //also compute the unknown Quantity for tank
            var totalKnownQuantity = 0;
            for (var oilpressID in $scope.tank.contents){
                totalKnownQuantity += $scope.tank.contents[oilpressID].quantity;
            }
            $scope.unknownQuantity = ($scope.tank.total_quantity - totalKnownQuantity).toFixed(2);
        })
        .catch(function(err){
            //error
            console.error('Error with getting tank contents. \nERROR:'+JSON.stringify(err));
        });

    $scope.saveTank = function(){
        //create function to save tank...
        return Tanks.update({tankID:$scope.tank.tank_id},$scope.tank).$promise
            .then(function(result){
                if (result.hasOwnProperty('status')){
                    if (result.status){
                        //successful tank update
                        $scope.showSuccess = true;
                    }
                    else {
                        if (result.message === 'tankWithNoExists'){
                            $scope.showWarning = true;
                        }
                    }
                }
            })
            .catch(function(err){
                //error
                console.error('Error with request to update tank. \nERROR:'+JSON.stringify(err));
            });
    };

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
        Producers.get({producerID:producerID}).$promise
            .then(function(producer){
                return producerModal(null,producer)
                    .then(function(){
                        //all good
                        console.log('Successful modal operation');
                    })
                    .catch(function(err){
                        console.log(JSON.stringify(err));
                    });
            })
            .catch(function(err){
                console.error('Error with request to get producer... ERROR: '+JSON.stringify(err));
            });
    };
}]);

merchantCtrls.controller('outflowDetailCtrl',['$scope','Merchant_Outflows','Tanks','Oilpresses','oilpressModal','Producers', 'producerModal', function($scope, Merchant_Outflows, Tanks, Oilpresses, oilpressModal, Producers, producerModal){
    $scope.showSuccess = false;
    $scope.merchantTanks = [];//initialize array to hold merchant Tanks
    Tanks.query().$promise
        .then(function(tanks){
            //got tanks ok
            $scope.merchantTanks = tanks;
        })
        .catch(function(err){
            //error
            console.error('Error with request to get merchant tanks.\nERROR: '+JSON.stringify(err));
        });

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
        Producers.get({producerID:producerID}).$promise
            .then(function(producer){
                return producerModal(null,producer)
                    .then(function(){
                        //all good
                        console.log('Successful modal operation');
                    })
                    .catch(function(err){
                        console.log(JSON.stringify(err));
                    });
            })
            .catch(function(err){
                console.error('Error with request to get producer... ERROR: '+JSON.stringify(err));
            });
    };
    $scope.$on('outflowUpdated',function(){
        $scope.showSuccess = true;
        $scope.refreshOutflow();//refresh page details
    });

    $scope.hideAlert = function(type){//function to hide alerts
        switch (type){
            case 'success':
                $scope.showSuccess = false;
                break;
        }
    };

    $scope.refreshOutflow = function(){
        Merchant_Outflows.getContents({outflowID:$scope.outflow.outflow_id, includeStatus:true}).$promise
            .then(function(outflow){
                $scope.outflow = outflow;
            })
            .catch(function(err){
                console.error('Error with requesting outflow: '+JSON.stringify(err));
            });
    };
}]);

//merchantCtrls.controller('outflowReportCtrl',['$scope','Merchant_Outflows','$window', function($scope, Merchant_Outflows, $window){
//    $scope.closeReport = function(){
//        $window.close();
//    };
//
//}]);

merchantCtrls.controller('currentProducersCtrl',['$scope','Producers','$window','producerModal','$rootScope','$q',function($scope,Producers,$window,producerModal,$rootScope, $q){
    //message initialization
    $scope.getMessages = function(messages){
        $rootScope.getScopeMessages($scope,messages);
    };
    //create initial page function and initializations
    $scope.currentProducers = [];
    $scope.currentProducersCount = 0;
    $scope.currentProducersCurrentPage = 1;
    $scope.getProducers = function(offset,limit,queryData){
        if (typeof queryData === 'undefined') queryData = {};
        if (typeof offset !== 'undefined'&& !isNaN(offset)) queryData.offset = offset;
        if (typeof limit !== 'undefined'&&!isNaN(limit)) queryData.limit = limit;
        //make api request to get producers
        Producers.get(queryData,function(result){
            $scope.currentProducers = result.rows;
            $scope.currentProducersCount = result.count;

        });
    };
    $scope.pageChanged = function(){
        //$scope.getProducers(10*($scope.currentProducersCurrentPage-1), undefined, $scope.queryData);
        $scope.searchProducer(10*($scope.currentProducersCurrentPage-1), undefined);
    };
    $scope.$on('refreshProducers',$scope.getProducers);//listen for refresh request
    //initialize page data with producers
    $scope.getProducers();
    $scope.deleteProducer = function(producerID){//delete producer functionality
        if (typeof producerID ==='undefined' || isNaN(producerID)) return;//check for invalid argument
        //confirm producer deletion
        var confirmDeletion = $window.confirm($scope.messages.confirmDeletion);
        if (!confirmDeletion) return $q.reject();//canceled deletion
        return Producers.delete({producerID:producerID}).$promise
            .then(function(result){
                if (result.hasOwnProperty('status')){
                    if (result.status){
                        //successful deletion
                        $window.alert($scope.messages.successfulDeletion);
                        $scope.getProducers();//refresh view
                    }
                    else{
                        $window.alert($scope.messages[result.message]);
                    }
                }
            })
            .catch(function(err){
                console.error('Error while deleting Producer. ERROR: '+JSON.stringify(err));
            });
    };
    $scope.viewProducer = function(producer){
        return producerModal(null,producer)
            .then(function(){
                //all good
                console.log('Successful modal operation');
                $rootScope.$broadcast('refreshProducers');
            })
            .catch(function(err){
                //error in modal function
                console.log(JSON.stringify(err));
            });
    };
    $scope.searchProducer = function(offset, limit){
        var queryData = {};
        if ($scope.searchID) queryData.producer_id = $scope.searchID;
        if ($scope.searchLastName && $scope.searchLastName.length>0) queryData.last_name = $scope.searchLastName;
        if ($scope.searchFirstName && $scope.searchFirstName.length>0) queryData.first_name = $scope.searchFirstName;
        if ($scope.searchAFM && $scope.searchAFM.length>0) queryData.afm = $scope.searchAFM;
        $scope.getProducers(offset,limit,queryData);
    };
    $scope.clearSearch = function(){
        $scope.currentInflowsCurrentPage = 1;
        $scope.searchLastName = $scope.searchFirstName = $scope.searchAFM = $scope.searchID = null;
        $scope.getProducers();
    };
}]);
