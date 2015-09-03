//load modules for routing
var express = require('express');
var router = express.Router();
var log = require('../../config/logConfig.js');

function checkApiPermissions(request,response,next){
    //check if it concerns an api request
    if (request.url.search(/\bapi/g) === -1) return next();//allow if not api request
    //first get logged in user type
    var userTypeID = request.user.type_id;
    var allowedAction = true;
    //act upon user type id
    switch (userTypeID){
        case 2:
            allowedAction = checkForOilPressAction(request);
            break;
        case 3:
            allowedAction = checkForMerchantAction(request);
            break;
        case 4:
            allowedAction = checkForOilCompanyAction(request);
            break;
    }

    if (allowedAction) return next();
    else {
        log.info({request:request}, 'Denied access for user ' + request.user.username);
        response.send('Not allowed action');
    }
}

function checkForOilPressAction(request){
    var method = request.method;
    var url = request.url;
    //check if api/user is called and allow since anyone can make changes to their user account.
    if (url.search(/\bapi\/user/g) !== -1) return true;
    switch (method){
        case 'GET':
            if (url.search(/\bapi\/producers/g) !== -1) return true;//producers
            if (url.search(/\bapi\/producer_lands/g) !== -1) return true;//producer_lands
            if (url.search(/\bapi\/oilpress\/tanks/g) !== -1) return true;//oilpress tanks
            if (url.search(/\bapi\/oilpress\/inflows/g) !== -1) return true;//oilpress inflows
            if (url.search(/\bapi\/oilpress\/outflows/g) !== -1) return true;//oilpress outflows
            if (url.search(/\bapi\/oilpress\/tankActions/g) !== -1) return true;//oilpress tank actions
            if (url.search(/\bapi\/merchants/g) !== -1) return true;//merchants
            if (url.search(/\bapi\/oilpress\/report/g) !== -1) return true;//oilpress outflow reports
            break;
        case 'PUT':
            if (url.search(/\bapi\/producers/g) !== -1) return true;//producers
            if (url.search(/\bapi\/oilpress\/tanks/g) !== -1) return true;//oilpress tanks
            if (url.search(/\bapi\/oilpress\/inflows/g) !== -1) return true;//oilpress inflows
            if (url.search(/\bapi\/oilpress\/outflows/g) !== -1) return true;//oilpress outflows
            break;
        case 'POST':
            if (url.search(/\bapi\/producers/g) !== -1) return true;//producers
            if (url.search(/\bapi\/oilpress\/tanks/g) !== -1) return true;//oilpress tanks
            if (url.search(/\bapi\/oilpress\/inflows/g) !== -1) return true;//oilpress inflows
            if (url.search(/\bapi\/oilpress\/outflows/g) !== -1) return true;//oilpress outflows
            break;
        case 'DELETE':
            if (url.search(/\bapi\/producers/g) !== -1) return true;//producers
            if (url.search(/\bapi\/oilpress\/tanks/g) !== -1) return true;//oilpress tanks
            if (url.search(/\bapi\/oilpress\/inflows/g) !== -1) return true;//oilpress inflows
            if (url.search(/\bapi\/oilpress\/outflows/g) !== -1) return true;//oilpress outflows
            break;
    }

    return false;
}

function checkForMerchantAction(request){
    var method = request.method;
    var url = request.url;
    //check if api/user is called and allow since anyone can make changes to their user account.
    if (url.search(/\bapi\/user/g) !== -1) return true;
    switch (method){
        case 'GET':
            if (url.search(/\bapi\/oilpresses/g) !== -1) return true;//oilpresses
            if (url.search(/\bapi\/producers/g) !== -1) return true;//producers
            if (url.search(/\bapi\/producer_lands/g) !== -1) return true;//producer_lands
            if (url.search(/\bapi\/merchant\/tanks/g) !== -1) return true;//merchant tanks
            if (url.search(/\bapi\/merchant\/inflows/g) !== -1) return true;//oilpress inflows
            if (url.search(/\bapi\/merchant\/outflows/g) !== -1) return true;//oilpress outflows
            if (url.search(/\bapi\/merchant\/report/g) !== -1) return true;//merchant reports
            if (url.search(/\bapi\/merchant\/download/g) !== -1) return true;//merchant reports
            //if (url.search(/\bapi\/oilcompanies/g) !== -1) return true;//oilcompanies
            break;
        case 'PUT':
            if (url.search(/\bapi\/oilpresses/g) !== -1) return true;//oilpresses
            if (url.search(/\bapi\/producers/g) !== -1) return true;//producers
            //if (url.search(/\bapi\/producer_lands/g) !== -1) return true;//producer_lands
            if (url.search(/\bapi\/merchant\/tanks/g) !== -1) return true;//merchant tanks
            if (url.search(/\bapi\/merchant\/inflows/g) !== -1) return true;//oilpress inflows
            if (url.search(/\bapi\/merchant\/outflows/g) !== -1) return true;//oilpress outflows
            break;
        case 'POST':
            if (url.search(/\bapi\/oilpresses/g) !== -1) return true;//oilpresses
            if (url.search(/\bapi\/producers/g) !== -1) return true;//producers
            if (url.search(/\bapi\/producer_lands/g) !== -1) return true;//producer_lands
            if (url.search(/\bapi\/merchant\/tanks/g) !== -1) return true;//merchant tanks
            if (url.search(/\bapi\/merchant\/inflows/g) !== -1) return true;//oilpress inflows
            if (url.search(/\bapi\/merchant\/outflows/g) !== -1) return true;//oilpress outflows
            break;
        case 'DELETE':
            if (url.search(/\bapi\/oilpresses/g) !== -1) return true;//oilpresses
            if (url.search(/\bapi\/producers/g) !== -1) return true;//producers
            //if (url.search(/\bapi\/producer_lands/g) !== -1) return true;//producer_lands
            if (url.search(/\bapi\/merchant\/tanks/g) !== -1) return true;//merchant tanks
            if (url.search(/\bapi\/merchant\/inflows/g) !== -1) return true;//oilpress inflows
            if (url.search(/\bapi\/merchant\/outflows/g) !== -1) return true;//oilpress outflows
            break;
    }

    return false;
}

function checkForOilCompanyAction(request){
    var method = request.method;
    var url = request.url;
    //check if api/user is called and allow since anyone can make changes to their user account.
    if (url.search(/\bapi\/user/g) !== -1) return true;
    switch (method){
        case 'GET':
            if (url.search(/\bapi\/merchants/g) !== -1) return true;//merchants
            if (url.search(/\bapi\/oilpresses/g) !== -1) return true;//oilpresses
            if (url.search(/\bapi\/producers/g) !== -1) return true;//producers
            if (url.search(/\bapi\/producers-sustainability/g) !== -1) return true;//producers sustainability
            if (url.search(/\bapi\/producer_lands/g) !== -1) return true;//producer_lands
            if (url.search(/\bapi\/oilcompany\/inflows/g) !== -1) return true;//oilcompany inflows
            if (url.search(/\bapi\/oilcompany\/report/g) !== -1) return true;//oilcompany inflow report
            if (url.search(/\bapi\/oilcompany_users/g) !== -1) return true;//oilcompany users
            break;
        case 'PUT':
            if (url.search(/\bapi\/oilcompany\/inflows/g) !== -1) return true;//oilcompany inflows
            break;
        case 'POST':

            break;
        case 'DELETE':

            break;
    }

    return false;
}

router.use(checkApiPermissions);

module.exports = router;