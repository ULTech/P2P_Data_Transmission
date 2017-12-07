var express = require('express');
var app = express();
var ExpressPeerServer = require('peer').ExpressPeerServer;

app.get('/', function(req, res, next) {

    res.sendFile(__dirname + '/peer/index.html');
});

var server = app.listen(2000);

options = {

	debug : true
	/*allow_discovery: true*/
};

peerServer = ExpressPeerServer(server, options);
app.use(express.static('peer'), peerServer);


//===================================================================================

peerServer.on('connection', function(id) {

    console.log('peer is connected, id : ' + id)
  	//peerServer._clients
});

server.on('disconnect', function(id) {

    console.log('peer is disconnected, id : ' + id)
});