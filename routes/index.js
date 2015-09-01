var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var checkRedirect = rootRequire('controllers/shared/checkAndRedirect.js');

// uncomment after placing your favicon in /public
router.use(favicon(path.join(__dirname, '../public/favicon.ico')));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(cookieParser());
router.use(express.static(path.join(__dirname, '../public')));
router.use(express.static(path.join(__dirname, '../bower_components')));

//required for passport
rootRequire('config/passport.js')(passport);//configure passport policies and functions
router.use(session({ secret: '8wic0YNoV469gif' ,resave: true, saveUninitialized: true, cookie: {maxAge:7200000, httpOnly:false}} )); // session secret
router.use(passport.initialize());
router.use(passport.session()); // persistent login sessions
router.use(flash()); // use connect-flash for flash messages stored in session

//check if its on secure protocol, otherwise redirect user there...
//router.use(checkSSL);

//first load the public controllers that don't need sign in
fs.readdirSync(path.join(__dirname,'../controllers/public')).forEach(function loadFile(file){ //readdirSync path is relative to main process here app.js
    if ((file.substr(-3) == '.js')){
        //Load router file. It must return through module.exports a router object
        var route = rootRequire('controllers/public/'+file);
        router.use(route);
    }
});

//authentication logic needed for other files
router.use(isLoggedIn);

//enforce permissions to only allow specific crud request per user type...
router.use(rootRequire('controllers/perms/permissions.js'));

//scan controllers directory and load all files
fs.readdirSync(path.join(__dirname,'../controllers/forRegistered')).forEach(function loadFile(file){ //readdirSync path is relative to main process here app.js
    if ((file.substr(-3) == '.js')){
        //Load router file. It must return through module.exports a router object
        var route = rootRequire('controllers/forRegistered/'+file);
        router.use(route);
    }
});

fs.readdirSync(path.join(__dirname,'../controllers/api')).forEach(function loadFile(file){ //readdirSync path is relative to main process here app.js
    if ((file.substr(-3) == '.js')){
        //Load router file. It must return through module.exports a router object
        var route = rootRequire('controllers/api/'+file);
        router.use(route);
    }
});

//apply Global routing logic that everything redirects to the correct SPA
router.get('*',checkRedirect);

function isLoggedIn(request,response,next){
    // if user is authenticated in the session, insert function to getUserID and carry on
    if (request.isAuthenticated()){
        return next();
    }
    else{
        // if they aren't redirect them to the home page
        response.redirect('/');
    }
}

function checkSSL(request,response,next){
    if  (request.protocol !== 'https') {
        return response.redirect('https://'+request.hostname+request.originalUrl);
    }
    else{
        //we're secure ok!
        return next();
    }
}
module.exports = router;
