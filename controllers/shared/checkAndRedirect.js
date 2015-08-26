var messages = rootRequire('libs/messaging.js');

function checkAndRedirect(request,response){

    if (request.isAuthenticated()){//user logged in
        //redirect to appropriate home page
        var userTypeID = request.user.type_id;
        switch (userTypeID){
            case 1:
                break;
            case 2:
                response.render('oilpress/index',{text:messages.getSection('oilpressHome-frontend'),pageHeaders:messages.getSection('oilpress-pageHeaders')});
                break;
            case 3:
                response.render('merchant/index',{text:messages.getSection('merchantHome-frontend'),pageHeaders:messages.getSection('merchant-pageHeaders')});
                break;
            case 4:
                response.render('oilcompany/index',{text:messages.getSection('oilcompanyHome-frontend'),pageHeaders:messages.getSection('oilcompany-pageHeaders')});
                break;
        }
    }
    else{//not logged in redirect to login page
        response.redirect('/login');
    }
}

module.exports = checkAndRedirect;