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
                if(!!request.query.export){//export to CSV file requested
                    var csvLine = '';
                    var fileName = 'oilcompany_' + moment().format('DD-MM-YYYY_HH:mm:ss') + '_inflows.csv';
                    var filePath = './reports/';
                    var promisifiedFS = Promise.promisifyAll(fs);
                    var text = messages.getSection('oilcompanyinflows');
                    var output = text.merchant_company_name + ',' + text.merchant + ',' + text.invoice_no + ',' + text.oilcompany_lot + ',' + text.date + ',' + text.quantity + '\n';
                    for(var i= 0, len=result.rows.length; i<len; i++){
                        var inflow = result.rows[i];
                        csvLine = (inflow.Merchant.name||'') + ',' + (inflow.Merchant.first_name||'') + ' ' +(inflow.Merchant.last_name||'') + ',' + (inflow.invoice_no||'') + ',' +(inflow.oilcompany_lot||'') + ',' + moment(inflow.inflow_date).format('DD-MM-YYYY_HH:mm:ss') + ',' + inflow.quantity + '\n';
                        output += csvLine;
                    }

                    promisifiedFS.mkdirAsync('./reports')
                        .catch(function(err){
                            if (err.cause.code === 'EEXIST') return true;
                            else return Promise.reject(err);
                        })
                        .then(function(){
                            return promisifiedFS.writeFileAsync(filePath +fileName,output,{encoding:'utf8'});
                        })
                        .then(function(){
                            //file created.. send file
                            log.info('Sending csv file for oilcompany inflows');
                            response.download(filePath+fileName,fileName,function(err){
                                if (err){
                                    log.error({request:request, err:err}, 'Error in sending file to user ');
                                    response.send('Error in sending file');
                                }
                                fs.unlink(filePath+fileName);
                            });
                        })
                        .catch(function(err){
                            var message = 'Error while trying to create csv to send back to user...';
                            log.error({request:request, err:err}, message);
                            response.send(message);
                        });
                }
                else{
                    response.send(result);
                }
            })
            .catch(function(err){
                log.error({request:request, err:err}, 'Error while trying to sending request to API\n ERROR:' + err.name);
                response.send({status:false, message:err.name});
            });
    })
    //update oilcompany inflow
    .put(function(request, response){
        var inflowID = request.params.inflowID;
        log.info('Trying to update inflow with id ' + inflowID);
        //do the call to data api with the requested url, method, body and authorization
        api.send(request.originalUrl, request.method ,request.user.token, request.body)
            .then(function(result){
                response.send(result);
            })
            .catch(function(err){
                log.error({request:request, err:err}, 'Error while trying to sending request to API\n ERROR:' + err.name);
                response.send({status:false, message:err.name});
            });
    });

router.get('/api/oilcompany/report', function(request, response){
    log.info('Trying to get report for oilcompany user with id '+ request.user.id);
    api.send(request.originalUrl, request.method, request.user.token, request.query)
        .then(function(results){
            var printRequested = (typeof request.query.print === 'undefined')?false:request.query.print;
            if (printRequested){//requested download of pdf file
                var promisifiedFS = Promise.promisifyAll(fs);
                var fileName = 'oilcompany_' + moment().format('DD-MM-YYYY_HH:mm:ss') + '_inflow.pdf';
                promisifiedFS.mkdirAsync('./reports')
                    .catch(function(err){
                        if (err.cause.code === 'EEXIST') return true;
                        else return Promise.reject(err);
                    })
                    .then(function(){
                        var html = jade.renderFile('views/helpers/oilcompanyInflowReport.jade', {text:messages.getSection('oilcompanyInflowReport'), results:results, print:true});

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
                response.render('helpers/oilcompanyInflowReport',{text:messages.getSection('oilcompanyInflowReport'), results:results});
            }
        })
        .catch(function(err){
            log.error({request:request, err:err}, 'Error while trying to sending request to API\n ERROR:' + err.name);
            response.send({status:false, message:err.name});
        });

});
module.exports = router;