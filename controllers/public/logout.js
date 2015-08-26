//load modules for routing
var express = require('express');
var router = express.Router();

router.get('/logout',function(request,response){
    if (request.isAuthenticated()) {
        console.log('Logging out user '+request.user.username);
        request.logout();
    }
    response.redirect('/');
});

module.exports = router;