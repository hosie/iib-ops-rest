/*
Copyright 2014-2015 IBM Corporation 
Author John Hosie 
 
  All rights reserved. This program and the accompanying materials
  are made available under the terms of the MIT License
  which accompanies this distribution, and is available at
  http://opensource.org/licenses/MIT
 
  Contributors:
      John Hosie - initial implementation 
*/

var express = require('express');
var http = require('http');
var httpProxy = require('http-proxy');

module.exports = function(connection){
    
    var router = express.Router();
    var targetUrl = "http://" + connection.host + ":" + connection.port;
    console.log("creating proxy for " + targetUrl);
    var proxyServer = httpProxy.createProxyServer({target:targetUrl});
    router.use('/',function(req,res){                        

        console.log("proxying request %j",req.url);
        proxyServer.web(req,res);        
    });
    return{
        hostname : connection.host,
        port     : connection.port,
        router   : router
    };
}


