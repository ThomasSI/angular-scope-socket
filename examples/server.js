/**
 * Created by thomas.schulz on 12.11.2014.
 */

var path = require('path');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var middleware = require('socketio-wildcard')();

io.use(middleware);

var port = 8080;
server.listen(port);

app.use(express.static( path.join(__dirname, '/app') )); //  "public" off of current is rootg

io.on('connection', function (socket) {

  socket.on('*', function(data){
    console.log("proxy : " , data.data[0] , data.data[1] );

    socket.emit( data.data[0] , data.data[1] );
    socket.broadcast.emit( data.data[0] , data.data[1] );
  });

  socket.on( 'disconnect' , function () {
    io.sockets.emit( 'client left' ,  socket.id );
  });

});


console.log("server start on port " + port);