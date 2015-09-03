//load modules for routing
var express = require('express');
var router = express.Router();
var log = require('../../config/logConfig.js');

router.get('/logout',function(request,response){
    if (request.isAuthenticated()) {
        log.info('Logging out user '+request.user.username);
        request.logout();
    }
    response.redirect('/');
});

module.exports = router;