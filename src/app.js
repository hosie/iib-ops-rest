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
var app = express();
var cors = require('cors');
var proxy = require('./routes/proxy.js');
var apiv1 = require('./routes/apiv1.js');
var fs = require('fs');

var testFlag = '--test';
 
app.use(cors());

fs.readFile('hosts.json', function (err, data) {
  if (err) throw err;
  
  var hosts = JSON.parse(data);
  hosts.forEach(function(item){
    //create a router for each one
    if(!(item.port))
    {
            item.port=4414;
    }
    var proxyRouter = proxy({host:item.host,port:item.port,mqtt:item.mqtt});
    app.use("/apiv1/integrationnodes/"+item.host,proxyRouter.router);
  });


  app.use("/apiv1",apiv1(hosts));

  if(process.argv.indexOf(testFlag)>-1)
  {
    //add a root for the front end test pages
    console.log('Test mode active');
    var testDir = __dirname + "/../test/front-end";
    console.log("serving front end tests from " + testDir);
    app.use("/test",express.static(testDir));
  }

  app.use("/prereqs",express.static(__dirname + "/bower_components"));

  //all other static html content is in public
  app.use("/",express.static(__dirname + "/public"));
  
  


  app.listen(3002);
  console.log('Listening on port 3002');
});

