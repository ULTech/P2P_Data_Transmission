//Binding PeerServer With NODE using express
var express = require('express');
var app = express();
var ExpressPeerServer = require('peer').ExpressPeerServer;

//Pass index.html file from relative path where server is runnig
app.get('/', function(req, res, next) {

    res.sendFile(__dirname + '/peer/index.html');
});

//Server listen to the port : 2000
var server = app.listen(2000);

//To get a logs
options = {

	debug : true
	/*allow_discovery: true*/
};

//PeerServer will use above server and edit app to use 'peer' library and PeerServer
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