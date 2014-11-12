/**
 * Created by thomas.schulz on 12.11.2014.
 */

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


console.log("server start on port " + port);