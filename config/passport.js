var LocalStrategy = require('passport-local').Strategy;
//var models = rootRequire('models2');
var crypt = rootRequire('libs/crypt.js');
var messages = rootRequire('libs/messaging.js');
var models = rootRequire('models');


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
        var userTable = models['userTable'];
        userTable.find({where:{username: username}})
            //here the user should be found with no exceptions since it is just for deserializing from session
            //If not there, something went quite wrong in the way...
            .then(function(user){
                //construct object with needed properties and return it
                var dsUser={};
                dsUser.username = user.username;
                dsUser.type_id = user.type_id;
                dsUser.id = user.id;
                return done(null,dsUser);
            })
            .catch(function(err){
                //something wrong with the database querying....
                console.log(err);
                return done(err);
            });
    });

    //login policy
    passport.use('local-login',new LocalStrategy(
        function(username,password,done){
            console.log('Trying to login user:'+username);
            var userTable = models['userTable'];
            userTable.find({where:{username: username}})
                .then(function(user){
                    if (user === null){
                        //no such user found in db...
                        console.log('No user '+username+' in db');
                        return done(null,false,{message: messages.print('login-frontend.notValidUsername')});
                    }
                    else{
                        //user found check password
                        if (crypt.validate(password,user.password)){
                            //check if user is activated and leave if not
                            if (!user.activated){
                                return done(null,false,{message: messages.print('login-frontend.notActivated')});
                            }
                            //user is activated...
                            //valid password!
                            var userObj = {};
                            userObj.username = user.username;
                            userObj.type_id = user.type_id;
                            userObj.id = user.id;
                            console.log('Adding user '+username+' to cache');
                            addUserToCache(userObj);//add him to cache for faster serialization and deserialization
                            console.log('User '+username+' succesfully logged in');
                            return done(null,userObj);
                        }
                        else{
                            //not valid password!
                            console.log('Not valid password for user '+username);
                            return done(null,false,{message:messages.print('login-frontend.notValidPassword')});
                        }
                    }
                })
                .catch(function(err){
                    //something wrong with the database querying....
                    console.log(err);
                    return done(err);
                });
        }
    ));
}

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