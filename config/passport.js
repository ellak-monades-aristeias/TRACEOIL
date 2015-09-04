var LocalStrategy = require('passport-local').Strategy;
//var models = rootRequire('models2');
var messages = rootRequire('libs/messaging.js');
var api = require('../libs/api.js');
var jwt = require('jsonwebtoken');
var log = require('./logConfig.js');

var userCache = [];
var maxUserCacheNo = 100; //probably more than enough,,, but whatever...

//do all the configuration to the passed passport object and expose it to a single call
module.exports = function(passport){
    //serialize user for session
    passport.serializeUser(function(user,done){
        done(null,user);
    });

    passport.deserializeUser(function(user,done){
        done(null,user);
    });

    //login policy
    passport.use('local-login',new LocalStrategy(
        function(username,password,done){
            log.info('Trying to login user '+ username);
            var body = {};
            body.username = username;
            body.password = password;
            apiLogin(body,done);
        }
    ));
};

function apiLogin(body,callback){
    var userObj = {};
    api.send('/login', 'POST', null, body)
        .then(function(result){
            if(!result.token){
                return done(null,false,{message: messages.print('login-frontend.')});
            }
            else{//got token. continue
                //decode the token and get the user in order
                var decodedToken = jwt.decode(result.token);
                userObj.username = decodedToken.username;
                userObj.type_id = decodedToken.type_id;
                userObj.id = decodedToken.id;
                userObj.token = result.token;
                log.info('User '+userObj.username+' successfully logged in');
                //pass the user token also in order to send it back
                return callback(null,userObj);
            }
        })
        .catch(function(err){
            return callback(err);
        });
}