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
6. Instal the dependancies ``` npm install ```
7. Start the server ``` node app.js ```

This will install any necessary dependancies.

You should see a message reporting that the server is listening on localhost:3002. NOTE: you can change the port number by editing the following link in src/app.js
```app.listen(3002); ```

### sniff test
Send an HTTP GET request ( e.g. using curl, or REST Console extension for Google Chrome  or simply by entering the following URL into your browser's address bar)...
``` localhost:3002/apiv1/integrationBus?depth=7 ```

You should see a JSON object returned that contains information about all of your Integration Node, thier Integration Servers and any applications, services, libraries, message flows etc... deployed to them.

### What next
Get on with coding a REST client to consume the data that are returned by this API

### Or...
Take a look at iib-ops-js as a convenient way for your javascript based client to consume both this API and also the live operational data that is published from IBM Integration Bus (for example message flow accounting and statistics data).
