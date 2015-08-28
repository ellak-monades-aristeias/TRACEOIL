//load modules for routing
var express = require('express');
var router = express.Router();
var messages = rootRequire('libs/messaging.js');
var checkRedirect = rootRequire('controllers/shared/checkAndRedirect.js');
var api = require('../../libs/api.js');
//var token = require('../../config/jwt.js');
router.get('/',checkRedirect);

router.get('/login',function(request,response){
    //response.render('login',{text:messages.getSection('login-frontend'),error:request.flash('error')});
    response.render('login-register/index',{text:messages.getSection('login-frontend')});
});


//get last transaction date and total oil quantity transferred in system in order to display them at login page
router.get('/getStats', function(request, response){
    api.send(request.originalUrl, request.method, null, null)
        .then(function(stats){
            response.send(stats);
        });
});

router.get('/loginPartial',function(request,response){
    response.render('login-register/loginPartial',{text:messages.getSection('login-frontend'),error:request.flash('error')});

});


router.post('/login',function(request,response,next){
    var body = request.body;
    api.send('/login', 'POST', null, body)
        .then(function(result){
            response.send(result);
            next();
        })
        .catch(function(err){

        });
});



module.exports = router;