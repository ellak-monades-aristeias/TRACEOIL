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
        done(null,user.username);
    });

    //deserialize user for session
    passport.deserializeUser(function(username,done){
        //first check in cached memory to find the user...
        log.info('Searching for user '+username+' in login cache...');
        for (var i = 0, len = userCache.length; i<len ; i++){
            if (userCache[i].username === username){
                log.info('User '+username+' found in cache...');
                return done(null,userCache[i]);
            }
        }
        //not found in cache
        log.info('User '+username+' not found in cache, querying database');
    });

    //login policy
    passport.use('local-login',new LocalStrategy(
        function(username,password,done){
            log.info('Trying to login user '+ username);
            var body = {};
            var userObj = {};
            body.username = username;
            body.password = password;
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
                        addUserToCache(userObj);
                        log.info('User '+userObj.username+' successfully logged in');
                        //pass the user token also in order to send it back
                        return done(null,userObj, {token: result.token});
                    }
                })
                .catch(function(err){
                    return done(err);
                });
        }
    ));
};

function addUserToCache(user){
    //first check if he is already in cache
    for (var i = 0, len = userCache.length;i<len;i++){
        if (userCache[i].username === user.username){
            //user found in cache, so delete it
            userCache.splice(i,1);
            break;
        }
    }
    //check if cache is at maximum level
    if (userCache.length >= maxUserCacheNo){
        //we're at maximum level... delete first element
        userCache.shift();
    }
    userCache.push(user);
}