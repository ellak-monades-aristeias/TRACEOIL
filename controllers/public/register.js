//load modules for routing
var express = require('express');
var router = express.Router();
var messages = rootRequire('libs/messaging.js');
var api = require('../../libs/api.js');
var log = require('../../config/logConfig.js');

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
    var username = request.body.username;
    log.info('Trying to register user ' + username);
    api.send(request.originalUrl, request.method , null, request.body)
        .then(function(result){
            log.info('User ' + username + ' successfully registered');
            response.send(result);
        })
        .catch(function(err){
            log.error({request:request, err:err}, 'Error while trying to sending request to API\n ERROR:' + err.name);
            response.send({status:false, message:err.name});
        });
});

module.exports = router;
