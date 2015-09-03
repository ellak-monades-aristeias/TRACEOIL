var bunyan = require('bunyan');
var fs = require('fs');
var logsPath = './logs';

//check for log folder existence
try {
    var stats = fs.statSync(logsPath);
    if (!stats.isDirectory()) throw new Error('It is not a directory');
}
catch(err){
    if (!!err){//directory not exists... create it
        fs.mkdirSync(logsPath);
    }
}

//custom request serializer
function reqSerializer(request) {
    return {
        user: request.user,
        method: request.method,
        url: request.originalUrl,
        body:request.body
    }
}
//custon error serializer in order to get the errors obj of error obj
function errSerializer(error){
    return{
        name: error.name,
        stack: error.stack,
        message: error.message,
        errors: error.errors
    }
}
module.exports = bunyan.createLogger({
    name: 'traceoil',
    serializers: {
        request: reqSerializer,
        err:errSerializer
    },
    streams:[
        {
            level:'info',
            stream:process.stdout
        },
        {
            type:'rotating-file',
            level:'info',
            path:logsPath+'/info_log.log',
            period:'1d',
            count:2
        },
        {
            level:'error',
            path:logsPath+'/error_log.log'
        }
    ]
});