//load modules for routing
var express = require('express');
var router = express.Router();
var passport = require('passport');
var messages = rootRequire('libs/messaging.js');
var checkRedirect = rootRequire('controllers/shared/checkAndRedirect.js');
var api = require('../../libs/api.js');
var log = require('../../config/logConfig.js');
router.get('/',checkRedirect);

router.get('/login',function(request,response){
    response.render('login-register/index',{text:messages.getSection('login-frontend')});
});


//get last transaction date and total oil quantity transferred in system in order to display them at login page
router.get('/getStats', function(request, response){
    log.info('Trying to get stats');
    api.send(request.originalUrl, request.method, null, null)
        .then(function(stats){
            response.send(stats);
        })
        .catch(function(err){
            log.error({request:request, err:err}, 'Error while trying to sending request to API\n ERROR:' + err.name);
            response.send({status:false, message:err.name});
        });
});

router.get('/loginPartial',function(request,response){
    response.render('login-register/loginPartial',{text:messages.getSection('login-frontend'),error:request.flash('error')});

});


router.post('/login',function(request,response,next){
    passport.authenticate('local-login',function(err,user){
        if (err || !user){
            //false user authentication or error occurred
            response.send({status:false, message:err.name});
        }
        else{
            //user credentials ok! log him in NOW!!!
            request.logIn(user,function(err){
                if (err) {
                    response.send({status:false, message:err.name});
                }
                var result = {};
                result.status = true;
                //get the token from passport login strategy in order to send it back to front end
                result.token = user.token;
                response.send(result);
            });
        }

    })(request,response,next);
});



module.exports = router;