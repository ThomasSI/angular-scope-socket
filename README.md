angular-scope-socket
====================

angular-scope-sync is a service to create 3-way-bindings between angular-js, scopes and a socket-io server.

The service provides a sync function to extend the angular scope object with functionality to send and receive changes on properties.


Example
=======
Short example for controller


Example Controller
------------------
After creating all properties on $scope, call the sync function:

```js
angular.module("app").controller("testCtrl", function ($scope , syncService ) {
    $scope.title = "sync test";
    syncService.sync($scope );
});
```
After calling the sync function the syncService emits all changes of properties to the socket.io server and listens for events from the socket.io server.

The service listens for auto generated namespaces from the server.
Namespace can be built using the following schema:

Basic Namespace
-----
```js
syncService.sync($scope , optionalNamespace );
socketIONamespace = optionalNamespace + "/" + scopeProperty
```


Nested Objects as Cascading Namespace
---------------------
```js
syncService.sync($scope , optionalNamespace );
socketIONamespace = optionalNamespace + "/" + scopeProperty.objectProperty
```

Elements of Arrays Namespace
------------------
```js
syncService.sync($scope , optionalNamespace );
socketIONamespace = optionalNamespace + "/" + scopeArray[elementIndex]
```

Objects as Elements of Arrays Namespace
-----------------------------
```js
syncService.sync($scope , optionalNamespace );
socketIONamespace = optionalNamespace + "/" + scopeArray[elementIndex].elementProperty
```

Example Server
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

Output from the Server for Incoming Messages
--------------------------------------------
The sync service is called with:

```js
syncService.sync($scope , "base");
```

Output:
```js
proxy :  base/title sync test 1
proxy :  base/object.data.data.value 123456
proxy :  base/arr[2] 34
proxy :  base/arr[5].data.data.value 123456
```

Run the Example
===============

Open terminal and run

```bash
   git clone https://github.com/ThomasSI/angular-scope-socket.git
   cd angular-scope-socket
   cd examples
   npm install
   cd app
   bower install
   cd ..
   node server
```

Open two or more browsers with http://localhost:8080/ and play!