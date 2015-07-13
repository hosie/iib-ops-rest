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
var router = express.Router();
var http = require('http');

var integrationnodes=[];

module.exports = function(hostlist){
    hostlist.forEach(function(item,i){
        integrationnodes.push({
            host:item.host,
            port:item.port,
            mqtt:item.mqtt
        });
    });
    initNodes();

    router.get('/integrationnodes',function(req,res){
        res.send(integrationnodes);
    });

    router.get('/integrationbus',getIntegrationBus);    
    
    return router;
}

function initNodes(){
    integrationnodes.forEach(function(item,i){
        var options = {
            hostname: item.host,
            port: item.port,
            path: '/apiv1',
            method: 'GET',
 
        };
        var resultObject;
        var resultString="";
        
        var req = http.request(options, function(res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {            
        
                resultString=resultString+chunk;
            });
            res.on('end', function () {            
        
                var resultObject = JSON.parse(resultString);        
                item.name=resultObject.name;
                //TODO drill into properites and get desc etc...
            });
        });

        req.setHeader('Accept','application/json');

        req.on('error', function(e) {
            console.log('initNodes:problem with request to %j:%j.  Error=%j',item.host,item.port,e.message);
        });

        req.end();
    });
}




function getIntegrationBus(request,reply){

    var depth=request.param('depth');
    console.log("getIntegrationBus(%j)",depth);
    var remainingRequest=integrationnodes.length;
    
    var queryParms="";
    var replyObject={
        type:"IntegrationBus",
        integrationNodes:{
            type:"integrationNodes",
            uri:"/integrationbus/integrationnodes",
            integrationNode:[]
        }
    };    
 
    if(depth>1) {
        depth=depth-1;
        queryParms="?depth="+depth;
    }

    integrationnodes.forEach(function(nextHost){
    
      var options = {
          hostname: nextHost.host,
          port: nextHost.port,
          path: '/apiv1/executiongroups' + queryParms,
          method: 'GET'
      };

      var nextNode = {
          name:nextHost.name,
          host:nextHost.host,
          mqtt:nextHost.mqtt,
          port:nextHost.port
      };
      replyObject.integrationNodes.integrationNode.push(nextNode);

      var resultObject;
      var resultString="";
      console.log("requesting from %j",JSON.stringify(options));
      var req = http.request(options, function(res) {
          console.log('STATUS: ' + res.statusCode);
          console.log('HEADERS: ' + JSON.stringify(res.headers));
          res.setEncoding('utf8');

          res.on('data', function (chunk) {
              console.log("on data:"+chunk);
              resultString=resultString+chunk;
          });
          res.on('end',function(){
              console.log("on end");
              var resultObject = JSON.parse(resultString);
              console.dir(resultObject);
              nextNode.type = "integrationNode";

              nextNode.integrationServers=resultObject;             

              nextNode.integrationServers.type="integrationServers";
              nextNode.integrationServers.integrationServer = nextNode.integrationServers.executionGroup;
              delete(nextNode.integrationServers.executionGroup);
              
              nextNode.integrationServers.integrationServer.forEach(function(integrationServer){

                  //rename the type of the objects
                  integrationServer.type="integrationServer";

                  //drill down and enrich the flow objects with topic names for flow stats
                  integrationServer.applications.application.forEach(function(application){
                      application.messageFlows.messageFlow.forEach(function(messageFlow){
                          var topic="IBM/IntegrationBus/" + nextNode.name +
                               "/Statistics/JSON/SnapShot/" + integrationServer.name +
                               "/applications/" + application.name +
                               "/messageflows/" + messageFlow.name;
                          messageFlow.flowStatsTopic = topic;
                      });
                  });
                  
              });
              




              remainingRequest--;       
              console.log(remainingRequest + " remaining");
              if(remainingRequest == 0) {
                  reply.send(replyObject);
              }
          });          
      });

      req.setHeader("Accept","application/json");

      req.on('error', function(e) {
          console.log("getIntegrationBus: problem with request for %j",JSON.stringify(options));
          console.log("error: %j",e.message);
          console.log("already received %j",resultString);
          //TODO copy error to reply object?
          remainingRequest--;
          if(remainingRequest == 0) {

              reply.send(replyObject);
          }
      });

      // write data to request body
      console.log("sending request");
      console.dir(req);
      req.end();
    });//end integrationnodes.forEach

}
