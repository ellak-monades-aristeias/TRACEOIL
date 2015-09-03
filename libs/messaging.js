var fs = require('fs');//to read the file with the messages
var log = require('../config/logConfig.js');

var selectedLanguage = 'el';
var messages ;

loadMessagesFile();

function loadMessagesFile(){
    try{
        messages = JSON.parse(fs.readFileSync(__dirname+'/../languages/'+selectedLanguage+'.json','utf8'));
    }
    catch(err){
        log.error({err:err}, 'Language file incorrect. Please check file structure and retry.');
        //process.exit(1);
        messages = {};//not tu crash the program, just assign empty objecet to messages object
    }

}

function print(selectedMessage){
    loadMessagesFile();
    var tmpArr = selectedMessage.split(".");
    var notExist  = false;
    var response = messages;
    for (var i= 0, len = tmpArr.length; i<len; i++){
       if (!response.hasOwnProperty(tmpArr[i])){
           notExist = true;
           break;
       }
        response = response[tmpArr[i]];
    }

    if (notExist) {

        log.info('Requested not existing message');
        return null;
    }
    else{
        return response;
    }

}

function getSection(section){
    loadMessagesFile();
    if (!messages.hasOwnProperty(section)){
        //not existing section in file
        return null;
    }
    else{
        return messages[section];
    }
}

exports.print = print;
exports.getSection = getSection;