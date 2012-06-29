/*
start variable while the socket.io is init here first and crafty start later.

I init the socket here before crafty is create since I need the socket to be not null once it start the game.
*/

var id = 0;

function getid(){//it is used for crafty in case in layer that will be used to id user control
    return id;    
};

function typechatpress(e){
    // look for window.event in case event isn't passed in
    if (typeof e == 'undefined' && window.event) { e = window.event; }
    if (e.keyCode == 13)
    {
		clickchat();
    }
}

function clickchat(){    
    var messagetext = document.getElementById("chat_input").value;
	console.log("text msg:"+messagetext);
    socket.emit('chat',{message:messagetext});
}

function chatbox(_text){
	var chat_box = document.getElementById("chat_box");
	var newdiv = document.createElement('div');
	newdiv.innerHTML = _text;
	chat_box.appendChild(newdiv);
}

console.log(document.location.hostname);
//var socket = io.connect('http://node_crafty.lightnet.c9.io');
if(io !=null){
	var socket = io.connect(document.location.hostname);
}

var players = [];

if(socket !=null){
	//this tell if the server is connected
	socket.on('connect',function() {
		console.log("===================================================");
		console.log('Client has connected to the server!');
		socket.emit('log',{msg:"user connected"});
		Crafty.scene("normalbgcolor");
	});


	socket.on('id',function(data) {
		
		if(data['id'] !=null){
			id = data['id'];
		}
		console.log("THIS ID:"+data['id']);
	});

	//update player position from other clients
	socket.on('position',function(data) {    
		if(data !=null){
			console.log("position");
			if(data['id'] !=null){
				var bfound = false;
				for (i in players){
					if(players[i]._id == data['id']){
						players[i].x = data['x'];
						players[i].y = data['y'];
						/*
						players[i].__newpos.x = data['x'];
						players[i].__newpos.y = data['y'];
						*/
						bfound = true;
						console.log("found and update position");
						break;
					}
				}
				
				if(!bfound){
					var cp = Crafty.e("BoxPlayer");
					cp._id = data['id'];
					cp.x = data['x'];
					cp.y = data['y'];
					players.push(cp);
					console.log(cp);
					console.log("added");
				}            
			}        
		}
	});

	socket.on('chat', function(data) {
		if(data['message'] !=null){
			chatbox(data['message']);
		}
	});

	socket.on('message', function(data) {
		
	});
	
	//server will send when player disconnect
	socket.on('playerleft', function(data) {
		if(data['id'] !=null){
			for (i in players){
				console.log(players[i]);
				console.log(i);
				if(players[i]._id == data['id']){//_id that we create to make sure it disappear or remove from the scene
					//console.log("found...");
					var tmpplayer = players[i];
					tmpplayer.destroy();
					players.splice(i,1);
					break;
				}
			}
		}
	});
	
	//trigger when server is disconnect
	socket.on('disconnect',function() {
		console.log('The client has disconnected!');
		//connected = false;
		console.log("disconnect");
		for (i in players){
			console.log(players[i]);
			console.log(i);
			if(players[i]._id == getid()){//_id that we create to make sure it disappear or remove from the scene
				//console.log("found...");
				var tmpplayer = players[i];
				tmpplayer.destroy();
				players.splice(i,1);
				break;
			}
		}
		Crafty.scene("disconnect");
	});
}

window.onbeforeunload = function (e) {
//var closewindowmessage="If you leave this page, your session will be definitely closed.";

  e = e || window.event;
  // For IE and Firefox
  if (e) {
    //e.returnValue = closewindowmessage;
	//socket.emit('user',{msg:"userclose"});
	socket.disconnect();
	//socket.emit('disconnect')
  }

  // For Safari
  return closewindowmessage;
};