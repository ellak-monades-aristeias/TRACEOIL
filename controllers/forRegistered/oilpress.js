//load modules for routing
var express = require('express');
var router = express.Router();
var messages = rootRequire('libs/messaging.js');


//partial html retrieval
router.get('/oilpress/partials/:partialHTML',function(request,response){
    //var partialHTML = request.param('partialHTML');//get partial html name from request
    var partialHTML = request.params.partialHTML;//get partial html name from request
    //now check what is needed for sending back
    switch (partialHTML){
        case 'menu':
            response.render('oilpress/oilpressMenu',{menu:messages.getSection('oilpress-menu')});
            break;
        case 'home':
            response.render('oilpress/oilpressHome',{text:messages.getSection('oilpressHome-frontend')});
            break;
        case 'inflows':
            response.render('oilpress/oilpressInflows',{text:messages.getSection('oilpressInflows-frontend')});
            break;
        case 'newInflow':
            response.render('oilpress/newInflowDirective',{text:messages.getSection('oilpressInflows-frontend')});
            break;
        case 'myaccount':
            response.render('oilpress/oilpressMyAccount',{text:messages.getSection('oilpressMyaccount')});
            break;
        case 'tanks':
            response.render('oilpress/oilpressTanks',{text:messages.getSection('oilpressTanks')});
            break;
        case 'producers':
            response.render('oilpress/oilpressProducers',{text:messages.getSection('oilpressProducers')});
            break;
        case 'tankDirective':
            response.render('oilpress/tankDirective',{text:messages.getSection('oilpressTankDirective')});
            break;
        case 'tankDetails':
            response.render('oilpress/tankDetails',{text:messages.getSection('oilpressTankDetails')});
            break;
        case 'outflows':
            response.render('oilpress/oilpressOutflows',{text:messages.getSection('oilpressOutflows')});
            break;
        case 'outflowDetails':
            response.render('oilpress/outflowDetails',{text:messages.getSection('oilpressOutflowDetails')});
            break;
        case 'outflowDirective':
            response.render('oilpress/outflowDirective',{text:messages.getSection('outflowDirective')});
            break;
        case 'tankStatusDirective':
            response.render('oilpress/tankStatusDirective',{text:messages.getSection('oilpressTankStatusDirective')});
            break;
        case 'producerDetails':
            response.render('oilpress/producerDetails',{text:messages.getSection('oilpressProducerDetails')});
            break;
    }
});

module.exports = router;