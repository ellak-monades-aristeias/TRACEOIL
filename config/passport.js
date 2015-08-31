var LocalStrategy = require('passport-local').Strategy;
//var models = rootRequire('models2');
var crypt = rootRequire('libs/crypt.js');
var messages = rootRequire('libs/messaging.js');
var api = require('../libs/api.js');
var jwt = require('jsonwebtoken');

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
        console.log('Searching for user '+username+' in login cache...');
        for (var i = 0, len = userCache.length; i<len ; i++){
            if (userCache[i].username === username){
                console.log('User '+username+' found in cache...');
                return done(null,userCache[i]);
            }
        }
        //not found in cache
        console.log('User '+username+' not found in cache, querying database');
    });

    //login policy
    passport.use('local-login',new LocalStrategy(
        function(username,password,done){
            console.log('Trying to login user:'+username);
            var body = {};
            var user = {};
            body.username = username;
            body.password = password;
            api.send('/login', 'POST', null, body)
                .then(function(result){
                    if(!result.token){
                        return done(null,false,{message: messages.print('login-frontend.')});
                    }
                    else{//got token. continue
                        var decodedToken = jwt.decode(result.token);
                        user.username = decodedToken.username;
                        user.type_id = decodedToken.type_id;
                        user.id = decodedToken.id;
                        console.log('User '+user.username+' succesfully logged in');
                        return done(null,user);
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