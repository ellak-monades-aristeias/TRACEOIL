//load modules for routing
var express = require('express');
var router = express.Router();
var api = require('../../libs/api.js');
var log = require('../../config/logConfig.js');

//PRODUCER API
router.route('/api/producers/:producerID?')
    .all(function(request, response){
        //initialize data and info message
        var data = {};
        var infoMessage = '';
        //get the producerID
        var producerID = request.params.producerID;
        //check requested method and get the appropriate data and info message
        switch(request.method){
            case 'GET':
                infoMessage = !!producerID?('Trying to get producer with id ' + producerID):'Trying to get producers list';
                data = request.query;
                break;
            case 'PUT':
                infoMessage = 'Trying to update producer with id ' + producerID;
                data = request.body;
                break;
            case 'POST':
                infoMessage = 'Trying to create producer';
                data = request.body;
                break;
            case 'DELETE':
                infoMessage = 'Trying to delete producer with id ' + producerID;
                break;
            default:
                infoMessage = 'Unknown request method';
                break;
        }
        log.info(infoMessage);
        //check requested method and get the appropriate data and info message
        api.send(request.originalUrl, request.method ,request.user.token, data)
        .then(function(result){
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