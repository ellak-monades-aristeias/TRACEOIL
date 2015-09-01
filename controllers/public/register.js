//load modules for routing
var express = require('express');
var router = express.Router();
var messages = rootRequire('libs/messaging.js');
var api = require('../../libs/api.js');

router.get('/register/*',function(request,response){
    response.render('login-register/index',{text:messages.getSection('login-frontend')});
});

router.get('/registerOilpressPartial',function(request,response){
    response.render('login-register/registerOilpressPartial',{text:messages.getSection('register-frontend')});
});

router.get('/registerMerchantPartial',function(request,response){
    response.render('login-register/registerMerchantPartial',{text:messages.getSection('register-frontend')});
});

router.get('/registerOilcompanyPartial',function(request,response){
    response.render('login-register/registerOilcompanyPartial',{text:messages.getSection('register-frontend'),oilCompanies:[]});
});

router.post('/register',function(request,response){
    console.log('Trying to register user ' + request.body.username);
    api.send('/register', 'POST', null, request.body)
        .then(function(result){
            response.send(result);
        })
        .catch(function(err){
            console.error(err);
        });
});

module.exports = router;
