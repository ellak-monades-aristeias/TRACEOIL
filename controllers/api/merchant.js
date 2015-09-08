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

router.param('merchantID',function(req,res,next,merchantID){
    if (isNaN(merchantID)) res.send('Wrong Request');
    else next();
});

router.route('/api/merchants/:merchantID?')
    .all(function(request, response){
        //initialize data and info message
        var data = {};
        var infoMessage = '';
        //get the merchantID
        var merchantID = request.params.merchantID;
        //check requested method and get the appropriate data and info message
        switch(request.method){
            case 'GET':
                infoMessage = !!merchantID?('Trying to get merchant with id ' + merchantID):'Trying to get merchants list';
                data = request.query;
                break;
            case 'PUT':
                infoMessage = 'Trying to update merchant with id ' + merchantID;
                data = request.body;
                break;
            case 'POST':
                infoMessage = 'Trying to create merchant';
                data = request.body;
                break;
            case 'DELETE':
                infoMessage = 'Trying to delete merchant with id ' + merchantID;
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

//MERCHANT TANKS
//parameters validation
router.param('tankID',function(req,res,next,tankID){
    if (isNaN(tankID)) res.send('WrongRequest');
    else next();
});

router.route('/api/merchant/tanks/:tankID?')
    .all(function(request, response){
        //initialize data and info message
        var data = {};
        var infoMessage = '';
        //get the tankID
        var tankID = request.params.tankID;
        //check requested method and get the appropriate data and info message
        switch(request.method){
            case 'GET':
                infoMessage = !!tankID?('Trying to get merchants tank with id ' + tankID):'Trying to get merchants tanks list';
                data = request.query;
                break;
            case 'PUT':
                infoMessage = 'Trying to update merchants tank with id ' + tankID;
                data = request.body;
                break;
            case 'POST':
                infoMessage = 'Trying to create merchants tank';
                data = request.body;
                break;
            case 'DELETE':
                infoMessage = 'Trying to delete merchants tank with id ' + tankID;
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

//MERCHANT INFLOWS
//parameters validation
router.param('merchantInflowID',function(req,res,next,merchantInflowID){
    //the merchantInflowID should be of the form traderTypeID - traderID - traderOutflowID
    var re = new RegExp('[0-9]{1,}-[0-9]{1,}-[0-9]{1,}');
    if (merchantInflowID.search(re) === -1){
        //not matched...
        res.send('Wrong Request');
    }
    else next();
});
router.route('/api/merchant/inflows/:merchantInflowID?')
    .all(function(request, response){
        //initialize data and info message
        var data = {};
        var infoMessage = '';
        //get the merchantInflowID
        var merchantInflowID = request.params.merchantInflowID;
        //check requested method and get the appropriate data and info message
        switch(request.method){
            case 'GET':
                infoMessage = !!merchantInflowID?('Trying to get merchants inflow with id ' + merchantInflowID):'Trying to get merchants inflows list';
                data = request.query;
                break;
            case 'PUT':
                infoMessage = 'Trying to update merchants inflow with id ' + merchantInflowID;
                data = request.body;
                break;
            case 'POST':
                infoMessage = 'Trying to create merchants inflow';
                data = request.body;
                break;
            case 'DELETE':
                infoMessage = 'Trying to delete merchants inflow with id ' + merchantInflowID;
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

//MERCHANT OUTFLOWS
//parameters validation
router.param('merchantOutflowID',function(req,res,next,merchantOutflowID){
    if (isNaN(merchantOutflowID)) res.send('Wrong Request');
    else next();
});

router.route('/api/merchant/outflows/:merchantOutflowID?')
    .all(function(request, response){
        //initialize data and info message
        var data = {};
        var infoMessage = '';
        //get the merchantOutflowID
        var merchantOutflowID = request.params.merchantOutflowID;
        //check requested method and get the appropriate data and info message
        switch(request.method){
            case 'GET':
                infoMessage = !!merchantOutflowID?('Trying to get merchants outflow with id ' + merchantOutflowID):'Trying to get merchants outflows list';
                data = request.query;
                break;
            case 'PUT':
                infoMessage = 'Trying to update merchants outflow with id ' + merchantOutflowID;
                data = request.body;
                break;
            case 'POST':
                infoMessage = 'Trying to create merchants outflow';
                data = request.body;
                break;
            case 'DELETE':
                infoMessage = 'Trying to delete merchants outflow with id ' + merchantOutflowID;
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

router.get('/api/merchant/report/:reportType', function(request, response){
    log.info('Trying to get merchant report');
    //Get the merchantID and the type of the report requested(inflow, outflow)
    var responseJade;
    var responseJadeText;
    var renderedJade;
    var merchantID = request.user.id;
    var reportType = request.params.reportType;
    //do the call to data api with the requested url, method, query and authorization
    switch (reportType){
        case 'inflow':
            responseJade = 'helpers/merchantInflowReport';
            responseJadeText = 'merchantInflowReport';
            renderedJade = 'views/helpers/merchantInflowReport.jade';
            break;
        case 'outflow':
            responseJade = 'helpers/merchantOutflowReport';
            responseJadeText = 'merchantOutflowReport';
            renderedJade = 'views/helpers/merchantOutflowReport.jade';
            break;
    }
    api.send(request.originalUrl, request.method, request.user.token, request.query)
        .then(function(results){
            var printRequested = (typeof request.query.print === 'undefined')?false:request.query.print;
            if (printRequested){//requested donwload of pdf file
                var promisifiedFS = Promise.promisifyAll(fs);
                var fileName = 'merchant_' + merchantID + '_' + moment().format('DD-MM-YYYY_HH:mm:ss') + '_' + reportType + '.pdf';
                promisifiedFS.mkdirAsync('./reports')
                    .catch(function(err){
                        if (err.cause.code === 'EEXIST') return true;
                        else return Promise.reject(err);
                    })
                    .then(function(){
                        var html = jade.renderFile(renderedJade, {text:messages.getSection(responseJadeText), results:results, print:true});

                        var options = { filename: './reports/' + fileName, format:'A4'};

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
                response.render(responseJade,{text:messages.getSection(responseJadeText), results:results});
            }
        })
        .catch(function(err){
            log.error({request:request, err:err}, 'Error while trying to sending request to API\n ERROR:' + err.name);
            response.send({status:false, message:err.name});
        });

});
module.exports = router;