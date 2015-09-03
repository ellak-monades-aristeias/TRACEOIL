//load modules for routing
var express = require('express');
var router = express.Router();
var api = require('../../libs/api.js');
var log = require('../../config/logConfig.js');

//PRODUCER API
//get the list of producers or a single producer
router.get('/api/producers/:producerID?', function(request, response){
    log.info('Request to get producers');
    //do the call to data api
    api.send(request.originalUrl, request.method ,request.headers.authorization, request.query)
        .then(function(result){
            response.send(result);
        })
        .catch(function(err){
            log.error({request:request, err:err}, 'Error while trying to sending request to API\n ERROR:' + err.name);
            response.send({status:false, message:err.name});
        });
});

//create producer
router.post('/api/producers', function(request, response){
    log.info('Trying to create producer');
    //do the call to data api with the requested url, method, body and authorization
    api.send(request.originalUrl, request.method, request.headers.authorization, request.body)
        .then(function(result){
            log.info('Producer created');
            response.send(result)
        })
        .catch(function(err){
            log.error({request:request, err:err}, 'Error while trying to sending request to API\n ERROR:' + err.name);
            response.send({status:false, message:err.name});
        });
});
//update producer
router.put('/api/producers/:producerID', function(request, response){
    //get the producer id
    var producerID = request.params.producerID;
    log.info('Trying to update producer with id ' + producerID);
    //do the call to data api with the requested url, method, query and authorization
    api.send(request.originalUrl, request.method, request.headers.authorization, request.body)
        .then(function(result){
            log.info('Producer with id ' + producerID + ' updated');
            response.send(result);
        })
        .catch(function(err){
            log.error({request:request, err:err}, 'Error while trying to sending request to API\n ERROR:' + err.name);
            response.send({status:false, message:err.name});
        });
});
//delete producer
router.delete('/api/producers/:producerID', function(request, response){
    //get the producer id from the params
    var producerID = request.params.producerID;
    log.info('Trying to delete producer with id' + producerID);
    //do the call to data api with the requested url, method and authorization
    api.send(request.originalUrl, request.method, request.headers.authorization, null)
        .then(function(result){
            log.info('Producer with id ' + producerID + ' deleted');
            response.send(result);
        })
        .catch(function(err){
            log.error({request:request, err:err}, 'Error while trying to sending request to API\n ERROR:' + err.name);
            response.send({status:false, message:err.name});
        });

});

router.get('/api/producers-sustainability', function(request, response){
    log.info('Trying to get producers sustainability score');
    //do the call to data api with the requested url, method, query and authorization
    api.send(request.originalUrl, request.method, request.headers.authorization, request.query)
        .then(function(result){
            response.send(result);
        })
        .catch(function(err){
            log.error({request:request, err:err}, 'Error while trying to sending request to API\n ERROR:' + err.name);
            response.send({status:false, message:err.name});
        });
});

module.exports = router;