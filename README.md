angular-scope-socket
====================

angular-scope-sync is a service to create 3-way-bindings between angular-js scopes and a socket-io server

the service provides a sync function to extend the angular scope object with functionality to send and receive changes on properties


example
=======
short example for controller


example controller
------------------
after creating all properties on $scope call the sync function

```js
angular.module("app").controller("testCtrl", function ($scope , syncService ) {
    $scope.title = "sync test";
    syncService.sync($scope );
});
```
after calling the sync function the syncService emits all changes of properties to the socket.io server
and listen to event from the socket.io server.

The service listen for auto generated namespaces from the server.
The namespace is build with the following schema:

basic Namespace
-----
```js
syncService.sync($scope , optionalNamespace );
socketIONamespace = optionalNamespace + "/" + scopePropertie
```


with object in object Namespace
---------------------
```js
syncService.sync($scope , optionalNamespace );
socketIONamespace = optionalNamespace + "/" + scopePropertie.objectPropertie
```

elements of arrays Namespace
------------------
```js
syncService.sync($scope , optionalNamespace );
socketIONamespace = optionalNamespace + "/" + scopeArray[elementIndex]
```

objects as elements of arrays Namespace
-----------------------------
```js
syncService.sync($scope , optionalNamespace );
socketIONamespace = optionalNamespace + "/" + scopeArray[elementIndex].elementPropertie
```

example Server
==============
```js
var port = 8080;

var path = require('path');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var middleware = require('socketio-wildcard')();
io.use(middleware);

server.listen(port);
app.use(express.static( path.join(__dirname, '/app') ));

io.on('connection', function (socket) {

  socket.on('*', function(data){
    console.log("proxy : " , data.data[0] , data.data[1] );
  });

});
```

output from the server for incoming messages
--------------------------------------------
the sync service is called with:

```js
syncService.sync($scope , "base");
```

output:
```js
proxy :  base/title sync test 1
proxy :  base/object.data.data.value 123456
proxy :  base/arr[2] 34
proxy :  base/arr[5].data.data.value 123456
```

run the example
===============

open terminal and run

```bash
   git clone git@github.com:ThomasSI/angular-scope-socket.git
   cd angular-scope-socket
   cd examples
   npm install
   cd app
   bower install
   cd ..
   node server
```

open two or more browser with http://localhost:8080/ and play