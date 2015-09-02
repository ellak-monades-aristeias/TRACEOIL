//load modules for routing
var express = require('express');
var router = express.Router();
var api = require('../../libs/api.js');

//OILPRESS LIST AND CREATION ************************
//parameters validation
router.param('oilpressID',function(req,res,next,oilpressID){
    if (isNaN(oilpressID)) res.end('Wrong Request');//not interested in non numeric ids...
    else next();
});

//get oilpresses or single oilpress
router.get('/api/oilpresses/:oilpressID?',function(request,response){
    //check if request was for single oilpress or for retrieving the oilpress list
    if(typeof request.params.oilpressID === 'undefined'){//generic request
        console.log('Request to get list of the oilpresses');
        api.send('/api/oilpresses/','GET',request.headers.authorization, null)
            .then(function(result){
                response.send(result);
            })
            .catch(function(err){
                console.error('Error while trying to sending request to API\n ERROR:' + err.name);
                response.send({status:false, message:err.name});
            });
    }
    else{//specific request
        //get the oilpress id from the params
        var oilpressID = request.params.oilpressID;
        console.log('Trying to get oilpress with id ' + oilpressID);
        api.send('/api/oilpresses/' + oilpressID,'GET',request.headers.authorization, null)
            .then(function(result){
                response.send(result);
            })
            .catch(function(err){
                console.error('Error while trying to sending request to API\n ERROR:' + err.name);
                response.send({status:false, message:err.name});
            });
    }

});

//create oilpress
router.post('/api/oilpresses', function(request, response){
    //get the oilpress data to be created
    var body = request.body;
    console.log('Trying to create oilpress');
    api.send('/api/oilpresses', 'POST', request.headers.authorization, body)
        .then(function(result){
            console.log('Oilpress with created');
            response.send(result)
        })
        .catch(function(err){
            console.error('Error while trying to sending request to API\n ERROR:' + err.name);
            response.send({status:false, message:err.name});
        });
});
//update oilpress
router.put('/api/oilpresses/:oilpressID0', function(request, response){
    //get the data to be updated
    var body = request.body;
    var oilpressID = request.params.oilpressID;
    api.send('/api/oilpresses/' + oilpressID, 'PUT', request.headers.authorization, body)
        .then(function(result){
            console.log('Oilpress with id ' + oilpressID + 'successfully updated');
            response.send(result);
        })
        .catch(function(err){
            console.error('Error while trying to sending request to API\n ERROR:' + err.name);
            response.send({status:false, message:err.name});
        });
});
//delete oilpress
router.delete('/api/oilpresses/:oilpressID', function(request, response){
    //get the oilpress id from the params
    var oilpressID = request.params.oilpressID;
    console.log('Trying to delete oilpress with id' + oilpressID);
    api.send('/api/oilpresses/' + oilpressID,'DELETE',request.headers.authorization, null)
        .then(function(result){
            response.send(result);
        })
        .catch(function(err){
            console.error('Error while trying to sending request to API\n ERROR:' + err.name);
            response.send({status:false, message:err.name});
        });

});

//OILPRESS OUTFLOWS
//parameters validation
router.param('outflowID',function(req,res,next,outflowID){
    if (isNaN(outflowID)) res.end('Wrong Request');//not interested in non numeric ids...
    else next();
});



module.exports = router;

