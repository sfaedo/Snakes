var http = require('http');
var path = require('path');
var express = require('express');
var app = express();
var server = http.createServer(app);
var ExpressPeerServer = require('peer').ExpressPeerServer;
var options = {
    debug: true
};

app.use(express.static(path.resolve(__dirname, 'client')));
app.use('/peerjs', ExpressPeerServer(server, options));

server.listen(8080, '0.0.0.0', function(){
  console.log('Server started');
});
