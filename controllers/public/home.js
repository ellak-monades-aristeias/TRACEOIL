//load modules for routing
var express = require('express');
var router = express.Router();
var passport = require('passport');
var messages = rootRequire('libs/messaging.js');
var checkRedirect = rootRequire('controllers/shared/checkAndRedirect.js');
var api = require('../../libs/api.js');
//var token = require('../../config/jwt.js');
router.get('/',checkRedirect);

router.get('/login',function(request,response){
    //response.render('login',{text:messages.getSection('login-frontend'),error:request.flash('error')});
    response.render('login-register/index',{text:messages.getSection('login-frontend')});
});


//get last transaction date and total oil quantity transferred in system in order to display them at login page
router.get('/getStats', function(request, response){
    api.send(request.originalUrl, request.method, null, null)
        .then(function(stats){
            response.send(stats);
        });
});

router.get('/loginPartial',function(request,response){
    response.render('login-register/loginPartial',{text:messages.getSection('login-frontend'),error:request.flash('error')});

});


router.post('/login',function(request,response,next){
    passport.authenticate('local-login',function(err,user,info){
        if (err) {
            return next(err);
        }
        if (!user){
            //false user authentication!
            var result = {};
            result.status = false;
            result.message = info.message;
            response.send(result);
        }
        else{
            //user credentials ok! log him in NOW!!!
            request.logIn(user,function(err){
                if (err) {
                    return next(err);
                }
                var result = {};
                result.status = true;
                //get the token from passport login strategy in order to send it back to front end
                result.token = info.token;
                response.send(result);
            });
        }

    })(request,response,next);
});



module.exports = router;