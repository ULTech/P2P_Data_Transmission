var UserName;
var DestPeerID;
var dataConn;
var vidConn;
var message, a_message;


var peer = new Peer(Math.floor(Math.random()*1000000000),{

  key : 'peerjs',
	host:  '192.168.43.138',
  port: 2000

 });

peer.on('open', function(id) {

	//console.log('My peer ID is: ' + id);
	$('#id').text(id);

});

  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

     function getVideo(callback){
       navigator.getUserMedia({audio: true, video: true}, callback, function(error){
      console.log(error);
      alert('An error occured. Please try again');

    });
    }

      getVideo(function(stream){

        window.localStream = stream;
        onReceiveStream(stream, 'my-camera');
      
      }); 

  function onReceiveStream(stream, element_id){
    var video = $('#' + element_id + ' video')[0];
    video.src = window.URL.createObjectURL(stream);
    //window.peer_stream = stream;
  }

peer.on('error', function(err){

    alert("An error ocurred with peer: " + err);
    console.error(err);
});

$(document).ready(function(){

	$('#connect').click(function() {

		UserName = $('#name').val(); 
		DestPeerID = $('#destpeerID').val();

		if(DestPeerID){

      		dataConn = peer.connect(DestPeerID,{

            metadata: {

              'username': UserName
            }

          });

      		if(dataConn){

          $('.InPeer_request').show();
     			//$('.login').hide();
     			//$('.msg').show();
     			//messages = document.getElementById("msgtextarea");
      		}

      		initConnection();
    	}
	});

	$('#AnPeer_startchat').click(function(){

		$('.login').hide();
    $('.AnPeer_connected').show();
		$('.a_msg').show();
    $('.AnPeer_receive').hide();
    //$('.AnPeer_call').show();

	});

  $('#InPeer_startchat').click(function(){

    $('.login').hide();
    $('.InPeer_request').hide();
    $('.InPeer_request_accepted').hide();
    $('.msg').show();
    $('.InPeer_connected').show();
    $('.InPeer_call').show();

  });

  $('#InPeer_startcall').click(function(){

    vidConn = peer.call(DestPeerID, window.localStream);

    if(vidConn){

        initVideo();
    }

    $('#my-camera').css('left','370px');
    $('#peer-camera').css('left','790px');

  });

});

function initVideo(){

      vidConn.on('stream', function(stream){

        window.peer_stream = stream;
        onReceiveStream(stream, 'peer-camera');

      });
}

function initConnection(){

			/*
				Initiator Peer who initiate or open Peer Connection
			*/


	    	dataConn.on('open', function() {

      			// Receive messages
  				dataConn.on('data', function(data) {

            if(data.msg == 'init'){

              $('#InPeer_connected_name').text(data.username);
              $('#InPeer_request_accepted_name').text(data.username);
              $('.InPeer_request_accepted').show();

            }else{

              console.log('Received Data : ', data);
              $('#msgtextarea').val($('#msgtextarea').val() + "\n                      > " + data);
              $('#msgtextarea').scrollTop($('#msgtextarea')[0].scrollHeight);
            }

  				});

  				// Send messages
  				$('#message').keypress(function(id){

  					if(id.keyCode == 13){

  						message = $('#message').val();
  						$('#msgtextarea').val($('#msgtextarea').val() + "\n> " + message);
  						$('#msgtextarea').scrollTop($('#msgtextarea')[0].scrollHeight);

  						dataConn.send(message);
  						$('#message').val("");
  					}
  				});
			});
}

//connection callback receives dataConn Object
peer.on('connection', function(conn) { 

	$('.AnPeer_receive').show();
	$('#AnPeer_id').text(conn.metadata.username + " : ");
  $('#AnPeer_connected_name').text(conn.metadata.username);

	conn.on('open', function(){

    $('#AnPeer_startchat').click(function(){

        conn.send({

          msg : 'init',
          username : $('#name').val()

        });
    });
		// Receive messages
		conn.on('data', function(data){

    		console.log('Received Data : ', data);
    		$('#a_msgtextarea').val($('#a_msgtextarea').val() + "\n                      > " + data);
  			$('#a_msgtextarea').scrollTop($('#a_msgtextarea')[0].scrollHeight);

  	});

		// Send messages
  		$('#a_message').keypress(function(id){

  			if(id.keyCode == 13){

  				a_message = $('#a_message').val();
  				$('#a_msgtextarea').val($('#a_msgtextarea').val() + "\n> " + a_message);
  				$('#a_msgtextarea').scrollTop($('#a_msgtextarea')[0].scrollHeight);
  				console.log(" " + $('#a_msgtextarea')[0].scrollWidth);

  				conn.send(a_message);
  				$('#a_message').val("");
  			}
  		});
	});

});

peer.on('call', function(call){
  
    onReceiveCall(call);
});

function onReceiveCall(call){


    $('#my-camera').css('left','370px');
    $('#peer-camera').css('left','790px');

    call.answer(window.localStream);

    call.on('stream', function(stream){

      window.peer_stream = stream;
      onReceiveStream(stream, 'peer-camera');

    });
}