//load modules for routing
var express = require('express');
var router = express.Router();
var messages = rootRequire('libs/messaging.js');

router.get('/helpers/:modalHTML',function(request,response){
   //var partialHTML = request.param('partialHTML');//get partial html name from request
   var modalHTML = request.params.modalHTML;//get partial html name from request
   //now check what is needed for sending back
   switch (modalHTML){
      case 'dateTimePicker':
         response.render('helpers/dateTimePicker',{text:messages.getSection('DateTimePicker')});
         break;
      case 'merchantInflowModal':
         response.render('helpers/merchantInflowModal',{text:messages.getSection('merchantInflowModal')});
         break;
      case 'merchantOutflowModal':
         response.render('helpers/merchantOutflowModal',{text:messages.getSection('merchantOutflowModal')});
         break;
      case 'merchantTankModal':
         response.render('helpers/merchantTankModal',{text:messages.getSection('merchantTankModal')});
         break;
      case 'oilpressModal':
         response.render('helpers/oilpressModal',{text:messages.getSection('oilpressModal'),userTypeID:request.user.type_id});
         break;
      case 'merchantModal':
         response.render('helpers/merchantModal',{text:messages.getSection('merchantModal')});
         break;
      case 'oilpressInflowModal':
         response.render('helpers/oilpressInflowModal',{text:messages.getSection('oilpressInflows-frontend')});
         break;
      case 'oilpressOutflowModal':
         response.render('helpers/oilpressOutflowModal',{text:messages.getSection('oilpressOutflowModal')});
         break;
      case 'producerModal':
         response.render('helpers/producerModal',{text:messages.getSection('producerModal'),userTypeID:request.user.type_id});
         break;
      case 'oilpressTankModal':
         response.render('helpers/oilpressTankModal',{text:messages.getSection('oilpressTankModal')});
         break;
      case 'merchantOutflowReport':
         response.render('helpers/merchantOutflowReport',{text:messages.getSection('merchantOutflowReport')});
         break;
      case 'emptyTankModal':
         response.render('helpers/emptyTankModal',{text:messages.getSection('emptyTankModal')});
         break;
      case 'scanProducerModal':
         response.render('helpers/scanProducerModal',{text:messages.getSection('scanProducerModal')});
         break;
   }


});

module.exports = router;