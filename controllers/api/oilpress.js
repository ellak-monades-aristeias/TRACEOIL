//load modules for routing
var express = require('express');
var router = express.Router();
var api = require('../../libs/api.js');
var log = require('../../config/logConfig.js');

//OILPRESS API
//parameters validation
router.param('oilpressID',function(req,res,next,oilpressID){
    if (isNaN(oilpressID)) res.end('Wrong Request');//not interested in non numeric ids...
    else next();
});

//get oilpresses or single oilpress
router.get('/api/oilpresses/:oilpressID?',function(request,response){
    log.info('Request to get the oilpresses');
    //do the call to data api with the requested url, method, body and authorization
    api.send(request.originalUrl, request.method, request.headers.authorization, request.query)
        .then(function(result){
            response.send(result);
        })
        .catch(function(err){
            log.error({request:request, err:err}, 'Error while trying to sending request to API\n ERROR:' + err.name);
            response.send({status:false, message:err.name});
        });

});

//create oilpress
router.post('/api/oilpresses', function(request, response){
    log.info('Trying to create oilpress');
    //do the call to data api with the requested url, method, body and authorization
    api.send(request.originalUrl, request.method, request.headers.authorization, request.body)
        .then(function(result){
            log.info('Oilpress created');
            response.send(result)
        })
        .catch(function(err){
            log.error({request:request, err:err}, 'Error while trying to sending request to API\n ERROR:' + err.name);
            response.send({status:false, message:err.name});
        });
});
//update oilpress
router.put('/api/oilpresses/:oilpressID', function(request, response){
    //get the oilpress id
    var oilpressID = request.params.oilpressID;
    //do the call to data api with the requested url, method, body and authorization
    api.send(request.originalUrl, request.method, request.headers.authorization, request.body)
        .then(function(result){
            log.info('Oilpress with id ' + oilpressID + ' successfully updated');
            response.send(result);
        })
        .catch(function(err){
            log.error({request:request, err:err}, 'Error while trying to sending request to API\n ERROR:' + err.name);
            response.send({status:false, message:err.name});
        });
});
//delete oilpress
router.delete('/api/oilpresses/:oilpressID', function(request, response){
    //get the oilpress id from the params
    var oilpressID = request.params.oilpressID;
    log.info('Trying to delete oilpress with id' + oilpressID);
    //do the call to data api with the requested url, method and authorization
    api.send(request.originalUrl, request.method, request.headers.authorization, null)
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
//get outflows list or single outflow
router.get('/api/oilpress/outflows/:outflowID?', function(request, response){
    log.info('Trying to get list of outflows for oilpress with id ' + oilpressID);
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
//create outflow
router.post('/api/oilpress/outflows', function(request, response){
    log.info('Trying to create outflow');
    //do the call to data api with the requested url, method, body and authorization
    api.send(request.originalUrl, request.method, request.headers.authorization, request.body)
        .then(function(result){
            log.info('Outflow created');
            response.send(result);
        })
        .catch(function(err){
            log.error({request:request, err:err}, 'Error while trying to sending request to API\n ERROR:' + err.name);
            response.send({status:false, message:err.name});
        });
});
//update outflow
router.put('/api/oilpress/outflows/:outflowID', function(request, response){
    //get the outflowID
    var outflowID = request.params.outflowID;
    log.info('Trying to update outflow with id ' + outflowID);
    //do the call to data api with the requested url, method, body and authorization
    api.send(request.originalUrl, request.method, request.headers.authorization, request.body)
        .then(function(result){
            log.info('Outflow with id ' + outflowID + ' updated');
            response.send(result);
        })
        .catch(function(err){
            log.error({request:request, err:err}, 'Error while trying to sending request to API\n ERROR:' + err.name);
            response.send({status:false, message:err.name});
        });
});
//delete outflow
router.delete('/api/oilpress/outflows/:outflowID', function(request, response){
    //get the outflowID
    var outflowID = request.params.outflowID;
    log.info('Trying to delete outflow with id ' + outflowID);
    //do the call to data api with the requested url, method and authorization
    api.send(request.originalUrl, request.method, request.headers.authorization, null)
        .then(function(result){
            log.info('Outflow with id ' + outflowID + ' deleted');
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
//get inflows list or single inflow
router.get('/api/oilpress/inflows/:inflowID?', function(request, response){
    log.info('Trying to get inflows');
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
//create inflow
router.post('/api/oilpress/inflows', function(request, response){
    log.info('Trying to create inflow');
    //do the call to data api with the requested url, method, body and authorization
    api.send(request.originalUrl, request.method, request.headers.authorization, request.body)
        .then(function(result){
            log.info('Inflow created');
            response.send(result);
        })
        .catch(function(err){
            log.error({request:request, err:err}, 'Error while trying to sending request to API\n ERROR:' + err.name);
            response.send({status:false, message:err.name});
        });
});
//update inflow
router.put('/api/oilpress/inflows/:inflowID', function(request, response){
    var inflowID = request.params.inflowID;
    log.info('Trying to update inflow with id ' + inflowID);
    //do the call to data api with the requested url, method, body and authorization
    api.send(request.originalUrl, request.method, request.headers.authorization, request.body)
        .then(function(result){
            log.info('Inflow with id ' + inflowID + ' updated');
            response.send(result);
        })
        .catch(function(err){
            log.error({request:request, err:err}, 'Error while trying to sending request to API\n ERROR:' + err.name);
            response.send({status:false, message:err.name});
        });
});
//delete inflow
router.delete('/api/oilpress/inflows/:inflowID', function(request, response){
    //get the outflowID
    var inflowID = request.params.inflowID;
    log.info('Trying to delete inflow with id' + inflowID);
    //do the call to data api with the requested url, method, body and authorization
    api.send(request.originalUrl, request.method, request.headers.authorization, null)
        .then(function(result){
            log.info('Inflow with id ' + inflowID + ' deleted');
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
//get list of tanks or a single tank
router.get('/api/oilpress/tanks/:tankID?', function(request, response){
    log.info('Trying to get tanks');
    //do the call to data api with the requested url, method, body and authorization
    api.send(request.originalUrl, request.method, request.headers.authorization, request.query)
        .then(function(result){
            response.send(result);
        })
        .catch(function(err){
            log.error({request:request, err:err}, 'Error while trying to sending request to API\n ERROR:' + err.name);
            response.send({status:false, message:err.name});
        });

});
//create tank
router.post('/api/oilpress/tanks', function(request, response){
    log.info('Trying to create tank');
    //do the call to data api with the requested url, method, body and authorization
    api.send(request.originalUrl, request.method, request.headers.authorization, request.body)
        .then(function(result){
            log.info('Tank created');
            response.send(result);
        })
        .catch(function(err){
            log.error({request:request, err:err}, 'Error while trying to sending request to API\n ERROR:' + err.name);
            response.send({status:false, message:err.name});
        });
});
//update tank
router.put('/api/oilpress/tanks/:tankID', function(request, response){
    //get the tankID
    var tankID = request.params.tankID;
    log.info('Trying to update tank with id ' + tankID);
    //do the call to data api with the requested url, method, body and authorization
    api.send(request.originalUrl, request.method, request.headers.authorization, request.body)
        .then(function(result){
            log.info('Tank with id ' + tankID + ' updated');
            response.send(result);
        })
        .catch(function(err){
            log.error({request:request, err:err}, 'Error while trying to sending request to API\n ERROR:' + err.name);
            response.send({status:false, message:err.name});
        });
});
//delete tank
router.delete('/api/oilpress/tanks/:tankID', function(request, response){
    //get the tankID
    var tankID = request.params.tankID;
    log.info('Trying to delete tank with id' + tankID);
    //do the call to data api with the requested url, method and authorization
    api.send(request.originalUrl, request.method, request.headers.authorization, null)
        .then(function(result){
            log.info('Tank with id ' + tankID + ' deleted');
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
    api.send(request.originalUrl, request.method, request.headers.authorization, request.query)
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

