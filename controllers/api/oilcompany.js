//load modules for routing
var express = require('express');
var router = express.Router();
var api = require('../../libs/api.js');
var log = require('../../config/logConfig.js');
var Promise = require('bluebird');
var messages = require('../../libs/messaging.js');
//modules loaded required for report
var fs = require('fs');
var pdf = require('html-pdf');
var jade = require('jade');
var moment = require('moment');

//OilCompany User Id parameter Validation
router.param('oilcompanyUserID',function(request,response,next,oilcompanyUserID){
    if (isNaN(oilcompanyUserID)) res.send('Wrong Request');
    else next();
});
//get oilcompany users
router.get('/api/oilcompany_users/:oilcompanyUserID?', function(request, response){
    log.info('Request to get oilcompany users');
    //do the call to data api with the requested url, method, body and authorization
    api.send(request.originalUrl, request.method, request.user.token, request.query)
        .then(function(result){
            response.send(result);
        })
        .catch(function(err){
            log.error({request:request, err:err}, 'Error while trying to sending request to API\n ERROR:' + err.name);
            response.send({status:false, message:err.name});
        });
});

//Oilcompany ID parameter validation
router.param('oilcompanyID',function(req,res,next,oilcompanyID){
    if (isNaN(oilcompanyID)) res.send('Wrong Request');
    else next();
});

router.param('inflowID',function(req,res,next,inflowID){
    //the InflowID should be of the form merchantID - outflowID
    var re = new RegExp('[0-9]{1,}-[0-9]{1,}');
    if (inflowID.search(re) === -1){
        //not matched...
        res.send('Wrong Request');
    }
    else next();
});

router.route('/api/oilcompany/inflows/:inflowID?')
    //get list of oilcompanies inflows or single inflow
    .get(function(request, response){
        log.info('Trying to get oilcompany inflows list or single inflow');
        //do the call to data api with the requested url, method, query and authorization
        api.send(request.originalUrl, request.method ,request.user.token, request.query)
            .then(function(result){
                response.send(result);
            })
            .catch(function(err){
                log.error({request:request, err:err}, 'Error while trying to sending request to API\n ERROR:' + err.name);
                response.send({status:false, message:err.name});
            });
    })
    //update oilcompany inflow
    .put(function(request, response){
        var inflowID = request.params.inflowID;
        log.info('Trying to get update inflow with id ' + inflowID);
        //do the call to data api with the requested url, method, query and authorization
        api.send(request.originalUrl, request.method ,request.user.token, request.query)
            .then(function(result){
                response.send(result);
            })
            .catch(function(err){
                log.error({request:request, err:err}, 'Error while trying to sending request to API\n ERROR:' + err.name);
                response.send({status:false, message:err.name});
            });
    });
module.exports = router;