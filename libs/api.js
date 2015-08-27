/*
    This library handles requests, transforms them and make them to the api
*/
var request = require('request');
var Promise = require('bluebird');
var configuration = require('../config/config.js');

//set the default options for the api request to the cloud
var apiRequest = request.defaults({
        baseUrl: configuration.hostname + ':' + configuration.port || 80 + '/',
        method: 'GET',
        headers: {
            'Authorization': null
        }
});
var allowedMethods = ['GET','POST','PUT','DELETE'];//array to hold available methods for http requests.

function sendRequest(resource, method, data){
    return new Promise(function(resolve, reject){
        //initial declarations
        var err;
        var result;
        if(!resource){//no resource provided
           err = new Error('No resource provided');
           return reject(err);
        }
        //check method provided.. should be either legal HTTP Request
        if (allowedMethods.indexOf(method) === -1){
           err = new Error('No proper method provided to contact cloud API');
           return reject(err);
        }
        var requestOptions = {headers:{}};
        switch (method){
            case 'POST':
            case 'PUT':
                //post or put must have body
                if (!data){
                    err = new Error('No post data provided to save to Cloud API');
                    return reject(err);
                }
                //assign the headers and the data to the request body
                requestOptions.headers['Content-Type']= 'application/json;charset=UTF-8';
                requestOptions.headers['Content-Length'] = Buffer.byteLength(data,'utf8');
                requestOptions.body = data;
                //set the option of request json true in order to accept the body as JSON object
                requestOptions.json = true;
                break;
            case 'GET':
                //construct the url if the get request comes with a data
                if (!!data) requestOptions.qs = '?'+querystring.stringify(data);
                break;
        }
        requestOptions.method = method;
        var resData = '';
        apiRequest('register', requestOptions, function(error, response, body){
        })
        .on('error', function(error){
                reject(error);
        })
        .on('response', function(response){
            response.on('data',function(chunk){
                resData += chunk;
            });
            response.on('end',function(){
                //check for error
                switch (response.statusCode){
                    case 200:
                        try{
                            result = JSON.parse(resData);
                            resolve(result);
                        }
                        catch(e){
                            resolve(resData);
                        }
                        break;
                    case 400:
                        err = new Error('Bad request to Api');
                        err.name = 'BadRequest';
                        err.status = 400;
                        reject(err);
                        break;
                    case 401:
                        err = new Error('Unauthorized request to Api. Probably wrong token provided');
                        err.name = 'AccessDenied';
                        err.status = 401;
                        reject(err);
                        break;
                    case 404:
                        err = new Error('Api Path not Found');
                        err.status = 404;
                        reject(err);
                        break;
                    case 500:
                        try{
                            result = JSON.parse(resData);//try to parse the error response to get message
                            var returnedError = !!result.message?new Error(result.message):result;//construct the returned error depending on what we where given
                            returnedError.status = 500;
                            reject(returnedError);
                        }
                        catch(e){
                            log.error({err:e}, 'Error while trying to parse response from unsuccessful login.');
                            reject(new Error(resData));
                        }
                        break;
                    default://other error
                        reject(new Error(resData));
                }

            })
        });
    });
}

exports.send = sendRequest;