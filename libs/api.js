/*
 This library handles requests, transforms them and make them to the api
 */
var request = require('request');
var Promise = require('bluebird');
var configuration = require('../config/config.js');

var allowedMethods = ['GET','POST','PUT','DELETE'];
//set the default options for the api request to the cloud
var apiRequest = request.defaults({
    baseUrl: configuration.apiHostname + ':' + configuration.apiPort + '/',
    method: 'GET',
    gzip:true,
    auth:{
        sendImmediately:true
    }
});

function sendRequest(resource, method, token, data){
    /*
     The function will accept as parameters, the resource url that need to be accessed, the method name ('GET','POST','PUT','DELETE'),
     authentication token, and a JSON data object. In case of GET request the data will be formed to query string and in POST/PUT will be sent
     as application/x-www-form-urlencoded
     */
    return new Promise(function(resolve, reject){
        var requestOptions = {
            auth:{
                bearer:null
            }
        };//initialize request options object for library
        //initial declarations
        if(!resource){//no resource provided
            var err = new Error('No resource provided');
            return reject(err);
        }
        //check method provided.. should be either legal HTTP Request
        if (allowedMethods.indexOf(method) === -1){
            var err = new Error('No proper method provided to contact resource API');
            return reject(err);
        }
        //check data object for valid JSON
        if (typeof data !== 'object'){
            var err = new Error('Wrong type of data provided. Expected JSON object');
            return reject(err);
        }
        //check if token was provided to enter to authentication details
        if (!!token){
            requestOptions.auth = {bearer:token.split(' ')[1]};
        }
        switch (method){
            case 'GET':
                if (!!data) requestOptions.qs = data;
                break;
            case 'POST':
            case 'PUT':
                //post or put must have body
                if (!data){
                    var err = new Error('No post data provided to save to resource API');
                    return reject(err);
                }
                requestOptions.body = data;
                requestOptions.json = true;
                break;
        }
        requestOptions.method = method;
        apiRequest(resource, requestOptions, function(error, response, body){
            if (!!error){//error with request
                return reject(error);
            }
            //no error
            switch (response.statusCode){
                case 200:
                case 201:
                    resolve(body);
                    break;
                case 400:
                    var err = new Error('Bad request to Api');
                    err.name = 'BadRequest';
                    err.status = 400;
                    reject(err);
                    break;
                case 401:
                    var err = new Error('Unauthenticated request to Api. Probably wrong token provided');
                    err.name = 'AccessDenied';
                    err.status = 401;
                    reject(err);
                    break;
                case 403:
                    var err = new Error('Unauthorized request to Api. Probably wrong token provided');
                    err.name = 'AccessDenied';
                    err.status = 403;
                    reject(err);
                    break;
                case 404:
                    var err = new Error('Api Path not Found');
                    err.status = 404;
                    reject(err);
                    break;
                case 500:
                    var returnedError = new Error(body);//construct the returned error depending on what we where given
                    returnedError.status = 500;
                    reject(returnedError);
                    break;
                default://other error
                    reject(new Error(response));
            }

        })
    });
}

exports.send = sendRequest;