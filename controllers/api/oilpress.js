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

//OILPRESS API
//parameters validation
router.param('oilpressID',function(req,res,next,oilpressID){
    if (isNaN(oilpressID)) res.end('Wrong Request');//not interested in non numeric ids...
    else next();
});
router.route('/api/oilpresses/:oilpressID?')
    .all(function(request, response){
        //initialize data and info message
        var data = {};
        var infoMessage = '';
        //get the oilpressID
        var oilpressID = request.params.oilpressID;
        //check requested method and get the appropriate data and info message
        switch(request.method){
            case 'GET':
                infoMessage = !!oilpressID?('Trying to get oilpress with id ' + oilpressID):'Trying to get oilpressses list';
                data = request.query;
                break;
            case 'PUT':
                infoMessage = 'Trying to update oilpress with id ' + oilpressID;
                data = request.body;
                break;
            case 'POST':
                infoMessage = 'Trying to create oilpress';
                data = request.body;
                break;
            case 'DELETE':
                infoMessage = 'Trying to delete oilpress with id ' + oilpressID;
                break;
            default:
                infoMessage = 'Unknown request method';
                break;
        }
        log.info(infoMessage);
        //do the call to data api with the requested url, method, data and authorization
        api.send(request.originalUrl, request.method ,request.user.token, data)
            .then(function(result){
                response.send(result);
            })
            .catch(function(err){
                log.error({request:request, err:err}, 'Error while trying to sending request to API\n ERROR:' + err.name);
                response.send({status:false, message:err.name});
            });
    });

//OILPRESS OUTFLOWS
//parameters validation
router.param('outflowID',function(req,res,next,outflowID){
    if (isNaN(outflowID)) res.end('Wrong Request');//not interested in non numeric ids...
    else next();
});
router.route('/api/oilpress/outflows/:outflowID?')
    .all(function(request, response){
        //initialize data and info message
        var data = {};
        var infoMessage = '';
        //get the outflowID
        var outflowID = request.params.outflowID;
        //check requested method and get the appropriate data and info message
        switch(request.method){
            case 'GET':
                infoMessage = !!outflowID?('Trying to get oilpress outflow with id ' + outflowID):'Trying to get oilpress outflows list';
                data = request.query;
                break;
            case 'PUT':
                infoMessage = 'Trying to update oilpress outflow with id ' + outflowID;
                data = request.body;
                break;
            case 'POST':
                infoMessage = 'Trying to create oilpress outflow';
                data = request.body;
                break;
            case 'DELETE':
                infoMessage = 'Trying to delete oilpress outflow with id ' + outflowID;
                break;
            default:
                infoMessage = 'Unknown request method';
                break;
        }
        log.info(infoMessage);
        //do the call to data api with the requested url, method, data and authorization
        api.send(request.originalUrl, request.method ,request.user.token, data)
            .then(function(result){
                response.send(result);
            })
            .catch(function(err){
                log.error({request:request, err:err}, 'Error while trying to sending request to API\n ERROR:' + err.name);
                response.send({status:false, message:err.name});
            });
    });

//OILPRESS INFLOWS
//parameters validation
router.param('inflowID',function(req,res,next,inflowID){
    if (isNaN(inflowID)) res.end('Wrong Request');
    else next();
});

router.route('/api/oilpress/inflows/:inflowID?')
.all(function(request, response){
        //initialize data and info message
        var data = {};
        var infoMessage = '';
        //get the inflowID
        var inflowID = request.params.inflowID;
        //check requested method and get the appropriate data and info message
        switch(request.method){
            case 'GET':
                infoMessage = !!inflowID?('Trying to get oilpress inflow with id ' + inflowID):'Trying to get oilpress inflows list';
                data = request.query;
                break;
            case 'PUT':
                infoMessage = 'Trying to update oilpress inflow with id ' + inflowID;
                data = request.body;
                break;
            case 'POST':
                infoMessage = 'Trying to create oilpress inflow';
                data = request.body;
                break;
            case 'DELETE':
                infoMessage = 'Trying to delete oilpress inflow with id ' + inflowID;
                break;
            default:
                infoMessage = 'Unknown request method';
                break;
        }
        log.info(infoMessage);
        //do the call to data api with the requested url, method, data and authorization
        api.send(request.originalUrl, request.method ,request.user.token, data)
            .then(function(result){
                response.send(result);
            })
            .catch(function(err){
                log.error({request:request, err:err}, 'Error while trying to sending request to API\n ERROR:' + err.name);
                response.send({status:false, message:err.name});
            });
    });

//OILPRESS TANKS
//parameters validation
router.param('tankID',function(req,res,next,tankID){
    if (isNaN(tankID)) res.send('WrongRequest');
    else next();
});

router.route('/api/oilpress/tanks/:tankID?')
    .all(function(request, response){
        //initialize data and info message
        var data = {};
        var infoMessage = '';
        //get the tankID
        var tankID = request.params.tankID;
        //check requested method and get the appropriate data and info message
        switch(request.method){
            case 'GET':
                infoMessage = !!tankID?('Trying to get oilpress tank with id ' + tankID):'Trying to get oilpress tanks list';
                data = request.query;
                break;
            case 'PUT':
                infoMessage = 'Trying to update oilpress tank with id ' + tankID;
                data = request.body;
                break;
            case 'POST':
                infoMessage = 'Trying to create oilpress tank';
                data = request.body;
                break;
            case 'DELETE':
                infoMessage = 'Trying to delete oilpress tank with id ' + tankID;
                break;
            default:
                infoMessage = 'Unknown request method';
                break;
        }
        log.info(infoMessage);
        //do the call to data api with the requested url, method, data and authorization
        api.send(request.originalUrl, request.method ,request.user.token, data)
            .then(function(result){
                response.send(result);
            })
            .catch(function(err){
                log.error({request:request, err:err}, 'Error while trying to sending request to API\n ERROR:' + err.name);
                response.send({status:false, message:err.name});
            });
    });

//TANK TOTALS
router.get('/api/oilpress/tankTotals/:tankID?', function(request, response){
    log.info('Trying to get tank totals ');
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

//TANK ACTIONS
router.get('/api/oilpress/tankActions/:tankID?', function(request, response){
    log.info('Trying to get tank actions');
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

router.get('/api/oilpress/report', function(request, response){
    log.info('Trying to get oilpress report');
    var oilpressID = request.user.id;
    //do the call to data api with the requested url, method, query and authorization
    api.send(request.originalUrl, request.method, request.user.token, request.query)
        .then(function(results){
            var printRequested = (typeof request.query.print === 'undefined')?false:request.query.print;
            if (printRequested){//request to download pdf file
                var promisifiedFS = Promise.promisifyAll(fs);
                var fileName = 'oilpress_' + oilpressID + '_' + moment().format('DD-MM-YYYY_HH:mm:ss') + '_outflow.pdf';
                promisifiedFS.mkdirAsync('./reports')
                    .catch(function(err){
                        if (err.cause.code === 'EEXIST') return true;
                        else return Promise.reject(err);
                    })
                    .then(function(){
                        var html = jade.renderFile('views/helpers/oilpressOutflowReport.jade', {text:messages.getSection('oilpressOutflowReport'), results:results, print:true});
                        var options = { filename: './reports/' + fileName, format: 'A4' };

                        pdf.create(html, options).toFile(function(err, res) {
                            if (err) return log.error({request:request, err:err}, 'Error while trying to create pdf');
                            response.download('./reports/'+fileName,fileName,function(err){
                                if (err) log.error({request:request, err:err}, 'Error while trying to send the file to user. ');
                                fs.unlink('./reports/'+fileName);
                            });

                        });

                    })
                    .catch(function(err){
                        log.error({request:request, err:err}, 'Error while producing pdf file for download. ');
                        response.send('Error while processing pdf');
                    });

            }
            else{//request
                response.render('helpers/oilpressOutflowReport',{text:messages.getSection('oilpressOutflowReport'), results:results});
            }
        })
        .catch(function(err){
            log.error({request:request, err:err}, 'Error while trying to sending request to API\n ERROR:' + err.name);
            response.send({status:false, message:err.name});
        });

});
module.exports = router;

