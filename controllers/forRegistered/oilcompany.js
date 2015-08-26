//load modules for routing
var express = require('express');
var router = express.Router();
var messages = rootRequire('libs/messaging.js');


//partial html retrieval
router.get('/oilcompany/partials/:partialHTML',function(request,response){
    //var partialHTML = request.param('partialHTML');//get partial html name from request
    var partialHTML = request.params.partialHTML;//get partial html name from request
    //now check what is needed for sending back
    switch (partialHTML){
        case 'menu':
            response.render('oilcompany/oilcompanyMenu',{menu:messages.getSection('oilcompany-menu')});
            break;
        case 'home':
            response.render('oilcompany/oilcompanyHome',{text:messages.getSection('oilcompanyHome-frontend')});
            break;
        case 'merchants':
            response.render('oilcompany/oilcompanyMerchants',{text:messages.getSection('oilcompanyMerchants')});
            break;
        case 'inflows':
            response.render('oilcompany/oilcompanyInflows',{text:messages.getSection('oilcompanyinflows')});
            break;
        case 'inflowDetails':
            response.render('oilcompany/inflowDetails',{text:messages.getSection('oilcompanyInflowDetails')});
            break;
        case 'myaccount':
            response.render('oilcompany/oilcompanyMyAccount',{text:messages.getSection('oilcompanyMyaccount')});
            break;

    }
});


module.exports = router;