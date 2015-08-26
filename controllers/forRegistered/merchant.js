//load modules for routing
var express = require('express');
var router = express.Router();
var messages = rootRequire('libs/messaging.js');

//partial html retrieval
router.get('/merchant/partials/:partialHTML',function(request,response){
    //var partialHTML = request.param('partialHTML');//get partial html name from request
    var partialHTML = request.params.partialHTML;//get partial html name from request
    //now check what is needed for sending back
    switch (partialHTML){
        case 'menu':
            response.render('merchant/merchantMenu',{menu:messages.getSection('merchant-menu')});
            break;
        case 'home':
            response.render('merchant/merchantHome',{text:messages.getSection('merchantHome')});
            break;
        case 'myaccount':
            response.render('merchant/merchantMyAccount',{text:messages.getSection('merchantMyAccount')});
            break;
        case 'oilpresses':
            response.render('merchant/merchantOilPresses',{text:messages.getSection('merchantOilPresses')});
            break;
        case 'tanks':
            response.render('merchant/merchantTanks',{text:messages.getSection('merchantTanks')});
            break;
        case 'tankDirective':
            response.render('merchant/tankDirective', {text:messages.getSection('merchantTankDirective')});
            break;
        case 'tankDetails':
            response.render('merchant/tankDetails', {text:messages.getSection('merchantTankDetails')});
            break;
        case 'tankStatusDirective':
            response.render('merchant/tankStatusDirective', {text:messages.getSection('merchantTankStatusDirective')});
            break;
        case 'inflows':
            response.render('merchant/merchantInflows',{text:messages.getSection('merchantInflows')});
            break;
        case 'inflowDirective':
            response.render('merchant/inflowDirective',{text:messages.getSection('merchantInflowDirective')});
            break;
        case'inflowDetails':
            response.render('merchant/inflowDetails',{text:messages.getSection('merchantInflowDetails')});
            break;
        case 'outflows':
            response.render('merchant/merchantOutflows',{text:messages.getSection('merchantOutflows')});
            break;
        case 'outflowDirective':
            response.render('merchant/outflowDirective',{text:messages.getSection('merchantOutflowDirective')});
            break;
        case 'outflowDetails':
            response.render('merchant/outflowDetails', {text:messages.getSection('merchantOutflowDetails')});
            break;
        case'outflowReport':
            response.render('merchant/outflowReport', {text:messages.getSection('outflowReport')});
            break;
        case'producers':
            response.render('merchant/merchantProducers', {text:messages.getSection('merchantProducers')});
            break;
    }
});

module.exports = router;