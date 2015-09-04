//load modules for routing
var express = require('express');
var router = express.Router();
var api = require('../../libs/api.js');
var log = require('../../config/logConfig.js');

//parameters validation
router.param('landID',function(req,res,next,landID){
    if (isNaN(landID)) res.send('Wrong Request');
    else next();
});
//get producer lands
router.get('/api/producer_lands/:landID?', function(request, response){
    log.info('Trying to get list of lands');
    //do the call to data api with the requested url, method, query and authorization
    api.send(request.originalUrl, request.method, request.user.token, request.query)
        .then(function(result){
            response.send(result);
        })
        .catch(function(err){
            log.error({request:request, err:err}, 'Error while trying to sending request to API\n ERROR:' + err.name);
            response.send({status:false, message:err.name});
        });
});

module.exports = router;
