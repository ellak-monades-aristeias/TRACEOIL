//Configuration module to parse config.json

var fs = require('fs');
var configuration;
loadConfig();

function loadConfig(){
    try{
        configuration = JSON.parse(fs.readFileSync(__dirname+'/config.json'));
        return true;
    }
    catch(err){
        throw err;
    }
}

module.exports = configuration;