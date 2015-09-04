//load modules for routing
var express = require('express');
var router = express.Router();
var api = require('../../libs/api.js');
var log = require('../../config/logConfig.js');

router.get('/api/user', function(request, response){
    log.info('Trying to get information of user ' + request.user.username);
    //do the call to data api
    api.send(request.originalUrl, request.method, request.user.token, null)
        .then(function(result){
            response.send(result);
        })
        .catch(function(err){
            log.error({request:request, err:err}, 'Error while trying to sending request to API\n ERROR:' + err.name);
            response.send({status:false, message:err.name});
        });
});

router.post('/api/user(/password)?', function(request, response){
    var username = request.user.username;
    log.info('Request to update information for user ' + username);
    api.send(request.originalUrl, request.method, request.user.token, request.body)
        .then(function(result){
            log.info('User ' + username +' updated');
            response.send(result);
        })
        .catch(function(err){
            log.error({request:request, err:err}, 'Error while trying to sending request to API\n ERROR:' + err.name);
            response.send({status:false, message:err.name});
        });
});

module.exports = router;