#iib-ops-rest

Operational rest api for IBM Integration Bus. Single REST API for operational data and administrative control of several Integration Nodes.

This is still early days in the development of this project and is little more than prototype at this stage.

## Try it
### Install
1. Download and install node.js - http://nodejs.org/download/
2. Download - [iib-ops-js] (https://github.com/ot4i/iib-ops-rest/archive/master.zip)  and unzip
3. open a console, add node.js to your PATH,
4. cd to the directory where you unzipped in (2). cd to src ( the directory that contains app.js and package.json - among other things) ``` cd iib-ops-rest/src ```
5. In any text editor, open ``` src/hosts.json``` and update it with the host and port for your Integration Node(s)
6. start the server ``` npm start ```

This will install any necessary dependancies.

You should see a message reporting that the server is listening on localhost:3002. NOTE: you can change the port number by editing the following link in src/app.js
```app.listen(3002); ```

### sniff test
Send an HTTP GET request ( e.g. using curl, or REST Console extension for Google Chrome  or simply by entering the following URL into your browser's address bar)...
``` localhost:3002/apiv1/integrationBus?depth=7 ```
