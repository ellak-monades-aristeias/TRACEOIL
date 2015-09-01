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
router.get('/api/oilpresses/:oilpressID?',function(request,response){//get oilpresses
    //check if request was for single oilpress or search in oilpress list

    api.send('/api/oilpresses','GET',request.headers.authorization, null)
        .then(function(result){

        })
        .catch(function(err){

        });
});

module.exports = router;

